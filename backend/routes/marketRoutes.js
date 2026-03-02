const express = require("express");
const axios = require("axios");

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const router = express.Router();

let cryptoCache = null;
let stockCache = null;
let lastCryptoFetch = 0;
let lastStockFetch = 0;

/* =======================
   CRYPTO (CoinGecko)
======================= */
router.get("/crypto", async (req, res) => {
  try {
    const now = Date.now();

    if (cryptoCache && now - lastCryptoFetch < 20000) {
      return res.json(cryptoCache);
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: true,
          price_change_percentage: "24h",
        },
      }
    );

    cryptoCache = response.data;
    lastCryptoFetch = now;

    res.json(cryptoCache);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
});

/* =======================
   STOCKS (Finnhub)
======================= */
router.get("/stocks", async (req, res) => {
  try {
    const now = Date.now();

    if (stockCache && now - lastStockFetch < 30000) {
      return res.json(stockCache);
    }

    const symbols = ["AAPL", "TSLA", "MSFT", "NVDA", "AMZN"];

    const promises = symbols.map(symbol =>
      axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      })
    );

    const results = await Promise.all(promises);

    const formatted = results.map((r, i) => ({
      symbol: symbols[i],
      price: r.data.c,
      change: r.data.dp,
    }));

    stockCache = formatted;
    lastStockFetch = now;

    res.json(stockCache);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Historical stock chart
router.get("/stocks/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const period2 = new Date();
    const period1 = new Date();
    period1.setMonth(period1.getMonth() - 1);

    const result = await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval: "1d",
    });

    if (!result || !result.quotes) {
      return res.json([]);
    }

    const data = result.quotes
      .filter(q =>
        q.open !== null &&
        q.high !== null &&
        q.low !== null &&
        q.close !== null
      )
      .map(q => ({
        x: new Date(q.date).getTime(), // 🔥 IMPORTANT
        y: [
          Number(q.open),
          Number(q.high),
          Number(q.low),
          Number(q.close)
        ],
      }));

    res.json(data);

  } catch (err) {
    console.error("Yahoo History Error:", err.message);
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
});

module.exports = router;