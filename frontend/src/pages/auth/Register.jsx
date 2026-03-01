import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import AuthLayout from "./AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import AuthButton from "../../components/Auth/AuthButton";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // ✅ registration successful → go to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      
      subtitle="Start investing with Finoria"
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Full name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          {loading ? "Creating account..." : "Create account"}
        </AuthButton>
      </form>

      <p className="auth-switch">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </AuthLayout>
  );
};

export default Register;