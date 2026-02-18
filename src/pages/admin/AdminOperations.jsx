import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LuHistory,
  LuActivity,
  LuUser,
  LuClock,
  LuRefreshCw,
  LuTrash2,
  LuBook
} from "react-icons/lu";
import { getAllLogs } from "../../api/apiAdmin";
import { getHeaders } from "../../getItems/getAuthItems";
import { useAlert } from "../../context/AlertContext";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function AdminAuditLedger() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null); 
  const { showAlert } = useAlert();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllLogs();
      const registryData = Array.isArray(data) ? data : data?.data || [];
      setLogs(registryData);
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const executeDeletion = async () => {
    const isBulk = !selectedLogId;
    setIsConfirmOpen(false);
    
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/logs`, {
        data: isBulk ? { clearAll: true } : { logIds: [selectedLogId] },
        ...getHeaders()
      });
      
      showAlert(isBulk ? "All logs cleared successfully." : "Log entry deleted.", "success");
      fetchLogs();
    } catch (err) {
      showAlert("Could not delete logs.", "error");
    } finally {
      setLoading(false);
      setSelectedLogId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    if (filter === "MODERATION")
      return log.actionType.includes("BAN") || log.actionType.includes("DELETE");
    if (filter === "SYSTEM")
      return !log.actionType.includes("BAN") && !log.actionType.includes("DELETE");
    return true;
  });

  if (loading)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 p-12 text-sm font-medium text-[var(--text-dim)]">
        <LuActivity className="animate-spin text-[var(--accent)]" size={24} />
        <span>Loading activity logs...</span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[var(--border)] pb-8 pt-10">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[var(--text-main)]">
            <LuHistory className="text-[var(--accent)]" size={28} /> Activity Logs
          </h2>
          <p className="text-[var(--text-dim)] text-sm mt-1">
            Track all administrative actions taken on the platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FILTERS */}
          <div className="flex bg-[var(--bg-secondary)] border border-[var(--border)] p-1 rounded-xl shadow-sm">
            {["ALL", "MODERATION", "SYSTEM"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === type 
                  ? "bg-[var(--accent)] text-white shadow-md" 
                  : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <button 
            onClick={() => { setSelectedLogId(null); setIsConfirmOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
          >
            <LuTrash2 size={14} /> Clear All
          </button>
          <button 
            onClick={fetchLogs} 
            className="p-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-dim)] hover:text-[var(--accent)] transition-all"
          >
            <LuRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* LOG LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const displayName = log.targetMetadata?.name || "Unknown Target";
            const displayImage = log.targetId?.profilePicture || log.targetId?.coverImage || log.targetMetadata?.image;

            return (
              <div 
                key={log._id} 
                className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl hover:border-[var(--accent)]/50 transition-all flex flex-col lg:flex-row items-center gap-6"
              >
                {/* DELETE BUTTON */}
                <button 
                  onClick={() => { setSelectedLogId(log._id); setIsConfirmOpen(true); }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-dim)] hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <LuTrash2 size={14} />
                </button>

                {/* ADMIN INFO */}
                <div className="flex items-center gap-4 min-w-[240px] w-full lg:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                    {log.adminId?.profilePicture ? (
                      <img 
                        src={log.adminId.profilePicture.startsWith("http") ? log.adminId.profilePicture : `${process.env.REACT_APP_API_URL}${log.adminId.profilePicture}`} 
                        className="w-full h-full object-cover" alt="Admin" 
                      />
                    ) : <LuUser size={20} className="text-[var(--text-dim)]" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)]">{log.adminId?.username || "System"}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      log.actionType.includes("BAN") || log.actionType.includes("DELETE") 
                      ? "text-rose-500 border-rose-500/20 bg-rose-500/5" 
                      : "text-blue-500 border-blue-500/20 bg-blue-500/5"
                    }`}>
                      {log.actionType.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* TARGET & TIME DETAILS */}
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-8 w-full lg:border-l lg:border-[var(--border)] lg:pl-8">
                  {/* TARGET */}
                  <div className="min-w-[180px]">
                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-2">Target</p>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
                        {displayImage ? (
                          <img 
                            src={displayImage.startsWith("http") ? displayImage : `${process.env.REACT_APP_API_URL}${displayImage}`} 
                            className="w-full h-full object-cover" alt="" 
                          />
                        ) : <LuBook size={14} className="text-[var(--text-dim)]" />}
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-main)] truncate max-w-[140px]">
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* TIME */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-2">Timestamp</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)]">
                      <LuClock className="text-[var(--accent)]" size={14} />
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                      <span className="text-[var(--text-dim)] text-xs">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REASON MESSAGE */}
                <div className="w-full lg:w-1/3 bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-dim)] font-medium italic">
                    {log.reason ? `"${log.reason}"` : "No specific reason provided."}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-2xl">
            <LuHistory size={40} className="mx-auto text-[var(--border)] mb-4" />
            <p className="text-sm font-medium text-[var(--text-dim)]">No activity logs found yet.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setSelectedLogId(null); }}
        onConfirm={executeDeletion}
        title={selectedLogId ? "Delete Entry" : "Clear All Logs"}
        message={selectedLogId ? "Are you sure you want to delete this log entry?" : "This will permanently delete all activity history. Proceed?"}
        confirmText={selectedLogId ? "Delete" : "Clear Everything"}
        type="danger"
      />
    </div>
  );
}