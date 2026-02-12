import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuCircleCheck, LuLoader, LuArrowRight } from "react-icons/lu";
import Confetti from "react-confetti"; // Optional: npm install react-confetti

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, verified
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Simulate a brief delay to allow the Webhook to finish its work
    const timer = setTimeout(() => {
      setStatus("verified");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      {status === "verified" && <Confetti numberOfPieces={200} recycle={false} />}
      
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500 opacity-10 blur-3xl rounded-full"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-center">
            {status === "processing" ? (
              <div className="p-5 bg-blue-500/10 rounded-full animate-spin">
                <LuLoader size={48} className="text-blue-500" />
              </div>
            ) : (
              <div className="p-5 bg-green-500/10 rounded-full animate-bounce">
                <LuCircleCheck size={48} className="text-green-500" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
              {status === "processing" ? "Verifying Registry..." : "Purchase Complete!"}
            </h1>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              {status === "processing" 
                ? "We're confirming your transaction with the Stripe gateway." 
                : "Your NestCoins have been successfully added to your ledger."}
            </p>
          </div>

          {status === "verified" && (
            <button
              onClick={() => navigate("/wallet")}
              className="w-full group flex items-center justify-center gap-3 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)]"
            >
              Return to Wallet
              <LuArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest pt-4">
            Order Reference: {sessionId?.slice(-12)}
          </p>
        </div>
      </div>
    </div>
  );
}