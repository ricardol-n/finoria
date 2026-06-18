const express = require("express");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const router = express.Router();

/* =====================================
   IMPORTANT: RAW BODY FOR SIGNATURE
===================================== */
router.use(express.raw({ type: "*/*" }));

router.post("/", async (req, res) => {
  try {

    const signature = req.headers["x-nowpayments-sig"];
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!secret) {
      console.error("NOWPAYMENTS_IPN_SECRET missing");
      return res.sendStatus(500);
    }

    if (!req.body) {
      console.error("Webhook received empty body");
      return res.sendStatus(400);
    }

    /* =====================================
       VERIFY SIGNATURE
    ===================================== */
    const hmac = crypto
      .createHmac("sha512", secret)
      .update(req.body.toString())
      .digest("hex");

    if (hmac !== signature) {
      console.error("Invalid NOWPayments signature");
      return res.status(400).send("Invalid signature");
    }

    /* =====================================
       PARSE WEBHOOK DATA
    ===================================== */
    let data;

    try {
      data = JSON.parse(req.body.toString());
    } catch (err) {
      console.error("Webhook JSON parse error");
      return res.sendStatus(400);
    }

    const { payment_id, payment_status } = data;

    if (!payment_id) {
      console.error("Missing payment_id");
      return res.sendStatus(400);
    }

    console.log("Webhook received:", payment_id, payment_status);

    /* =====================================
       FIND TRANSACTION
    ===================================== */
    const transaction = await Transaction.findOne({
      paymentId: payment_id,
    });

    if (!transaction) {
      console.log("Transaction not found:", payment_id);
      return res.sendStatus(200);
    }

    /* =====================================
       PREVENT DOUBLE PROCESSING
    ===================================== */
    if (transaction.status === "completed") {
      console.log("Transaction already processed");
      return res.sendStatus(200);
    }

    /* =====================================
       HANDLE SUCCESS PAYMENT
    ===================================== */
    if (payment_status === "finished" || payment_status === "confirmed") {

      transaction.status = "completed";
      await transaction.save();

      const user = await User.findById(transaction.user);

      if (!user) {
        console.error("User not found for transaction");
        return res.sendStatus(500);
      }

      user.balance += transaction.amount;
      await user.save();

      console.log("Deposit completed:", transaction.amount);
    }

    /* =====================================
       HANDLE FAILED PAYMENT
    ===================================== */
    if (payment_status === "failed" || payment_status === "expired") {

      transaction.status = "failed";
      await transaction.save();

      console.log("Deposit failed:", payment_id);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

module.exports = router;