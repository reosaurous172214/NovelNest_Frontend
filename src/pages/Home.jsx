import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCrown, FaFire, FaTrophy, FaChevronRight, FaBolt,
  FaMagic, FaTerminal, FaShieldAlt, FaDatabase, FaGlobe, FaChartLine,
} from "react-icons/fa";
import axios from "axios";

/* ================================================================
   1. SUB-COMPONENTS (Defined first to prevent ReferenceErrors)
   ================================================================
*/

const DataPanel = ({ title, icon, data, accent }) => {
  const accentColor = accent === "blue" ? "text-blue-500" : accent === "yellow" ? "text-yellow-500" : "text-purple-500";
  return (
    <div className="bg-[#080808]/50 border border-white/5 rounded-[2rem] p-8 relative group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${accentColor}`}>{icon}</div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {data?.map((n, i) => (
          <Link to={`/novel/${n._id}`} key={n._id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all group/item">
            <span className="font-mono text-[10px] font-black text-gray-700 w-5">0{i + 1}</span>
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5">
              <img src={n.coverImage} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-gray-400 group-hover/item:text-white truncate uppercase tracking-tight">{n.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const OperationSector = ({ title, sub, icon, data }) => (
  <div className="mb-24">
    <div className="flex items-end justify-between mb-12 px-2">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-2xl text-white">{icon}</div>
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{title}</h2>
          <p className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.4em] mt-2">{sub}</p>
        </div>
      </div>
      <Link to="/novels" className="text-[10px] font-black text-gray-600 hover:text-white flex items-center gap-2 tracking-[0.2em] uppercase transition-all">
        Full Access <FaChevronRight size={8} />
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {data?.map((novel) => (
        <Link key={novel._id} to={`/novel/${novel._id}`} className="group relative">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 group-hover:border-blue-500/30 transition-all duration-500 bg-[#080808]">
            <img src={novel.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h4 className="text-[10px] font-black text-white uppercase truncate tracking-tight group-hover:text-blue-400 transition-colors">{novel.title}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

/* ================================================================
   2. MAIN HOME COMPONENT
   ================================================================
*/

const Home = () => {
  const [data, setData] = useState({
    spotlight: null,
    popular: [],
    highlyRated: [],
    action: [],
    fantasy: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/novels", {
          params: { limit: 60, sortBy: "views" },
        });
        
        const all = res.data.novels || [];

        // --- FILTER FOR VALID IMAGES ONLY ---
        const validImagePool = all.filter(novel => 
            novel.coverImage && 
            !novel.coverImage.includes("placeholder") && 
            !novel.coverImage.includes("not-found") &&
            novel.coverImage.startsWith("http")
        );

        // Pick random spotlight from the validated pool
        const randomSpotlight = validImagePool.length > 0 
            ? validImagePool[Math.floor(Math.random() * Math.min(validImagePool.length, 25))]
            : all[0];

        setData({
          spotlight: randomSpotlight,
          popular: all.slice(0, 5),
          highlyRated: [...all].sort((a, b) => b.rating - a.rating).slice(0, 5),
          action: all.filter((n) => n.genres?.includes("action")).slice(0, 6),
          fantasy: all.filter((n) => n.genres?.includes("fantasy")).slice(0, 6),
        });
      } catch (err) {
        console.error("Archive Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-blue-500 animate-pulse">SYNCING ARCHIVE...</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-white py-24 overflow-x-hidden antialiased font-sans">
      
      {/* --- REFINED APEX BANNER (2/3 Height) --- */}
      <section className="relative pt-8 pb-10 px-6 max-w-7xl mx-auto z-10">
        {data.spotlight && (
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center h-auto md:h-[420px]">
            
            {/* Dynamic Background Glow */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-1000">
              <img src={data.spotlight.coverImage} className="w-full h-full object-cover blur-[80px] scale-110" alt="" />
            </div>

            {/* Banner Text Content */}
            <div className="relative z-20 flex-1 p-6 md:p-12 space-y-4">
              <div className="flex items-center gap-3">
                <FaCrown className="text-yellow-500 size-4" />
                <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-blue-400/70">Verified Top Reads</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.95] text-white drop-shadow-2xl">
                {data.spotlight.title}
              </h1>

              <p className="text-gray-400 text-xs md:text-sm font-serif italic line-clamp-2 max-w-xl opacity-80">
                {data.spotlight.description}
              </p>

              <div className="flex gap-4 pt-2">
                <Link to={`/novel/${data.spotlight._id}`} className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                  Continue Reading
                </Link>
                <div className="hidden sm:flex px-4 py-3 border border-white/10 rounded-xl items-center gap-2 bg-black/40 backdrop-blur-md">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <span className="font-mono text-[8px] uppercase tracking-widest text-gray-500">Enter the Cafe</span>
                </div>
              </div>
            </div>

            {/* Right Side Image (2/3 Height Fit) */}
            <div className="relative z-20 w-full md:w-[320px] h-full hidden md:block overflow-hidden">
                <img 
                  src={data.spotlight.coverImage} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" 
                  alt={data.spotlight.title} 
                />
                {/* Fade effect between image and text area */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]" />
            </div>
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          <DataPanel title="Popularity Matrix" icon={<FaFire />} data={data.popular} accent="blue" />
          <DataPanel title="Rating Registry" icon={<FaCrown />} data={data.highlyRated} accent="yellow" />
          <DataPanel title="Trending Feed" icon={<FaTrophy />} data={data.popular.slice().reverse()} accent="purple" />
        </section>

        <OperationSector title="Combat Intelligence" sub="Class: Action" icon={<FaBolt />} data={data.action} />
        <OperationSector title="Arcane Repository" sub="Class: Fantasy" icon={<FaMagic />} data={data.fantasy} />
      </main>
    </div>
  );
};

export default Home;