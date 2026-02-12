import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null); // Global wallet state
  const [loading, setLoading] = useState(true);

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Parallel request to get both Profile and Wallet data
      const [userRes, walletRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/payments/wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (userRes.data) {
        setUser(userRes.data);
        setWallet(walletRes.data);
        localStorage.setItem("data", JSON.stringify(userRes.data));
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout(); 
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (stored) setUser(JSON.parse(stored));
    checkUserStatus();
  }, [checkUserStatus]);

  const login = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("data", JSON.stringify(userData));
    setUser(userData);
    checkUserStatus(); // Refresh wallet immediately after login
  };

  const logout = () => {
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    setUser(null);
    setWallet(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        setWallet, // Allow manual updates after purchases
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        refreshUser: checkUserStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}