import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ drawerOpen, setDrawerOpen }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${drawerOpen ? "show" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`sidebar ${drawerOpen ? "open" : ""}`}>
        <h2 className="brand">FINORIA</h2>

        <nav onClick={() => setDrawerOpen(false)}>
          <NavLink to="/dashboard">Overview</NavLink>
          <NavLink to="/dashboard/portfolio">Portfolio</NavLink>
          <NavLink to="/dashboard/market">Market</NavLink>
          <NavLink to="/dashboard/joint">Joint</NavLink>
          <NavLink to="/dashboard/transactions">Transactions</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </aside>
    </>
  );
}