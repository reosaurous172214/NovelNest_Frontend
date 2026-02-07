import { useEffect, useState } from "react";
import { LuBook, LuClock, LuUsers, LuIndianRupee, LuActivity, LuRefreshCw } from "react-icons/lu";
import { fetchAdminStats } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext";

export default function AdminDashboard() {
  const { showAlert } = useAlert();
  const [stats, setStats] = useState({
    totalNovels: 0,
    pendingRequests: 0,
    newUsersToday: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        showAlert(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LuRefreshCw className="animate-spin text-[var(--accent)]" size={40} />
      </div>
    );
  }

  const cards = [
    { title: "Total Novels", value: stats.totalNovels, icon: LuBook, color: "text-[var(--accent)]" },
    { title: "Pending Requests", value: stats.pendingRequests, icon: LuClock, color: "text-yellow-500" },
    { title: "New Users (Today)", value: stats.newUsersToday, icon: LuUsers, color: "text-emerald-500" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: LuIndianRupee, color: "text-[var(--text-main)]" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--accent)] bg-opacity-10 rounded-lg text-[var(--accent)]">
          <LuActivity size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">System Overview</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="p-6 rounded-[1.5rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl hover:border-[var(--accent)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[var(--text-dim)] text-[10px] font-black uppercase tracking-[0.2em]">{card.title}</p>
              <card.icon className={`${card.color} opacity-80 group-hover:scale-110 transition-transform`} size={20} />
            </div>
            <p className={`text-3xl font-black tracking-tighter ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <LuActivity className="text-[var(--accent)]" size={18} />
          <h3 className="font-black text-sm uppercase tracking-widest">Recent Operations</h3>
        </div>
        
        {/* Placeholder logic for logs */}
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[var(--border)] rounded-[1.5rem]">
           <p className="text-[var(--text-dim)] text-xs font-bold uppercase tracking-widest opacity-50">
            No live telemetry detected
          </p>
        </div>
      </div>
    </div>
  );
}