const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors')({
  origin: ['https://www.yash-v.in', 'https://yash-v.in'],
  methods: ['POST']
});

admin.initializeApp();
const db = admin.firestore();

// Razorpay instance (lazy-init so deploy works before config is set)
let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    const cfg = functions.config().razorpay || {};
    if (!cfg.key_id || !cfg.key_secret) throw new Error('Razorpay keys not configured');
    _razorpay = new Razorpay({ key_id: cfg.key_id, key_secret: cfg.key_secret });
  }
  return _razorpay;
}

// Helper: verify Firebase ID token from Authorization header
async function verifyAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) throw new Error('No auth token');
  return admin.auth().verifyIdToken(token);
}

/**
 * createOrder
 * Creates a Razorpay order for ₹199 (19900 paise)
 * Requires valid Firebase Auth ID token
 */
exports.createOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const decoded = await verifyAuth(req);
      const uid = decoded.uid;

      const order = await getRazorpay().orders.create({
        amount: 19900,
        currency: 'INR',
        receipt: 'portfolio_' + uid + '_' + Date.now(),
        notes: {
          uid: uid,
          product: 'analytics_dashboard_30d'
        }
      });

      // Store order→uid mapping for verification
      await db.collection('pending_orders').doc(order.id).set({
        uid: uid,
        created_at: admin.firestore.Timestamp.now()
      });

      return res.status(200).json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (error) {
      console.error('createOrder error:', error);
      return res.status(error.message === 'No auth token' ? 401 : 500).json({
        error: error.message || 'Failed to create order'
      });
    }
  });
});

/**
 * verifyPayment
 * Verifies Razorpay signature (HMAC-SHA256) and writes subscription to Firestore
 * Requires valid Firebase Auth ID token
 */
exports.verifyPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const decoded = await verifyAuth(req);
      const uid = decoded.uid;

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Missing payment details' });
      }

      // Verify order belongs to this user
      const orderDoc = await db.collection('pending_orders').doc(razorpay_order_id).get();
      if (!orderDoc.exists || orderDoc.data().uid !== uid) {
        return res.status(403).json({ success: false, error: 'Order not found or unauthorized' });
      }

      // Verify HMAC-SHA256 signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', functions.config().razorpay.key_secret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Invalid signature' });
      }

      // Write subscription to Firestore with 30-day expiry
      const now = admin.firestore.Timestamp.now();
      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      await db.collection('users').doc(uid).collection('subscriptions').add({
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        amount: 19900,
        currency: 'INR',
        created_at: now,
        expires_at: expiresAt,
        status: 'active'
      });

      // Clean up pending order
      await db.collection('pending_orders').doc(razorpay_order_id).delete();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('verifyPayment error:', error);
      return res.status(error.message === 'No auth token' ? 401 : 500).json({
        success: false,
        error: error.message || 'Verification failed'
      });
    }
  });
});

// ─────────────────────────────────────────────────
// BigQuery Sync – Mixpanel events + Firestore data
// ─────────────────────────────────────────────────
const { BigQuery } = require('@google-cloud/bigquery');
const https = require('https');

const BQ_PROJECT = 'profile-analytics-tracker';
const BQ_DATASET = 'portfolio_analytics';
const BATCH_SIZE = 500;

// Lazy-init BigQuery client (ADC — same project, automatic auth)
let _bigquery = null;
function getBigQuery() {
  if (!_bigquery) {
    _bigquery = new BigQuery({ projectId: BQ_PROJECT });
  }
  return _bigquery;
}

function getMixpanelApiSecret() {
  const secret = process.env.MIXPANEL_API_SECRET;
  if (!secret) throw new Error('MIXPANEL_API_SECRET env var not set');
  return secret;
}

function getYesterday() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Fetch Mixpanel Raw Export API (NDJSON)
 * https://developer.mixpanel.com/reference/raw-event-export
 */
function fetchMixpanelExport(apiSecret, fromDate, toDate) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(apiSecret + ':').toString('base64');
    const url = `https://data.mixpanel.com/api/2.0/export?from_date=${fromDate}&to_date=${toDate}`;

    https.get(url, {
      headers: { Authorization: `Basic ${auth}` },
    }, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', (c) => { body += c; });
        res.on('end', () => reject(new Error(`Mixpanel API ${res.statusCode}: ${body}`)));
        return;
      }
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const lines = body.split('\n').filter((l) => l.trim());
        const events = [];
        for (const line of lines) {
          try { events.push(JSON.parse(line)); } catch (_) { /* skip malformed */ }
        }
        resolve(events);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Transform a raw Mixpanel export event to a flat BigQuery row
 */
function transformMixpanelEvent(raw, loadedAt) {
  const p = raw.properties || {};
  const eventTime = p.time ? new Date(p.time * 1000).toISOString() : null;
  const eventDate = eventTime ? eventTime.slice(0, 10) : null;

  const row = {
    event: raw.event,
    distinct_id: p.distinct_id || null,
    time: eventTime,
    event_date: eventDate,
    insert_id: p.$insert_id || null,
    city: p.$city || p.mp_city || null,
    region: p.$region || null,
    country_code: p.$country_code || p.mp_country_code || null,
    os: p.$os || null,
    browser: p.$browser || null,
    browser_version: p.$browser_version || null,
    device: p.$device || null,
    screen_height: p.$screen_height != null ? Number(p.$screen_height) : null,
    screen_width: p.$screen_width != null ? Number(p.$screen_width) : null,
    current_url: p.$current_url || null,
    referrer: p.$referrer || null,
    referring_domain: p.$referring_domain || null,
    initial_referrer: p.$initial_referrer || null,
    initial_referring_domain: p.$initial_referring_domain || null,
    search_engine: p.$search_engine || null,
    mp_lib: p.mp_lib || null,
    lib_version: p.$lib_version || null,
    page_title: p.page_title || null,
    path: p.path || null,
    depth: p.depth != null ? Number(p.depth) : null,
    section_name: p.section_name || null,
    cta_text: p.cta_text || null,
    destination: p.destination || null,
    link_text: p.link_text || null,
    channel: p.channel || null,
    direction: p.direction || null,
    state: p.state || null,
    project_name: p.project_name || null,
    case_study: p.case_study || null,
    company: p.company || null,
    metric: p.metric || null,
    field: p.field || null,
    url: p.url || null,
    destination_title: p.destination_title || null,
    properties_json: JSON.stringify(p),
    loaded_at: loadedAt,
  };

  return row;
}

