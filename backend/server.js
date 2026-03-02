const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

// 🔥 1️⃣ Webhook FIRST (before express.json)
app.use("/api/crypto/webhook", require("./routes/crypto.webhook"));

// 🔥 2️⃣ Then JSON parser
app.use(express.json());

// 🔥 3️⃣ Then normal routes
app.use("/api/crypto", require("./routes/cryptoDeposit"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/investments", require("./routes/investment"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/admin", require("./routes/admin.routes"));

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);