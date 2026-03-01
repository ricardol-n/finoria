import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPortfolio } from "../../../api/portfolio";
import "./Portfolio.css";

export default function Portfolio() {

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        setAssets(data);
      } catch (err) {
        console.error("Portfolio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading portfolio...</p>;
  if (!assets.length) return <p>No assets found</p>;

  return (
    <div className="portfolio">

      <div className="portfolio-header">
        <h1>Portfolio</h1>
      </div>

      <div className="holdings">

        {assets.map((asset) => (
          <div
            key={asset._id}
            className="holding-card"
            onClick={() => navigate(`/dashboard/portfolio/${asset._id}`)}
          >
            <div>
              <h3>{asset.assetName}</h3>
              <span className="quantity">{asset.quantity} units</span>
            </div>

            <div>
              <h4>${asset.totalValue.toLocaleString()}</h4>
              <span className={asset.growthPercent >= 0 ? "positive" : "negative"}>
                {asset.growthPercent}%
              </span>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}