import React from "react";
import { FaTerminal, FaShieldAlt, FaCodeBranch, FaClock } from "react-icons/fa";

const Footer = () => {
  // CLEAN READABILITY TOKENS
  // Using a clean sans-serif stack for maximum readability
  const bodyFont = "font-sans antialiased";
  const headingStyle = "text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 block";
  const linkStyle = "text-[14px] font-medium text-gray-400 hover:text-blue-500 transition-colors duration-300";

  return (
    <footer className={`relative bg-[#020202] border-t border-white/5 pt-20 pb-10 overflow-hidden ${bodyFont}`}>
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- 1. PRIMARY ARCHITECTURE --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Dossier */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <FaTerminal size={18} />
               </div>
               <h2 className="text-2xl font-black tracking-tighter uppercase text-white">NovelHub</h2>
            </div>
            <p className="text-[15px] leading-relaxed max-w-sm text-gray-400">
              The premier digital archive for high-level narrative intelligence. 
              We curate, index, and secure the world's most complex chronicles for the modern reader.
            </p>
          </div>

          {/* Navigation Registry */}
          <div>
            <span className={headingStyle}>Navigation</span>
            <ul className="space-y-4">
              <li><a href="/novels" className={linkStyle}>Browse Records</a></li>
              <li><a href="/rankings" className={linkStyle}>Apex Board</a></li>
              <li><a href="/genres" className={linkStyle}>Sector Maps</a></li>
            </ul>
          </div>

          {/* System Protocols */}
          <div>
            <span className={headingStyle}>Protocols</span>
            <ul className="space-y-4">
              <li><a href="/terms" className={linkStyle}>Service Terms</a></li>
              <li><a href="/privacy" className={linkStyle}>Data Privacy</a></li>
              <li><a href="/safety" className={linkStyle}>Safety Guide</a></li>
            </ul>
          </div>
        </div>

        {/* --- 2. TECHNICAL STATUS BAR --- */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 border-y border-white/5 mb-10 gap-6">
           <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                 <FaShieldAlt className="text-blue-500/40" size={12} />
                 <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                 <FaCodeBranch className="text-gray-700" size={12} />
                 <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">v2.6.0 Stable</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                 <FaClock className="text-gray-700" size={12} />
                 <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{new Date().toLocaleTimeString()} UTC</span>
              </div>
           </div>
           <div className="text-[11px] font-black text-blue-500/60 uppercase tracking-[0.3em]">
              Connection Stable
           </div>
        </div>

        {/* --- 3. FINAL CREDENTIALS --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[12px] text-gray-500 font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="text-white font-bold">NovelHub Archive</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Architect</span>
            <div className="bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-xl shadow-2xl">
               <span className="text-blue-400 font-black text-[13px] uppercase tracking-wide">
                 Saurabh Sharma
               </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;