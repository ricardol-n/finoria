import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "220px", padding: "1rem", background: "#111" }}>
        <h3 style={{ color: "#fff" }}>Admin</h3>
        <nav>
          <Link to="/admin" style={{ color: "#fff" }}>Dashboard</Link><br />
          <Link to="/admin/users" style={{ color: "#fff" }}>Users</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;