import "./Hero.css";
import GradientBackground from "./GradientBackground";
import GlassCard from "../UI/GlassCard";
import Header from "../Header/Header";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import amazon from "../../assets/logos/amazon-color-svgrepo-com.svg";
import nvidia from "../../assets/logos/nvidia-logo-svgrepo-com.svg";
import ford from "../../assets/logos/ford-svgrepo-com.svg";
import coinbase from "../../assets/logos/coinbase-svgrepo-com.svg";
import google from "../../assets/logos/google-pay-svgrepo-com.svg";
import shopify from "../../assets/logos/envato-svgrepo-com.svg";
import usdc from "../../assets/logos/usdc-svgrepo-com.svg";
import { menuData } from "../../components/Header/menuData";
import InvestSection from "../InvestSection";

export default function Hero() {
  const {user,loading} = useContext(AuthContext);

  if (loading) return null;

  console.log("HERO USER:", user);
  console.log("HERO LOADING:", loading);

  const logos = [
    usdc,
    amazon,
    nvidia,
    ford,
    coinbase,
    google,
    shopify,
  ];
  const {products} = menuData;

  return (
    <section className="hero">
      <Header />
      <GradientBackground />

      <div className="hero-content">
        {/* LEFT */}
        <div className="hero-text">
          <span className="badge">
            Sessions 2026 · Early-bird registration →
          </span>

          <h1>
            Financial<br />
            infrastructure<br />
            to grow your<br />
            revenue
          </h1>

          <p>
            Build, scale, and operate your business with
            modern financial tools designed for growth.
          </p>

          <div className="actions">
            <Link to="/register">
            <button className="primary">Start now</button>
            </Link>

            <Link to="/contact">
            <button className="secondary">Contact sales</button>
            </Link>
            
            


            {!loading && user?.role === "admin" && (
              <Link to="/admin">
                <button className="admin-btn">
                  Admin Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <GlassCard />
      </div>

      {/* LOGO MARQUEE UNDER HERO CONTENT */}
      <div className="logo-section">
        <div className="logo-track">
          {[...logos, ...logos].map((logo, index) => (
            <div className="logo-item" key={index}>
              
              <img src= {logo} alt="company logo" />
            </div>
          ))}
        </div>
      </div>

      {/* INVESTMENT PILLARS */}
      <div className="hero-mission">
  {products.items.map((item, index) => (
    <div
      className="hero-mission-item"
      key={index}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="hero-mission-icon">
        {item.icon}
      </div>
      <div>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </div>
    </div>
  ))}
</div>

      
    </section>
    
    

    
  );
}
