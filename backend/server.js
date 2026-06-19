const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://finoria2.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 1️⃣ Webhook FIRST (before express.json)
app.use("/api/crypto/webhook", require("./routes/crypto.webhook"));

// 🔥 2️⃣ Then JSON parser
app.use(express.json());

// 🔥 3️⃣ Then normal routes
app.use("/api/crypto", require("./routes/cryptoDeposit"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/investment", require("./routes/investment"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/security", require("./routes/security"));

const PORT = process.env.PORT || 5000;

connectDB();

// 🔥 VERY IMPORTANT: LOAD CRON JOB
require("./cron/investmentProfit");

app.listen(PORT, () =>
  console.log(`🚀 Server running on port`)
);