import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import DepositModal from "./DepositModal";
import api from "../../../api/axios";
import "./AssetDetails.css";

export default function AssetDetails() {

  const { type, id } = useParams();

  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);

  /* =============================
     FETCH ASSET DETAILS
  ============================= */

  useEffect(() => {

    const fetchDetails = async () => {
      try {

        if (type === "crypto") {
          const res = await api.get("/market/crypto");
          const asset = res.data.find(c => c.id === id);
          setData(asset);
        }

        if (type === "stock") {
          const res = await api.get("/market/stocks");
          const asset = res.data.find(s => s.symbol === id);
          setData(asset);
        }

      } catch (err) {
        console.error("Asset fetch error:", err.response?.data || err.message);
      }
    };

    fetchDetails();

  }, [type, id]);

  /* =============================
     DYNAMIC BINANCE SYMBOL 🔥
  ============================= */

  const binanceSymbol = useMemo(() => {
    if (type !== "crypto") return null;

    if (!data?.symbol) return null;

    return data.symbol.toUpperCase() + "USDT";
  }, [type, data]);

  /* =============================
     FETCH CHART DATA
  ============================= */

  useEffect(() => {

    if (type !== "crypto") return;
    if (!binanceSymbol) {
      console.warn("Invalid symbol for chart:", id);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await api.get(
          `/market/crypto/history/${binanceSymbol}`
        );
        setChartData(res.data);
      } catch (err) {
        console.error("Chart fetch error:", err.response?.data || err.message);
      }
    };

    fetchHistory();

    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);

  }, [binanceSymbol, type, id]);

  if (!data) {
    return <div className="asset-loading">Loading asset...</div>;
  }

  const price =
    type === "crypto"
      ? data.current_price
      : data.price;

  const change =
    type === "crypto"
      ? data.price_change_percentage_24h
      : data.change;

  /* =============================
     CHART CONFIG
  ============================= */

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      background: "transparent"
    },
    grid: {
      borderColor: "#1f2937"
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#9ca3af" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#16c784",
          downward: "#ea3943"
        }
      }
    }
  };

  return (
    <div className="asset-page">

      <div className="asset-header">
        <div className="asset-title">

          {type === "crypto" && (
            <img
              src={data.image}
              alt={data.name}
              className="asset-logo"
            />
          )}

          <div>
            <h1>
              {type === "crypto" ? data.name : data.symbol}
            </h1>

            <span className="asset-symbol">
              {type === "crypto"
                ? data.symbol?.toUpperCase()
                : data.symbol}
            </span>
          </div>
        </div>

        <div className="asset-price">
          <h2>${price?.toLocaleString()}</h2>
          <span className={change >= 0 ? "green" : "red"}>
            {change?.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="asset-main">

        <div className="asset-chart-card">
          {type === "crypto" && chartData.length > 0 && (
            <Chart
              type="candlestick"
              height={420}
              series={[{ data: chartData }]}
              options={chartOptions}
            />
          )}
        </div>

        <div className="trade-panel">
          <h3>Trade</h3>

          <button
            className="buy-btn"
            onClick={() => setShowDepositModal(true)}
          >
            Buy {data.symbol?.toUpperCase()}
          </button>

          <button className="sell-btn">
            Sell {data.symbol?.toUpperCase()}
          </button>

          <div className="asset-stats">

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
      </div>

      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          assetName={data.symbol}
          assetId={id}
        />
      )}

    </div>
  );
}