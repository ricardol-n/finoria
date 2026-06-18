import Investment from "../models/Investment.js";

export const createInvestment = async (req, res) => {
  try {
    const { type, amount, months, partnerEmail } = req.body;

    const planRates = {
      individual: 8,
      joint: 10,
      shares: 12,
      longterm: 6,
    };

    const rate = planRates[type];

    if (!rate) {
      return res.status(400).json({ message: "Invalid investment type" });
    }

    const currentValue =
      amount * Math.pow(1 + rate / 100, months);

    const investment = await Investment.create({
      user: req.user.id,
      type,
      amount,
      months,
      rate,
      partnerEmail,
      currentValue,
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};