import { createContext, useState, useEffect,useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  console.log("AUTH RESTORE:", {
    storedUser: localStorage.getItem("user"),
    storedToken: localStorage.getItem("token"),
  });

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }

  setLoading(false);
}, []);

 const login = (data) => {
  console.log("Login DATA:", data);
  
  const userData = {
  _id: data.user._id,
  email: data.user.email,
  role: data.user.role,
  status: data.user.status,        // ✅ ADD THIS
  approved: data.user.approved,    // ✅ ADD THIS (optional but good)
};


  console.log("SAVED USER:", userData);

  setUser(userData);
  setToken(data.token);

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", data.token);
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);