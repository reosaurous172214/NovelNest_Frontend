import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { useAddFavourites } from "../../hooks/useFavourites";
import { getToken } from "../../getItems/getAuthItems";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext"; // Added Auth context

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
  const { addToFavourites, adding } = useAddFavourites();
  
  const { user } = useAuth(); // Access current logged-in user
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
        setTocPage(1);
      } catch (err) {
        console.error("Failed to load novel:", err);
      }
    };
    fetchNovel();
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  if (!novel)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-sans text-[10px] text-[var(--accent)] uppercase tracking-[0.2em] animate-pulse">
          Loading Story...
        </p>
      </div>
    );

  const shortDesc =
    novel.description?.length > 280 && !expanded
      ? novel.description.slice(0, 280) + "..."
      : novel.description;

  const handleFavourite = async () => {
    if (!token) {
      showAlert("Please log in to save bookmarks.", "info");
      return;
    }
    try {
      const response = await addToFavourites(id);
      const msg = response?.message || "Saved to your library.";
      showAlert(`"${novel.title}" ${msg}`, "success");
    } catch (err) {
      showAlert("Could not update Favourites.", "error");
    }
  };

  const glassStyle =
    "bg-[var(--bg-secondary)] opacity-95 backdrop-blur-3xl border border-[var(--border)] shadow-2xl";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-24 relative overflow-hidden transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* HERO SECTION */}
        <div className={`relative rounded-[2.5rem] p-8 md:p-12 ${glassStyle}`}>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="mx-auto md:mx-0 shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-t from-[var(--accent)] to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <img
                  src={novel.coverImage}
                  onError={handleImageError}
                  alt={novel.title}
                  className="relative w-64 h-96 object-cover rounded-2xl shadow-2xl border border-[var(--border)] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-[var(--text-main)] mb-6">
                {novel.title}
              </h1>

              <p className="text-sm text-[var(--text-dim)] font-medium tracking-[0.2em] uppercase mb-8">
                Author /{" "}
                <span className="text-[var(--text-main)] border-b border-[var(--accent)]/50 pb-1 ml-1">
                  {novel.author}
                </span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatBox label="Status" value="Ongoing" icon={<FaInfoCircle size={10} />} color="text-emerald-400" />
                <StatBox label="Chapters" value={`${totalChapters}`} icon={<FaBookOpen size={10} />} />
                <StatBox label="Views" value={novel.views?.toLocaleString()} icon={<FaEye size={10} />} />
                <StatBox label="Rating" value={novel.rating || "4.8"} icon={<FaStar size={10} />} color="text-yellow-400" />
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {novel.genres?.map((g, i) => (
                  <span key={i} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-default">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/novel/${id}/chapter/${chapters[chapters.length - 1]?.chapterNumber || 1}`}
                  className="bg-[var(--accent)] px-10 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all"
                >
                  <FaPlay size={10} /> Start Reading
                </Link>
                <button
                  onClick={handleFavourite}
                  className="px-10 py-4 rounded-2xl font-black text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center gap-3 hover:bg-[var(--accent)]/10 transition-all text-xs uppercase tracking-widest"
                >
                  <FaHeart size={10} /> Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className={`mt-12 md:rounded-[2.5rem] overflow-hidden ${glassStyle}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/50 overflow-x-auto no-scrollbar">
            {[
              { id: "about", label: "Summary" },
              { id: "toc", label: "Chapters" },
              { id: "reviews", label: "Reviews" },
              { id: "recommend", label: "Recommended" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-6 mx-2 md text-[11px] font-black uppercase tracking-[0.1em] transition-all relative
                  ${activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}
                `}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)]"></div>}
              </button>
            ))}
          </div>

          <div className="p-10 text-left">
            {activeTab === "about" && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 text-[var(--text-main)] flex items-center gap-3">
                  <div className="w-1 h-6 bg-[var(--accent)]"></div> The Story
                </h2>
                <p className="text-[var(--text-dim)] leading-relaxed text-lg font-medium italic opacity-90">{shortDesc}</p>
                {novel.description?.length > 280 && (
                  <button onClick={() => setExpanded(!expanded)} className="mt-6 text-[var(--accent)] font-bold text-[10px] uppercase tracking-widest hover:underline">
                    {expanded ? "[ SHOW LESS ]" : "[ READ FULL SUMMARY ]"}
                  </button>
                )}
              </div>
            )}

            {activeTab === "toc" && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-main)]">Table of Contents</h2>
                  <span className="text-[10px] font-sans bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-2 rounded-full border border-[var(--accent)]/20 uppercase font-bold">
                    {totalChapters} Chapters Available
                  </span>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setTocPage(i + 1)} className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all ${tocPage === i + 1 ? "bg-[var(--text-main)] border-[var(--text-main)] text-[var(--bg-primary)] shadow-xl" : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)]"}`}>
                        Page {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                {/* Chapter List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleChapters.map((ch, idx) => (
                    <Link key={ch._id} to={`/novel/${id}/chapter/${ch.chapterNumber}`} className="group flex items-center p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all shadow-sm">
                      <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] font-sans text-[var(--accent)] text-xs font-black group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-inner">
                        {ch.chapterNumber}
                      </span>
                      <div className="ml-5 min-w-0">
                        <span className="block text-xs font-bold text-[var(--text-main)] truncate uppercase tracking-tight">{ch.title}</span>
                        <span className="text-[9px] text-[var(--text-dim)] font-sans uppercase tracking-widest mt-1 block">Verified Chapter</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FIXED TAB LOGIC: Check for "reviews" to match the tab ID */}
            {activeTab === "reviews" && (
              <div className="animate-in fade-in duration-500">
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
        <div className="mt-12 text-left">
          <div className={`p-10 rounded-[2.5rem] ${glassStyle}`}>
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 text-[var(--text-main)] flex items-center gap-4">
              <FaShieldAlt className="text-[var(--accent)]" size={18} /> Story Details
            </h2>
            <NovelDetailMap novel={novel} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon, color = "text-[var(--text-main)]" }) => (
  <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-2xl shadow-inner text-left">
    <div className="flex items-center gap-2 mb-2 opacity-50">
      {icon}
      <p className="text-[9px] uppercase font-bold tracking-widest">{label}</p>
    </div>
    <p className={`text-sm font-black uppercase tracking-tight ${color}`}>{value}</p>
  </div>
);

export default NovelDetail;