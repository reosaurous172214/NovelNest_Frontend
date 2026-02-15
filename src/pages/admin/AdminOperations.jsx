import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LuHistory,
  LuActivity,
  LuUser,
  LuClock,
  LuRefreshCw,
  LuTrash2,
  LuX
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
      
      showAlert(isBulk ? "Audit logs cleared." : "Log entry deleted.", "success");
      fetchLogs();
    } catch (err) {
      showAlert("Delete action failed.", "error");
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
      <div className="flex items-center gap-2 p-12 text-xs font-semibold text-[var(--text-dim)] animate-pulse uppercase font-sans">
        <LuActivity className="animate-spin" /> Loading history...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-[var(--text-main)] pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <LuHistory className="text-[var(--accent)]" size={20} /> Activity Logs
          </h2>
          <p className="text-[var(--text-dim)] text-xs mt-1">
            Historical snapshot of administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-[var(--border)]">
            <button 
              onClick={() => { setSelectedLogId(null); setIsConfirmOpen(true); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/5 border border-rose-500/20 rounded-lg text-rose-500 text-[10px] font-bold uppercase hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <LuTrash2 size={12} /> Clear All
            </button>
            <button onClick={fetchLogs} className="p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-dim)] hover:text-[var(--accent)] transition-all">
              <LuRefreshCw size={14} />
            </button>
          </div>

          <div className="flex bg-[var(--bg-secondary)] border border-[var(--border)] p-1 rounded-lg">
            {["ALL", "MODERATION", "SYSTEM"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  filter === type ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVITY CARDS */}
      <div className="grid grid-cols-1 gap-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            // METADATA LOGIC: Determine if the target was a user or novel
            const displayName =  log.targetMetadata?.name || "Unknown Entity";
            const displayImage = log.targetId?.profilePicture || log.targetId?.coverImage || log.targetMetadata?.image;

            return (
              <div key={log._id} className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] p-4 rounded-xl transition-all hover:border-[var(--accent)] shadow-sm">
                
                <button 
                  onClick={() => { setSelectedLogId(log._id); setIsConfirmOpen(true); }}
                  className="absolute top-3 right-3 p-1 rounded-md text-[var(--text-dim)] hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <LuX size={14} />
                </button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* ADMIN INFO */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                      {log.adminId?.profilePicture ? (
                        <img 
                          src={log.adminId.profilePicture.startsWith("http") ? log.adminId.profilePicture : `${process.env.REACT_APP_API_URL}${log.adminId.profilePicture}`} 
                          className="w-full h-full object-cover" alt="" 
                        />
                      ) : <LuUser size={16} className="text-[var(--text-dim)]" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{log.adminId?.username || "System"}</h3>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          log.actionType.includes("BAN") || log.actionType.includes("DELETE") ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}>{log.actionType.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* TARGET & TIME */}
                  <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 w-full md:border-l border-[var(--border)] md:pl-6">
                    <div className="space-y-1 min-w-[160px]">
                      <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase opacity-60">Target Subject</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {displayImage ? (
                            <img 
                              src={displayImage.startsWith("http") ? displayImage : `${process.env.REACT_APP_API_URL}${displayImage}`} 
                              className="w-full h-full object-cover" 
                              alt="" 
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                            />
                          ) : null}
                          <LuUser size={12} className={`${displayImage ? 'hidden' : 'block'} text-[var(--text-dim)]`} />
                        </div>
                        <span className={`text-xs font-semibold text-[var(--text-main)] italic ${!log.targetId ? 'opacity-70' : ''}`}>
                          {displayName}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase opacity-60">Timestamp</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-[var(--text-dim)]">
                        <LuClock size={12} />
                        {new Date(log.timestamp).toLocaleDateString()}
                        <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* REASON */}
                  <div className="w-full md:w-auto md:text-right">
                    <p className="text-[11px] text-[var(--text-dim)] italic truncate max-w-[200px] ml-auto">
                      {log.reason ? `"${log.reason}"` : "Default Entry"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-sm font-semibold text-[var(--text-dim)]">No activity found.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setSelectedLogId(null); }}
        onConfirm={executeDeletion}
        title={selectedLogId ? "Delete Log" : "Clear History"}
        message={selectedLogId ? "Remove this specific entry?" : "Delete all activity records permanently?"}
        confirmText={selectedLogId ? "Delete" : "Clear All"}
        type="danger"
      />
    </div>
  );
}