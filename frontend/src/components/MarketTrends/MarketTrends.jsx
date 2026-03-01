import "./MarketTrends.css";
import { useEffect, useState, useRef } from "react";

const STOCKS = ["AAPL", "MSFT", "NVDA", "AMZN"];
const ETFS = ["SPY", "QQQ", "VTI"];
const CRYPTO = ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT"];

export default function MarketTrends() {
  const [assets, setAssets] = useState([]);
  const [category, setCategory] = useState("stocks");
  const [sortType, setSortType] = useState("gainers");

  const previousData = useRef({});
  const API_KEY = process.env.REACT_APP_FINNHUB_KEY;

  const getSymbols = () => {
    if (category === "stocks") return STOCKS;
    if (category === "etf") return ETFS;
    if (category === "crypto") return CRYPTO;
  };

  const fetchData = async () => {
    try {
      const symbols = getSymbols();

      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const endpoint =
            category === "crypto"
              ? `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
              : `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

          const res = await fetch(endpoint);
          const data = await res.json();

          const prevPrice = previousData.current[symbol];
          const direction =
            prevPrice && data.c > prevPrice
              ? "up"
              : prevPrice && data.c < prevPrice
              ? "down"
              : "";

          previousData.current[symbol] = data.c;

          return {
            symbol: symbol.replace("BINANCE:", ""),
            price: data.c,
            change: data.dp,
            direction,
          };
        })
      );

      setAssets(results);
    } catch (error) {
      console.error("Market fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, [category]);

  const sortedAssets = [...assets].sort((a, b) =>
    sortType === "gainers"
      ? b.change - a.change
      : a.change - b.change
  );

  return (
    <section className="market-section">
      <div className="market-container">
        <h2>Live Market Overview</h2>

        {/* CATEGORY TOGGLE */}
        <div className="market-controls">
          <div className="category-toggle">
            <button
              className={category === "stocks" ? "active" : ""}
              onClick={() => setCategory("stocks")}
            >
              Stocks
            </button>
            <button
              className={category === "etf" ? "active" : ""}
              onClick={() => setCategory("etf")}
            >
              ETFs
            </button>
            <button
              className={category === "crypto" ? "active" : ""}
              onClick={() => setCategory("crypto")}
            >
              Crypto
            </button>
          </div>

          <div className="sort-toggle">
            <button
              className={sortType === "gainers" ? "active" : ""}
              onClick={() => setSortType("gainers")}
            >
              Top Gainers
            </button>
            <button
              className={sortType === "losers" ? "active" : ""}
              onClick={() => setSortType("losers")}
            >
              Top Losers
            </button>
          </div>
        </div>

        <div className="market-table-wrapper">
          <table className="market-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map((asset, index) => (
                <tr key={index}>
                  <td className="symbol">{asset.symbol}</td>
                  <td className={`price ${asset.direction}`}>
                    ${asset.price?.toFixed(2)}
                  </td>
                  <td
                    className={
                      asset.change >= 0 ? "positive" : "negative"
                    }
                  >
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}