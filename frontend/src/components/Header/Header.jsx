import "./Header.css";
import { useState, useEffect,useContext } from "react";
import MegaMenu from "./MegaMenu";
import { menuData } from "./menuData";
import PricingMenu from "./PricingMenu";
import MobileMenu from "./MobileMenu";
import { FaBars } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
logout();
navigate("/login");
};

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 1024);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  
  useEffect(() => {
  document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
}, [mobileMenuOpen]);

  return (
    <>
      {/* HEADER */}
      <header className={`header ${scrolled ? "sticky" : ""}`}>
        <div className="header-inner">
          <div className="logo">FINORIA</div>


          {/* DESKTOP NAV */}
          {!isMobile && (
            <nav className="nav">
              <div
                className="nav-item"
                onMouseEnter={() => setActiveMenu("products")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                Products
                <span className="underline" />
                {activeMenu === "products" && (
                  <MegaMenu data={menuData.products} />
                )}
              </div>

              <div
                className="nav-item"
                onMouseEnter={() => setActiveMenu("solutions")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                Solutions
                <span className="underline" />
                {activeMenu === "solutions" && (
                  <MegaMenu data={menuData.solutions} />
                )}
              </div>

              <div
                className="nav-item"
                onMouseEnter={() => setActiveMenu("pricing")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                Pricing
                <span className="underline" />
                {activeMenu === "pricing" && <PricingMenu />}
              </div>
            </nav>
          )}

          {/* DESKTOP ACTIONS */}
      {!isMobile && (
        <div className="actions">
          {!user ? (
            <>
              <Link to="/login" className="signin">Sign in</Link>
              <Link to="/contact" className="sales">Contact sales</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="signin">Dashboard</Link>
              <button onClick={handleLogout} className="sales logout">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    {/* MOBILE HAMBURGER */}
      {isMobile && (
        <div
          className="hamburger"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars />
        </div>
      )}
        </div>

          
      </header>

      {/* MOBILE FULLSCREEN MENU (OUTSIDE HEADER) */}
      {isMobile && (
       <MobileMenu
        open={mobileMenuOpen}
        activeSection={activeMobileSection}
        onSelect={setActiveMobileSection}
        onClose={() => {
          setMobileMenuOpen(false);
          setActiveMobileSection(null);
      }}
/>

      )}
    </>
  );
};

export default Header;
