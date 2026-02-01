import { useEffect, useState } from "react";

export default function Alert({
  msg,
  type = "error", // success, info, error
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Dynamic styles that work with your light/dark themes
  const typeStyles = {
    error: "border-red-500/30 text-red-500 bg-[var(--bg-secondary)] shadow-red-500/10",
    success: "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-secondary)] shadow-[var(--accent-glow)]",
    info: "border-blue-500/30 text-blue-500 bg-[var(--bg-secondary)] shadow-blue-500/10",
  };

  const progressStyles = {
    error: "bg-red-500",
    success: "bg-[var(--accent)]",
    info: "bg-blue-500",
  };

  useEffect(() => {
    // Show the alert
    setVisible(true);

    // Update the progress bar "time feature"
    const intervalTime = 10;
    const step = (intervalTime / duration) * 100;
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, intervalTime);

    // Slide out slightly before closing
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    // Call the close function
    const removeTimer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div
        className={`
          relative min-w-[320px] max-w-[90vw]
          px-8 py-5
          rounded-2xl
          border backdrop-blur-2xl
          shadow-2xl overflow-hidden
          
          ${typeStyles[type]}
          
          text-center font-bold text-sm uppercase tracking-[0.15em]
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-8 scale-90"}
        `}
      >
        <div className="flex items-center justify-center gap-3">
          {msg}
        </div>

        {/* TIME FEATURE: Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10">
          <div 
            className={`h-full transition-all linear ${progressStyles[type]}`}
            style={{ width: `${progress}%`, transitionDuration: '10ms' }}
          />
        </div>
      </div>
    </div>
  );
}