import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
import AuthLayout from "../auth/AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import AuthButton from "../../components/Auth/AuthButton";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const {user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ redirect ONLY when user becomes available
    useEffect(() => {
  if (!user) return;

  if (user.status === "approved" || user.role === "admin") {
    navigate("/dashboard");
  } else {
    navigate("/pending");
  }
}, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
  email,
  password,
});

      login(res.data);           // 🔐 save user + token
    
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
     
      subtitle="Sign in to your Finoria account"
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <AuthButton disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </AuthButton>
      </form>

      <p className="auth-switch">
        Don’t have an account? <a href="/register">Create one</a>
      </p>
    </AuthLayout>
  );
};

export default Login;