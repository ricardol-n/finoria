const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const Investment = require("../models/Investment");
const User = require("../models/User");

/*
===========================================
PLAN CONFIG (CENTRALIZED)
===========================================
*/
const PLANS = {
  individual: { min: 100, rate: 8, duration: 1 },
  joint: { min: 500, rate: 10, duration: 3 },
  shares: { min: 200000, rate: 12, duration: 12 },
  longterm: { min: 1000, rate: 6, duration: 6 },
};

/*
===========================================
CREATE INVESTMENT (TRANSACTION SAFE)
===========================================
*/
router.post("/create", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, amount, partnerEmail } = req.body;

    const user = await User.findById(req.user.id).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    if (!PLANS[type]) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid investment type" });
    }

    const plan = PLANS[type];
    const { min, rate, duration } = plan;

    if (!duration) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Investment duration missing in plan config",
      });
    }

    if (amount < min) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Minimum investment is $${min}`,
      });
    }

    if (type === "joint" && !partnerEmail) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Partner email required",
      });
    }

    if (user.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // 💰 Deduct balance
    user.balance -= amount;
    await user.save({ session });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const investment = await Investment.create([{
          user: user._id,
          type,
          amount,
          partnerEmail,
          monthlyReturn: rate,
          durationMonths: duration,
          monthsPaid: 0,
          totalProfitEarned: 0,
          principalReturned: false,
          startDate,
          endDate,
          status: "active",
        }], { session });

    // 🧾 Record transaction (VERY IMPORTANT)
    const Transaction = require("../models/Transaction");

    await Transaction.create(
      [
        {
          user: user._id,
          investment: investment[0]._id,
          type: "investment",
          amount: amount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Investment created successfully",
      investment: investment[0],
      newBalance: user.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch investments" });
  }
});

router.get("/summary", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const investments = await Investment.find({
      user: req.user.id,
      status: "active",
    });

    const totalInvested = investments.reduce(
      (acc, inv) => acc + inv.amount,
      0
    );

    const totalProfit = investments.reduce(
      (acc, inv) => acc + (inv.totalProfitEarned || 0),
      0
    );

    res.json({
      balance: user.balance,   // 👈 ADD THIS
      totalInvested,
      totalProfit,
      activeCount: investments.length,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch summary"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;