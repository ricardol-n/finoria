import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminLogin from "./pages/admin/AdminLogin";

// Dashboard
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/pages/Overview";
import Portfolio from "./pages/dashboard/pages/Portfolio";
import Joint from "./pages/dashboard/pages/Joint";
import Market from "./pages/dashboard/pages/Market";
import Transactions from "./pages/dashboard/pages/Transactions";
import Documents from "./pages/dashboard/pages/Documents";
import Settings from "./pages/dashboard/pages/Settings";
import PendingApproval from "./pages/dashboard/pages/PendingApproval";
import AssetDetails from "./pages/dashboard/pages/AssetDetails";


function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 🔐 Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="joint" element={<Joint />} />
        <Route path="market" element={<Market />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings" element={<Settings />} />
        <Route path="pending" element={<PendingApproval />} />
        <Route path="market/:type/:id" element={<AssetDetails/>} />
      </Route>

      {/* 🛡 Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
      </Route>

    </Routes>
  );
}

export default App;