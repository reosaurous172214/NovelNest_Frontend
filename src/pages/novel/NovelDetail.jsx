import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NovelDetailMap from "../../components/novel/NovelDetailMap";
import RecommendedNovels from "../../components/novel/RecommendedNovels";
import CommentUi from "../../components/comment/CommentUi";
import {
  FaStar,
  FaEye,
  FaBookOpen,
  FaInfoCircle,
  FaHeart,
  FaPlay,
  FaShieldAlt,
  FaChevronDown,
  FaBookmark,
} from "react-icons/fa";
import { useAddFavourites } from "../../hooks/useFavourites";
import { useAddBookmark } from "../../hooks/useBookmarks"; // Added Bookmark hook
import { getToken } from "../../getItems/getAuthItems";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";

const CHAPTERS_PER_PAGE = 50;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop";

const NovelDetail = () => {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [chapters, setChapters] = useState([]);
  const [tocPage, setTocPage] = useState(1);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const saveMenuRef = useRef(null);

  const { addToFavourites, adding: favAdding } = useAddFavourites();
  const { addToBookmark, adding: bookAdding } = useAddBookmark(); // Hook for bookmarks
  
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const token = getToken();

  const totalChapters = chapters.length;
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  const startIdx = (tocPage - 1) * CHAPTERS_PER_PAGE;
  const visibleChapters = chapters.slice(
    startIdx,
    startIdx + CHAPTERS_PER_PAGE,
  );

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const novelRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/novels/${id}`);
        setNovel(novelRes.data);

        const chaptersRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/novel/${id}`);
        const rawData = Array.isArray(chaptersRes.data) ? chaptersRes.data : chaptersRes.data.chapters || [];

        const sortedChapters = [...rawData].sort((a, b) => (b.chapterNumber || 0) - (a.chapterNumber || 0));
        setChapters(sortedChapters);
        setTocPage(1);
      } catch (err) {
        console.error("Failed to load novel:", err);
      }
    };
    fetchNovel();

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(event.target)) {
        setShowSaveMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  if (!novel) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-sans text-[10px] text-[var(--accent)] uppercase tracking-[0.3em] font-bold animate-pulse">Synchronizing Registry...</p>
    </div>
  );

  const handleFavourite = async () => {
    if (!token) return showAlert("Please log in first.", "info");
    try {
      const response = await addToFavourites(id);
      showAlert(`"${novel.title}" ${response?.message || "Added to Favourites"}`, "success");
      setShowSaveMenu(false);
    } catch (err) {
      showAlert("Action failed.", "error");
    }
  };

  const handleBookmark = async () => {
    if (!token) return showAlert("Please log in first.", "info");
    try {
      const response = await addToBookmark(id);
      showAlert(`"${novel.title}" ${response?.message || "Bookmarked"}`, "success");
      setShowSaveMenu(false);
    } catch (err) {
      showAlert("Action failed.", "error");
    }
  };

  const balancedRounded = "rounded-2xl"; 
  const glassStyle = `bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl ${balancedRounded} transition-colors`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-28 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--accent)] opacity-5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <div className={`relative p-6 md:p-10 ${glassStyle}`}>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="mx-auto md:mx-0 shrink-0">
              <div className="relative group">
                <img
                  src={novel.coverImage}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  alt={novel.title}
                  className={`w-56 h-80 object-cover ${balancedRounded} shadow-lg border border-[var(--border)] transition-transform duration-500 group-hover:scale-[1.01]`}
                />
              </div>
            </div>

            <div className="flex-1 text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-[1.1] text-[var(--text-main)] mb-4">
                {novel.title}
              </h1>

              <p className="text-[10px] text-[var(--text-dim)] font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                Created By <span className="w-4 h-[1px] bg-[var(--border)]"></span>
                <span className="text-[var(--text-main)]">{novel.author}</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <StatBox label="Status" value="Ongoing" icon={<FaInfoCircle size={10} />} color="text-emerald-500" radius={balancedRounded} />
                <StatBox label="Chapters" value={`${totalChapters}`} icon={<FaBookOpen size={10} />} radius={balancedRounded} />
                <StatBox label="Views" value={novel.views?.toLocaleString()} icon={<FaEye size={10} />} radius={balancedRounded} />
                <StatBox label="Rating" value={novel.rating || "4.8"} icon={<FaStar size={10} />} color="text-yellow-500" radius={balancedRounded} />
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {novel.genres?.map((g, i) => (
                  <span key={i} className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-default ${balancedRounded}`}>
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/novel/${id}/chapter/${chapters[chapters.length - 1]?.chapterNumber || 1}`}
                  className={`bg-[var(--accent)] px-8 py-4 ${balancedRounded} font-black text-white text-[11px] uppercase tracking-widest shadow-md flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all`}
                >
                  <FaPlay size={10} /> Start Reading
                </Link>
                
                {/* SAVING DROPDOWN MENU */}
                <div className="relative" ref={saveMenuRef}>
                  <button
                    onClick={() => setShowSaveMenu(!showSaveMenu)}
                    className={`h-full px-8 py-4 ${balancedRounded} font-black text-[var(--text-main)] border border-[var(--border)] flex items-center justify-center gap-3 hover:bg-[var(--accent)]/10 transition-all text-[11px] uppercase tracking-widest bg-[var(--bg-primary)]`}
                  >
                    Save Story <FaChevronDown size={10} className={`transition-transform ${showSaveMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showSaveMenu && (
                    <div className={`absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl z-50 overflow-hidden ${balancedRounded}`}>
                      <button
                        onClick={handleFavourite}
                        disabled={favAdding}
                        className="w-full px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/10 flex items-center gap-3 text-[var(--text-main)] border-b border-[var(--border)]"
                      >
                        <FaHeart className="text-red-500" /> Favorites
                      </button>
                      <button
                        onClick={handleBookmark}
                        disabled={bookAdding}
                        className="w-full px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/10 flex items-center gap-3 text-[var(--text-main)]"
                      >
                        <FaBookmark className="text-[var(--accent)]" /> Bookmarks
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className={`mt-10 overflow-hidden ${glassStyle}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
            {[
              { id: "about", label: "Description" },
              { id: "toc", label: "Chapters" },
              { id: "reviews", label: "Reviews" },
              { id: "recommend", label: "Recommended" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 text-[14px] font-medium uppercase transition-all relative
                  ${activeTab === tab.id ? "text-[var(--accent)] bg-[var(--bg-secondary)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}
                `}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"></div>}
              </button>
            ))}
          </div>

          <div className="p-8 text-left">
            {activeTab === "about" && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-4 text-[var(--text-main)] flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--accent)]"></div> The Summary
                </h2>
                <p className="text-[var(--text-dim)] leading-relaxed text-base font-medium italic opacity-90">
                  {expanded ? novel.description : (novel.description?.slice(0, 280) + (novel.description?.length > 280 ? "..." : ""))}
                </p>
                {novel.description?.length > 280 && (
                  <button onClick={() => setExpanded(!expanded)} className="mt-4 text-[var(--accent)] font-bold text-[9px] uppercase tracking-widest hover:underline transition-all">
                    {expanded ? "[ READ LESS ]" : "[ READ MORE ]"}
                  </button>
                )}
              </div>
            )}

            {activeTab === "toc" && (
              <div className="animate-in fade-in duration-500">
                {totalPages > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setTocPage(i + 1)} className={`shrink-0 px-4 py-2 text-[9px] font-bold uppercase border ${balancedRounded} transition-all ${tocPage === i + 1 ? "bg-[var(--text-main)] border-[var(--text-main)] text-[var(--bg-primary)] shadow-md" : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}>
                        Page {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-20 gap-y-3">
                  {visibleChapters.map((ch) => (
                    <Link key={ch._id} to={`/novel/${id}/chapter/${ch.chapterNumber}`} className={`group flex items-center p-4 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all ${balancedRounded} shadow-sm`}>
                      <span className={`w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-black group-hover:bg-[var(--accent)] group-hover:text-white transition-all ${balancedRounded}`}>
                        {ch.chapterNumber}
                      </span>
                      <div className="ml-4 min-w-0">
                        <span className="block text-[11px] font-bold text-[var(--text-main)] truncate uppercase">{ch.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-in fade-in duration-500">
                <RatingInput novelId={id} currentRating={novel.rating} token={token} showAlert={showAlert} radius={balancedRounded} />
                <CommentUi novelId={id} currentUser={user} />
              </div>
            )}

            {activeTab === "recommend" && (
              <div className="animate-in fade-in duration-500">
                <RecommendedNovels novelId={id} />
              </div>
            )}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="mt-10 text-left">
          <div className={`p-4 ${glassStyle}`}>
            <h2 className="text-lg font-black uppercase tracking-tighter mb-8 text-[var(--text-main)] flex items-center gap-3">
              <FaShieldAlt className="text-[var(--accent)]" size={16} /> Story Details
            </h2>
            <NovelDetailMap novel={novel} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingInput = ({ novelId, currentRating, token, showAlert, radius }) => {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(currentRating || 0);

  useEffect(() => {
    if (currentRating) setSelected(Math.round(currentRating));
  }, [currentRating]);

  const handleRate = async (score) => {
    if (!token) {
      showAlert("Please log in to rate.", "info");
      return;
    }
    try {
      setSelected(score);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/novels/${novelId}/rate`,
        { rating: score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert(`Feedback Recorded: ${res.data.averageRating} stars`, "success");
    } catch (err) {
      showAlert("Rating update failed.", "error");
    }
  };

  return (
    <div className={`flex items-center gap-2 bg-[var(--bg-primary)] p-4 border border-[var(--border)] mb-8 w-fit ${radius}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => handleRate(star)} className="transition-transform active:scale-90">
            <FaStar size={20} className={`transition-colors duration-200 ${(hover || selected) >= star ? "text-yellow-500" : "text-[var(--border)]"}`} />
          </button>
        ))}
      </div>
      <span className="ml-4 font-black text-xs text-[var(--text-main)] tracking-widest">{hover || selected || "0"}.0</span>
    </div>
  );
};

const StatBox = ({ label, value, icon, radius, color = "text-[var(--text-main)]" }) => (
  <div className={`bg-[var(--bg-primary)] border border-[var(--border)] p-2 ${radius} text-left flex flex-col justify-between shadow-sm`}>
    <div className="flex items-center gap-2 mb-2 opacity-60">
      {icon}
      <p className="text-[10px] uppercase font-bold tracking-widest">{label}</p>
    </div>
    <p className={`text-[18px] font-black uppercase tracking-tight ${color}`}>{value}</p>
  </div>
);

export default NovelDetail;