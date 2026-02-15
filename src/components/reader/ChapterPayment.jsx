import React, { useState } from 'react';
import { Lock, Wallet, ArrowRight, Zap } from 'lucide-react';

const ChapterPaymentOverlay = ({ chapter, userBalance, onUnlock }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const cost = 50; 

  const canAfford = userBalance >= cost;

  // Added a local handler to manage the loading state
  const handleUnlockClick = async () => {
    setIsProcessing(true);
    try {
      await onUnlock(chapter._id);
    } finally {
      // We wrap in finally to ensure processing stops 
      // even if the parent function hits an error
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full py-20 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
      <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-2xl border border-yellow-500/50 shadow-2xl text-center">
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
          <Lock className="text-yellow-500 w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Unlock Chapter {chapter.chapterNumber}
        </h2>
        <p className="text-gray-400 mb-6">
          To continue reading "{chapter.title}", please unlock this chapter using NestCoins.
        </p>

        <div className="bg-gray-700/50 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-500 fill-yellow-500 w-5 h-5" />
            <span className="text-white font-semibold">Cost: {cost} NestCoins</span>
          </div>
          <div className="text-sm text-gray-400">
            Balance: {userBalance}
          </div>
        </div>

        {canAfford ? (
          <button
            onClick={handleUnlockClick} // Updated to use the local handler
            disabled={isProcessing}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Unlocking..." : "Unlock Now"}
            {!isProcessing && <ArrowRight className="w-5 h-5" />}
          </button>
        ) : (
          <button
            onClick={() => window.location.href = '/wallet'}
            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Wallet className="w-5 h-5" />
            Insufficient Balance - Top Up
          </button>
        )}

        <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">
          70% of earnings support the author
        </p>
      </div>
    </div>
  );
};

export default ChapterPaymentOverlay;