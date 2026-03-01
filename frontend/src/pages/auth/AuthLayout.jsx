import "../../styles/auth.css";

const AuthLayout = ({  subtitle, children }) => {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <h2 className="logo1">FINORIA</h2>
      </header>

      <div className="auth-wrapper">
        <div className="auth-card">
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

