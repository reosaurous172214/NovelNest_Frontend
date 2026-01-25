import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NovelDetailMap from "../../components/novel/NovelDetailMap";
import RecommendedNovels from "../../components/novel/RecommendedNovels";

const CHAPTERS_PER_PAGE = 50;

const NovelDetail = () => {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [chapters, setChapters] = useState([]);

  // TOC pagination state
  const [tocPage, setTocPage] = useState(1);

  const totalChapters = chapters.length;
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);

  const startIdx = (tocPage - 1) * CHAPTERS_PER_PAGE;
  const endIdx = startIdx + CHAPTERS_PER_PAGE;
  const visibleChapters = chapters.slice(startIdx, endIdx);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const novelRes = await axios.get(`http://localhost:5000/api/novels/${id}`);
        setNovel(novelRes.data);

        const chaptersRes = await axios.get(`http://localhost:5000/api/chapters/novel/${id}`);
        const rawData = Array.isArray(chaptersRes.data)
          ? chaptersRes.data
          : chaptersRes.data.chapters || [];

        const sortedChapters = [...rawData].sort((a, b) => {
          return (b.chapterNumber || 0) - (a.chapterNumber || 0);
        });

        setChapters(sortedChapters);
        setTocPage(1); // reset page when novel changes
      } catch (err) {
        console.error("Archive retrieval failed:", err);
      }
    };

    fetchNovel();
  }, [id]);

  if (!novel) return (
    <div className="min-h-screen flex items-center justify-center text-indigo-400 bg-[#050505]">
      <div className="animate-pulse">Loading amazing stories...</div>
    </div>
  );

  const shortDesc = novel.description?.length > 280 && !expanded
    ? novel.description.slice(0, 280) + "..."
    : novel.description;

  const glassStyle = "bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]";
  const innerRefraction = "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none";

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 py-24 relative overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* HERO */}
          <div className={`relative rounded-3xl p-8 ${glassStyle} ${innerRefraction}`}>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="mx-auto md:mx-0 shrink-0">
                <img
            src={novel.coverImage}
            alt={novel.title}
            className="w-56 h-84 object-cover rounded-2xl shadow-2xl border border-white/10"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {novel.title}
                </h1>

                <p className="text-sm text-indigo-300/80 mt-3 font-medium tracking-widest uppercase">
            Authored by <span className="text-white border-b border-indigo-500/50 pb-1">{novel.author}</span>
                </p>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox label="Status" value="Ongoing" color="text-green-400" />
            <StatBox label="Chapters" value={totalChapters} />
            <StatBox label="Views" value={novel.views?.toLocaleString() || 0} />
            <StatBox label="Rating" value={`★ ${novel.rating || "4.3"}`} color="text-yellow-400" />
                </div>

                <div className="flex flex-wrap gap-2 mt-8">
            {novel.genres?.map((g, i) => (
              <span key={i} className="px-4 py-1.5 text-xs font-bold rounded-full bg-white/[0.05] border border-white/[0.1] text-indigo-200">
                {g}
              </span>
            ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              to={`/novel/${id}/chapter/${chapters[0]?.chapterNumber || 1}`}
              className="bg-indigo-600 px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center"
            >
              Start Reading
            </Link>
            <Link to={`/novel/${id}/favorites`} className="px-8 py-3 rounded-xl font-semibold text-indigo-300 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/10 transition">
              ♥ Save to Favorites
            </Link>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
        <div className={`mt-10 rounded-3xl overflow-hidden ${glassStyle}`}>
          <div className="flex flex-wrap border-b border-white/5 bg-white/[0.02]">
            {['about', 'toc', 'reviews', 'recommend'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'}
                `}
              >
                {tab === 'toc' ? 'Contents' : tab === 'recommend' ? 'Similar' : tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white">The Synopsis</h2>
                <p className="text-gray-400 leading-relaxed text-lg font-light tracking-wide">
                  {shortDesc}
                </p>
                {novel.description?.length > 280 && (
                  <button onClick={() => setExpanded(!expanded)} className="mt-4 text-indigo-400 font-bold hover:underline">
                    {expanded ? 'SHOW LESS' : 'READ FULL SUMMARY'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'toc' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Chapters</h2>
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                    {totalChapters} Available
                  </span>
                </div>

                {/* PAGE TABS */}
                {totalPages > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const from = totalChapters - (pageNum - 1) * CHAPTERS_PER_PAGE ;
                      const to = Math.max(totalChapters - (pageNum ) * CHAPTERS_PER_PAGE, 0);

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setTocPage(pageNum)}
                          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all
                            ${tocPage === pageNum
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-white/[0.05] border-white/[0.1] text-gray-400 hover:text-white'}
                          `}
                        >
                          {from}–{to}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* CHAPTER LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visibleChapters.map((ch, idx) => (
                    <Link
                      key={ch._id}
                      to={`/novel/${id}/chapter/${ch.chapterNumber}`}
                      className="group flex items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                    >
                      <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 font-mono text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {totalChapters - (startIdx + idx)}
                      </span>
                      <span className="ml-4 text-gray-300 group-hover:text-white font-medium truncate">
                        {ch.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommend' && <RecommendedNovels novelId={id} />}
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-12">
          <div className={`p-8 rounded-3xl ${glassStyle}`}>
            <h2 className="text-xl font-bold mb-6 text-white border-l-4 border-indigo-600 pl-4">
              Metadata & Details
            </h2>
            <NovelDetailMap novel={novel} />
          </div>
        </div>

      </div>
    </div>
  );
};

const StatBox = ({ label, value, color = 'text-white' }) => (
  <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

export default NovelDetail;