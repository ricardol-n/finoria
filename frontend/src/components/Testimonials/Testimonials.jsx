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
            <span>— Maria K., UK</span>
          </div>

          <div className="testimonial-card">
            <p>
              “The capital protection structure gave me confidence to invest
              long term.”
            </p>
            <span>— Samuel T., UK</span>
          </div>
          <div className="testimonial-card">
            <p>
              Thank you - and in particular Rob Shaw - for your excellent service in dealing with my enquiry.

I've been with ii (back when it was tdwaterhouse) for twenty years now, and what few problems and queries I've ever had have been dealt with speedily and smoothly.

I'd recommend ii for the quality of their investor service to anyone who asks.

It also has a decent website, clear and easy to navigate, and settlements and dividend payments are smooth and timely, too.

Pete.
            </p>
            <span>— Peter W., UK</span>
          </div>
          <div className="testimonial-card">
            <p>
              Site works great, fast no problems easy to navigate and see history and company prospects.  Simple straightforward modern design and not expensive to use.

Thanks also to Mark I was able to recover my account after misplacing my recovery code and also my old phone.  I appreciate the help and patience in checking I had full access restored.
            </p>
            <span>— Tomos family, UK</span>
          </div>
          <div className="testimonial-card">
            <p>
              I have just spoken to Steve Parsonage at interactive investors. I discussed cash transfers and different currency options. Steve was available. He listened to my request, what I was trying to achieve. He then called his colleagues to get answers. He outlined the possibilities and made recommendations. Very impressive.
            </p>
            <span>— Mike J., UK</span>
          </div>

        </div>

      </div>
    </section>
  );
}