import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the latest user data from the backend
  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Assuming you have a /api/auth/me or /api/users/profile route
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("data", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Auth Verification Failed:", err.response?.data?.message || "Session expired");
      logout(); // Clear invalid data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial check from LocalStorage for immediate UI response
    const stored = localStorage.getItem("data");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    
    // 2. Background verification to ensure token is still valid
    checkUserStatus();
  }, [checkUserStatus]);

  const login = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("data", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        refreshUser: checkUserStatus // Useful if user updates their profile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}