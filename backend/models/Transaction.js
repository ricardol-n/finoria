const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "investment", "profit","principal_return",],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // 🔥 link transaction to investment (VERY IMPORTANT)
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
    },

    // 🔥 IMPORTANT FOR WEBHOOK MATCHING
    paymentId: {
      type: String,
      unique:true,
      sparse:true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",   // ✅ FIXED
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);