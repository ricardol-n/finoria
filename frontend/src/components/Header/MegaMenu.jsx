import "./Header.css";

const MegaMenu = ({ data, mobile }) => {
  // 🛑 HARD GUARD (prevents crash)
  if (!data || !Array.isArray(data.items)) return null;

  return (
    <div className={`mega-menu ${mobile ? "mobile" : ""}`}>
      <div>
        {data.title && <div className="mega-title">{data.title}</div>}

        <div className="mega-grid">
          {data.items.map((item, i) => (
            <div key={i} className="mega-item">
              <strong>
                {item.icon && <span className="icon">{item.icon}</span>}
                {item.title}
              </strong>
              {item.desc && <span>{item.desc}</span>}
            </div>
          ))}
        </div>
      </div>

      {data.cta && (
        <div className="mega-cta">
          <h4>{data.cta.title}</h4>
          <p>{data.cta.desc}</p>
          <button>{data.cta.button}</button>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;

