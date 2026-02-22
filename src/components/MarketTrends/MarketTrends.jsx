import "./MarketTrends.css";
import { useEffect,useCallback, useState, useRef } from "react";

const symbols = ["AAPL", "MSFT", "NVDA", "AMZN", "SPY"];

export default function MarketTrends() {
  const [stocks, setStocks] = useState([]);
  const previousData = useRef({});

  const API_KEY = process.env.REACT_APP_FINNHUB_KEY;

  const fetchData = useCallback(async () => {
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );
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
          symbol,
          price: data.c,
          change: data.dp,
          direction,
        };
      })
    );

    setStocks(results);
  } catch (error) {
    console.error("Market fetch error:", error);
  }
}, [API_KEY]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <section className="market-section">
      <div className="market-container">
        <h2>Active Market Trends</h2>
        <p>
          Live pricing across global equities available for fractional investment.
        </p>

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
              {stocks.map((stock, index) => (
                <tr key={index}>
                  <td className="symbol">{stock.symbol}</td>

                  <td className={`price ${stock.direction}`}>
                    ${stock.price?.toFixed(2)}
                  </td>

                  <td
                    className={
                      stock.change >= 0 ? "positive" : "negative"
                    }
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change?.toFixed(2)}%
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