import "./Header.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { menuData } from "./menuData";

const MobileMenu = ({ open, activeSection, onSelect, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <div className={`mobile-menu ${open ? "open" : ""}`}>
      
      {/* HEADER */}
      <div className="mobile-menu-header">
        <div className="logo">FINORIA</div>
        <FaTimes className="close-icon" onClick={onClose} />
      </div>

      {/* MAIN LIST */}
      <ul className="mobile-list">

        {/* PRODUCTS */}
        <li onClick={() => onSelect(activeSection === "products" ? null : "products")}>
          Products <FaChevronRight />
        </li>
        {activeSection === "products" && (
          <div className="mobile-submenu">
            {menuData.products.items.map((item, i) => (
              <div key={i} className="mobile-subitem">
                <div className="icon">{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SOLUTIONS */}
        <li onClick={() => onSelect(activeSection === "solutions" ? null : "solutions")}>
          Solutions <FaChevronRight />
        </li>
        {activeSection === "solutions" && (
          <div className="mobile-submenu">
            {menuData.solutions.items.map((item, i) => (
              <div key={i} className="mobile-subitem">
                <div className="icon">{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRICING */}
        <li onClick={() => { onClose(); navigate("/pricing"); }}>
          Pricing
        </li>

        {/* COMPANY */}
        <li onClick={() => { onClose(); navigate("/company"); }}>
          Company
        </li>
      </ul>

      {/* AUTH CTA */}
      <div className="mobile-cta">
        {!user ? (
          <>
            <button
              className="primary"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              Login
            </button>

            <button
              className="secondary"
              onClick={() => {
                onClose();
                navigate("/register");
              }}
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <button
              className="primary"
              onClick={() => {
                onClose();
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>

            <button
              className="secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;