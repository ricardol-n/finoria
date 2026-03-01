import { NavLink } from "react-router-dom";
import { FiHome, FiTrendingUp, FiBriefcase, FiUser } from "react-icons/fi";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <div className="bottom-nav">

      <NavLink to="/dashboard/portfolio">
        <FiBriefcase />
        <span>Portfolio</span>
      </NavLink>

      <NavLink to="/dashboard/market">
        <FiTrendingUp />
        <span>Market</span>
      </NavLink>

      {/* CENTER BUTTON */}
      <NavLink to="/dashboard" className="center-btn">
        <FiHome />
      </NavLink>

      <NavLink to="/dashboard/joint">
        <FiUser />
        <span>Joint</span>
      </NavLink>

      <NavLink to="/dashboard/settings">
        <FiUser />
        <span>Settings</span>
      </NavLink>

    </div>
  );
}