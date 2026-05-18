const admin = require("firebase-admin");

// Service account JSON load
const serviceAccount = require("../../firebase-service-account.json");

//  initialize only once a time  — multiple init can gives error 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;