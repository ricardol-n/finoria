const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

const app = express();

/* ================================
   DATABASE
================================ */
connectDB();

/* ================================
   CORS CONFIG (PRODUCTION SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://finoria2.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // DO NOT break request with error (prevents Render crash)
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight requests
app.options(/.*/, cors());

/* ================================
   BODY PARSER
================================ */
app.use(express.json());

/* ================================
   ROUTES
================================ */
app.use("/api/crypto/webhook", require("./routes/crypto.webhook"));

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

/* ================================
   CRON JOB (INVESTMENT PROFITS)
================================ */
require("./cron/investmentProfit");

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);