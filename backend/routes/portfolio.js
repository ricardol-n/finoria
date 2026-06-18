const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

// GET user portfolio (assets + completed deposits)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch portfolio assets
    const assets = await Portfolio.find({ user: userId });

    // Fetch completed deposits not yet in portfolio
    const deposits = await Transaction.find({
      user: userId,
      type: "deposit",
      status: "completed",
    });

    // Map deposits as assets
    const depositAssets = deposits.map(dep => ({
      _id: dep._id,
      assetName: dep.cryptoCurrency || "USD Deposit",
      quantity: dep.amount, // treat 1 unit = $1 for simplicity
      currentPrice: 1,
      buyPrice: 1,
    }));

    // Merge both
    const allAssets = [...assets, ...depositAssets];

    // Format
    const formatted = allAssets.map(asset => {
      const totalValue = asset.quantity * (asset.currentPrice || 1);
      const invested = asset.quantity * (asset.buyPrice || 1);
      const growthPercent = ((totalValue - invested) / invested) * 100;

      return {
        _id: asset._id,
        assetName: asset.assetName,
        quantity: asset.quantity,
        totalValue,
        growthPercent: growthPercent.toFixed(2),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
});

module.exports = router;