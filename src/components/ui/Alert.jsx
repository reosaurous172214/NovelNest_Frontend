import { useEffect, useState } from "react";
import { 
  HiCheckCircle, 
  HiExclamation, 
  HiInformationCircle, 
  HiX 
} from "react-icons/hi"; 

export default function Alert({
  msg,
  type = "error",
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Professional Slate-based Palette
  // Deep tints for light mode, rich muted jewel tones for dark mode
  const typeConfig = {
    success: {
      container: "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534] dark:bg-[#064e3b] dark:text-[#d1fae5] dark:border-[#059669]/30",
      progress: "bg-[#22c55e]",
      icon: <HiCheckCircle className="text-xl text-[#22c55e]" />,
    },
    error: {
      container: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b] dark:bg-[#451a1a] dark:text-[#fee2e2] dark:border-[#dc2626]/30",
      progress: "bg-[#ef4444]",
      icon: <HiExclamation className="text-xl text-[#ef4444]" />,
    },
    info: {
      container: "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af] dark:bg-[#1e3a8a] dark:text-[#dbeafe] dark:border-[#2563eb]/30",
      progress: "bg-[#3b82f6]",
      icon: <HiInformationCircle className="text-xl text-[#3b82f6]" />,
    },
  };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const exitTimer = setTimeout(() => setIsExiting(true), duration - 500);
    const closeTimer = setTimeout(() => onClose?.(), duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-full flex justify-center px-4">
      <div
        className={`
          relative flex items-center gap-4 
          min-w-[320px] max-w-[480px] 
          p-4 rounded-xl border shadow-xl backdrop-blur-xl
          ${typeConfig[type].container}
          
          /* Using a cleaner spring transition for a premium feel */
          transition-all duration-500 cubic-bezier(0.2, 1, 0.3, 1)
          ${visible && !isExiting
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-95"}
        `}
      >
        {/* Visual Indicator */}
        <div className="flex-shrink-0">
          {typeConfig[type].icon}
        </div>

        {/* Content */}
        <div className="flex-grow font-semibold text-[13px] tracking-tight leading-snug uppercase">
          {msg}
        </div>

        {/* Dismiss Trigger */}
        <button 
          onClick={() => setIsExiting(true)}
          className="pointer-events-auto p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-opacity"
        >
          <HiX className="text-lg opacity-40 hover:opacity-100" />
        </button>

        {/* Time Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/5 dark:bg-white/5 overflow-hidden rounded-b-xl">
          <div 
            className={`h-full ${typeConfig[type].progress} transition-all linear`}
            style={{ 
              width: visible ? "0%" : "100%", 
              transitionDuration: `${duration}ms` 
            }}
          />
        </div>
      </div>
    </div>
  );
}