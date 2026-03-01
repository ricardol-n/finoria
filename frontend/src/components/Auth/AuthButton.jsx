const AuthButton = ({ children, loading }) => {
  return (
    <button className="auth-btn" disabled={loading}>
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;
