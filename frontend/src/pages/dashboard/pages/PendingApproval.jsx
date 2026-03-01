import "./PendingApproval.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const PendingApproval = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔁 Auto polling every 10 seconds
   useEffect(() => {
    const interval = setInterval(async () => {
      await refreshUser();
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // 🚀 Auto redirect if approved
  useEffect(() => {
    if (user?.status === "approved") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="pending-wrapper">
      <div className="pending-card">
        <div className="status-icon">
          <div className="pulse"></div>
        </div>

        <h2>Account Pending Approval</h2>

        <p className="subtitle">
          Your account is currently under review by our compliance team.
        </p>

        <p className="description">
          We verify all investment accounts to maintain regulatory standards
          and protect our investors. This process typically takes 24–48 hours.
        </p>

        <div className="status-badge">
          ⏳ Verification in Progress
        </div>

        <div className="pending-actions">
          <button
            className="support-btn"
            onClick={() => navigate("/contact")}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;