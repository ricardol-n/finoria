const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const router = express.Router();


// 📌 Get user's transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 Deposit (example)
router.post("/deposit", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "completed",
      description: "Account deposit",
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { balance: amount },
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Deposit failed" });
  }
});

module.exports = router;