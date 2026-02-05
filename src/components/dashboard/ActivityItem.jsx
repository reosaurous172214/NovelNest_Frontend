import {
  FaRocket,
  FaPlusCircle,
  FaCheckCircle,
  FaBookOpen
} from "react-icons/fa";
const ActivityItem = ({ activity }) => {
  const getActionIcon = (type) => {
    switch (type) {
      case "READ_CHAPTER": return <FaBookOpen className="text-blue-500" />;
      case "CREATE_CHAPTER": return <FaPlusCircle className="text-emerald-500" />;
      case "AUTHOR_REQUEST": return <FaRocket className="text-orange-400" />;
      default: return <FaCheckCircle className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="flex gap-3 md:gap-4 text-left group">
        <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center text-[10px] md:text-xs border border-[var(--border)] group-hover:border-[var(--accent)] transition-all">
          {getActionIcon(activity.actionType || activity.action)}
        </div>
        <div className="flex-1 min-w-0 border-b border-[var(--border)] pb-3 md:pb-4 group-last:border-0">
            <p className="text-[9px] md:text-[10px] font-bold text-[var(--text-main)] truncate">
              {activity.meta?.novelTitle || "System Process"}
            </p>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[7px] md:text-[8px] text-[var(--text-dim)] uppercase font-black tracking-tighter">
                {(activity.actionType || activity.action || "LOG").replace(/_/g, ' ')}
              </span>
              <span className="text-[6px] md:text-[7px] font-black opacity-30 italic">
                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
        </div>
    </div>
  );
};
export default ActivityItem;