const mongoose = require("mongoose");
const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const runInvestmentLogic = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const activeInvestments = await Investment.find({
      status: "active",
    }).session(session);

    for (let inv of activeInvestments) {

      if (inv.lastProfitMonth === currentMonth) continue;
      if (inv.monthsPaid >= inv.durationMonths) continue;

      const user = await User.findById(inv.user).session(session);
      if (!user) continue;

      const profit = (inv.amount * inv.monthlyReturn) / 100;

      inv.withdrawableProfit += profit;
      inv.totalProfitEarned += profit;
      inv.monthsPaid += 1;
      inv.lastProfitMonth = currentMonth;

      if (inv.monthsPaid >= inv.durationMonths) {
        inv.status = "completed";

        if (!inv.principalReturned) {
          user.balance += inv.amount;

          await Transaction.create([{
            user: user._id,
            investment: inv._id,
            type: "principal_return",
            amount: inv.amount,
          }], { session });

          inv.principalReturned = true;
        }
      }

      await inv.save({ session });
      await user.save({ session });

      await Transaction.create([{
        user: user._id,
        investment: inv._id,
        type: "profit",
        amount: profit,
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Investment logic executed");

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Investment logic failed:", err);
    throw err;
  }
};

module.exports = { runInvestmentLogic };