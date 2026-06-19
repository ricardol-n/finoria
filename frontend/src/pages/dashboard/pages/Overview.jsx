import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiPlus,
  FiTrendingUp,
  FiBriefcase,
  FiGift,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Overview.css";
import api from "../../../api/axios";
import DepositModal from "./DepositModal";
import TradingChart from "./TradingChart";

export default function Overview() {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [user,setUser] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [pRes, sRes, tRes, uRes] = await Promise.all([
        api.get("/portfolio"),
        api.get("/investment/summary"),
        api.get("/auth/me"),
      ]);

      setPortfolio(pRes.data || []);
      setSummary(sRes.data);
      setUser(uRes.data);
      console.log("Current user:", uRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="overview">Loading...</div>;
  if (!summary) return <div className="overview">Failed to load</div>;

  const totalAssets = portfolio.reduce(
    (sum, asset) => sum + asset.totalValue,
    0
  );

  const netWorth =
  (summary.totalInvested || 0) +
  (summary.totalProfit || 0) +
  (user?.balance || 0);

  return (
    <div className="overview">

      {/* ===== HERO ===== */}
      <section className="hero-premium">
        <div>
          <span className="hero-label">Net Worth</span>
          <h1>${netWorth.toLocaleString()}</h1>
          <p className="hero-sub">
            ${summary.totalInvested.toLocaleString()} invested ·
            <span className="profit">
              {" "}+${summary.totalProfit.toLocaleString()} earnings
            </span>
          </p>
        </div>

        <button
          className="btn-premium"
          onClick={() => setShowDeposit(true)}
        >
          <FiPlus />
          Add Funds
        </button>
      </section>

      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onDepositSuccess={() => {
            setShowDeposit(false);
            loadData();
          }}
        />
      )}

      {/* ===== QUICK ACTIONS ===== */}
      <div className="quick-actions">
        <div
          className="quick-item"
          onClick={() => navigate("/dashboard/joint")}
        >
          <FiTrendingUp />
          <span>Invest</span>
        </div>

        <div
          className="quick-item"
          onClick={() => navigate("/dashboard/joint")}
        >
          <FiUsers />
          <span>Joint Plan</span>
        </div>

        <div
          className="quick-item"
          onClick={() => navigate("/dashboard/portfolio")}
        >
          <FiBriefcase />
          <span>Portfolio</span>
        </div>

        <div
          className="quick-item"
          onClick={() => navigate("/dashboard/referrals")}
        >
          <FiGift />
          <span>Referrals</span>
        </div>
      </div>

      {/* ===== PERFORMANCE STRIP ===== */}
      <section className="performance-premium">
        <div>
          <span>Available Assets</span>
          <strong>${totalAssets.toLocaleString()}</strong>
        </div>

        <div>
          <span>Active Investments</span>
          <strong>{summary.activeCount}</strong>
        </div>

        <div>
          <span>Total Invested</span>
          <strong>${summary.totalInvested.toLocaleString()}</strong>
        </div>
      </section>

      {/* ===== SNAPSHOT ===== */}
      <div className="overview-section">
        <div className="section-header">
          <h3>Portfolio Snapshot</h3>
          <span
            className="link"
            onClick={() => navigate("/dashboard/portfolio")}
          >
            View Portfolio <FiArrowUpRight />
          </span>
        </div>

        <div className="snapshot-card">
          <p>
            You currently have{" "}
            <strong>{summary.activeCount}</strong> active
            investment plan(s) generating returns.
          </p>
        </div>
      </div>

      {/* ===== PREMIUM CHART ===== */}
        <div className="chart-luxury">
          <TradingChart />
        </div>

        </div>
  );
}