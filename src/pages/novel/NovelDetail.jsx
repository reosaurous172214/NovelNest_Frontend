import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NovelDetailMap from "../../components/novel/NovelDetailMap";
import RecommendedNovels from "../../components/novel/RecommendedNovels";
import CommentUi from "../../components/comment/CommentUi";
import NovelPaymentOverlay from "../../components/novel/NovelPayment";
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
  FaLock,
  FaUnlock,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { useAddFavourites } from "../../hooks/useFavourites";
import { useAddBookmark } from "../../hooks/useBookmarks";
import { getHeaders, getToken } from "../../getItems/getAuthItems";
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
  const [showPayment, setShowPayment] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const saveMenuRef = useRef(null);

  const { addToFavourites, adding: favAdding } = useAddFavourites();
  const { addToBookmark, adding: bookAdding } = useAddBookmark();

  const { user, setUser } = useAuth();
  const { showAlert } = useAlert();
  const token = getToken();

  // Ownership check: Checks if the current novel ID is in the user's unlockedNovels array
  const isNovelUnlocked = user?.unlockedNovels?.some(
    (novelId) => novelId.toString() === id.toString(),
  );

  const fetchWallet = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payments/wallet`,
        getHeaders(),
      );
      setUserBalance(res.data.balance || 0);
    } catch (err) {
      console.error("Wallet error", err);
    }
  }, [token]);

  const fetchNovelData = useCallback(async () => {
    try {
      const novelRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/novels/${id}`,
      );
      setNovel(novelRes.data);

      const chaptersRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chapters/novel/${id}`,
      );
      const rawData = Array.isArray(chaptersRes.data)
        ? chaptersRes.data
        : chaptersRes.data.chapters || [];
      const sortedChapters = [...rawData].sort(
        (a, b) => (b.chapterNumber || 0) - (a.chapterNumber || 0),
      );

      setChapters(sortedChapters);
    } catch (err) {
      console.error("Failed to load novel:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchNovelData();
    fetchWallet();

    const handleClickOutside = (event) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(event.target)) {
        setShowSaveMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id, fetchNovelData, fetchWallet]);

  /* --- HANDLERS (FIXED: Defined missing functions) --- */
  const handleFavourite = async () => {
    if (!token) return showAlert("Log in required.", "info");
    try {
      const response = await addToFavourites(id);
      showAlert(
        `"${novel.title}" ${response?.message || "Added to Favourites"}`,
        "success",
      );
      setShowSaveMenu(false);
    } catch (err) {
      showAlert("Action failed.", "error");
    }
  };

  const handleBookmark = async () => {
    if (!token) return showAlert("Log in required.", "info");
    try {
      const response = await addToBookmark(id);
      showAlert(
        `"${novel.title}" ${response?.message || "Bookmarked"}`,
        "success",
      );
      setShowSaveMenu(false);
    } catch (err) {
      showAlert("Action failed.", "error");
    }
  };

  const handleBuyNovel = () => {
    // 1. Check for token to ensure user is logged in
    if (!token) return showAlert("Log in required to purchase.", "info");

    // 2. Prevent redundant purchase attempts if already unlocked
    // This uses 'unlockedNovels' to match your Mongoose Schema
    if (isNovelUnlocked)
      return showAlert("Novel already in your library.", "info");

    setShowPayment(true);
  };

  const onUnlockConfirm = async () => {
    try {
      // 3. POST request to your updated /:novelId/unlock endpoint
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/novels/${id}/unlock`,
        {},
        getHeaders(),
      );

      showAlert(res.data.message, "success");
      setShowPayment(false);

      // 4. Update the GLOBAL user state immediately
      // This ensures the "Buy" button turns into "Unlocked" without a page refresh
      if (user) {
        const updatedUnlocked = [...(user.unlockedNovels || []), id.toString()];
        setUser({ ...user, unlockedNovels: updatedUnlocked });
      }

      // 5. Refresh wallet to show new balance
      fetchWallet();
    } catch (err) {
      // 6. Handle 403 (Insufficient Balance) or 500 (Server Error)
      const errorMsg =
        err.response.data.message || "Unlock failed. Please try again.";
      showAlert(errorMsg, "error");
    }
  };

  if (!novel)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] text-[var(--accent)] uppercase tracking-[0.3em] font-bold">
          Loading Novel...
        </p>
      </div>
    );

  const totalChapters = chapters.length;
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  const startIdx = (tocPage - 1) * CHAPTERS_PER_PAGE;
  const visibleChapters = chapters.slice(
    startIdx,
    startIdx + CHAPTERS_PER_PAGE,
  );

  const balancedRounded = "rounded-xl";
  const glassStyle = `bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl ${balancedRounded}`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-28 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--accent)] opacity-5 blur-[120px] pointer-events-none" />

      {/* PAYMENT MODAL OVERLAY */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-all"
            >
              <FaTimes size={24} />
            </button>
            <NovelPaymentOverlay
              novel={novel}
              userBalance={userBalance}
              onUnlock={onUnlockConfirm}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* HERO SECTION */}
        <div className={`relative p-6 md:p-10 ${glassStyle}`}>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="mx-auto md:mx-0 shrink-0">
              <img
                // Check if coverImage exists and prepend API URL if it's a local path
                src={
                  novel.coverImage?.startsWith("http")
                    ? novel.coverImage
                    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`
                }
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                alt={novel.title}
                className={`w-56 h-80 object-cover ${balancedRounded} shadow-lg border border-[var(--border)]`}
              />
            </div>

            <div className="flex-1 text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase leading-[1.1] text-[var(--text-main)] mb-4">
                {novel.title}
              </h1>

              <p className="text-[10px] text-[var(--text-dim)] font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                Created By{" "}
                <span className="w-4 h-[1px] bg-[var(--border)]"></span>
                <span className="text-[var(--text-main)]">
                  {novel.author?.username || novel.author}
                </span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <StatBox
                  label="Status"
                  value={novel.status || "Ongoing"}
                  icon={<FaInfoCircle size={10} />}
                  color="text-emerald-500"
                  radius={balancedRounded}
                />
                <StatBox
                  label="Chapters"
                  value={`${totalChapters}`}
                  icon={<FaBookOpen size={10} />}
                  radius={balancedRounded}
                />
                <StatBox
                  label="Views"
                  value={novel.views?.toLocaleString()}
                  icon={<FaEye size={10} />}
                  radius={balancedRounded}
                />
                <StatBox
                  label="Rating"
                  value={novel.rating || "4.8"}
                  icon={<FaStar size={10} />}
                  color="text-yellow-500"
                  radius={balancedRounded}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {novel.genres?.map((g, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] ${balancedRounded}`}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/novel/${id}/chapter/${chapters[chapters.length - 1]?.chapterNumber || 1}`}
                  className={`bg-[var(--accent)] px-8 py-4 ${balancedRounded} font-bold text-white text-[11px] uppercase tracking-widest shadow-md flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all`}
                >
                  <FaPlay size={10} /> Start Reading
                </Link>

                {isNovelUnlocked ? (
                  <div
                    className={`px-8 py-4 ${balancedRounded} font-bold text-emerald-500 text-[11px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-3 shadow-sm`}
                  >
                    <FaUnlock size={10} /> Novel Unlocked
                  </div>
                ) : (
                  <button
                    onClick={handleBuyNovel}
                    className={`px-8 py-4 ${balancedRounded} font-bold text-white text-[11px] uppercase tracking-widest bg-emerald-600 border border-emerald-500 flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg`}
                  >
                    <FaShoppingCart size={10} /> Buy Full Novel
                  </button>
                )}

                <div className="relative" ref={saveMenuRef}>
                  <button
                    onClick={() => setShowSaveMenu(!showSaveMenu)}
                    className={`h-full px-8 py-4 ${balancedRounded} font-bold text-[var(--text-main)] border border-[var(--border)] flex items-center justify-center gap-3 hover:bg-[var(--accent)]/10 transition-all text-[11px] uppercase tracking-widest bg-[var(--bg-primary)]`}
                  >
                    Save to library{" "}
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${showSaveMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showSaveMenu && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl z-50 overflow-hidden ${balancedRounded} animate-in slide-in-from-top-2 duration-200`}
                    >
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
                        <FaBookmark className="text-[var(--accent)]" />{" "}
                        Bookmarks
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
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
                className={`py-5 text-[14px] font-bold uppercase transition-all relative
                  ${activeTab === tab.id ? "text-[var(--accent)] bg-[var(--bg-secondary)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8 text-left">
            {activeTab === "about" && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-[var(--text-main)] flex items-center gap-2">
                  Summary
                </h2>
                <p className="text-[var(--text-dim)] leading-relaxed text-base font-medium opacity-90 whitespace-pre-wrap">
                  {expanded
                    ? novel.description
                    : novel.description?.slice(0, 400) +
                      (novel.description?.length > 400 ? "..." : "")}
                </p>
                {novel.description?.length > 400 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 text-[var(--accent)] font-bold text-[9px] uppercase tracking-widest hover:underline"
                  >
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
                      <button
                        key={i}
                        onClick={() => setTocPage(i + 1)}
                        className={`shrink-0 px-4 py-2 text-[9px] font-bold uppercase border ${balancedRounded} transition-all ${tocPage === i + 1 ? "bg-[var(--text-main)] border-[var(--text-main)] text-[var(--bg-primary)] shadow-md" : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)]"}`}
                      >
                        Page {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-20 gap-y-3">
                  {visibleChapters.map((ch) => {
                    const isChapterUnlocked = user?.unlockedChapters?.some(
                      (id) => id.toString() === ch._id.toString(),
                    );
                    const isFree =
                      ch.chapterNumber <= (novel.freeChapters || 10);

                    return (
                      <Link
                        key={ch._id}
                        to={`/novel/${id}/chapter/${ch.chapterNumber}`}
                        className={`group flex items-center p-4 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all ${balancedRounded}`}
                      >
                        <span
                          className={`w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold group-hover:bg-[var(--accent)] group-hover:text-white transition-all ${balancedRounded}`}
                        >
                          {ch.chapterNumber}
                        </span>
                        <div className="ml-4 flex-1 min-w-0 flex items-center justify-between">
                          <span className="block text-[11px] font-bold text-[var(--text-main)] truncate uppercase">
                            {ch.title}
                          </span>
                          {!isFree && !isNovelUnlocked && (
                            <div className="ml-2">
                              {isChapterUnlocked ? (
                                <FaUnlock
                                  size={10}
                                  className="text-emerald-500 opacity-60"
                                />
                              ) : (
                                <FaLock
                                  size={10}
                                  className="text-[var(--text-dim)]"
                                />
                              )}
                            </div>
                          )}
                          {isNovelUnlocked && !isFree && (
                            <FaUnlock
                              size={10}
                              className="text-emerald-500 opacity-60"
                            />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-in fade-in duration-500">
                <RatingInput
                  novelId={id}
                  currentRating={novel.rating}
                  token={token}
                  showAlert={showAlert}
                  radius={balancedRounded}
                />
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

        {/* STORY DETAILS GRID */}
        <div className="mt-10 text-left">
          <div className={`p-2 md:p-8 ${glassStyle}`}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-main)] flex items-center gap-3">
              <FaShieldAlt className="text-[var(--accent)]" size={16} /> Story
              Details
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
    if (!token) return showAlert("Log in to rate.", "info");
    try {
      setSelected(score);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/novels/${novelId}/rate`,
        { rating: score },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showAlert(
        `Feedback Recorded: ${res.data.averageRating} stars`,
        "success",
      );
    } catch (err) {
      showAlert("Rating failed.", "error");
    }
  };

  return (
    <div
      className={`flex items-center gap-2 bg-[var(--bg-primary)] p-4 border border-[var(--border)] mb-8 w-fit ${radius}`}
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            className="transition-transform active:scale-90"
          >
            <FaStar
              size={20}
              className={`transition-colors ${(hover || selected) >= star ? "text-yellow-500" : "text-[var(--border)]"}`}
            />
          </button>
        ))}
      </div>
      <span className="ml-4 font-bold text-xs text-[var(--text-main)] tracking-widest">
        {hover || selected || "0"}.0
      </span>
    </div>
  );
};

const StatBox = ({
  label,
  value,
  icon,
  radius,
  color = "text-[var(--text-main)]",
}) => (
  <div
    className={`bg-[var(--bg-primary)] border border-[var(--border)] p-3 ${radius} text-left flex flex-col justify-between shadow-sm`}
  >
    <div className="flex items-center gap-2 mb-2 opacity-60">
      {icon}
      <p className="text-[10px] uppercase font-bold tracking-widest">{label}</p>
    </div>
    <p className={`text-[16px] font-bold uppercase tracking-tight ${color}`}>
      {value}
    </p>
  </div>
);

export default NovelDetail;
