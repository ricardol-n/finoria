require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors =require("cors");
const adminRoutes  = require("./routes/admin.routes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));



// middleware
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;

// connect database
connectDB();

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);