import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Filter, X, Search, SlidersHorizontal, Trash2, ChevronRight } from "lucide-react";

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

  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = useMemo(() => new URLSearchParams(location.search).get("search") || "", [location.search]);

  // --- 1. ENHANCED DATA FETCHING ---
  const fetchNovels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/novels", {
        params: {
          search: searchParam,
          genres: genres.join(","),
          tags: tags.join(","),
          sortBy,
        },
      });
      setNovels(res.data.novels || []);
    } catch (err) {
      console.error("Archive retrieval failure", err);
    } finally {
      // Small delay for smooth transition
      setTimeout(() => setLoading(false), 300);
    }
  }, [searchParam, genres, tags, sortBy]);

  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  // --- 2. DYNAMIC SCROLL RESTORATION ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParam, genres, tags]);

  const resetFilters = () => {
    setGenres([]);
    setTags([]);
    setSortBy("createdAt");
    if (searchParam) navigate("/novels");
  };

  const filteredTags = TAGS.filter((t) =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const glassStyle = "bg-white/[0.02] backdrop-blur-[30px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]";

  const FiltersContent = () => (
    <div className="space-y-10">
      {/* HEADER ACTION */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">System Config</h3>
          {(genres.length > 0 || tags.length > 0 || sortBy !== "createdAt") && (
            <button onClick={resetFilters} className="text-[9px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-2 group">
              <Trash2 size={10} className="group-hover:rotate-12 transition-transform" /> Clear All
            </button>
          )}
      </div>

      {/* SORT REGISTRY */}
      <div className="space-y-4">
        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 block">Sort Algorithm</label>
        <div className="grid grid-cols-1 gap-2">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setSortBy(o.value)}
              className={`flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-3.5 rounded-2xl border transition-all
                ${sortBy === o.value
                  ? "bg-white text-black border-white shadow-xl shadow-white/5"
                  : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300"
                }`}
            >
              {o.label}
              {sortBy === o.value && <ChevronRight size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* GENRES DATASET */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">Genre Filter</label>
            <span className="text-[8px] font-mono text-indigo-500">{genres.length} Selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = genres.includes(g);
            return (
              <button
                key={g}
                onClick={() => setGenres((prev) => active ? prev.filter((x) => x !== g) : [...prev, g])}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all
                  ${active
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10"
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAG ARCHIVE */}
      <div className="space-y-4">
        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">Keyword Index</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={14} />
          <input
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            placeholder="SEARCH TAGS..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[10px] tracking-widest font-bold text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="max-h-52 overflow-y-auto flex flex-wrap gap-2 pr-2 custom-scrollbar">
          {filteredTags.map((t) => {
            const active = tags.includes(t);
            return (
              <button
                key={t}
                onClick={() => setTags((prev) => active ? prev.filter((x) => x !== t) : [...prev, t])}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all
                  ${active
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.02] text-gray-600 border-white/5 hover:text-gray-400 hover:bg-white/5"
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
    <div className="min-h-screen bg-[#020202] text-gray-200 pt-32 pb-20 relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-80  h-[calc(100vh-160px)]">
          <div className={`rounded-[3rem] p-10 ${glassStyle}`}>
            <FiltersContent />
          </div>
        </aside>

        {/* MAIN LIST AREA */}
        <main className="flex-1 space-y-12">
          
          {/* SEARCH HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase italic">Archive Stream Active</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                {searchParam ? `Results // ${searchParam}` : "Explore All"}
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-black text-indigo-500 tracking-[0.4em] uppercase">
                {novels.length} Novels found 
                <div className="h-px w-12 bg-indigo-500/30" />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-transform"
            >
              <Filter size={14} /> Open Filters
            </button>
          </div>

          {/* NOVELS LIST */}
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border border-white/10 rounded-full" />
                    <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <p className="text-[10px] font-mono tracking-[0.5em] text-gray-600 uppercase animate-pulse">Syncing Archive Nodes...</p>
              </div>
            ) : novels.length === 0 ? (
              <div className={`p-24 text-center rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01]`}>
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                  <Search size={32} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-widest text-white mb-2 italic">Null Reference</h2>
                <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                  No matches found in the current sector.
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                {novels.map((n) => (
                    <NovelCard key={n._id} novel={n} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
          <div className={`w-full max-w-sm h-full p-10 border-l border-white/10 overflow-y-auto ${glassStyle} animate-in slide-in-from-right duration-500`}>
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Console</h2>
                <p className="text-[8px] font-mono text-gray-600 tracking-widest uppercase">System Configuration</p>
              </div>
              <button onClick={() => setShowFilters(false)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <FiltersContent />
            
            <button 
                onClick={() => setShowFilters(false)}
                className="w-full mt-12 py-5 bg-white text-black rounded-[1.5rem] font-black tracking-widest text-[10px] uppercase shadow-2xl hover:bg-indigo-500 hover:text-white transition-all"
            >
              Initialize Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Novels;