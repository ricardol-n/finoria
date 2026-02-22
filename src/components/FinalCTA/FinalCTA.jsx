import "./FinalCTA.css";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function FinalCTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("active");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="final-cta reveal" ref={sectionRef}>
      <div className="final-cta-container">
        <h2>Build Enduring Wealth Together</h2>

        <p>
          Designed for disciplined couples and partners, our joint investment 
          plans prioritize capital preservation, structured long-term returns, 
          and prudent access to diversified global markets — helping you grow 
          and protect wealth with confidence.
        </p>

        <div className="cta-buttons">
          <Link to="/register">
            <button className="cta-primary">
              Open Joint Investment Account
            </button>
          </Link>

          <Link to="/contact">
            <button className="cta-secondary">
              Speak With an Advisor
            </button>
          </Link>
        </div>

        <span className="cta-disclaimer">
          Long-term investing involves risk. Capital preservation strategies 
          aim to reduce risk but do not guarantee returns.
        </span>
      </div>
    </section>
  );
}