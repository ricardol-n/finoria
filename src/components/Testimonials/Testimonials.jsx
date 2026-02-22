import "./Testimonials.css";
import { useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";

export default function Testimonials() {
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
    <section className="testimonials-section reveal" ref={sectionRef}>
      <div className="testimonials-container">

        <h2>Trusted by Investors Worldwide</h2>

        {/* TRUSTPILOT BAR */}
        <div className="trustpilot-bar">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p>Rated 4.9/5 from 2,400+ reviews on Trustpilot</p>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="testimonial-grid">

          <div className="testimonial-card">
            <p>
              “Finoria completely changed how I invest. The fractional model
              makes it accessible and secure.”
            </p>
            <span>— David A., UK</span>
          </div>

          <div className="testimonial-card">
            <p>
              “I love the transparency and real-time tracking. It feels like
              institutional investing made simple.”
            </p>
            <span>— Maria K., Nigeria</span>
          </div>

          <div className="testimonial-card">
            <p>
              “The capital protection structure gave me confidence to invest
              long term.”
            </p>
            <span>— Samuel T., Kenya</span>
          </div>
          <div className="testimonial-card">
            <p>
              “The capital protection structure gave me confidence to invest
              long term.”
            </p>
            <span>— Samuel T., Kenya</span>
          </div>
          <div className="testimonial-card">
            <p>
              “The capital protection structure gave me confidence to invest
              long term.”
            </p>
            <span>— Samuel T., Kenya</span>
          </div>
          <div className="testimonial-card">
            <p>
              “The capital protection structure gave me confidence to invest
              long term.”
            </p>
            <span>— Samuel T., Kenya</span>
          </div>

        </div>

      </div>
    </section>
  );
}