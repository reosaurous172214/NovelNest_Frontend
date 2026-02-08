import { useEffect, useState } from "react";
import { LuBook, LuUsers, LuIndianRupee, LuActivity, LuRefreshCw, LuShieldAlert, LuCircleCheck ,LuChevronRight} from "react-icons/lu";
import { fetchAdminStats } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext.jsx";

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
        showAlert("Could not sync dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <LuRefreshCw className="animate-spin text-[var(--accent)]" size={32} />
    </div>
  );

  const cards = [
    { title: "Total Novels", value: stats.totalNovels, icon: LuBook, color: "text-[var(--accent)]" },
    { title: "Pending Actions", value: stats.pendingRequests, icon: LuShieldAlert, color: "text-amber-500" },
    { title: "New Members", value: stats.newUsersToday, icon: LuUsers, color: "text-emerald-500" },
    { title: "Revenue Ledger", value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: LuIndianRupee, color: "text-[var(--text-main)]" },
  ];

  return (
    <div className="space-y-10">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--accent)] bg-opacity-10 rounded-lg text-[var(--accent)] border border-[var(--accent)]/20">
          <LuActivity size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-[var(--text-dim)] text-xs font-medium uppercase tracking-widest">Real-time platform status</p>
        </div>
      </div>
      
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm hover:border-[var(--accent)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest">{card.title}</p>
              <card.icon className={`${card.color} opacity-70 group-hover:scale-110 transition-transform`} size={18} />
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY PLACEHOLDER */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <LuActivity className="text-[var(--accent)]" size={16} /> Recent Operations
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--border)] rounded-lg bg-[var(--bg-primary)]/50">
             <LuCircleCheck className="text-[var(--border)] mb-2" size={32} />
             <p className="text-[var(--text-dim)] text-xs font-bold uppercase tracking-widest opacity-40">
              All systems operational
            </p>
          </div>
        </div>

        {/* QUICK TOOLS */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 shadow-sm">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Quick Tools</h3>
          <div className="space-y-3">
            <button className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all text-left flex items-center justify-between group">
              Generate Report <LuChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all text-left flex items-center justify-between group">
              Clear System Cache <LuChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider hover:border-red-500/50 text-red-500 transition-all text-left flex items-center justify-between group">
              Maintenance Mode <LuChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}