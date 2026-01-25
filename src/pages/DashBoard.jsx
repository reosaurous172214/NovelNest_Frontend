import {
  FaBookOpen,
  FaUserCircle,
  FaPlus,
  FaHeart,
  FaChevronRight,
  FaHistory,
  FaTerminal,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// --- SUB-COMPONENT: StatLink ---

// --- MAIN COMPONENT ---
const Dashboard = () => {
  const [username, setUsername] = useState("Reader");
  const [profilePicture, setProfilePicture] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const StatLink = ({ to, icon, title, desc, color }) => (
    <Link to={to} className="group relative block h-full">
      <div
        className={`relative h-full bg-[#0a0a0a]/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] transition-all duration-500 hover:border-blue-500/40 hover:-translate-y-2`}
      >
        <div
          className={`${color} text-4xl mb-6 group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1 font-['Inter']">
          {title}
        </h3>
        <p className="font-['JetBrains_Mono'] text-[8px] text-gray-600 uppercase tracking-[0.2em]">
          {desc}
        </p>
      </div>
    </Link>
  );

  // --- SUB-COMPONENT: ActivityItem ---
  const ActivityItem = ({ type, text, novel, time, status }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-white/10 transition-all group cursor-pointer">
      <div className="flex items-center gap-6 overflow-hidden">
        <div className="hidden md:flex flex-col items-center">
          <div className="w-[2px] h-4 bg-white/5" />
          <div
            className={`w-3 h-3 rounded-full border-2 ${type === "READ" ? "border-blue-500" : type === "FAVORITE" ? "border-red-500" : "border-green-500"} bg-[#020202]`}
          />
          <div className="w-[2px] h-4 bg-white/5" />
        </div>

        <div className="min-w-0 font-['Inter']">
          <p className="text-[13px] md:text-base text-gray-500 font-medium">
            {text}{" "}
            <span className="text-white font-[900] uppercase italic tracking-tighter">
              “{novel}”
            </span>
          </p>
          <div className="flex items-center gap-3 mt-1.5 font-['JetBrains_Mono']">
            <span className="text-[8px] text-blue-500/60 font-bold uppercase">
              {status}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span className="md:hidden text-[8px] text-gray-700">{time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <span className="hidden md:block font-['JetBrains_Mono'] text-[10px] font-black text-gray-700 tracking-tighter italic">
          {time}
        </span>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
          <FaChevronRight
            className="text-gray-700 group-hover:text-white"
            size={12}
          />
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    const userData = localStorage.getItem("data");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsername(user.username || "Reader");
        setProfilePicture(user.profilePicture);
        if (user._id) fetchUserActivity(user._id);
      } catch (e) {
        console.error("Failed to parse user data");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserActivity = async (userId) => {
    try {
      setLoading(true);
      // NOTE: Ensure your backend endpoint matches this exactly
      const res = await axios.get(
        `http://localhost:5000/api/users/${userId}/activity`,
      );
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error("Failed to fetch intelligence logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const glassBase =
    "bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 shadow-2xl";
  const monoFont =
    "font-['JetBrains_Mono'] text-[9px] tracking-[0.4em] uppercase antialiased text-blue-500/60";

  return (
    <div className="relative min-h-screen bg-[#020202] text-white pt-32 px-6 pb-20 overflow-hidden font-['Inter']">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between p-10 mb-12 rounded-[3rem] ${glassBase}`}
        >
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-8 h-[1px] bg-blue-500" />
              <span className={monoFont}>Verified User Session</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter uppercase italic leading-none">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                {username}
              </span>
            </h1>
          </div>

          <div className="mt-8 md:mt-0 relative group">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition duration-700" />
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="relative w-24 h-24 rounded-3xl object-cover border border-white/20 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
              />
            ) : (
              <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                <FaUserCircle className="text-5xl text-gray-700" />
              </div>
            )}
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatLink
            to="/novels"
            icon={<FaBookOpen />}
            title="The Archive"
            desc="Continue Reading"
            color="text-blue-500"
          />
          <StatLink
            to="/favorites"
            icon={<FaHeart />}
            title="Library"
            desc="Favorite Dossiers"
            color="text-red-500"
          />
          <StatLink
            to="/create"
            icon={<FaPlus />}
            title="Publish"
            desc="Create Entry"
            color="text-green-500"
          />
          <StatLink
            to="/profile"
            icon={<FaTerminal />}
            title="Systems"
            desc="User Configuration"
            color="text-gray-500"
          />
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div className={`rounded-[3rem] p-10 ${glassBase}`}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                <FaHistory />
              </div>
              <div>
                <h2 className="text-2xl font-[900] tracking-tight uppercase italic leading-none">
                  Recent Activity
                </h2>
                <p className={monoFont + " mt-2"}>Intelligence Log Feed</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-600 font-mono text-[10px] animate-pulse">
                Synchronizing logs...
              </p>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  type={activity.actionType}
                  text={activity.description}
                  novel={activity.novelTitle}
                  time={activity.timestamp}
                  status={activity.statusLabel}
                />
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-600 font-mono text-[10px] uppercase">
                  No intelligence logs found for this session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
