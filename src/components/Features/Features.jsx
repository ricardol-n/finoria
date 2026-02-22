import { useEffect,useRef } from "react";
import "../Hero/Hero.css";

export default function Features() {
    const sectionRef = useRef(null);

    useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("active");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="features-section reveal" ref={sectionRef}>
      <div className="features-container">

        <div className="feature-card">
          <h4>Fractional Ownership</h4>
          <p>Buy portions of high-value US stocks and ETFs starting small.</p>
        </div>

        <div className="feature-card">
          <h4>Instant Execution</h4>
          <p>Orders processed instantly with real-time tracking.</p>
        </div>

        <div className="feature-card">
          <h4>Global Access</h4>
          <p>Invest in global markets directly from Africa.</p>
        </div>

        <div className="feature-card">
          <h4>Secure Infrastructure</h4>
          <p>Bank-level encryption and capital protection.</p>
        </div>

      </div>
    </section>
  );
}