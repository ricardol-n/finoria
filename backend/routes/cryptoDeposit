const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/auth.middleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const response = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: currency,
        ipn_callback_url:
          "https://finoria.onrender.com/api/crypto/webhook",
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        },
      }
    );

    const payment = response.data;

    // 🔥 IMPORTANT: Save payment_id
    await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "pending",
      paymentId: payment.payment_id,
      description: `Crypto deposit (${currency})`,
    });

    res.json({
      payment_id: payment.payment_id,
      pay_address: payment.pay_address,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Crypto payment creation failed" });
  }
});

module.exports = router;