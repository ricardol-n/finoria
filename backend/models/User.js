const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    
    balance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "locked"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user","admin"],
      default: "user",
    },
    twoFA: {
      type:Boolean,
      default: false
    },
    twoFASecret: {
      type:String,
      default:null
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);