import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COLUMN 1 – BRAND */}
        <div className="footer-col">
          <h3 className="footer-logo">Finoria</h3>
          <p>
            Finoria provides structured joint investment plans designed for
            disciplined long-term growth, capital preservation, and access to
            diversified global markets.
          </p>
        </div>

        {/* COLUMN 2 – INVESTMENTS */}
        <div className="footer-col">
          <h4>Investment Plans</h4>
          <ul>
            <li><Link to="/joint-investment">Joint Investment</Link></li>
            <li><Link to="/shares">Shares Ownership</Link></li>
            <li><Link to="/long-term">Long-Term Growth</Link></li>
            <li><Link to="/capital-protection">Capital Protection</Link></li>
          </ul>
        </div>

        {/* COLUMN 3 – COMPANY */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>

        {/* COLUMN 4 – LEGAL */}
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/risk">Risk Disclosure</Link></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Finoria. All rights reserved.</p>

        <p className="footer-disclaimer">
          Investments involve risk. Capital preservation strategies aim to reduce
          volatility but do not guarantee returns. Past performance is not
          indicative of future results.
        </p>
      </div>
      {/* REGULATORY BADGES */}
<div className="regulatory-section">

  <div className="reg-badge">
    <div className="reg-icon">SEC</div>
    <div>
      <h5>Structured Under U.S. Securities Principles</h5>
      <p>Investment framework aligned with international regulatory standards.</p>
    </div>
  </div>

  <div className="reg-badge">
    <div className="reg-icon">FCA</div>
    <div>
      <h5>Governance & Compliance Framework</h5>
      <p>Operational policies reflect global financial compliance practices.</p>
    </div>
  </div>

  <div className="reg-badge">
    <div className="reg-icon">AML</div>
    <div>
      <h5>Anti-Money Laundering Controls</h5>
      <p>Robust KYC and AML procedures applied to all joint accounts.</p>
    </div>
  </div>

</div>
    </footer>
  );
}