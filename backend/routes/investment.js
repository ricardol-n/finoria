const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const Portfolio = require("../models/Portfolio");

// GET user portfolio
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assets = await Portfolio.find({ user: req.user.id });

    const formatted = assets.map(asset => {
      const totalValue = asset.quantity * asset.currentPrice;
      const invested = asset.quantity * asset.buyPrice;
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
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
});

module.exports = router;