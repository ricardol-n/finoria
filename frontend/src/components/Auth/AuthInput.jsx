const AuthInput = ({ label, type, ...props }) => {
  return (
    <div className="auth-field">
      <label>{label}</label>
      <input type={type} {...props} />
    </div>
  );
};

export default AuthInput;
