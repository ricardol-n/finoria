// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginActivity = require("../models/LoginActivity");
const UAParser = require("ua-parser-js");

const router = express.Router();


/* ================================
REGISTER
================================ */

router.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed
    });

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {

    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });

  }

});


/* ================================
LOGIN
================================ */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    /* ================================
       CREATE JWT TOKEN
    ================================ */

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    /* ================================
       LOG LOGIN ACTIVITY
    ================================ */

    const parser = new UAParser(req.headers["user-agent"]);

    await LoginActivity.create({

      userId: user._id,

      ip: req.ip,

      device: parser.getDevice().model || "Desktop",

      browser: parser.getBrowser().name || "Unknown",

      location: req.headers["x-forwarded-for"] || "Unknown"

    });


    /* ================================
       SEND RESPONSE
    ================================ */

    res.json({

      token,

      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      }

    });

  } catch (err) {

    console.error("Login error:", err);

    res.status(500).json({
      error: "Login failed"
    });

  }

});


/* ================================
GET CURRENT USER
================================ */

router.get("/me", async (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {

    res.status(401).json({ message: "Invalid token" });

  }

});


module.exports = router;