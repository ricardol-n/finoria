const cron = require("node-cron");
const mongoose = require("mongoose");
const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const {runInvestmentLogic } = require("../services/investmentService");

cron.schedule("0 0 1 * *", async () => {
  console.log("Running monthly investment job...");
  await runInvestmentLogic();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const activeInvestments = await Investment.find({
      status: "active",
    }).session(session);

    for (let inv of activeInvestments) {
      // 🛑 Prevent double payout same month
      if (inv.lastProfitMonth === currentMonth) continue;

      // 🛑 Stop if duration completed
      if (inv.monthsPaid >= inv.durationMonths) continue;

      const user = await User.findById(inv.user).session(session);
      if (!user) continue;

      // 💰 Calculate monthly profit
      const profit = (inv.amount * inv.monthlyReturn) / 100;

      // Add to withdrawable profit (NOT directly to balance)
      inv.withdrawableProfit += profit;
      inv.totalProfitEarned += profit;
      inv.monthsPaid += 1;
      inv.lastProfitMonth = currentMonth;

      // 📦 If duration completed after this payout
      if (inv.monthsPaid >= inv.durationMonths) {
        inv.status = "completed";

        // Return principal once
        if (!inv.principalReturned) {
          user.balance += inv.amount;

          await Transaction.create(
            [
              {
                user: user._id,
                investment: inv._id,
                type: "principal_return",
                amount: inv.amount,
              },
            ],
            { session }
          );

          inv.principalReturned = true;
        }
      }

      await inv.save({ session });
      await user.save({ session });

      // Log monthly profit transaction
      await Transaction.create(
        [
          {
            user: user._id,
            investment: inv._id,
            type: "profit",
            amount: profit,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    console.log("Investment job completed safely.");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Investment cron failed:", err);
  }
});