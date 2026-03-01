import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./AssetDetails.css";

export default function AssetDetails() {
  const { type, id } = useParams();
  const [data, setData] = useState(null);
  const [history,setHistory] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (type === "crypto") {
          const res = await api.get("/api/market/crypto");
          const asset = res.data.find((c) => c.id === id);
          setData(asset);
        }

        if (type === "stock") {
          const res = await api.get("/api/market/stocks");
          const asset = res.data.find((s) => s.symbol === id);
          setData(asset);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [type, id]);

  useEffect(() => {
  if (type === "stock") {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/market/stocks/history/${id}`);
        setHistory(res.data);
      } catch (err) {
        console.error("History fetch failed");
      }
    };
    fetchHistory();
  }
}, [type, id]);

  if (!data) return <div className="asset-loading">Loading asset...</div>;

  const price =
    type === "crypto"
      ? data.current_price
      : data.price;

  const change =
    type === "crypto"
      ? data.price_change_percentage_24h
      : data.change;

  const chartData =
    type === "crypto" && data.sparkline_in_7d
      ? data.sparkline_in_7d.price.map((p, i) => ({
          price: p,
          index: i,
        }))
      : [];

  return (
    <div className="asset-container">

      {/* HEADER */}
      <div className="asset-header">
        <div>
          <h1>
            {type === "crypto" ? data.name : data.symbol}
          </h1>
          <p className="asset-symbol">
            {type === "crypto"
              ? data.symbol.toUpperCase()
              : data.symbol}
          </p>
        </div>

        {type === "crypto" && (
          <img
            src={data.image}
            alt={data.name}
            className="asset-logo"
          />
        )}
      </div>

      {/* PRICE CARD */}
      <div className="asset-price-card">
        <h2>${price?.toLocaleString()}</h2>
        <span className={change >= 0 ? "green" : "red"}>
          {change?.toFixed(2)}%
        </span>
      </div>

      <div className="asset-actions">
      <button className="buy-btn">Buy</button>
      <button className="sell-btn">Sell</button>
      </div>
      

      {/* CHART */}
{((type === "crypto" && chartData.length > 0) ||
  (type === "stock" && history.length > 0)) && (
<div className="asset-chart">
    <Chart
      type="candlestick"
      height={350}
      series={[{ data: history || [] }]}
      options={{
        chart: {
          toolbar: { show: false },
          animations: { enabled: true },
        },
        xaxis: {
          type: "datetime",
        },
        tooltip: {
          enabled: true,
        },
      }}
    />
  </div>
)}

      {/* EXTRA INFO */}
      <div className="asset-info">
        {type === "crypto" && (
          <>
            <div>
              <span>Market Cap</span>
              <strong>${data.market_cap?.toLocaleString()}</strong>
            </div>
            <div>
              <span>24h Volume</span>
              <strong>${data.total_volume?.toLocaleString()}</strong>
            </div>
          </>
        )}

        {type === "stock" && (
          <div>
            <span>Current Price</span>
            <strong>${data.price?.toFixed(2)}</strong>
          </div>
        )}
      </div>

    </div>
  );
}