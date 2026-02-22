//routes/admin.routes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * ADMIN DASHBOARD STATS
 * GET /api/admin/dashboard
 */
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const approvedUsers = await User.countDocuments({ status: "approved" });

    const totalBalanceAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ]);

    const totalBalance = totalBalanceAgg[0]?.total || 0;

    res.json({
      totalUsers,
      activeUsers,
      approvedUsers,
      totalBalance,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});


/**
 * GET ALL USERS
 * GET /api/admin/users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * APPROVE USER
 * PUT /api/admin/users/:id/approve
 */
router.put("/users/:id/approve", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "approved";
    user.isActive = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

/**
 * LOCK USER
 * PUT /api/admin/users/:id/lock
 */
router.put("/users/:id/lock", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();

    res.json({ message: "User locked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Lock failed" });
  }
});

/**
 * INCREASE USER BALANCE
 * PUT /api/admin/users/:id/balance
 */
router.put("/users/:id/balance", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance = (user.balance || 0) + Number(amount);
    await user.save();

    res.json({
      message: "Balance updated successfully",
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Balance update failed" });
  }
});

module.exports = router;
