import axios from 'axios';
import React, { useState } from 'react';
import { LuCheck, LuZap, LuShieldCheck, LuCrown, LuInfo, LuLoader } from "react-icons/lu";
import { getHeaders } from '../getItems/getAuthItems';

export default function Subscription() {
  const [processingId, setProcessingId] = useState(null);

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "4.99",
      period: "per month",
      savings: null,
      features: ["60% Discount on all purchases", "Completely Ad-free", "Early access to releases"],
      recommended: false
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: "12.99",
      period: "every 3 months",
      savings: "Save 15%",
      features: ["60% Discount on all purchases", "Completely Ad-free", "Early access to releases", "Exclusive member badge"],
      recommended: false
    },
    {
      id: "half-yearly",
      name: "Semi-Annual",
      price: "24.99",
      period: "every 6 months",
      savings: "Save 20%",
      features: ["60% Discount on all purchases", "Completely Ad-free", "Early access to releases", "Priority Support"],
      recommended: false
    },
    {
      id: "yearly",
      name: "Annual",
      price: "39.99",
      period: "per year",
      savings: "Save 40%",
      features: ["60% Discount on all purchases", "Completely Ad-free", "Early access to releases", "Full premium perks", "2 Bonus novels included"],
      recommended: true
    }
  ];

  const handleSubscription = async (planId) => {
    try {
      setProcessingId(planId);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/subscription`,
        { plan: planId },
        getHeaders()
      );
      
      if (res.data.url) {
        localStorage.setItem("origin","/subscription");
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error("Subscription Error:", e);
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- PAGE HEADER --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-[var(--accent)]">
            <LuCrown size={14} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Premium Member</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Upgrade Your Experience</h1>
          <p className="text-[var(--text-dim)] text-sm font-medium leading-relaxed">
            Join our premium community to enjoy an exclusive <span className="text-[var(--text-main)] font-semibold">60% discount</span> on all digital content and a completely ad-free experience.
          </p>
        </div>

        {/* --- PRICING CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col bg-[var(--bg-secondary)] border ${
                plan.recommended ? 'border-[var(--accent)] shadow-xl scale-[1.02]' : 'border-[var(--border)] shadow-sm'
              } rounded-3xl p-8 transition-all hover:border-[var(--accent)]/50`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Best Value
                </div>
              )}

              <div className="space-y-1 mb-8 text-left">
                <h3 className="text-sm font-semibold uppercase text-[var(--text-dim)] tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tighter">${plan.price}</span>
                  <span className="text-[10px] font-medium text-[var(--text-dim)] uppercase">{plan.period}</span>
                </div>
                {plan.savings && (
                  <span className="inline-block text-[9px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase mt-2">
                    {plan.savings}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-left">
                    <LuCheck className="text-[var(--accent)] mt-0.5 shrink-0" size={16} />
                    <span className="text-xs font-medium text-[var(--text-dim)] leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                disabled={processingId !== null}
                onClick={() => handleSubscription(plan.id)} 
                className={`w-full py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  plan.recommended 
                  ? 'bg-[var(--accent)] text-white shadow-md hover:brightness-110' 
                  : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)]'
                } disabled:opacity-50`}
              >
                {processingId === plan.id ? (
                  <LuLoader className="animate-spin" size={14} />
                ) : (
                  'Select Plan'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* --- TRUST FOOTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[var(--border)]">
          <div className="flex items-center gap-4 p-4">
            <LuShieldCheck className="text-[var(--accent)]" size={20} />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase">Secure Payment</p>
              <p className="text-[11px] text-[var(--text-dim)]">Encrypted by Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <LuZap className="text-[var(--accent)]" size={20} />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase">Instant Access</p>
              <p className="text-[11px] text-[var(--text-dim)]">No waiting period</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <LuInfo className="text-[var(--accent)]" size={20} />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase">Flexible Billing</p>
              <p className="text-[11px] text-[var(--text-dim)]">Cancel whenever you want</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}