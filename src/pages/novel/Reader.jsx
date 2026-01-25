import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, Loader2, BookOpen, Type, Settings, X, Sun, Moon,
  Maximize2, Minimize2, AlignLeft, AlignCenter, Minus, Plus
} from "lucide-react";
import { FaLock } from "react-icons/fa";

/* ================= THEME & FONT CONFIG ================= */
const fontMap = {
  inter: "font-['Inter',sans-serif]",
  serif: "font-['Source_Serif_4',serif]",
  mono: "font-['JetBrains_Mono',monospace]",
};

const themeMap = {
  dark: "bg-[#0b0c0e] text-neutral-300",
  light: "bg-[#ffffff] text-neutral-900",
  sepia: "bg-[#f4ecd8] text-[#5b4636]",
  midnight: "bg-[#01050a] text-slate-400",
};

export default function InfiniteReader() {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();

  /* ---------- CORE STATE ---------- */
  const [chapters, setChapters] = useState([]);
  const [currentVisibleChapter, setCurrentVisibleChapter] = useState(Number(chapterNumber));
  const [lastChapterLoaded, setLastChapterLoaded] = useState(Number(chapterNumber));
  const [totalChaptersCount, setTotalChaptersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ---------- UI PREFERENCES ---------- */
  const [showUI, setShowUI] = useState(false);
  const [panel, setPanel] = useState(null); // toc | appearance
  
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [fontFamily, setFontFamily] = useState("serif");
  const [theme, setTheme] = useState("dark");
  const [maxWidth, setMaxWidth] = useState("max-w-2xl");

  const observerRef = useRef(null);
  const historyTimeoutRef = useRef(null);

  /* ---------- SCROLL RESTORATION ---------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [novelId, chapterNumber]);

  /* ---------- API FETCHING ---------- */
  useEffect(() => {
    axios.get(`http://localhost:5000/api/novels/${novelId}`)
      .then((r) => setTotalChaptersCount(r.data.totalChapters || 0));
  }, [novelId]);

  const syncHistory = useCallback((num) => {
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    historyTimeoutRef.current = setTimeout(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.post(`http://localhost:5000/api/lib/history/${novelId}/last/${num}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error("Sync failed"); }
    }, 1500);
  }, [novelId]);

  const loadInitial = useCallback(async (num) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chapters/${novelId}/num/${num}`);
      const ch = data.chapter || data;
      setChapters([ch]);
      setLastChapterLoaded(ch.chapterNumber);
      setHasMore(ch.chapterNumber < totalChaptersCount);
      syncHistory(ch.chapterNumber);
    } catch (e) { setHasMore(false); }
    finally { setLoading(false); }
  }, [novelId, totalChaptersCount, syncHistory]);

  const loadNext = useCallback(async () => {
    if (!hasMore || loading) return;
    const next = lastChapterLoaded + 1;
    const token = localStorage.getItem("token");

    if (!token && next > 5) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chapters/${novelId}/num/${next}`);
      const ch = data.chapter || data;
      setChapters((p) => [...p, ch]);
      setLastChapterLoaded(ch.chapterNumber);
      setHasMore(ch.chapterNumber < totalChaptersCount);
    } catch (e) { setHasMore(false); }
    finally { setLoading(false); }
  }, [novelId, lastChapterLoaded, hasMore, loading, totalChaptersCount]);

  /* ---------- INTERSECTION OBSERVERS ---------- */
  useEffect(() => {
    loadInitial(Number(chapterNumber));
  }, [chapterNumber, loadInitial]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && loadNext(), { rootMargin: "800px" });
    if (observerRef.current) obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [loadNext]);

  useEffect(() => {
    const vis = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const num = Number(e.target.dataset.chNum);
          setCurrentVisibleChapter(num);
          window.history.replaceState(null, "", `/novel/${novelId}/chapter/${num}`);
          syncHistory(num);
        }
      });
    }, { threshold: 0.2, rootMargin: "-10% 0px -70% 0px" });

    document.querySelectorAll("section[data-ch-num]").forEach((el) => vis.observe(el));
    return () => vis.disconnect();
  }, [chapters, novelId, syncHistory]);

  const isGuestRestricted = !localStorage.getItem("token") && currentVisibleChapter >= 5;
  const readingProgress = (currentVisibleChapter / totalChaptersCount) * 100;

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeMap[theme]} ${fontMap[fontFamily]}`}>
      
      {/* 1. PROGRESSIVE HUD BAR */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-white/5">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_#6366f1]" 
          style={{ width: `${readingProgress}%` }} 
        />
      </div>

      {/* 2. TOP GHOST NAV */}
      <div 
        className={`fixed top-0 inset-x-0 h-20 z-40 flex items-center justify-between px-6 transition-transform duration-300 bg-gradient-to-b from-black/20 to-transparent ${showUI ? "translate-y-0" : "-translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => navigate(`/novel/${novelId}`)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-60">
          Sector {currentVisibleChapter} / {totalChaptersCount}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* 3. MAIN READER ENGINE */}
      <main 
        className={`${maxWidth} mx-auto px-6 py-32 transition-all duration-500`}
        onClick={() => { setShowUI(!showUI); setPanel(null); }}
      >
        {chapters.map((ch) => (
          <section key={ch._id} data-ch-num={ch.chapterNumber} className="mb-48 last:mb-20">
            <header className="mb-12 border-b border-white/5 pb-12">
              <div className="text-center">
                <span className="text-[10px] font-mono tracking-widest opacity-30 uppercase">Node Sync {ch.chapterNumber}</span>
                <h1 className="mt-4 text-4xl font-light tracking-tight">{ch.title}</h1>
              </div>
            </header>

            <article
              style={{ fontSize: `${fontSize}px`, lineHeight }}
              className="whitespace-pre-wrap text-justify antialiased selection:bg-indigo-500/40"
            >
              {ch.content}
            </article>
          </section>
        ))}

        <div ref={observerRef} className="h-64 flex justify-center items-center">
          {hasMore ? <Loader2 className="animate-spin opacity-20" size={30} /> : <div className="h-px w-20 bg-white/10" />}
        </div>
      </main>

      {/* 4. MODULAR BOTTOM DOCK */}
      <div className={`fixed bottom-8 inset-x-0 z-50 flex justify-center transition-all duration-300 ${showUI ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center gap-2 p-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <button onClick={(e) => { e.stopPropagation(); setPanel("toc"); }} className={`p-4 rounded-full transition-colors ${panel === "toc" ? "bg-indigo-600 text-white" : "hover:bg-white/5"}`}>
            <BookOpen size={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setPanel("appearance"); }} className={`p-4 rounded-full transition-colors ${panel === "appearance" ? "bg-indigo-600 text-white" : "hover:bg-white/5"}`}>
            <Type size={20} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button onClick={(e) => { e.stopPropagation(); navigate(`/novel/${novelId}`); }} className="p-4 hover:bg-white/5 rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* 5. SLIDE-UP APPEARANCE PANEL */}
      {panel === "appearance" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/20" onClick={() => setPanel(null)}>
          <div 
            className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-mono uppercase tracking-widest opacity-40">System UI Settings</h3>
              <button onClick={() => setPanel(null)}><X size={18} /></button>
            </div>

            <div className="space-y-10">
              {/* Font Choice */}
              <div>
                <div className="flex gap-2">
                  {Object.keys(fontMap).map((f) => (
                    <button key={f} onClick={() => setFontFamily(f)} className={`flex-1 py-3 rounded-xl text-xs uppercase tracking-tighter transition-all ${fontFamily === f ? "bg-white text-black font-bold" : "bg-white/5 hover:bg-white/10 text-white/40"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(themeMap).map((t) => (
                  <button 
                    key={t} 
                    onClick={() => setTheme(t)} 
                    className={`h-12 rounded-xl border-2 transition-all ${theme === t ? "border-indigo-500 scale-105" : "border-transparent opacity-60"} ${themeMap[t]}`}
                  >
                    <span className="text-[10px] uppercase font-bold">{t[0]}</span>
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest opacity-30">Text Size</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setFontSize(s => Math.max(14, s-2))} className="p-2 bg-white/5 rounded-lg"><Minus size={14} /></button>
                    <span className="text-sm font-mono">{fontSize}</span>
                    <button onClick={() => setFontSize(s => Math.min(32, s+2))} className="p-2 bg-white/5 rounded-lg"><Plus size={14} /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest opacity-30">Page Width</p>
                  <div className="flex gap-2">
                    <button onClick={() => setMaxWidth("max-w-xl")} className={`p-2 rounded-lg flex-1 ${maxWidth === "max-w-xl" ? "bg-indigo-500" : "bg-white/5"}`}><Minimize2 size={14} className="mx-auto" /></button>
                    <button onClick={() => setMaxWidth("max-w-3xl")} className={`p-2 rounded-lg flex-1 ${maxWidth === "max-w-3xl" ? "bg-indigo-500" : "bg-white/5"}`}><Maximize2 size={14} className="mx-auto" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TABLE OF CONTENTS (TOC) */}
      {panel === "toc" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPanel(null)}>
          <div className="w-full max-w-md h-[70vh] bg-neutral-900 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest">Index</h3>
              <button onClick={() => setPanel(null)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
              {[...Array(totalChaptersCount)].map((_, i) => {
                const ch = i + 1;
                return (
                  <button
                    key={ch}
                    onClick={() => { navigate(`/novel/${novelId}/chapter/${ch}`); setPanel(null); }}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all ${ch === currentVisibleChapter ? "bg-indigo-600 text-white font-bold" : "hover:bg-white/5 text-white/40"}`}
                  >
                    <span className="text-[10px] font-mono opacity-40 mr-4">{ch.toString().padStart(3, '0')}</span>
                    Sector {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. AUTH LOCK GATE */}
      {isGuestRestricted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-700">
          <div className="text-center p-10 max-w-sm">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/30">
              <FaLock size={30} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Access Restricted</h2>
            <p className="text-sm text-neutral-500 mb-10 leading-relaxed">
              You've hit the guest limit for this archive. Authenticate your node to read the full data.
            </p>
            <button 
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", `/novel/${novelId}/chapter/${currentVisibleChapter}`);
                navigate("/login");
              }}
              className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Authenticate Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}