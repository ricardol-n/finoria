import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line } from "recharts";
import api from "../../../api/axios";
import "./Market.css";

export default function Market() {
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  const fetchMarket = async () => {
    try {
      const [cryptoRes, stockRes] = await Promise.all([
        api.get("/api/market/crypto"),
        api.get("/api/market/stocks"),
      ]);

      setCrypto(cryptoRes.data);
      setStocks(stockRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 20000);
    return () => clearInterval(interval);
  }, []);

  const openAsset = (type, id) => {
    navigate(`/dashboard/market/${type}/${id}`);
  };

  return (
    <div className="market-page">

      {/* CRYPTO */}
      <div className="market-section">
        <h2>Crypto Market</h2>

        <div className="market-grid">
          {crypto.map((coin) => (
            <div
              key={coin.id}
              className="market-card"
              onClick={() => openAsset("crypto", coin.id)}
            >
              <div className="market-left">
                <img src={coin.image} alt={coin.name} />
                <div>
                  <h4>{coin.name}</h4>
                  <span>{coin.symbol.toUpperCase()}</span>
                </div>
              </div>

              <div className="sparkline">
                <LineChart
                  width={80}
                  height={40}
                  data={coin.sparkline_in_7d.price.map((p) => ({ price: p }))}
                >
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={
                      coin.price_change_percentage_24h >= 0
                        ? "#16c784"
                        : "#ea3943"
                    }
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </div>

              <div className="market-right">
                <h4>${coin.current_price.toLocaleString()}</h4>
                <span
                  className={
                    coin.price_change_percentage_24h >= 0
                      ? "green"
                      : "red"
                  }
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOCKS */}
      <div className="market-section">
        <h2>Stock Market</h2>

        <div className="market-grid">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="market-card"
              onClick={() => openAsset("stock", stock.symbol)}
            >
              <div className="stock-badge">{stock.symbol}</div>

              <div className="market-right">
                <h4>${stock.price?.toFixed(2)}</h4>
                <span className={stock.change >= 0 ? "green" : "red"}>
                  {stock.change?.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}