/**
 * Streaming insert rows into BigQuery in batches
 */
async function loadRowsToBigQuery(datasetId, tableId, rows) {
  if (!rows.length) return;
  const table = getBigQuery().dataset(datasetId).table(tableId);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await table.insert(batch, { raw: false, skipInvalidRows: false });
  }
  console.log(`Inserted ${rows.length} rows into ${datasetId}.${tableId}`);
}

/**
 * Delete partition for idempotent re-runs
 */
async function deletePartition(datasetId, tableId, dateColumn, dateStr) {
  const query = `DELETE FROM \`${BQ_PROJECT}.${datasetId}.${tableId}\` WHERE ${dateColumn} = '${dateStr}'`;
  console.log(`Deleting partition: ${tableId} WHERE ${dateColumn} = '${dateStr}'`);
  await getBigQuery().query({ query, location: 'us-central1' });
}

// ─────────────────────────────────────────────────
// Scheduled Function 1: Mixpanel → BigQuery (daily 05:00 UTC)
// ─────────────────────────────────────────────────
exports.syncMixpanelToBigQuery = functions
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .pubsub.schedule('0 5 * * *')
  .timeZone('UTC')
  .onRun(async (_context) => {
    const dateStr = getYesterday();
    console.log(`syncMixpanelToBigQuery: exporting ${dateStr}`);

    const apiSecret = getMixpanelApiSecret();
    const rawEvents = await fetchMixpanelExport(apiSecret, dateStr, dateStr);
    console.log(`Fetched ${rawEvents.length} events from Mixpanel for ${dateStr}`);

    if (rawEvents.length === 0) {
      console.log('No events to load. Done.');
      return null;
    }

    const loadedAt = new Date().toISOString();
    const rows = rawEvents.map((e) => transformMixpanelEvent(e, loadedAt));

    // Idempotent: delete existing data for this date before inserting
    await deletePartition(BQ_DATASET, 'mixpanel_events', 'event_date', dateStr);
    await loadRowsToBigQuery(BQ_DATASET, 'mixpanel_events', rows);

    console.log(`syncMixpanelToBigQuery complete for ${dateStr}`);
    return null;
  });

// ─────────────────────────────────────────────────
// Scheduled Function 2: Firestore → BigQuery (daily 05:30 UTC)
// ─────────────────────────────────────────────────
exports.syncFirestoreToBigQuery = functions
  .runWith({ timeoutSeconds: 300, memory: '256MB' })
  .pubsub.schedule('30 5 * * *')
  .timeZone('UTC')
  .onRun(async (_context) => {
    const snapshotDate = getToday();
    const loadedAt = new Date().toISOString();
    console.log(`syncFirestoreToBigQuery: snapshotting ${snapshotDate}`);

    // Read all users from Firestore
    const usersSnap = await db.collection('users').get();
    console.log(`Found ${usersSnap.size} users in Firestore`);

    const userRows = [];
    const subRows = [];

    for (const userDoc of usersSnap.docs) {
      const u = userDoc.data();
      userRows.push({
        uid: userDoc.id,
        email: u.email || null,
        display_name: u.displayName || u.display_name || null,
        photo_url: u.photoURL || u.photo_url || null,
        last_login: u.lastLogin
          ? (u.lastLogin.toDate ? u.lastLogin.toDate().toISOString() : new Date(u.lastLogin).toISOString())
          : null,
        snapshot_date: snapshotDate,
        loaded_at: loadedAt,
      });

      // Read subscriptions subcollection
      const subsSnap = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('subscriptions')
        .get();

      for (const subDoc of subsSnap.docs) {
        const s = subDoc.data();
        subRows.push({
          subscription_id: subDoc.id,
          uid: userDoc.id,
          razorpay_order_id: s.razorpay_order_id || null,
          razorpay_payment_id: s.razorpay_payment_id || null,
          amount: s.amount != null ? Number(s.amount) : null,
          currency: s.currency || null,
          status: s.status || null,
          created_at: s.created_at
            ? (s.created_at.toDate ? s.created_at.toDate().toISOString() : new Date(s.created_at).toISOString())
            : null,
          expires_at: s.expires_at
            ? (s.expires_at.toDate ? s.expires_at.toDate().toISOString() : new Date(s.expires_at).toISOString())
            : null,
          snapshot_date: snapshotDate,
          loaded_at: loadedAt,
        });
      }
    }

    // Idempotent: delete today's snapshot before inserting
    await deletePartition(BQ_DATASET, 'firestore_users', 'snapshot_date', snapshotDate);
    await deletePartition(BQ_DATASET, 'firestore_subscriptions', 'snapshot_date', snapshotDate);

    if (userRows.length > 0) {
      await loadRowsToBigQuery(BQ_DATASET, 'firestore_users', userRows);
    }
    if (subRows.length > 0) {
      await loadRowsToBigQuery(BQ_DATASET, 'firestore_subscriptions', subRows);
    }

    console.log(`syncFirestoreToBigQuery complete: ${userRows.length} users, ${subRows.length} subscriptions`);
    return null;
  });
