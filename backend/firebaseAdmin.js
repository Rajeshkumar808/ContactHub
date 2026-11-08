const { initializeApp, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        projectId: "g2contacthub",
      });

module.exports = getAuth(app);