import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/admin/AdminLayout";

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

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRequests from "../pages/admin/AdminRequest";
import AdminOperations from "../pages/admin/AdminOperations";
import AdminNovels from "../pages/admin/AdminNovel";
import AdminAppearance from "../pages/admin/AdminAppearance";
const AppRoutes = () => {
  const location = useLocation();

  // 1. Theme States
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("site-theme") || "default"
  );
  const [adminTheme, setAdminTheme] = useState(
    localStorage.getItem("admin-theme") || "admin-tech-dark"
  );

  // 2. Global Theme Manager
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/novels" element={<Novel />} />
        <Route path="/novel/create" element={<CreateNovel />} />
        <Route path="/novel/edit/:id" element={<EditNovel />} />
        <Route path="/novel/author/me" element={<NovelUploads />} />
        <Route path="/novel/:id" element={<NovelDetail />} />
        <Route path="/novel/:novelId/chapter/:chapterNumber" element={<Chapter />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings currentTheme={currentTheme} setTheme={setCurrentTheme} />} />
        <Route path="/notifications" element={<Notification />} />
      </Route>

      {/* --- 2. ADMIN ROUTES --- */}
      {/* Note: AdminLayout receives props to pass them down to AdminAppearance */}
      <Route element={<AdminLayout adminTheme={adminTheme} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/novels" element={<AdminNovels />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/activity" element={<AdminOperations />} />
        {/* Pass all theme props here so the appearance page can actually change them */}
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;