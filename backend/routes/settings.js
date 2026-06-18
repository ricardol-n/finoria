const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

/* =========================
   GET USER PROFILE
========================= */

router.get("/profile", auth, async (req, res) => {

  try {

    const user = await User
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);

  } catch (err) {

    console.error("Profile fetch error:", err);

    res.status(500).json({
      error: "Server error"
    });

  }

});


/* =========================
   UPDATE PROFILE
========================= */

router.put("/profile", auth, async (req, res) => {

  try {

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required"
      });
    }

    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user.id }
    });

    if (emailExists) {
      return res.status(400).json({
        error: "Email already in use"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {

    console.error("Profile update error:", err);

    res.status(500).json({
      error: "Profile update failed"
    });

  }

});


/* =========================
   CHANGE PASSWORD
========================= */

router.put("/password", auth, async (req, res) => {

  try {

    const { current, newPassword } = req.body;

    if (!current || !newPassword) {
      return res.status(400).json({
        error: "Current and new password required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const match = await bcrypt.compare(current, user.password);

    if (!match) {
      return res.status(400).json({
        error: "Incorrect password"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;

    await user.save();

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {

    console.error("Password update error:", err);

    res.status(500).json({
      error: "Password update failed"
    });

  }

});


/* =========================
   UPDATE SECURITY SETTINGS
========================= */

router.put("/security", auth, async (req, res) => {

  try {

    const updates = {};

    if (req.body.twoFA !== undefined) {
      updates.twoFA = req.body.twoFA;
    }

    if (req.body.emailAlerts !== undefined) {
      updates.emailAlerts = req.body.emailAlerts;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {

    console.error("Security update error:", err);

    res.status(500).json({
      error: "Security update failed"
    });

  }

});


router.post("/2fa/setup", auth, async (req,res)=>{

try{

const secret = speakeasy.generateSecret({
length:20
});

const qrCode = await QRCode.toDataURL(secret.otpauth_url);

await User.findByIdAndUpdate(req.user.id,{
twoFASecret: secret.base32
});

res.json({
qrCode,
secret: secret.base32
});

}catch(err){

res.status(500).json({error:"2FA setup failed"});

}

});

router.post("/2fa/verify", auth, async (req,res)=>{

try{

const {token} = req.body;

const user = await User.findById(req.user.id);

const verified = speakeasy.totp.verify({

secret:user.twoFASecret,
encoding:"base32",
token,
window:1

});

if(!verified){

return res.status(400).json({
error:"Invalid verification code"
});

}

user.twoFA = true;

await user.save();

res.json({message:"2FA enabled"});

}catch(err){

res.status(500).json({error:"Verification failed"});

}

});

router.post("/2fa/disable", auth, async (req,res)=>{

await User.findByIdAndUpdate(req.user.id,{
twoFA:false,
twoFASecret:null
});

res.json({message:"2FA disabled"});

});

module.exports = router;