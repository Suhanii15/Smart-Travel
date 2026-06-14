const express = require("express");
const passport = require("../config/passport");
const { generateToken } = require("../lib/utils");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    return res.redirect(
      `https://smart-travel-alpha.vercel.app/auth/google/success?token=${token}&name=${encodeURIComponent(
        req.user.name
      )}&id=${req.user._id}`
    );
  }
);

module.exports = router;