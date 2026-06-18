import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./PortfolioDetails.css";

export default function PortfolioDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const res = await api.get(`/investment/${id}`);
        setInvestment(res.data);
      } catch (err) {
        console.error("Failed to fetch investment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  if (loading) return <div className="details">Loading...</div>;
  if (!investment) return <div className="details">Not found</div>;

  const progress =
    investment.durationMonths > 0
      ? Math.min(
          100,
          (investment.monthsPaid / investment.durationMonths) * 100
        )
      : 0;

  const daysLeft = investment.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(investment.endDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <div className="details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-card">
        <h2>{investment.type} Investment</h2>
        <p className="amount">${investment.amount.toLocaleString()}</p>

        <div className="status-row">
          <span className={`badge1 ${investment.status}`}>
            {investment.status}
          </span>
        </div>

        <div className="progress-bar1">
          <div
            className="progress-fill1"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="meta1">
          <span>
            {investment.monthsPaid} / {investment.durationMonths} months
          </span>
          <span>{daysLeft} days left</span>
        </div>

        <div className="stats">
          <div>
            <p>Monthly Return</p>
            <h4>{investment.monthlyReturn}%</h4>
          </div>

          <div>
            <p>Total Profit</p>
            <h4>
              ${investment.totalProfitEarned.toLocaleString()}
            </h4>
          </div>

          <div>
            <p>Withdrawable</p>
            <h4>
              ${investment.withdrawableProfit.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}