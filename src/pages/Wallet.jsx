import React, { useEffect, useState } from "react";
import { LuArrowUpRight, LuArrowDownLeft, LuShieldCheck, LuHistory, LuCirclePlus, LuDownload } from "react-icons/lu";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getHeaders } from "../getItems/getAuthItems";
import BalanceDisplay from "../components/balance/WalletDisplay";

export default function WalletDashboard() {
  const { wallet, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const txRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments/history`, 
          getHeaders(),
          { withCredentials: true }
        );
        setTransactions(txRes.data);
        await refreshUser();
      } catch (err) {
        console.error("Secure data sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, [refreshUser]);

  // Handle CSV Export
  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const headers = ["Date,Description,Amount,Balance After\n"];
    const rows = transactions.map(tx => {
      return `${new Date(tx.createdAt).toLocaleDateString()},${tx.description},${tx.amount},${tx.balanceAfter}\n`;
    });
    
    const blob = new Blob([headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `statement_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBuyCoins = async (amount, price) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-checkout`,
        { amount, price },
        getHeaders(),
        { withCredentials: true }
      );
      if (data.url) {
        localStorage.setItem("origin","/wallet");
        window.location.href = data.url;
        
      }
    } catch (err) {
      console.error("Payment processing error:", err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--text-dim)] text-[9px] font-semibold uppercase tracking-widest">Connecting</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-28 md:py-24 space-y-6 min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)]">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div className="space-y-1 text-left">
          <h1 className="text-xl font-semibold tracking-tight">Account Statement</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
              <LuShieldCheck size={10} /> Secure
            </span>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:bg-[var(--bg-primary)] transition-all"
        >
          <LuDownload size={14} /> Export CSV
        </button>
      </div>

      {/* --- BALANCE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-left">
            <p className="text-[9px] font-bold uppercase text-[var(--text-dim)] tracking-widest mb-2">Available Balance</p>
            <div className="flex items-baseline gap-2">
              <BalanceDisplay balance={wallet?.balance || 0} size={32} />
              <span className="text-xs font-semibold text-[var(--text-dim)] opacity-50 uppercase">NC</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase flex items-center gap-1.5">
              <LuCirclePlus size={12} className="text-[var(--accent)]" /> Add Funds
            </p>
            <div className="flex gap-2">
              {[500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleBuyCoins(amt, amt / 100)}
                  className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] text-[10px] font-semibold transition-all active:scale-95"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl text-left">
            <p className="text-[8px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">Total In</p>
            <p className="text-lg font-semibold text-emerald-500">+{wallet?.totalEarned || 0}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl text-left">
            <p className="text-[8px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">Total Out</p>
            <p className="text-lg font-semibold text-red-500">-{wallet?.totalSpent || 0}</p>
          </div>
        </div>
      </div>

      {/* --- TRANSACTIONS --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
          <LuHistory className="text-[var(--accent)]" size={14} />
          <h3 className="text-[10px] font-semibold uppercase tracking-widest">Recent Activity</h3>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-[var(--bg-primary)]/40 text-[9px] font-bold text-[var(--text-dim)] uppercase">
                  <th className="px-6 py-3 border-b border-[var(--border)]">Type</th>
                  <th className="px-6 py-3 border-b border-[var(--border)]">Details</th>
                  <th className="px-6 py-3 border-b border-[var(--border)] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          tx.amount > 0 
                          ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" 
                          : "text-red-500 bg-red-500/5 border-red-500/10"
                        }`}>
                          {tx.amount > 0 ? <LuArrowUpRight size={14} /> : <LuArrowDownLeft size={14} />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-[9px] text-[var(--text-dim)] uppercase opacity-60">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className={`px-6 py-4 font-semibold text-right ${tx.amount > 0 ? "text-emerald-500" : "text-[var(--text-main)]"}`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-[9px] uppercase tracking-widest opacity-30">Empty Activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}