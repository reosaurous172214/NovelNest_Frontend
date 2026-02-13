import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCrown, FaFire, FaTrophy, FaBolt,
  FaMagic, FaCheckCircle, FaPlay, FaHeart,
  FaUserSecret, FaRocket, FaClock, FaEye
} from "react-icons/fa";
import axios from "axios";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop";

const handleImageError = (e) => {
  e.target.src = FALLBACK_IMAGE;
};

/* ================================================================
   BANNER (UI balanced only)
================================================================ */

const Banner = ({ spotlight }) => {
  const bgImage =
    spotlight?.coverImage && spotlight.coverImage.startsWith("http")
      ? spotlight.coverImage
      : FALLBACK_IMAGE;

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-[var(--border-color)] shadow-xl flex flex-col lg:flex-row items-center min-h-[340px] lg:min-h-[420px] bg-[var(--bg-secondary)]">

      {/* Glow */}
      <img
        src={bgImage}
        onError={handleImageError}
        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-125"
        alt=""
      />

      <div className="absolute inset-0 backdrop-blur-2xl bg-[var(--bg-primary)]/40" />

      {/* Text */}
      <div className="relative z-10 flex-1 p-6 sm:p-10 lg:p-14 space-y-5">

        <span className="text-xs font-medium text-[var(--accent)] tracking-wide">
          Featured Story
        </span>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold leading-tight line-clamp-2">
          {spotlight.title}
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] line-clamp-3 max-w-xl">
          {spotlight.description}
        </p>

        <Link
          to={`/novel/${spotlight._id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium shadow hover:opacity-90 active:scale-95 transition"
        >
          <FaPlay size={12} />
          Start Reading
        </Link>
      </div>

      {/* Image */}
      <div className="relative z-10 hidden lg:block w-[300px] xl:w-[340px] p-6">
        <img
          src={spotlight.coverImage}
          onError={handleImageError}
          className="rounded-2xl shadow-lg object-cover aspect-[2/3]"
          alt={spotlight.title}
        />
      </div>
    </div>
  );
};

/* ================================================================
   DATA PANEL (clean cards)
================================================================ */

const DataPanel = ({ title, icon, data }) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">

    <div className="flex items-center gap-3 mb-5">
      <span className="text-[var(--accent)] text-lg">{icon}</span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>

    <div className="space-y-3">
      {data?.map((n, i) => (
        <Link
          to={`/novel/${n._id}`}
          key={n._id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-primary)]/60 transition"
        >
          <span className="text-xs w-4 opacity-50">{i + 1}</span>

          <img
            src={n.coverImage}
            onError={handleImageError}
            className="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)]"
            alt=""
          />

          <p className="text-sm truncate">{n.title}</p>
        </Link>
      ))}
    </div>
  </div>
);

/* ================================================================
   OPERATION SECTOR (responsive grid fixed)
================================================================ */

const OperationSector = ({ title, sub, icon, data }) => (
  <section className="space-y-6">

    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <span className="text-[var(--accent)]">{icon}</span>
          {title}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">{sub}</p>
      </div>

      <Link
        to="/novels"
        className="text-xs text-[var(--accent)] font-medium hover:underline"
      >
        See all
      </Link>
    </div>

    {/* RESPONSIVE FIXED GRID */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

      {data?.map((novel) => (
        <Link key={novel._id} to={`/novel/${novel._id}`} className="group">

          <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm">

            <img
              src={novel.coverImage}
              onError={handleImageError}
              className="aspect-[3/4] object-cover group-hover:scale-105 transition"
              alt=""
            />
          </div>

          <p className="text-xs mt-2 truncate group-hover:text-[var(--accent)] transition">
            {novel.title}
          </p>
        </Link>
      ))}
    </div>
  </section>
);

/* ================================================================
   MAIN HOME (same logic)
================================================================ */

const Home = () => {
  const [data, setData] = useState({
    spotlight: null, popular: [], highlyRated: [], trending: [],
    action: [], fantasy: [], romance: [], mystery: [], scifi: [],
    completed: [], recent: [], sleeper: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/novels`,
          { params: { limit: 120, sortBy: "views" } }
        );

        const all = res.data.novels || [];

        const validNovels = all.filter(
          (n) =>
            n.coverImage &&
            n.coverImage.startsWith("http") &&
            !n.coverImage.toLowerCase().includes("no-image")
        );

        const pool = validNovels.length > 0 ? validNovels : all;

        const randomSpotlight =
          pool[Math.floor(Math.random() * Math.min(pool.length, 20))];

        setData({
          spotlight: randomSpotlight,
          popular: all.slice(0, 5),
          highlyRated: [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5),
          trending: all.slice(5, 10),
          action: all.filter(n => n.genres?.includes("action")).slice(0, 6),
          fantasy: all.filter(n => n.genres?.includes("fantasy")).slice(0, 6),
          romance: all.filter(n => n.genres?.includes("romance")).slice(0, 6),
          mystery: all.filter(n => n.genres?.includes("mystery")).slice(0, 6),
          scifi: all.filter(n => n.genres?.includes("sci-fi")).slice(0, 6),
          completed: all.filter(n => n.status === "completed").slice(0, 6),
          recent: [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
          sleeper: all.filter(n => (n.views || 0) < 1000 && (n.rating || 0) >= 4).slice(0, 6)
        });

      }catch(e){
        console.log("Error Fetching Novels",e);
      }
       finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-28 px-4">

      <div className="max-w-7xl mx-auto space-y-14">

        {data.spotlight && <Banner spotlight={data.spotlight} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DataPanel title="Most Popular" icon={<FaFire />} data={data.popular} />
          <DataPanel title="Top Rated" icon={<FaCrown />} data={data.highlyRated} />
          <DataPanel title="Trending" icon={<FaTrophy />} data={data.trending} />
        </div>

        <OperationSector title="New Releases" sub="Fresh drops" icon={<FaClock />} data={data.recent} />
        <OperationSector title="Action" sub="Fast & intense" icon={<FaBolt />} data={data.action} />
        <OperationSector title="Fantasy" sub="Magic worlds" icon={<FaMagic />} data={data.fantasy} />
        <OperationSector title="Romance" sub="Heart stories" icon={<FaHeart />} data={data.romance} />
        <OperationSector title="Sci-Fi" sub="Future tech" icon={<FaRocket />} data={data.scifi} />
        <OperationSector title="Mystery" sub="Secrets inside" icon={<FaUserSecret />} data={data.mystery} />
        <OperationSector title="Hidden Gems" sub="Underrated picks" icon={<FaEye />} data={data.sleeper} />
        <OperationSector title="Completed" sub="Finished" icon={<FaCheckCircle />} data={data.completed} />

      </div>
    </div>
  );
};

export default Home;
