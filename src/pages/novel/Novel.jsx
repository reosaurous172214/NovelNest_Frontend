import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Filter, X, Search, Trash2, ChevronRight } from "lucide-react";

import { GENRES, TAGS } from "../../constants/novelMeta";
import NovelCard from "../../components/novel/NovelSlip";

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt" },
  { label: "Chapters", value: "chapters" },
  { label: "Views", value: "views" },
  { label: "Rating", value: "rating" },
];

const Novels = () => {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = useMemo(
    () => new URLSearchParams(location.search).get("search") || "",
    [location.search],
  );

  // --- 1. DATA FETCHING ---
  const fetchNovels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/novels`,
        {
          params: {
            search: searchParam,
            genres: genres.join(","),
            tags: tags.join(","),
            sortBy,
          },
        },
      );
      setNovels(res.data.novels || []);
      setCurrentPage(1); // Reset to first page on new search/filter
    } catch (err) {
      console.error("Failed to load novels", err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [searchParam, genres, tags, sortBy]);

  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  // --- 2. PAGINATION LOGIC ---
  const totalPages = Math.ceil(novels.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNovels = novels.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setGenres([]);
    setTags([]);
    setSortBy("createdAt");
    if (searchParam) navigate("/novels");
  };

  const filteredTags = TAGS.filter((t) =>
    t.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const glassStyle =
    "bg-[var(--bg-secondary)] opacity-95 backdrop-blur-3xl border border-[var(--border)] shadow-2xl";

  const FiltersContent = () => (
    <div className="space-y-10">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
          Filter Settings
        </h3>
        {(genres.length > 0 || tags.length > 0 || sortBy !== "createdAt") && (
          <button
            onClick={resetFilters}
            className="text-[9px] font-bold text-[var(--text-dim)] hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-2 group"
          >
            <Trash2 size={10} /> Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)] block">
          Sort By
        </label>
        <div className="grid grid-cols-1 gap-2">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setSortBy(o.value)}
              className={`flex justify-between items-center text-[10px] font-bold tracking-widest uppercase px-5 py-3.5 rounded-2xl border transition-all
                ${
                  sortBy === o.value
                    ? "bg-[var(--text-main)] text-[var(--bg-primary)] border-[var(--text-main)] shadow-xl"
                    : "bg-[var(--bg-primary)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
            >
              {o.label}
              {sortBy === o.value && <ChevronRight size={12} />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
            Genres
          </label>
          <span className="text-[8px] font-sans font-bold text-[var(--accent)]">
            {genres.length} Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = genres.includes(g);
            return (
              <button
                key={g}
                onClick={() =>
                  setGenres((prev) =>
                    active ? prev.filter((x) => x !== g) : [...prev, g],
                  )
                }
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all
                  ${
                    active
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg"
                      : "bg-[var(--bg-primary)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--text-dim)]"
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
          Search Tags
        </label>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors"
            size={14}
          />
          <input
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            placeholder="TYPE TO SEARCH..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-[10px] tracking-widest font-bold text-[var(--text-main)] placeholder-[var(--text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
        </div>
        <div className="max-h-52 overflow-y-auto flex flex-wrap gap-2 pr-2 custom-scrollbar">
          {filteredTags.map((t) => {
            const active = tags.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  setTags((prev) =>
                    active ? prev.filter((x) => x !== t) : [...prev, t],
                  )
                }
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all
                  ${
                    active
                      ? "bg-[var(--text-main)] text-[var(--bg-primary)] border-[var(--text-main)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text-main)]"
                  }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-32 pb-20 relative transition-colors duration-500 text-left">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent)] opacity-5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 relative z-10">
        <aside className="hidden lg:block w-80 h-full sticky top-32">
          <div className={`rounded-[3rem] p-10 ${glassStyle}`}>
            <FiltersContent />
          </div>
        </aside>

        <main className="flex-1 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                {searchParam ? `Results for "${searchParam}"` : "Browse Novels"}
              </h1>
              <p className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">
                Showing {startIdx + 1}-
                {Math.min(startIdx + ITEMS_PER_PAGE, novels.length)} of{" "}
                {novels.length} novels
              </p>
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-primary)] text-[10px] font-black tracking-widest uppercase"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold tracking-widest text-[var(--text-dim)] uppercase">
                  Loading Stories...
                </p>
              </div>
            ) : currentNovels.length === 0 ? (
              <div
                className={`p-24 text-center rounded-[3rem] border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]/50`}
              >
                <h2 className="text-lg font-black uppercase tracking-widest italic">
                  No Results Found
                </h2>
                <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="flex items-center flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {currentNovels.map((n) => (
                  <NovelCard key={n._id} novel={n} />
                ))}

                {/* PAGINATION TABS */}
                {/* PAGINATION TABS */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-10">
                    {/* Previous Button */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} className="rotate-180" />
                    </button>

                    {/* Page Numbers Logic */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;

                      // logic: always show first, last, current, and one neighbor
                      const isFirst = pageNum === 1;
                      const isLast = pageNum === totalPages;
                      const isNearCurrent =
                        Math.abs(pageNum - currentPage) <= 1;

                      if (isFirst || isLast || isNearCurrent) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black border transition-all
              ${
                currentPage === pageNum
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg scale-110"
                  : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
              }
            `}
                          >
                            {pageNum}
                          </button>
                        );
                      }

                      // Show ellipses for gaps
                      if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="text-[var(--text-dim)] px-1"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    {/* Next Button */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE FILTERS */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end">
          <div
            className={`w-full max-w-sm h-full p-10 border-l border-[var(--border)] overflow-y-auto ${glassStyle}`}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-3 bg-[var(--bg-primary)] rounded-2xl text-[var(--text-dim)]"
              >
                <X size={20} />
              </button>
            </div>
            <FiltersContent />
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black text-[10px] uppercase shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Novels;
