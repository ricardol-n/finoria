import { useEffect, useState } from "react";
import { FiTrendingUp, FiUsers, FiBriefcase, FiGift } from "react-icons/fi";
import "./Overview.css";
import api from "../../../api/axios"
import DepositModal from "./DepositModal";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit,setShowDeposit] = useState(false);


  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/api/dashboard/overview");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <div className="overview">Loading...</div>;
  if (!data) return <div className="overview">Failed to load data</div>;


  return (
    <div className="overview">

      {/* HERO CARD */}
      <div className="hero1">
        <div className="tots">
          <p className="muted">Total Assets</p>
          <h1>${data.totalAssets.toLocaleString()}</h1>
        </div>
       <button className="primary-btn" onClick={() => setShowDeposit(true)}>
         Deposit
       </button>

       {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      </div>

       {/* MOBILE QUICK ACTIONS */}
      <div className="quick-actions">
        <div className="quick-item">
          <FiTrendingUp />
          <span>Invest</span>
        </div>

        <div className="quick-item">
          <FiUsers />
          <span>Joint</span>
        </div>

        <div className="quick-item">
          <FiBriefcase />
          <span>Assets</span>
        </div>

        <div className="quick-item">
          <FiGift />
          <span>Referrals</span>
        </div>
      </div>

      {/* STAT GRID */}
      <div className="grid-4">
        <div className="card">
          <p className="muted">Portfolio Value</p>
          <h2>${data.totalAssets.toLocaleString()}</h2>
        </div>

        <div className="card">
          <p className="muted">Active Investments</p>
          <h2>${data.activeInvestments.toLocaleString()}</h2>
        </div>

        <div className="card">
          <p className="muted">Total Earnings</p>
          <h2>${data.totalEarnings.toLocaleString()}</h2>
        </div>

        <div className="card">
          <p className="muted">Joint Account</p>
          <h2>${data.jointBalance.toLocaleString()}</h2>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid-2">
        <div className="card large">
          <h3>Performance</h3>
          <div className="chart-placeholder">
            Premium Chart Goes Here
          </div>
        </div>

        <div className="card">
          <h3>Market Snapshot</h3>
          <div className="market-row">
            <span>AAPL</span>
            <span>$189.22</span>
            <span className="green">+1.4%</span>
          </div>
          <div className="market-row">
            <span>TSLA</span>
            <span>$245.80</span>
            <span className="red">-0.8%</span>
          </div>
        </div>
      </div>

    </div>
  );
}