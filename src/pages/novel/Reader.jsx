import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Components & Config
import ReaderLayout from "../../components/reader/ReaderLayout";
import { fetchChapter } from "../../api/fetchChapter";
import { themeMap, fontMap } from "../../config/readerConfig";

// Icons
import { 
  FaChevronRight, 
  FaChevronLeft, 
  FaArrowUp, 
  FaSync 
} from "react-icons/fa";

export default function Reader() {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();
  
  // --- REFS (State Locks) ---
  const hasFetchedInitial = useRef(false);
  const observer = useRef();

  // --- STATES ---
  const [chapters, setChapters] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [readingMode, setReadingMode] = useState("single"); 
  const [nextChapterNum, setNextChapterNum] = useState(null);

  const [settings, setSettings] = useState({
    theme: localStorage.getItem("site-theme") || "default",
    font: "serif",
    fontSize: 18,
  });

  // --- 1. NEURAL SYNC (HEARTBEAT) ---
  useEffect(() => {
    const sendPulse = async () => {
      if (document.hidden) return;

      try {
        const config = { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
        };
        
        await axios.post(`${process.env.REACT_APP_API_URL}/api/analytics/sync`, 
          { 
            novelId, 
            wordsWritten: 0, 
            chapterFinished: false 
          }, 
          config
        );
        console.log("Analytics: Pulse Synchronized.");
      } catch (err) {
        console.error("Heartbeat Sync Error:", err);
      }
    };

    const pulse = setInterval(sendPulse, 30000);
    return () => clearInterval(pulse);
  }, [novelId]);

  // --- 2. INITIAL FETCH (Double-Increment Fix) ---
  useEffect(() => {
    // Reset the lock whenever the route parameters change
    hasFetchedInitial.current = false;
  }, [novelId, chapterNumber]);

  useEffect(() => {
    // Only run if we are in single mode and haven't fetched this chapter yet
    if (readingMode === "single" && !hasFetchedInitial.current) {
      const loadData = async () => {
        try {
          setLoading(true);
          hasFetchedInitial.current = true; // LOCK: Prevents double-fetch in StrictMode
          
          window.scrollTo({ top: 0, behavior: 'instant' }); 
          
          const data = await fetchChapter(novelId, chapterNumber);
          
          // Sync state with backend response
          setChapters([data.chapter || data]);
          setHasNext(data.hasNext || false);
          setNextChapterNum(data.hasNext ? parseInt(chapterNumber) + 1 : null);
        } catch (err) {
          console.error("Transmission Error:", err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [novelId, chapterNumber, readingMode]);

  // --- 3. INFINITE SCROLL FETCH ---
  const fetchNextChapter = async () => {
    if (!hasNext || isFetchingNext || !nextChapterNum) return;
    
    setIsFetchingNext(true);
    try {
      const data = await fetchChapter(novelId, nextChapterNum);
      
      // Append new chapter to existing list
      setChapters(prev => [...prev, data.chapter || data]);
      setHasNext(data.hasNext || false);
      setNextChapterNum(data.hasNext ? nextChapterNum + 1 : null);
    } catch (err) {
      console.error("Infinite fetch failed", err);
    } finally {
      setIsFetchingNext(false);
    }
  };

  // --- 4. INTERSECTION OBSERVER ---
  const lastElementRef = (node) => {
    if (loading || readingMode !== "infinite") return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      // isIntersecting ensures we only fetch when the loader is visible
      if (entries[0].isIntersecting && hasNext && !isFetchingNext) {
        fetchNextChapter();
      }
    });
    if (node) observer.current.observe(node);
  };

  // --- LOADING UI ---
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] animate-pulse">Syncing Manuscript...</p>
    </div>
  );

  return (
    <ReaderLayout 
      themeClass={themeMap[settings.theme]} 
      fontClass={fontMap[settings.font]} 
      settings={{...settings, readingMode}} 
      setSettings={(newSettings) => {
        if (newSettings.readingMode) {
          setReadingMode(newSettings.readingMode);
          // If switching back to single, we want to reset the view
          if (newSettings.readingMode === "single") hasFetchedInitial.current = false;
        }
        setSettings(newSettings);
      }}
    >
      <article 
        className="mx-auto max-w-2xl text-left transition-colors duration-500" 
        style={{ fontSize: `${settings.fontSize}px`, color: "var(--text-main)" }}
      >
        
        {chapters.map((ch, index) => (
          <section 
            key={ch._id || index} 
            className={index > 0 ? "mt-32 pt-20 border-t border-[var(--border)]" : ""}
          >
            <header className="mb-16 pt-10">
              <h1 className="text-3xl md:text-5xl font-black mb-4 italic uppercase tracking-tighter leading-[1] text-[var(--text-main)]">
                {ch.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
                  Transmission {readingMode === "infinite" ? ch.chapterNumber : chapterNumber}
                </p>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>
            </header>
            
            <div className="whitespace-pre-wrap leading-relaxed tracking-wide mb-10 font-medium opacity-90 select-text">
              {ch.content}
            </div>
          </section>
        ))}

        {/* --- INFINITE LOADER TARGET --- */}
        {readingMode === "infinite" && (
          <div ref={lastElementRef} className="h-60 flex flex-col items-center justify-center gap-4">
            {isFetchingNext ? (
               <>
                 <FaSync className="text-[var(--accent)] animate-spin" />
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Decrypting Next Node...</p>
               </>
            ) : !hasNext && (
              <div className="text-center opacity-20">
                <div className="h-px w-20 bg-[var(--text-dim)] mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase">End of Records</p>
              </div>
            )}
          </div>
        )}

        {/* --- SINGLE MODE CONTROLS --- */}
        {readingMode === "single" && (
          <footer className="mt-24 border-t border-[var(--border)] pt-16 pb-40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parseInt(chapterNumber) > 1 ? (
                <button 
                  onClick={() => navigate(`/novel/${novelId}/chapter/${parseInt(chapterNumber) - 1}`)} 
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-[var(--text-main)] font-black uppercase tracking-widest text-[10px] hover:border-[var(--accent)] transition-all"
                >
                  <FaChevronLeft /> Previous Node
                </button>
              ) : <div />}
              
              {hasNext ? (
                <button 
                  onClick={() => navigate(`/novel/${novelId}/chapter/${parseInt(chapterNumber) + 1}`)} 
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--accent)] rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[var(--accent)]/20 hover:brightness-110 transition-all"
                >
                  Next Transmission <FaChevronRight />
                </button>
              ) : (
                <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                  Archive Complete
                </div>
              )}
            </div>
          </footer>
        )}
      </article>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-[var(--accent)] shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <FaArrowUp />
      </button>
    </ReaderLayout>
  );
}