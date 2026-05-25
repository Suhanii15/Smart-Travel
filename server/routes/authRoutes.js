const express  = require("express");
const router   = express.Router();
const passport = require("../config/passport");
const jwt= require("jsonwebtoken");

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: "http://localhost:5173/login" 
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:5173/auth/google/success?token=${token}&name=${encodeURIComponent(req.user.name)}&id=${req.user._id}`
    );
  }
);

module.exports = router;