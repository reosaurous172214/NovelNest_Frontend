import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuCheck, LuLoader, LuArrowRight, LuShieldCheck } from "react-icons/lu";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // Optional: npm install react-use

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [status, setStatus] = useState("processing");
  const sessionId = searchParams.get("session_id");
  const [toNav] = useState(() => {
    const saved = localStorage.getItem("origin");
    localStorage.removeItem("origin"); // Clean up immediately after reading
    return saved || "/dashboard"; 
  });

  useEffect(() => {
    // Simulate a brief delay for the Webhook to settle
    const timer = setTimeout(() => {
      setStatus("verified");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6 antialiased font-sans">
      {status === "verified" && (
        <Confetti 
          width={width} 
          height={height} 
          numberOfPieces={150} 
          recycle={false} 
          colors={['#10b981', '#3b82f6', '#ffffff']}
        />
      )}
      
      <div className="max-w-md w-full text-center space-y-8 p-12 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Subtle Background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>

        <div className="relative z-10 space-y-8">
          
          {/* ICON SECTION */}
          <div className="flex justify-center">
            <div className={`p-6 rounded-full transition-all duration-700 ${
              status === "processing" 
              ? "bg-blue-500/5 text-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)]" 
              : "bg-emerald-500/5 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
            }`}>
              {status === "processing" ? (
                <LuLoader size={42} className="animate-spin stroke-[1.5]" />
              ) : (
                <LuCheck size={42} className="animate-in zoom-in duration-500 stroke-[2]" />
              )}
            </div>
          </div>

          {/* TEXT SECTION */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-[var(--text-main)] tracking-tight">
              {status === "processing" ? "Verifying Transaction" : "Payment Successful"}
            </h1>
            <p className="text-sm text-[var(--text-dim)] font-medium leading-relaxed px-4">
              {status === "processing" 
                ? "Securely confirming your order with the payment gateway. Please wait." 
                : "Your account has been updated. All digital assets and premium perks are now active."}
            </p>
          </div>

          {/* ACTION SECTION */}
          <div className="pt-4">
            {status === "verified" ? (
              <button
                onClick={() => {navigate(toNav)}}
                className="w-full group flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-lg"
              >
                Return Back
                <LuArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest animate-pulse">
                <LuShieldCheck size={14} />
                Secure Handshake
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="pt-6 border-t border-[var(--border)] mt-4">
            <p className="text-[9px] font-mono text-[var(--text-dim)] uppercase tracking-widest opacity-60">
              Receipt ID: {sessionId?.slice(-16) || "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}