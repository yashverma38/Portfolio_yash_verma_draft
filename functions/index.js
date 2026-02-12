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
