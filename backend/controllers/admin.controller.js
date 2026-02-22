const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Approve user
exports.approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  res.json({ message: "User approved" });
};

// Lock user
exports.lockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isActive: false,
  });

  res.json({ message: "User locked" });
};

// Unlock user
exports.unlockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isActive: true,
    status: "approved",
  });

  res.json({ message: "User unlocked" });
};

// 📊 Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDeposits = await Transaction.aggregate([
      { $match: { type: "deposit", status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: "withdrawal", status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const pendingWithdrawals = await Transaction.countDocuments({
      type: "withdrawal",
      status: "pending",
    });

    res.json({
      totalUsers,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0,
      pendingWithdrawals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

exports.updateUserBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += Number(amount);
    await user.save();

    res.json({
      message: "Balance updated successfully",
      newBalance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update balance" });
  }
};
