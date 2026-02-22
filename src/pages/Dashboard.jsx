import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.email}</strong></p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;