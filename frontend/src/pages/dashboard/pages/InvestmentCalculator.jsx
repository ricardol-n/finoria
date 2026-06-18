import React, { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "../../../api/axios";
import "./InvestmentCalculator.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const INVESTMENT_TYPES = {
  individual: { label: "Individual Investment", min: 100, rate: 8 },
  joint: { label: "Joint Investment", min: 500, rate: 10 },
  shares: { label: "Shares Ownership", min: 200000, rate: 12 },
  longterm: { label: "Long-Term Growth", min: 1000, rate: 6, locked: true },
};

export default function InvestmentCalculator({ selectedPlan }) {
  const [type, setType] = useState(selectedPlan || "individual");
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const currentPlan = INVESTMENT_TYPES[type];

  // Sync with parent plan selection
  useEffect(() => {
    if (selectedPlan && selectedPlan !== type) {
      setType(selectedPlan);
    }
  }, [selectedPlan,type]);

  // Auto-adjust amount if below minimum
  useEffect(() => {
    if (amount < currentPlan.min) {
      setAmount(currentPlan.min);
    }
  }, [amount,currentPlan.min]);

  // Prevent invalid month values
  useEffect(() => {
    if (months < 1) setMonths(1);
    if (months > 60) setMonths(60);
  }, [months]);

  // 📈 Generate compound projection (clean + numeric)
  const projection = useMemo(() => {
    let balance = Number(amount);
    const labels = [];
    const dataPoints = [];

    for (let i = 1; i <= months; i++) {
      balance += (balance * currentPlan.rate) / 100;
      labels.push(`Month ${i}`);
      dataPoints.push(Number(balance.toFixed(2)));
    }

    return {
      labels,
      values: dataPoints,
      final: dataPoints[dataPoints.length - 1] || amount,
    };
  }, [amount, months, currentPlan.rate]);

  const chartData = {
    labels: projection.labels,
    datasets: [
      {
        label: "Projected Growth",
        data: projection.values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(236, 72, 153, 0.08)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // 🚀 Create Investment
  const handleInvest = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    if (!amount || amount < currentPlan.min) {
      return setError(`Minimum investment is $${currentPlan.min}`);
    }

    if (type === "joint" && !partnerEmail) {
      return setError("Partner email required for joint investment");
    }

    if (type === "longterm" && months < 6) {
      return setError("Long-term plan requires minimum 6 months");
    }

    try {
      await api.post("/investment/create", {
        type,
        amount,
        partnerEmail,
      });

      setSuccess("Investment created successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Investment failed");
    }
  };

  return (
    <div className="calculator-container">
      {/* PLAN SELECTOR */}
      <div className="plan-selector">
        {Object.keys(INVESTMENT_TYPES).map((key) => (
          <button
            key={key}
            className={type === key ? "active-plan" : ""}
            onClick={() => setType(key)}
          >
            {INVESTMENT_TYPES[key].label}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div className="calc-inputs">
        <div>
          <label>Investment Amount ($)</label>
          <input
            type="number"
            min={currentPlan.min}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <small>Minimum: ${currentPlan.min}</small>
        </div>

        <div>
          <label>Duration (Months)</label>
          <input
            type="number"
            min={1}
            max={60}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>

        {type === "joint" && (
          <div>
            <label>Partner Email</label>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* RESULT */}
      <div className="result-box">
        <p>Monthly Return: {currentPlan.rate}%</p>
        <h3>
          Projected Value: $
          {projection.final.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </h3>
      </div>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <button className="invest-btn1" onClick={handleInvest}>
        Start Investment
      </button>

      <div className="chart-box">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}