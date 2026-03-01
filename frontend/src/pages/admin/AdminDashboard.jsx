import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Deposits</h3>
          <p>₦{stats.totalDeposits}</p>
        </div>

        <div className="stat-card">
          <h3>Total Withdrawals</h3>
          <p>₦{stats.totalWithdrawals}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Withdrawals</h3>
          <p>{stats.pendingWithdrawals}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;