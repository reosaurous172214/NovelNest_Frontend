import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      const [userRes, walletRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/payments/wallet`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: null })), // Prevent wallet failure from breaking user load
      ]);

      if (userRes.data) {
        setUser(userRes.data);
        setWallet(walletRes.data);
        // Sync local storage with fresh server data
        localStorage.setItem("data", JSON.stringify(userRes.data));
      }
    } catch (err) {
      console.error("Auth sync failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIAL LOAD: Check server status immediately
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  // Inside AuthProvider
  const login = useCallback(
    (userData, token) => {
      // 1. Clear old data
      localStorage.removeItem("data");

      // 2. Set new credentials
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("data", JSON.stringify(userData));

      // 3. Update state
      setUser(userData);

      // 4. Trigger the status check (which you also likely wrapped in useCallback)
      checkUserStatus();
    },
    [checkUserStatus],
  ); // Only re-create if checkUserStatus changes

  const logout = () => {
    localStorage.clear(); // Safer to clear all for a fresh start
    setUser(null);
    setWallet(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        wallet,
        setWallet,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        refreshUser: checkUserStatus,
      }}
    >
      {/* Only show app when loading is false to prevent flashing old state */}
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
