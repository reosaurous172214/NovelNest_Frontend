import {
  FaBookOpen,
  FaUserCircle,
  FaPlus,
  FaHeart,
  FaHistory,
  FaList,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useActivity from "../hooks/useActivity";
import { useAuth } from "../context/AuthContext";

/* ---------------- STAT CARD ---------------- */
const MetricCard = ({ icon, label, value }) => (
  <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] opacity-95 backdrop-blur-3xl hover:border-[var(--accent)] transition-all duration-300 flex items-center gap-4 group">
    <div className="text-2xl text-[var(--accent)] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left">
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold">
        {label}
      </p>
      <h3 className="text-2xl font-black mt-1 text-[var(--text-main)]">
        {value}
      </h3>
    </div>
  </div>
);

/* ---------------- QUICK ACTION ---------------- */
const QuickAction = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] hover:border-[var(--accent)]/50 transition-all w-full sm:w-auto justify-center group"
  >
    <span className="text-[var(--accent)] group-hover:scale-110 transition-transform">
      {icon}
    </span>
    <span className="text-sm font-bold uppercase tracking-tight text-[var(--text-main)]">
      {label}
    </span>
    <FaChevronRight className="ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </Link>
);

/* ---------------- ACTIVITY ITEM ---------------- */
const ActivityItem = ({ type, text, novel, time }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all group">
    <div className="mb-2 sm:mb-0 text-left">
      <p className="text-sm text-[var(--text-dim)] group-hover:text-[var(--text-main)] transition-colors">
        {text}{" "}
        <span className="text-[var(--text-main)] font-bold">“{novel}”</span>
      </p>
      <span className="text-[10px] text-[var(--text-dim)] opacity-50 uppercase tracking-wide">
        {time}
      </span>
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
      {type}
    </span>
  </div>
);

/* ---------------- ACTIVITY TEXT HELPER ---------------- */
const mapActivity = (a) => {
  switch (a.action) {
    case "READ_CHAPTER":
      return `Read chapter "${a.meta?.chapterTitle || "Unknown"}" of `;
    case "READ_NOVEL":
      return `Started reading `;
    case "FAVORITE_NOVEL":
      return `Added to favorites: `;
    case "BOOKMARK_NOVEL":
      return `Bookmarked `;
    case "CREATE_NOVEL":
      return `Created a new book: `;
    case "UPDATE_NOVEL":
      return `Updated `;
    case "DELETE_NOVEL":
      return `Deleted `;
    case "PUBLISH_NOVEL":
      return `Published `;
    default:
      return `Interacted with `;
  }
};

/* ---------------- MAIN DASHBOARD ---------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { activities = [], loading: activitiesLoading, hours = "0.0" } = useActivity();
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const username = user?.username || "Reader";
  const profilePicture = user?.profilePicture;

  const filtered = filter === "ALL"
    ? activities
    : activities.filter((a) => a.action.startsWith(filter));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-28 px-4 sm:px-6 lg:px-12 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-10 lg:space-y-14">
        
        {/* WELCOME SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-center p-8 lg:p-12 rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl relative overflow-hidden">
          <div className="text-center lg:text-left relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
              User Dashboard
            </p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">
              Welcome back, <span className="text-[var(--accent)]">{username}</span>
            </h1>
          </div>

          <div className="relative group z-10">
            {profilePicture ? (
              <img
                src={profilePicture.startsWith("http") ? profilePicture : `${process.env.REACT_APP_API_URL}${profilePicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border border-[var(--border)] shadow-xl"
              />
            ) : (
              <FaUserCircle className="text-7xl text-[var(--text-dim)]" />
            )}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard icon={<FaBookOpen />} label="Books Read" value="128" />
          <MetricCard icon={<FaHeart />} label="Favorites" value="42" />
          <MetricCard icon={<FaClock />} label="Time Reading" value={`${hours}h`} />
          <MetricCard icon={<FaList />} label="Published Works" value="6" />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <QuickAction to="/novels" icon={<FaBookOpen />} label="Continue Reading" />
          <QuickAction to="/novel/create" icon={<FaPlus />} label="Create Novel" />
          <QuickAction to="/novel/author/me" icon={<FaList />} label="My Library" />
          <QuickAction to="/library" icon={<FaHistory />} label="Reading History" />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="p-6 sm:p-10 rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div className="text-left">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 text-[var(--text-main)]">
                <FaHistory className="text-[var(--accent)]" />
                Recent Activity
              </h2>
              <div className="h-1 w-12 bg-[var(--accent)] mt-2 rounded-full"></div>
            </div>

            {/* RESPONSIVE FILTER BAR - Aligned right on desktop */}
            <div className="flex w-full md:justify-end">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar bg-[var(--bg-primary)] p-1.5 rounded-xl border border-[var(--border)] w-full md:w-auto">
                {["ALL", "READ", "FAVORITE", "PUBLISH"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                      filter === f
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activitiesLoading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-center">
                <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">Loading activity...</p>
              </div>
            ) : filtered.length ? (
              <div className="space-y-4 animate-in fade-in duration-700">
                {filtered.map((a, index) => (
                  <ActivityItem
                    key={index}
                    type={a.action.replace("_", " ")}
                    text={mapActivity(a)}
                    novel={a.meta?.novelTitle || "Unknown"}
                    time={new Date(a.createdAt).toLocaleString()}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30">
                <FaList size={40} className="mx-auto mb-4" />
                <p className="text-xs uppercase tracking-widest font-bold">No activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}