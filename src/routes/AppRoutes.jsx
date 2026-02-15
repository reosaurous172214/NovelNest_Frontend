import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/admin/AdminLayout";
import { useAuth } from "../context/AuthContext";

// User Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/DashBoard";
import Profile from "../pages/Profile";
import CreateNovel from "../pages/novel/CreateNovel";
import EditNovel from "../pages/novel/EditNovel";
import Novel from "../pages/novel/Novel";
import NovelDetail from "../pages/novel/NovelDetail";
import Chapter from "../pages/novel/Reader";
import NovelUploads from "../pages/novel/NovelUploads";
import Library from "../pages/lib/Library";
import Settings from "../pages/Settings";
import Notification from "../pages/NotificationPage";
import Wallet from "../pages/Wallet";
import PaymentSuccess from "../pages/PaymentSuccess";
import AuthSuccess from "../pages/AuthSuccess";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRequests from "../pages/admin/AdminRequest";
import AdminOperations from "../pages/admin/AdminOperations";
import AdminNovels from "../pages/admin/AdminNovel";
import AdminAppearance from "../pages/admin/AdminAppearance";
import RequestPage from "../pages/request/RequestPage";
import AdminAudits from "../pages/admin/AdminAudit";
import Subscription from "../pages/Subscription";
import AdminAnalytics from "../pages/admin/AdminAnalytics";

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  // 1. Initial States from LocalStorage
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("site-theme") || "default"
  );
  const [adminTheme, setAdminTheme] = useState(
    localStorage.getItem("admin-theme") || "admin-tech-dark"
  );

  // Flag to prevent the database from overriding manual changes in Settings.jsx
  const [hasSynced, setHasSynced] = useState(false);

  // 2. SMART SYNC: Load user preference only once on login/refresh
  useEffect(() => {
    if (user?.preferences?.theme && !hasSynced) {
      setCurrentTheme(user.preferences.theme);
      localStorage.setItem("site-theme", user.preferences.theme);
      setHasSynced(true);
    }
  }, [user, hasSynced]);

  // Reset sync if user logs out so the next login triggers a fresh sync
  useEffect(() => {
    if (!user) setHasSynced(false);
  }, [user]);

  // 3. GLOBAL THEME MANAGER (DOM Injection)
  useEffect(() => {
    const root = window.document.documentElement;
    const isAdminPath = location.pathname.startsWith("/admin");

    const allThemes = [
      "theme-light", "theme-cream", "theme-cyberpunk", "theme-emerald", 
      "theme-paperback", "theme-nordic", "theme-amoled",
      "theme-admin-tech-dark", "theme-admin-tech-light-1", "theme-admin-tech-light-2"
    ];

    root.classList.remove(...allThemes);

    if (isAdminPath) {
      root.classList.add(`theme-${adminTheme}`);
      localStorage.setItem("admin-theme", adminTheme);
    } else {
      // Logic for User Themes
      if (currentTheme !== "default") {
        root.classList.add(`theme-${currentTheme}`);
      } 
      localStorage.setItem("site-theme", currentTheme);
    }
  }, [currentTheme, adminTheme, location.pathname]);

  return (
    <Routes>
      {/* --- 1. USER ROUTES --- */}
      <Route element={<MainLayout currentTheme={currentTheme} setTheme={setCurrentTheme} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet/>}/>
        <Route path="/novels" element={<Novel />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/novel/create" element={<CreateNovel />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/subscription" element={<Subscription/>} />
        <Route path='/request' element={<RequestPage/>}/>
        <Route path="/novel/edit/:id" element={<EditNovel />} />
        <Route path="/novel/author/me" element={<NovelUploads />} />
        <Route path="/novel/:id" element={<NovelDetail />} />
        <Route path="/novel/:novelId/chapter/:chapterNumber" element={<Chapter />} />
        <Route path="/library" element={<Library />} />
        
        {/* Settings now has full control again */}
        <Route path="/settings" element={<Settings currentTheme={currentTheme} setTheme={setCurrentTheme} />} />
        
        <Route path="/notifications" element={<Notification />} />
      </Route>

      {/* --- 2. ADMIN ROUTES --- */}
      { user && user.role === "admin" &&
      <Route element={<AdminLayout adminTheme={adminTheme} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/novels" element={<AdminNovels />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/analytics" element={<AdminAnalytics/>} />
        <Route path="/admin/audit" element={<AdminAudits/>}/>
        <Route path="/admin/activity" element={<AdminOperations />} />
        <Route 
          path="/admin/appearance" 
          element={
            <AdminAppearance 
              currentTheme={currentTheme} 
              setTheme={setCurrentTheme} 
              adminTheme={adminTheme} 
              setAdminTheme={setAdminTheme} 
            />
          } 
        />
      </Route>
      }
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;