import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LuHistory, LuHeart, LuBookmark, LuTrash2, LuLibrary } from "react-icons/lu"; // Switched to Lucide for consistent weights

import UniversalCard from "../../components/library/UniversalCard";
import {
  AuthPrompt,
  Loading,
  Empty,
} from "../../components/library/LibraryStates";
import ConfirmModal from "../../components/ui/ConfirmModal";

const TABS = {
  HISTORY: "history",
  FAVOURITES: "favourites",
  BOOKMARKS: "bookmarks",
};

const Library = ({ isDash = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.HISTORY);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchLibraryData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsDataInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === TABS.BOOKMARKS ? "bookmarks/get" : activeTab;
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lib/${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNovels(
        res.data.map((item) => ({
          ...(item.novel || item),
          lastReadChapter: item.lastReadChapter || 1,
          updatedAt: item.viewedAt || item.addedAt || null,
          recordId: item._id,
        })),
      );
    } catch (error) {
      console.error("Library Fetch Error:", error);
      setNovels([]);
    } finally {
      setLoading(false);
      setIsDataInitialized(true);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  const triggerDelete = (novelId) => {
    setModalConfig({
      title: "Remove Entry",
      message: `Are you sure you want to remove this from your ${activeTab}?`,
      onConfirm: async () => {
        const token = localStorage.getItem("token");
        const path = activeTab === TABS.BOOKMARKS
            ? `bookmarks/delete/${novelId}`
            : `${activeTab}/${novelId}`;
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/lib/${path}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setNovels((prev) => prev.filter((n) => n._id !== novelId));
          setShowModal(false);
        } catch (err) {
          console.error("Delete failed", err);
        }
      },
    });
    setShowModal(true);
  };

  const handleClearAll = () => {
    setModalConfig({
      title: `Clear All ${activeTab}`,
      message: `Warning: This will permanently wipe all your ${activeTab} data. This action cannot be undone.`,
      onConfirm: async () => {
        const token = localStorage.getItem("token");
        const clearPath = activeTab === TABS.BOOKMARKS ? "bookmarks/clearall" : activeTab;
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/lib/${clearPath}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setNovels([]);
          setShowModal(false);
        } catch (error) {
          console.error("Clear All Failed", error);
        }
      },
    });
    setShowModal(true);
  };

  if (!isDataInitialized && loading) return <Loading activeTab={activeTab} />;

  return (
    <div className={`w-full bg-[var(--bg-primary)] text-[var(--text-main)] transition-all duration-500 font-sans antialiased ${isDash ? "pt-6" : "pt-24 md:pt-32 min-h-screen px-4 pb-20 md:pb-32"}`}>
      
      <ConfirmModal
        isOpen={showModal}
        {...modalConfig}
        onCancel={() => setShowModal(false)}
      />

      <div className="max-w-7xl mx-auto">
        {/* --- NAVIGATION & CONTROLS BAR --- */}
        <nav className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 border-b border-[var(--border)] pb-6 md:pb-8">
          
          <div className="w-full md:w-auto">
            <div className="bg-[var(--bg-secondary)] rounded-2xl md:rounded-full p-1.5 flex flex-row gap-1 border border-[var(--border)] overflow-x-auto no-scrollbar shadow-sm">
              {[
                [TABS.HISTORY, "History", <LuHistory size={16} />],
                [TABS.FAVOURITES, "Favorites", <LuHeart size={16} />],
                [TABS.BOOKMARKS, "Bookmarks", <LuBookmark size={16} />],
              ].map(([key, label, icon]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center justify-center gap-2 px-5 md:px-7 py-2.5 rounded-xl md:rounded-full font-semibold transition-all text-xs tracking-tight whitespace-nowrap flex-1 md:flex-none ${
                    activeTab === key 
                    ? "bg-[var(--accent)] text-white shadow-md" 
                    : "text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)]/50"
                  }`}
                >
                  {icon} <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {novels.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95 text-xs font-semibold tracking-wide uppercase"
            >
              <LuTrash2 size={14} />
              <span>Clear {activeTab}</span>
            </button>
          )}
        </nav>

        {/* --- CONTENT GRID --- */}
        <main className="w-full">
          {!isAuthenticated ? (
            <div className="flex justify-center py-20"> <AuthPrompt /> </div>
          ) : loading ? (
            <div className="flex justify-center py-20"> <Loading activeTab={activeTab} /> </div>
          ) : novels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 justify-items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              {novels.map((novel) => (
                <UniversalCard
                  key={novel._id}
                  novel={novel}
                  showDelete={true}
                  showProgress={activeTab === TABS.HISTORY}
                  onRead={() =>
                    navigate(`/novel/${novel._id}/chapter/${novel.lastReadChapter || 1}`)
                  }
                  onDelete={() => triggerDelete(novel._id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-20"> <Empty activeTab={activeTab} /> </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Library;