import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Components & Config
import ReaderLayout from "../../components/reader/ReaderLayout";
import ChapterPaymentOverlay from "../../components/reader/ChapterPayment";
import { fetchChapter } from "../../api/fetchChapter";
import { themeMap, fontMap } from "../../config/readerConfig";

// Icons
import {
  FaChevronRight,
  FaChevronLeft,
  FaArrowUp,
  FaSync,
} from "react-icons/fa";
import { getHeaders } from "../../getItems/getAuthItems";

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

  // --- NEW PAYMENT STATES ---
  const [isLocked, setIsLocked] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

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
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/analytics/sync`,
          {
            novelId,
            wordsWritten: 0,
            chapterFinished: false,
          },
          getHeaders(),
        );
        console.log("Analytics: Pulse Synchronized.");
      } catch (err) {
        console.error("Heartbeat Sync Error:", err);
      }
    };

    const pulse = setInterval(sendPulse, 30000);
    return () => clearInterval(pulse);
  }, [novelId]);

  // --- 2. WALLET BALANCE FETCH ---
  const fetchBalance = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payments/wallet`,
        getHeaders(),
      );
      setUserBalance(data.balance);
    } catch (err) {
      console.error("Balance Sync Error:", err);
    }
  };

  // --- 3. UNLOCK CHAPTER ACTION ---
  const handleUnlock = async (chapterId) => {
    console.log(chapterId);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chapters/${chapterId}/unlock`,
        {},
        getHeaders(),
      );

      // Reset flow to re-fetch unlocked content
      setIsLocked(false);
      hasFetchedInitial.current = false;
      // loadData will trigger via the next useEffect
    } catch (err) {
      alert(err.response?.data?.message || "Unlock Protocol Failed.");
    }
  };

  // --- 4. INITIAL FETCH (With Payment Check) ---
  useEffect(() => {
    hasFetchedInitial.current = false;
  }, [novelId, chapterNumber]);

  useEffect(() => {
    if (readingMode === "single" && !hasFetchedInitial.current) {
      const loadData = async () => {
        try {
          setLoading(true);
          setIsLocked(false);
          hasFetchedInitial.current = true;

          window.scrollTo({ top: 0, behavior: "instant" });

          const data = await fetchChapter(novelId, chapterNumber);

          setChapters([data.chapter || data]);
          setHasNext(data.hasNext || false);
          setNextChapterNum(data.hasNext ? parseInt(chapterNumber) + 1 : null);
        } catch (err) {
          if (err.response?.status === 403) {
            setIsLocked(true);
            // We don't have the chapter content, so we set a placeholder for the overlay
            setChapters([
              {
                _id: err.response.data.chapterId, // Backend should send this in res.status(403).json(...)
                chapterNumber: chapterNumber,
              },
            ]);
            fetchBalance();
          }
          console.error("Transmission Error:", err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [novelId, chapterNumber, readingMode]);

  // --- 5. INFINITE SCROLL FETCH ---
  const fetchNextChapter = async () => {
    if (!hasNext || isFetchingNext || !nextChapterNum) return;

    setIsFetchingNext(true);
    try {
      const data = await fetchChapter(novelId, nextChapterNum);
      setChapters((prev) => [...prev, data.chapter || data]);
      setHasNext(data.hasNext || false);
      setNextChapterNum(data.hasNext ? nextChapterNum + 1 : null);
    } catch (err) {
      // If next chapter in infinite scroll is locked, we stop infinite scroll
      if (err.response?.status === 403) {
        setHasNext(false);
      }
      console.error("Infinite fetch failed", err);
    } finally {
      setIsFetchingNext(false);
    }
  };

  // --- 6. INTERSECTION OBSERVER ---
  const lastElementRef = (node) => {
    if (loading || readingMode !== "infinite") return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNext && !isFetchingNext) {
        fetchNextChapter();
      }
    });
    if (node) observer.current.observe(node);
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] animate-pulse">
          Syncing Manuscript...
        </p>
      </div>
    );

  return (
    <ReaderLayout
      themeClass={themeMap[settings.theme]}
      fontClass={fontMap[settings.font]}
      settings={{ ...settings, readingMode }}
      setSettings={(newSettings) => {
        if (newSettings.readingMode) {
          setReadingMode(newSettings.readingMode);
          if (newSettings.readingMode === "single")
            hasFetchedInitial.current = false;
        }
        setSettings(newSettings);
      }}
    >
      <article
        className="mx-auto max-w-2xl text-left transition-colors duration-500"
        style={{
          fontSize: `${settings.fontSize}px`,
          color: "var(--text-main)",
        }}
      >
        {isLocked ? (
          <ChapterPaymentOverlay
            chapter={{
              _id: novelId, // Using novelId/chapterNumber context for the partial
              title: `Transmission ${chapterNumber}`,
              chapterNumber: chapterNumber,
            }}
            userBalance={userBalance}
            onUnlock={() => handleUnlock(chapters[0]?._id || novelId)}
          />
        ) : (
          <>
            {chapters.map((ch, index) => (
              <section
                key={ch._id || index}
                className={
                  index > 0 ? "mt-32 pt-20 border-t border-[var(--border)]" : ""
                }
              >
                <header className="mb-16 pt-10">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4  leading-[1] text-[var(--text-main)]">
                    {ch.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-semibold text-[var(--accent)] ">
                      Chapter {ch.chapterNumber || chapterNumber}
                    </p>
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>
                </header>

                <div className="whitespace-pre-wrap leading-relaxed  mb-10 font-medium opacity-90 select-text">
                  {ch.content}
                </div>
              </section>
            ))}
          </>
        )}

        {readingMode === "infinite" && !isLocked && (
          <div
            ref={lastElementRef}
            className="h-60 flex flex-col items-center justify-center gap-4"
          >
            {isFetchingNext ? (
              <>
                <FaSync className="text-[var(--accent)] animate-spin" />
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                  Decrypting Next Node...
                </p>
              </>
            ) : (
              !hasNext && (
                <div className="text-center opacity-20">
                  <div className="h-px w-20 bg-[var(--text-dim)] mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase">
                    End of Records
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {readingMode === "single" && (
          <footer className="mt-24 border-t border-[var(--border)] pt-16 pb-40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parseInt(chapterNumber) > 1 ? (
                <button
                  onClick={() =>
                    navigate(
                      `/novel/${novelId}/chapter/${parseInt(chapterNumber) - 1}`,
                    )
                  }
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-[var(--text-main)] font-black uppercase tracking-widest text-[10px] hover:border-[var(--accent)] transition-all"
                >
                  <FaChevronLeft /> Previous Node
                </button>
              ) : (
                <div />
              )}

              {!isLocked && hasNext ? (
                <button
                  onClick={() =>
                    navigate(
                      `/novel/${novelId}/chapter/${parseInt(chapterNumber) + 1}`,
                    )
                  }
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--accent)] rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[var(--accent)]/20 hover:brightness-110 transition-all"
                >
                  Next Transmission <FaChevronRight />
                </button>
              ) : (
                !isLocked && (
                  <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                    Archive Complete
                  </div>
                )
              )}
            </div>
          </footer>
        )}
      </article>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-[var(--accent)] shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <FaArrowUp />
      </button>
    </ReaderLayout>
  );
}
