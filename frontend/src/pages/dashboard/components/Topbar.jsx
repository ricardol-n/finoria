import { useAuth } from "../../../context/AuthContext";
import {FiMenu} from "react-icons/fi";
import "./Topbar.css";

export default function Topbar({ setDrawerOpen }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="top-left">
        <FiMenu
          className="mobile-menu"
          onClick={() => setDrawerOpen(true)}
        />
        <h3>Overview</h3>
      </div>

      <div className="user-pill">
        {user?.email}
      </div>
    </header>
  );
}