import { useState, useRef, useEffect } from "react";
import {
  LuStar,
  LuBookmarkPlus,
  LuBookOpen,
  LuChevronDown,
  LuChevronUp,
  LuClock,
  LuEye,
  LuHeart,
  LuBookmark,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { getToken } from "../../getItems/getAuthItems";
import { useAddBookmark } from "../../hooks/useBookmarks";
import { useAddFavourites } from "../../hooks/useFavourites";

export default function NovelCard({ novel }) {
  const [expanded, setExpanded] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const saveMenuRef = useRef(null);
  
  const { showAlert } = useAlert();
  const token = getToken();
  
  const { addToBookmark, adding: bookmarkAdding } = useAddBookmark();
  const { addToFavourites, adding: favAdding } = useAddFavourites();

  useEffect(() => {
    function handleClickOutside(event) {
      if (saveMenuRef.current && !saveMenuRef.current.contains(event.target)) {
        setShowSaveMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const coverUrl = novel.coverImage?.startsWith("http")
    ? novel.coverImage
    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

  const handleSaveAction = async (actionType) => {
    if (!token) {
      showAlert("Please log in to save to your library.", "info");
      return;
    }

    try {
      if (actionType === "bookmark") {
        await addToBookmark(novel._id);
        showAlert(`"${novel.title}" added to Bookmarks.`, "success");
      } else {
        await addToFavourites(novel._id);
        showAlert(`"${novel.title}" added to Favorites.`, "success");
      }
      setShowSaveMenu(false);
    } catch {
      showAlert("Action failed. Please try again.", "error");
    }
  };

  const StatBox = ({ icon, children }) => (
    <div className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-lg md:rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[9px] md:text-[11px] font-semibold uppercase tracking-tight text-[var(--text-dim)] shadow-sm">
      <span className="opacity-70">{icon}</span>
      {children}
    </div>
  );

  return (
    <div className="group w-full max-w-5xl mx-auto mb-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden font-sans antialiased">
      
      {/* MAIN CONTENT LINK - Row on mobile, Row on desktop */}
      <Link to={`/novel/${novel._id}`} className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
        
        {/* COVER CONTAINER */}
        <div className="w-24 sm:w-32 md:w-44 shrink-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border border-[var(--border)] shadow-md">
            <img
              src={coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* GLASS STATUS BADGE - Visible on all screen sizes */}
            <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 flex items-center gap-1.5 md:gap-2 px-1.5 py-0.5 md:px-2.5 md:py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md md:rounded-lg shadow-2xl">
              <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse ${
                novel.status?.toLowerCase() === 'completed' ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`} />
              <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] text-white">
                {novel.status || "Ongoing"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - Adjacent to image on mobile */}
        <div className="flex-1 flex flex-col gap-2 md:gap-5 min-w-0 text-left justify-center md:justify-start">
          <div className="space-y-0.5 md:space-y-1">
            <h2 className="text-sm sm:text-lg md:text-2xl font-semibold text-[var(--text-main)] tracking-tight leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2 md:line-clamp-2">
              {novel.title}
            </h2>
            <p className="text-[10px] md:text-xs text-[var(--text-dim)] font-medium flex items-center gap-2 uppercase tracking-wider">
              <span className="hidden md:inline">By</span> <span className="hidden md:inline w-4 h-[1px] bg-[var(--border)]"></span>
              <span className="text-[var(--text-main)] font-semibold truncate">
                {novel.author?.username || "Anonymous"}
              </span>
            </p>
          </div>

          {/* STATS GRID - 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3">
            <StatBox icon={<LuBookOpen size={12} />}>{novel.totalChapters} <span className="hidden md:inline">Chapters</span><span className="md:hidden">Ch</span></StatBox>
            <StatBox icon={<LuEye size={12} />}>{novel.views > 999 ? (novel.views / 1000).toFixed(1) + "k" : novel.views} <span className="hidden md:inline">Views</span></StatBox>
            <StatBox icon={<LuStar size={12} className="text-yellow-500 fill-yellow-500/20" />}>{novel.rating || "4.8"}</StatBox>
            <StatBox icon={<LuClock size={12} className="text-emerald-500" />}><span className="truncate">Verified</span></StatBox>
          </div>

          {/* GENRES - Hidden on very small mobile to save space, or use smaller text */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {novel.genres?.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-md md:rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)]">{g}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* LOWER SECTION */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 flex flex-col gap-3 md:gap-4">
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl md:rounded-2xl p-3 md:p-4 text-left">
          <p className={`text-[11px] md:text-sm text-[var(--text-dim)] leading-relaxed font-medium opacity-80 ${expanded ? "" : "line-clamp-2"}`}>
            {novel.description}
          </p>
          {novel.description?.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[9px] md:text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1">
              {expanded ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />}
              {expanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-1 relative">
          <Link
            to={`/novel/${novel._id}`}
            className="flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 rounded-lg md:rounded-xl bg-[var(--accent)] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:brightness-110 shadow-lg transition-all active:scale-[0.98]"
          >
            <LuBookOpen size={14} />
            Start Reading
          </Link>

          <div className="flex-1 relative" ref={saveMenuRef}>
            <button
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              className="w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 rounded-lg md:rounded-xl border border-[var(--border)] text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[var(--text-main)] bg-[var(--bg-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-[0.98]"
            >
              <LuBookmarkPlus size={14} />
              Save to Library
              <LuChevronDown className={`transition-transform duration-300 ${showSaveMenu ? 'rotate-180' : ''}`} />
            </button>

            {showSaveMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => handleSaveAction("favorite")}
                  disabled={favAdding}
                  className="w-full flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--accent)]/10 border-b border-[var(--border)] transition-colors"
                >
                  <LuHeart className="text-red-500" /> Favorites
                </button>
                <button
                  onClick={() => handleSaveAction("bookmark")}
                  disabled={bookmarkAdding}
                  className="w-full flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <LuBookmark className="text-[var(--accent)]" /> Bookmarks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}