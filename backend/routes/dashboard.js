const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio")
const Transaction = require("../models/Transaction");

const router = express.Router();

router.get("/overview", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get portfolio assets
    const portfolio = await Portfolio.find({ user: user._id });

    // Calculate total portfolio current value
    const portfolioValue = portfolio.reduce((total, asset) => {
      return total + asset.quantity * asset.currentPrice;
    }, 0);

    // Calculate total invested amount
    const totalInvested = portfolio.reduce((total, asset) => {
      return total + asset.quantity * asset.buyPrice;
    }, 0);

    // Profit = current value - invested
    const totalEarnings = portfolioValue - totalInvested;

    // Total deposits
    const deposits = await Transaction.find({
      user: user._id,
      type: "deposit",
      status: "completed",
    });

    const totalDeposits = deposits.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    res.json({
      totalAssets: user.balance + portfolioValue,
      balance: user.balance,
      portfolioValue,
      activeInvestments: totalInvested,
      totalEarnings,
      totalDeposits,
      jointBalance: 0,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;