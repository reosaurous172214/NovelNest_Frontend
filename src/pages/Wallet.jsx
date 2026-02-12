import React, { useEffect, useState } from "react";
import { LuArrowUpRight, LuArrowDownLeft, LuWallet } from "react-icons/lu";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getHeaders } from "../getItems/getAuthItems";
import WalletDisplay from "../components/balance/WalletDisplay";
import { loadStripe } from "@stripe/stripe-js";

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
        console.error("Registry Sync Failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, [refreshUser]);

  const handleBuyCoins = async (amount, price) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-checkout`,
        { amount, price },
        getHeaders(),
        { withCredentials: true }
      );
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Billing Error:", err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
      <div className="text-[var(--accent)] text-xs font-medium uppercase animate-pulse">
        Initializing Neural Ledger...
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-28 space-y-8 min-h-screen">
      
      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8 shadow-lg">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent)] opacity-5 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-medium uppercase text-[var(--accent)] mb-2">Available Assets</p>
                <div className="flex items-center gap-3">
                  {/* size 28 is the 'balanced' sweet spot for this card */}
                  <WalletDisplay balance={wallet?.balance || 0} size={28} />
                </div>
              </div>
              <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl border border-[var(--accent)]/20">
                <LuWallet size={20} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[9px] font-medium text-[var(--text-dim)] uppercase mb-3">Recharge Protocol</p>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleBuyCoins(amt, amt / 100)}
                    className="px-5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[11px] font-bold text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-95"
                  >
                    +{amt} NC
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl flex flex-col justify-center">
            <p className="text-[10px] font-medium text-[var(--text-dim)] uppercase mb-1">Lifetime In</p>
            <p className="text-2xl font-bold text-green-500">+{wallet?.totalEarned || 0}</p>
          </div>
          <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl flex flex-col justify-center">
            <p className="text-[10px] font-medium text-[var(--text-dim)] uppercase mb-1">Lifetime Out</p>
            <p className="text-2xl font-bold text-red-500">-{wallet?.totalSpent || 0}</p>
          </div>
        </div>
      </div>

      {/* --- LEDGER SECTION --- */}
      <div className="space-y-4 text-left">
        <h3 className="flex items-center gap-3 text-[11px] font-bold text-[var(--text-main)] uppercase">
          <span className="w-8 h-[1px] bg-[var(--accent)]"></span>
          Registry Logs
        </h3>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[var(--bg-primary)]/50 border-b border-[var(--border)] text-[10px] font-medium text-[var(--text-dim)] uppercase">
                  <th className="p-4">Sync</th>
                  <th className="p-4">Operation</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Registry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.amount > 0 ? "text-green-500 bg-green-500/5" : "text-red-500 bg-red-500/5"}`}>
                          {tx.amount > 0 ? <LuArrowUpRight size={16} /> : <LuArrowDownLeft size={16} />}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[var(--text-main)] text-[13px] mb-0.5">{tx.description}</p>
                        <p className="text-[10px] text-[var(--text-dim)] uppercase opacity-60 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className={`p-4 font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono text-[var(--text-dim)] bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border)]">
                          {tx.balanceAfter} NC
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-[var(--text-dim)] text-[10px] font-medium uppercase italic">No logs on record</td>
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