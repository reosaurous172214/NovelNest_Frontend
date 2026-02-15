import React, { useState } from 'react';
import { Lock, Wallet, ArrowRight, Zap } from 'lucide-react';

const NovelPaymentOverlay = ({ novel, userBalance, onUnlock }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Adjusted to 2000 to match your unlockSingleNovel backend controller
  const cost = 2000; 

  const canAfford = userBalance >= cost;

  const handleUnlockClick = async () => {
    try {
      setIsProcessing(true);
      // Ensure we pass the ID to the parent handler
      await onUnlock(novel._id || novel.id);
    } catch (error) {
      console.error("Unlock action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full py-10 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
      <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-3xl border border-yellow-500/30 shadow-2xl text-center">
        
        {/* Icon Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 mb-6 border border-yellow-500/20">
          <Lock className="text-yellow-500 w-8 h-8" />
        </div>

        {/* FIX: Rendered novel.title instead of the whole object */}
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
          Unlock Full Novel
        </h2>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Unlock every current and future chapter of <span className="text-white font-semibold">"{novel?.title}"</span> permanently.
        </p>

        {/* Pricing Card */}
        <div className="bg-gray-700/30 rounded-2xl p-5 mb-8 flex justify-between items-center border border-white/5">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Cost</span>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500 w-4 h-4" />
              <span className="text-white font-bold text-lg">{cost}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Balance</span>
            <span className={`font-bold ${canAfford ? 'text-gray-300' : 'text-red-500'}`}>
              {userBalance} Coins
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {canAfford ? (
          <button
            onClick={handleUnlockClick}
            disabled={isProcessing}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-800 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-xs tracking-widest shadow-xl shadow-yellow-500/10"
          >
            {isProcessing ? "Processing..." : "Confirm Unlock"}
            {!isProcessing && <ArrowRight className="w-5 h-5" />}
          </button>
        ) : (
          <button
            onClick={() => window.location.href = '/wallet'}
            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest"
          >
            <Wallet className="w-5 h-5" />
            Insufficient Balance - Top Up
          </button>
        )}

        <p className="mt-6 text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] opacity-50">
          70% of earnings support the author
        </p>
      </div>
    </div>
  );
};

export default NovelPaymentOverlay;