import { useParams, useNavigate } from "react-router-dom";
import ReaderLayout from "../../components/reader/ReaderLayout";
import { useEffect, useState, useRef } from "react";
import { fetchChapter } from "../../api/fetchChapter";
import { themeMap, fontMap } from "../../config/readerConfig";
import { FaChevronRight, FaChevronLeft, FaCheckCircle, FaArrowUp } from "react-icons/fa";

export default function Reader() {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();
  
  // States
  const [chapters, setChapters] = useState([]); // Array to support Infinite Scroll
  const [loading, setLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [readingMode, setReadingMode] = useState("single"); // "single" or "infinite"
  const [nextChapterNum, setNextChapterNum] = useState(null);

  const [settings, setSettings] = useState({
    theme: localStorage.getItem("site-theme") || "default",
    font: "serif",
    fontSize: 18,
  });

  // INITIAL FETCH (and reset when URL changes in single mode)
  useEffect(() => {
    if (readingMode === "single") {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'instant' }); 
      fetchChapter(novelId, chapterNumber)
        .then((data) => {
          setChapters([data.chapter || data]);
          setHasNext(data.hasNext || false);
          setNextChapterNum(data.hasNext ? parseInt(chapterNumber) + 1 : null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [novelId, chapterNumber, readingMode]);

  // INFINITE SCROLL FETCH LOGIC
  const fetchNextChapter = async () => {
    if (!hasNext || isFetchingNext || !nextChapterNum) return;
    
    setIsFetchingNext(true);
    try {
      const data = await fetchChapter(novelId, nextChapterNum);
      setChapters(prev => [...prev, data.chapter || data]);
      setHasNext(data.hasNext || false);
      setNextChapterNum(data.hasNext ? nextChapterNum + 1 : null);
    } catch (err) {
      console.error("Infinite fetch failed", err);
    } finally {
      setIsFetchingNext(false);
    }
  };

  // INTERSECTION OBSERVER (The Watcher)
  const observer = useRef();
  const lastElementRef = (node) => {
    if (loading || readingMode !== "infinite") return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNext) {
        fetchNextChapter();
      }
    });
    if (node) observer.current.observe(node);
  };

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
        if (newSettings.readingMode) setReadingMode(newSettings.readingMode);
        setSettings(newSettings);
      }}
    >
      <article className="mx-auto max-w-2xl text-left" style={{ fontSize: `${settings.fontSize}px`, color: "var(--text-main)" }}>
        
        {chapters.map((ch, index) => (
          <div key={ch._id || index} className={index > 0 ? "mt-32 pt-20 border-t border-[var(--border)]" : ""}>
            <header className="mb-16 pt-10">
              <h1 className="text-3xl md:text-4xl font-black mb-4 italic uppercase tracking-tighter leading-[1.1]">
                {ch.title}
              </h1>
              <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">
                Node: {readingMode === "infinite" ? index + 1 : chapterNumber}
              </p>
            </header>
            
            <div className="whitespace-pre-wrap leading-relaxed tracking-wide mb-10 font-medium opacity-90">
              {ch.content}
            </div>
          </div>
        ))}

        {/* INFINITE LOADER / SENTINEL */}
        {readingMode === "infinite" && (
          <div ref={lastElementRef} className="h-40 flex items-center justify-center">
            {isFetchingNext ? (
               <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            ) : !hasNext && (
              <p className="text-[10px] font-black uppercase text-[var(--text-dim)]">--- End of Records ---</p>
            )}
          </div>
        )}

        {/* SINGLE MODE FOOTER */}
        {readingMode === "single" && (
          <div className="mt-24 border-t border-[var(--border)] pt-16 pb-40">
            <div className="grid grid-cols-2  gap-10">
              {parseInt(chapterNumber) > 1 ? (
                <button onClick={() => navigate(`/novel/${novelId}/chapter/${parseInt(chapterNumber) - 1}`)} className="px-14 py-6 bg-[var(--accent)] rounded-2xl text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl">
                  <FaChevronLeft className="inline-block mr-2" /> Previous Chapter
                </button>
              ) : (
                <div></div>
              )}
              {hasNext ? (
                <button onClick={() => navigate(`/novel/${novelId}/chapter/${parseInt(chapterNumber) + 1}`)} className="px-14 py-6 bg-[var(--accent)] rounded-2xl text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl">
                 Next Chapter <FaChevronRight className="inline-block ml-2" />
                </button>
              ) : (
                <div className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">Transmission Complete</div>
              )}
            </div>
          </div>
        )}
      </article>
    </ReaderLayout>
  );
}