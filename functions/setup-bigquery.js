/**
 * One-time setup script: creates BigQuery dataset + tables
 * Run with: node setup-bigquery.js
 * Requires: GOOGLE_APPLICATION_CREDENTIALS or gcloud auth application-default login
 */
const { BigQuery } = require('@google-cloud/bigquery');

const PROJECT_ID = 'profile-analytics-tracker';
const DATASET_ID = 'portfolio_analytics';
const LOCATION = 'us-central1';

const bigquery = new BigQuery({ projectId: PROJECT_ID });

async function setup() {
  // 1. Create dataset
  console.log(`Creating dataset ${DATASET_ID}...`);
  try {
    await bigquery.createDataset(DATASET_ID, {
      location: LOCATION,
      description: 'Portfolio analytics from Mixpanel + Firestore',
    });
    console.log(`Dataset ${DATASET_ID} created.`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`Dataset ${DATASET_ID} already exists.`);
    } else {
      throw err;
    }
  }

  const dataset = bigquery.dataset(DATASET_ID);

  // 2. Create mixpanel_events table
  console.log('Creating mixpanel_events table...');
  try {
    await dataset.createTable('mixpanel_events', {
      schema: {
        fields: [
          { name: 'event', type: 'STRING', mode: 'REQUIRED' },
          { name: 'distinct_id', type: 'STRING', mode: 'NULLABLE' },
          { name: 'time', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'event_date', type: 'DATE', mode: 'REQUIRED' },
          { name: 'insert_id', type: 'STRING', mode: 'NULLABLE' },
          { name: 'city', type: 'STRING', mode: 'NULLABLE' },
          { name: 'region', type: 'STRING', mode: 'NULLABLE' },
          { name: 'country_code', type: 'STRING', mode: 'NULLABLE' },
          { name: 'os', type: 'STRING', mode: 'NULLABLE' },
          { name: 'browser', type: 'STRING', mode: 'NULLABLE' },
          { name: 'browser_version', type: 'STRING', mode: 'NULLABLE' },
          { name: 'device', type: 'STRING', mode: 'NULLABLE' },
          { name: 'screen_height', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'screen_width', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'current_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'referrer', type: 'STRING', mode: 'NULLABLE' },
          { name: 'referring_domain', type: 'STRING', mode: 'NULLABLE' },
          { name: 'initial_referrer', type: 'STRING', mode: 'NULLABLE' },
          { name: 'initial_referring_domain', type: 'STRING', mode: 'NULLABLE' },
          { name: 'search_engine', type: 'STRING', mode: 'NULLABLE' },
          { name: 'mp_lib', type: 'STRING', mode: 'NULLABLE' },
          { name: 'lib_version', type: 'STRING', mode: 'NULLABLE' },
          { name: 'page_title', type: 'STRING', mode: 'NULLABLE' },
          { name: 'path', type: 'STRING', mode: 'NULLABLE' },
          { name: 'depth', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'section_name', type: 'STRING', mode: 'NULLABLE' },
          { name: 'cta_text', type: 'STRING', mode: 'NULLABLE' },
          { name: 'destination', type: 'STRING', mode: 'NULLABLE' },
          { name: 'link_text', type: 'STRING', mode: 'NULLABLE' },
          { name: 'channel', type: 'STRING', mode: 'NULLABLE' },
          { name: 'direction', type: 'STRING', mode: 'NULLABLE' },
          { name: 'state', type: 'STRING', mode: 'NULLABLE' },
          { name: 'project_name', type: 'STRING', mode: 'NULLABLE' },
          { name: 'case_study', type: 'STRING', mode: 'NULLABLE' },
          { name: 'company', type: 'STRING', mode: 'NULLABLE' },
          { name: 'metric', type: 'STRING', mode: 'NULLABLE' },
          { name: 'field', type: 'STRING', mode: 'NULLABLE' },
          { name: 'url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'destination_title', type: 'STRING', mode: 'NULLABLE' },
          { name: 'properties_json', type: 'STRING', mode: 'NULLABLE' },
          { name: 'loaded_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
        ],
      },
      timePartitioning: {
        type: 'DAY',
        field: 'event_date',
      },
      clustering: {
        fields: ['event', 'distinct_id'],
      },
      description: 'Raw Mixpanel event data exported daily',
    });
    console.log('mixpanel_events table created.');
  } catch (err) {
    if (err.code === 409) {
      console.log('mixpanel_events table already exists.');
    } else {
      throw err;
    }
  }

  // 3. Create firestore_users table
  console.log('Creating firestore_users table...');
  try {
    await dataset.createTable('firestore_users', {
      schema: {
        fields: [
          { name: 'uid', type: 'STRING', mode: 'REQUIRED' },
          { name: 'email', type: 'STRING', mode: 'NULLABLE' },
          { name: 'display_name', type: 'STRING', mode: 'NULLABLE' },
          { name: 'photo_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'last_login', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'snapshot_date', type: 'DATE', mode: 'REQUIRED' },
          { name: 'loaded_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
        ],
      },
      timePartitioning: {
        type: 'DAY',
        field: 'snapshot_date',
      },
      clustering: {
        fields: ['uid'],
      },
      description: 'Daily snapshot of Firestore users collection',
    });
    console.log('firestore_users table created.');
  } catch (err) {
    if (err.code === 409) {
      console.log('firestore_users table already exists.');
    } else {
      throw err;
    }
  }

  // 4. Create firestore_subscriptions table
  console.log('Creating firestore_subscriptions table...');
  try {
    await dataset.createTable('firestore_subscriptions', {
      schema: {
        fields: [
          { name: 'subscription_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'uid', type: 'STRING', mode: 'REQUIRED' },
          { name: 'razorpay_order_id', type: 'STRING', mode: 'NULLABLE' },
          { name: 'razorpay_payment_id', type: 'STRING', mode: 'NULLABLE' },
          { name: 'amount', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'currency', type: 'STRING', mode: 'NULLABLE' },
          { name: 'status', type: 'STRING', mode: 'NULLABLE' },
          { name: 'created_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'expires_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'snapshot_date', type: 'DATE', mode: 'REQUIRED' },
          { name: 'loaded_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
        ],
      },
      timePartitioning: {
        type: 'DAY',
        field: 'snapshot_date',
      },
      clustering: {
        fields: ['uid', 'status'],
      },
      description: 'Daily snapshot of Firestore subscriptions subcollection',
    });
    console.log('firestore_subscriptions table created.');
  } catch (err) {
    if (err.code === 409) {
      console.log('firestore_subscriptions table already exists.');
    } else {
      throw err;
    }
  }

  console.log('\nSetup complete! All tables ready in portfolio_analytics dataset.');
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
