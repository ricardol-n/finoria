const express = require("express");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const router = express.Router();

// IMPORTANT: raw body for signature
router.use(express.raw({ type: "*/*" }));

router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-nowpayments-sig"];
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;

    // Verify signature
    const hmac = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");

    if (hmac !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const data = JSON.parse(req.body.toString());

    const { payment_id, payment_status } = data;

    if (payment_status === "finished") {
      const transaction = await Transaction.findOne({
        paymentId: payment_id,
      });

      if (!transaction || transaction.status === "completed") {
        return res.sendStatus(200);
      }

      transaction.status = "completed";
      await transaction.save();

      // 🔥 Increase user balance
      const user = await User.findById(transaction.user);
      user.balance += transaction.amount;
      await user.save();
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;