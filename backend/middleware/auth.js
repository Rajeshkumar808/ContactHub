
const admin = require("../firebaseAdmin");

const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(
      /^Bearer\s+/i,
      ""
    );

    if (!token) {
      return res.status(401).json({
        message: "Authentication token required",
      });
    }

    // Verify Firebase ID token
const decodedToken = await admin.verifyIdToken(token);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return res.status(401).json({
        message: "Firebase account email is missing",
      });
    }

    // Find existing MongoDB account
    let user = await User.findOne({ firebaseUid });

    // Link an existing account only when Firebase confirms a verified email
    if (!user && decodedToken.email_verified) {
      user = await User.findOne({ email });
    }

    // Create MongoDB account for new Firebase user
    if (!user) {
      user = await User.create({
        firebaseUid,
        name:
          decodedToken.name ||
          email.split("@")[0],
        username: firebaseUid,
        email,
        password: null,
        role: "user",
        isActive: true,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account has been disabled",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Firebase authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired Firebase token",
    });
  }
};
