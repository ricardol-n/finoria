import "./InvestSection.css";
import { Link } from "react-router-dom";
import investImg from "../assets/logos/freepik__sp-500-nasdaq-dow-30-nikkel-dax-index-uk-100-eurus__65441.png"; // replace with your image path

export default function InvestSection() {
  return (
    <section className="invest-section">
      <div className="invest-container">
        
        {/* LEFT */}
        <div className="invest-text">
          <h2>Invest in fractions</h2>

          <p>
            Our fractional investing technology allows you to invest as much
            or as little as you want in your favorite public listed US
            company or bundle of companies called an ETF.
          </p>

          <Link to="/register">
            <button className="invest-btn">
              Start Investing
            </button>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="invest-image">
          <img src={investImg} alt="Fractional investing illustration" />
        </div>

      </div>
    </section>
  );
}