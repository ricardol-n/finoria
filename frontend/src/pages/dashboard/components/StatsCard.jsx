import "./StatsCard.css";

export default function StatsCard({ title, value }) {
  return (
    <div className="stats-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}