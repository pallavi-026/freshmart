const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount = null;

// Priority 1: Environment variable (most reliable for cloud deployments)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('🔑 Firebase credentials loaded from environment variable');
  } catch (e) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e.message);
  }
}

// Priority 2: Secret file at Render's default path
if (!serviceAccount) {
  const renderSecretPath = '/etc/secrets/serviceAccountKey.json';
  if (fs.existsSync(renderSecretPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(renderSecretPath, 'utf8'));
      console.log('🔑 Firebase credentials loaded from Render secret file');
    } catch (e) {
      console.error('❌ Failed to read Render secret file:', e.message);
    }
  }
}

// Priority 3: Local file (for development)
if (!serviceAccount) {
  const localPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(localPath)) {
    try {
      serviceAccount = require(localPath);
      console.log('🔑 Firebase credentials loaded from local file');
    } catch (e) {
      console.error('❌ Failed to read local serviceAccountKey.json:', e.message);
    }
  }
}

try {
  if (serviceAccount && serviceAccount.project_id !== 'YOUR_PROJECT_ID') {
    admin.initializeApp({
      credential: admin.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin SDK Initialized');
  } else {
    console.warn('⚠️  WARNING: Firebase serviceAccountKey.json not found.');
    console.warn('⚠️  Set FIREBASE_SERVICE_ACCOUNT env var or provide the key file.');
  }
} catch (error) {
  console.error('❌ Firebase Admin Initialization Error:', error.message);
}

module.exports = admin;
