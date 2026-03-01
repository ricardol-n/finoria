import { createContext, useState, useEffect,useContext } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  

useEffect(() => {
    const restoreAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me"); // uses interceptor
        setUser(res.data);
      } catch (err) {
        console.error("Token verification failed:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, [token]);

  // 🔑 Login
  const login = (data) => {
    const userData = {
      _id: data.user._id,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
    };

    localStorage.setItem("token", data.token);

    setUser(userData);
    setToken(data.token);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // 🔄 Refresh User (after approval, role change, etc.)
  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading , refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);