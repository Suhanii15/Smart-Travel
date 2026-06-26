const express = require("express");
const passport = require("../config/passport");
const { generateToken } = require("../lib/utils");
const router = express.Router();

const getCallbackUrl = (req) => {
  if (process.env.RENDER_EXTERNAL_URL) {
    return `${process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback`;
  }
  return `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
};

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    callbackURL: getCallbackUrl(req),
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false, callbackURL: getCallbackUrl(req) }, (err, user) => {
    if (err || !user) {
      return res.redirect("https://smart-travel-alpha.vercel.app/login?error=google_auth_failed");
    }
    const token = generateToken(user._id);
    return res.redirect(
      `https://smart-travel-alpha.vercel.app/auth/google/success?token=${token}&name=${encodeURIComponent(user.name)}&id=${user._id}`
    );
  })(req, res, next);
});

module.exports = router;