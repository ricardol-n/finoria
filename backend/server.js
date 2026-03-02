const dotenv = require("dotenv")
const express = require("express");
const connectDB = require("./config/db");
const cors =require("cors");
const adminRoutes  = require("./routes/admin.routes");


dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));


// middleware
app.use(express.json());

// routes
app.use("/api/transactions", require("./routes/transactions"))
app.use("/api/investments", require("./routes/investment"))
app.use("/api/portfolio", require("./routes/portfolio"))
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/crypto", require("./routes/cryptoDeposit"));
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;

// connect database
connectDB();

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);