import { useEffect, useState, useCallback } from "react"; // 1. Added useCallback
import { 
  LuBook, LuUsers, LuIndianRupee, LuActivity, LuRefreshCw, 
  LuShieldAlert, LuCircleCheck, LuChevronRight, LuDownload, LuFileText 
} from "react-icons/lu";
import { fetchAdminStats, fetchAllUsers, fetchAllTransactions } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const { showAlert } = useAlert();
  const [stats, setStats] = useState({
    totalNovels: 0,
    pendingRequests: 0,
    newUsersToday: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // 2. Wrap getStats in useCallback to create a stable reference
  const getStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      showAlert("Could not sync dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]); // showAlert is stable from Context, making this function stable

  // 3. getStats is now a safe and exhaustive dependency
  useEffect(() => {
    getStats();
  }, [getStats]);

  // PDF EXPORT LOGIC ... (Exactly as you have it)
  const exportUserDatabase = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllUsers();
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("USER MASTER REGISTRY", 14, 20);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()} | Total Users: ${data.length}`, 14, 28);

      autoTable(doc, {
        startY: 35,
        head: [['Username', 'Email', 'NestCoins', 'Status']],
        body: data.map(u => [
          u.username, 
          u.email, 
          u.nestCoins || 0, 
          u.isBanned ? "RESTRICTED" : "ACTIVE"
        ]),
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 }
      });

      doc.save(`NovelHub_Users_${Date.now()}.pdf`);
      showAlert("User database exported successfully", "success");
    } catch (err) {
      showAlert("User export failed", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const exportTransactionLedger = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllTransactions();
      const doc = new jsPDF('l');
      doc.setFontSize(18);
      doc.text("TRANSACTION LEDGER", 14, 20);

      autoTable(doc, {
        startY: 35,
        head: [['Date', 'Transaction ID', 'User', 'Type', 'Amount']],
        body: data.map(t => [
          new Date(t.createdAt).toLocaleString(),
          t._id,
          t.user?.username || "N/A",
          t.type.toUpperCase(),
          `${t.amount} Coins`
        ]),
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 }
      });

      doc.save(`NovelHub_Ledger_${Date.now()}.pdf`);
      showAlert("Financial ledger exported successfully", "success");
    } catch (err) {
      showAlert("Transaction export failed", "error");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <LuRefreshCw className="animate-spin text-[var(--accent)]" size={32} />
    </div>
  );

  const cards = [
    { title: "Total Novels", value: stats.totalNovels, icon: LuBook, color: "text-[var(--accent)]" },
    { title: "Pending Actions", value: stats.pendingRequests, icon: LuShieldAlert, color: "text-amber-500" },
    { title: "New Members", value: stats.newUsersToday, icon: LuUsers, color: "text-emerald-500" },
    { title: "Wallet Volume", value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: LuIndianRupee, color: "text-[var(--text-main)]" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-[var(--accent)]/10 rounded-2xl text-[var(--accent)] border border-[var(--accent)]/20 shadow-inner">
            <LuActivity size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Terminal</h2>
            <p className="text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-[0.2em]">Operational Telemetry</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            disabled={isExporting}
            onClick={exportUserDatabase}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-[var(--accent)] transition-all disabled:opacity-50"
          >
            {isExporting ? <LuRefreshCw className="animate-spin" /> : <LuDownload size={14} />}
            User Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="p-6 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all group text-left">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest">{card.title}</p>
              <card.icon className={`${card.color} opacity-80 group-hover:scale-110 transition-transform`} size={20} />
            </div>
            <p className={`text-3xl font-bold tracking-tighter ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm text-left">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3">
              <LuActivity className="text-[var(--accent)]" size={18} /> System Diagnostics
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-[var(--bg-primary)]/40">
             <LuCircleCheck className="text-emerald-500 mb-4 opacity-40" size={48} />
             <p className="text-[var(--text-dim)] text-[11px] font-bold uppercase tracking-widest">
               No anomalies detected in the current cycle
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm text-left">
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-8">Data Protocols</h3>
          <div className="space-y-4">
            <button 
              onClick={exportUserDatabase}
              className="w-full p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest hover:border-[var(--accent)] transition-all flex items-center justify-between group"
            >
              <span className="flex items-center gap-3"><LuFileText className="text-[var(--accent)]" /> User Database PDF</span>
              <LuChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={exportTransactionLedger}
              className="w-full p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest hover:border-emerald-500 transition-all flex items-center justify-between group"
            >
              <span className="flex items-center gap-3"><LuIndianRupee className="text-emerald-500" /> Transaction Ledger</span>
              <LuChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}