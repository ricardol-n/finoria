import { useEffect,useRef,useState } from "react";
import "../Hero/Hero.css";

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(counter);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [end, duration]);

  return count;
}

export default function Stats() {
    const sectionRef = useRef(null);
    const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          sectionRef.current.classList.add("active");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const assets = useCountUp(startCount ? 120 : 0);
  const users = useCountUp(startCount ? 25 : 0);
  const markets = useCountUp(startCount ? 15 : 0);

  return (
    <section className="stats-section reveal" ref={sectionRef}>
      <div className="stats-container">

        <div>
          <h3>${assets}M+</h3>
          <p>Assets Under Management</p>
        </div>

        <div>
          <h3>{users}K+</h3>
          <p>Active Investors</p>
        </div>

        <div>
          <h3>98%</h3>
          <p>Customer Satisfaction</p>
        </div>

        <div>
          <h3>{markets}+</h3>
          <p>Global Markets</p>
        </div>

      </div>
    </section>
  );
}