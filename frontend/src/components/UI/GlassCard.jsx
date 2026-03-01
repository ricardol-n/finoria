import { useEffect, useState } from "react";
import "./GlassCard.css";

export default function GlassCard() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 24380;
    const duration = 1500;
    const step = 20;
    const increment = end / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setRevenue(end);
        clearInterval(timer);
      } else {
        setRevenue(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card">
      <span className="glass-label">Live revenue</span>
      <h2>${revenue.toLocaleString()}</h2>

      <div className="glass-metric">
        <span>Today</span>
        <strong>+12.4%</strong>
      </div>

      <div className="glass-metric">
        <span>This month</span>
        <strong>$180,430</strong>
      </div>
    </div>
  );
}
