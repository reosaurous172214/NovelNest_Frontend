import { useEffect, useState } from "react";

export default function Alert({
  msg,
  type = "error",
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);

  const bgStyles = {
    error: "bg-red-500/10 text-red-200",
    success: "bg-green-500/10 text-green-200",
    info: "bg-blue-500/10 text-blue-200",
  };

  useEffect(() => {
    setVisible(true);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    const removeTimer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className=" fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`
          min-w-[380px] max-w-[540px]
          px-6 py-4
          rounded-2xl
          backdrop-blur-xl
          shadow-2xl
          
          ${bgStyles[type]}
          text-center font-medium tracking-wide
          transition-all duration-300 ease-out
          ${visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-3 scale-95"}
        `}
      >
        {msg}
      </div>
    </div>
  );
}
