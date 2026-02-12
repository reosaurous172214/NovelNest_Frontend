import React from "react";
import { useNavigate } from "react-router-dom";
import { LuXCircle, LuArrowLeft, LuLifeBuoy } from "react-icons/lu";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500 opacity-10 blur-3xl rounded-full"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-center">
            <div className="p-5 bg-red-500/10 rounded-full">
              <LuXCircle size={48} className="text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
              Payment Cancelled
            </h1>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              The transaction was not completed. No charges were made to your account, and your ledger remains unchanged.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/wallet")}
              className="flex items-center justify-center gap-3 py-4 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] rounded-2xl font-bold transition-all hover:border-[var(--accent)] active:scale-95"
            >
              <LuArrowLeft size={20} />
              Back to Wallet
            </button>
            
            <button
              onClick={() => window.location.href = "mailto:support@novelnest.com"}
              className="flex items-center justify-center gap-3 py-4 text-[var(--text-dim)] text-xs font-bold hover:text-[var(--text-main)] transition-colors"
            >
              <LuLifeBuoy size={16} />
              Need help with billing?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}