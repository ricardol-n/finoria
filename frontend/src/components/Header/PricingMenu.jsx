import "./Header.css";

const PricingMenu = () => {
  return (
    <div className="pricing-menu">
      <div className="pricing-item">
        <strong>Starter Plan</strong>
        <p>$1,000 – $9,999 · Long-term growth</p>
      </div>

      <div className="pricing-item">
        <strong>Growth Plan</strong>
        <p>$10,000 – $199,999 · Compounded returns</p>
      </div>

      <div className="pricing-item highlight">
        <strong>Ownership Plan</strong>
        <p>$200,000+ · 20% monthly equity share</p>
      </div>

      <div className="pricing-footer">
        <button>View Full Pricing</button>
      </div>
    </div>
  );
};

export default PricingMenu;
