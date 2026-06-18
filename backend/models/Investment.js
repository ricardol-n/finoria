const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["individual", "joint", "shares", "longterm"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // 🔹 Monthly percentage return (e.g. 8%)
    monthlyReturn: {
      type: Number,
      required: true,
    },

    // 🔹 Fixed investment duration
    durationMonths: {
      type: Number,
      required: true,
    },

    // 🔹 How many months have been paid so far
    monthsPaid: {
      type: Number,
      default: 0,
    },

    // 🔹 Total profit accumulated over time
    totalProfitEarned: {
      type: Number,
      default: 0,
    },

    // 🔹 Optional: if using manual withdraw system
    withdrawableProfit: {
      type: Number,
      default: 0,
    },

    // 🔹 Prevent double payout in same month
    lastProfitMonth: {
      type: String,
    },

    // 🔹 Maturity tracking
    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    // 🔹 Principal return tracking
    principalReturned: {
      type: Boolean,
      default: false,
    },

    partnerEmail: String,

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);