const express = require("express");
const axios = require("axios");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance();
const router = express.Router();

/* =============================
   SIMPLE MEMORY CACHE
============================= */
const cache = {};
const setCache = (key, data, ttl = 20000) => {
  cache[key] = {
    data,
    expiry: Date.now() + ttl,
  };
};

const getCache = (key) => {
  if (!cache[key]) return null;
  if (Date.now() > cache[key].expiry) {
    delete cache[key];
    return null;
  }
  return cache[key].data;
};

/* =============================
   CRYPTO MARKET (CoinGecko)
============================= */
router.get("/crypto", async (req, res) => {
  try {
    const cached = getCache("cryptoMarket");
    if (cached) return res.json(cached);

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

    setCache("cryptoMarket", response.data, 20000);
    res.json(response.data);
  } catch (err) {
    console.error("Crypto fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
});
/* =============================
   CRYPTO SEARCH
============================= */
router.get("/crypto/search/:query", async (req, res) => {
  try {
    const query = req.params.query;

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/search",
      {
        params: { query }
      }
    );

    const coins = response.data.coins.slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      image: c.large
    }));

    res.json(coins);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

/* =============================
   STOCK MARKET (Finnhub)
============================= */
router.get("/stocks", async (req, res) => {
  try {
    const cached = getCache("stockMarket");
    if (cached) return res.json(cached);

    const symbols = ["AAPL", "TSLA", "MSFT", "NVDA", "AMZN"];

    const responses = await Promise.all(
      symbols.map((symbol) =>
        axios.get("https://finnhub.io/api/v1/quote", {
          params: {
            symbol,
            token: process.env.FINNHUB_API_KEY,
          },
        })
      )
    );

    const formatted = responses.map((r, i) => ({
      symbol: symbols[i],
      price: r.data.c,
      change: r.data.dp,
    }));

    setCache("stockMarket", formatted, 30000);
    res.json(formatted);
  } catch (err) {
    console.error("Stock fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

/* =============================
   STOCK HISTORY (Yahoo)
============================= */
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
      return res.status(404).json({ error: "No chart data found" });
    }

    const data = result.quotes
      .filter((q) => q.open && q.high && q.low && q.close)
      .map((q) => ({
        x: new Date(q.date).getTime(),
        y: [q.open, q.high, q.low, q.close],
      }));

    res.json(data);
  } catch (err) {
    console.error("Yahoo history error:", err);

    res.status(500).json({
      error: "Yahoo history failed",
      message: err.message,
    });
  }
});

/* =============================
   CRYPTO HISTORY (Binance via Backend)
============================= */
router.get("/crypto/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    // ✅ Validate symbol format
    if (!symbol || !symbol.endsWith("USDT")) {
      return res.status(400).json({
        error: "Invalid symbol format",
      });
    }

    const response = await axios.get(
      "https://api.binance.com/api/v3/klines",
      {
        params: {
          symbol,
          interval: "1m",
          limit: 100,
        },
      }
    );

    if (!response.data) {
      return res.status(404).json({ error: "No candle data" });
    }

    const formatted = response.data.map((candle) => ({
      x: candle[0],
      y: [
        parseFloat(candle[1]),
        parseFloat(candle[2]),
        parseFloat(candle[3]),
        parseFloat(candle[4]),
      ],
    }));

    res.json(formatted);

  } catch (err) {
    console.error("Binance history error:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch Binance candles",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;