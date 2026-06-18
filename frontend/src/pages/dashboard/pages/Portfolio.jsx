import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import api from "../../../api/axios";
import "./Portfolio.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, txRes] = await Promise.all([
          api.get("/investment/my"),
          api.get("/transactions"),
        ]);

        setInvestments(invRes.data || []);
        setTransactions((txRes.data || []).slice(0, 6));
      } catch (err) {
        console.error("Portfolio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeInvestments = investments.filter(i => i.status === "active");
  const completedInvestments = investments.filter(i => i.status === "completed");

  const summary = useMemo(() => {
    const invested = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
    const profit = activeInvestments.reduce(
      (sum, i) => sum + (i.totalProfitEarned || 0),
      0
    );

    return {
      totalInvested: invested,
      totalProfit: profit,
      totalValue: invested + profit,
    };
  }, [activeInvestments]);

  if (loading) return <div className="portfolio">Loading...</div>;

  const pieData = {
    labels: activeInvestments.map(i => i.type),
    datasets: [
      {
        data: activeInvestments.map(i => i.amount),
        backgroundColor: ["#2563eb", "#3b82f6", "#93c5fd", "#f9a8d4"],
        borderWidth: 0,
      },
    ],
  };

  const displayedInvestments = activeTab === "active" ? activeInvestments : completedInvestments;

  return (
    <div className="portfolio">

      {/* ===== SUMMARY ===== */}
      <div className="portfolio-summary">
        <div className="summary-card primary">
          <p>Total Value</p>
          <h2>${summary.totalValue.toLocaleString()}</h2>
        </div>

        <div className="summary-card">
          <p>Active Invested</p>
          <h3>${summary.totalInvested.toLocaleString()}</h3>
        </div>

        <div className="summary-card">
          <p>Active Profit</p>
          <h3 className="positive">
            +${summary.totalProfit.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* ===== ALLOCATION ===== */}
      {activeInvestments.length > 0 && (
        <div className="card allocation-card">
          <h3>Allocation</h3>
          <Pie data={pieData} />
        </div>
      )}

      {/* ===== TABS ===== */}
      <div className="portfolio-tabs">
        <button
          className={activeTab === "active" ? "tab active" : "tab"}
          onClick={() => setActiveTab("active")}
        >
          Active ({activeInvestments.length})
        </button>

        <button
          className={activeTab === "completed" ? "tab active" : "tab"}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedInvestments.length})
        </button>
      </div>

     {/* ===== INVESTMENTS ===== */}
<div className="card">
  {displayedInvestments.length === 0 ? (
    <div className="empty-state">No investments found</div>
  ) : (
    displayedInvestments.map(inv => {
      const progress =
        inv.durationMonths > 0
          ? Math.min(
              100,
              Math.max(
                0,
                (inv.monthsPaid / inv.durationMonths) * 100
              )
            )
          : 0;

      const daysLeft = inv.endDate
        ? Math.max(
            0,
            Math.ceil(
              (new Date(inv.endDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0;

      return (
        <div key={inv._id} className="investment-item">

          <div className="investment-top">
            <div>
              <strong>{inv.type}</strong>
              <p>${inv.amount.toLocaleString()}</p>
            </div>

            <span className={`badge2 ${inv.status}`}>
              {inv.status}
            </span>
          </div>

          {inv.status === "active" && (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="meta">
                <span>
                  {inv.monthsPaid}/{inv.durationMonths} months
                </span>
                <span>{daysLeft} days left</span>
              </div>
            </>
          )}

          <div className="investment-bottom">
            <div>
              <span className="rate">
                {inv.monthlyReturn}% / month
              </span>
              <span className="profit">
                +${(inv.totalProfitEarned || 0).toLocaleString()}
              </span>
            </div>

            <div className="actions">
              <button
                className="btn-outline"
                onClick={() =>
                  navigate(`/dashboard/portfolio/${inv._id}`)
                }
              >
                View
              </button>

              {inv.status === "active" && (
                <button className="btn-primary">
                  Withdraw Profit
                </button>
              )}
            </div>
          </div>

        </div>
      );
    })
  )}
</div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="card transactions-card">
        <h3>Recent Activity</h3>
        {transactions.map(tx => (
          <div key={tx._id} className="tx-row">
            <span>{tx.type}</span>
            <span>${tx.amount.toLocaleString()}</span>
            <span>
              {new Date(tx.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}