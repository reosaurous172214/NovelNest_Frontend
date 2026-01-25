import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/DashBoard";
import Profile from "../pages/Profile";
import CreateNovel from "../pages/novel/CreateNovel";
import EditNovel from "../pages/novel/EditNovel";
import AuthorNovels from "../pages/novel/AuthorNovels";
import Novel from "../pages/novel/Novel";
import NovelDetail from "../pages/novel/NovelDetail";
import Chapter from "../pages/novel/Reader";
import NovelUploads from "../pages/novel/NovelUploads";
import Library from "../pages/lib/Library";
import { Scroll } from "lucide-react";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes WITH Navbar */}
      
      <Route element={<MainLayout />}>
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
      </Route>

      {/* Routes WITHOUT Navbar */}
      

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
