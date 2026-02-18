import { useState, useEffect, useCallback, useMemo } from "react";
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
  const API_URL = process.env.REACT_APP_API_URL;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const { showAlert } = useAlert();

  /* ================= FETCH LOGS ================= */

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllLogs();
      setLogs(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Fetch logs error:", error);
      showAlert("Failed to load activity logs.", "error");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /* ================= DELETE LOG(S) ================= */

  const executeDeletion = async () => {
    const isBulk = !selectedLogId;
    setIsConfirmOpen(false);

    try {
      setLoading(true);

      await axios.delete(`${API_URL}/api/admin/logs`, {
        data: isBulk
          ? { clearAll: true }
          : { logIds: [selectedLogId] },
        ...getHeaders()
      });

      showAlert(
        isBulk
          ? "All logs cleared successfully."
          : "Log entry deleted successfully.",
        "success"
      );

      // Optimistic UI update
      if (isBulk) {
        setLogs([]);
      } else {
        setLogs((prev) => prev.filter((log) => log._id !== selectedLogId));
      }
    } catch (error) {
      console.error("Delete logs error:", error);
      showAlert("Could not delete logs.", "error");
    } finally {
      setLoading(false);
      setSelectedLogId(null);
    }
  };

  /* ================= FILTERING ================= */

  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return logs;

    return logs.filter((log) => {
      const isModeration =
        log.actionType?.includes("BAN") ||
        log.actionType?.includes("DELETE");

      if (filter === "MODERATION") return isModeration;
      if (filter === "SYSTEM") return !isModeration;

      return true;
    });
  }, [logs, filter]);

  /* ================= HELPERS ================= */

  const buildImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 p-12 text-sm font-medium text-[var(--text-dim)]">
        <LuActivity
          className="animate-spin text-[var(--accent)]"
          size={24}
        />
        <span>Loading activity logs...</span>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[var(--border)] pb-8 pt-10">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-[var(--text-main)]">
            <LuHistory className="text-[var(--accent)]" size={28} />
            Activity Logs
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

          {/* CLEAR ALL */}
          <button
            onClick={() => {
              setSelectedLogId(null);
              setIsConfirmOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
          >
            <LuTrash2 size={14} />
            Clear All
          </button>

          {/* REFRESH */}
          <button
            onClick={fetchLogs}
            className="p-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-dim)] hover:text-[var(--accent)] transition-all"
          >
            <LuRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* LOG LIST */}
      <div className="grid gap-4">
        {filteredLogs.length === 0 ? (
          <div className="py-20 text-center bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-2xl">
            <LuHistory
              size={40}
              className="mx-auto text-[var(--border)] mb-4"
            />
            <p className="text-sm font-medium text-[var(--text-dim)]">
              No activity logs found yet.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const {
              _id,
              adminId,
              actionType,
              timestamp,
              reason,
              targetMetadata,
              targetId
            } = log;

            const displayName =
              targetMetadata?.name || "Unknown Target";

            const displayImage =
              targetId?.profilePicture ||
              targetId?.coverImage ||
              targetMetadata?.image;

            const date = new Date(timestamp);

            const isModeration =
              actionType?.includes("BAN") ||
              actionType?.includes("DELETE");

            return (
              <div
                key={_id}
                className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl hover:border-[var(--accent)]/50 transition-all flex flex-col lg:flex-row items-center gap-6"
              >

                {/* DELETE BUTTON */}
                <button
                  onClick={() => {
                    setSelectedLogId(_id);
                    setIsConfirmOpen(true);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-dim)] hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <LuTrash2 size={14} />
                </button>

                {/* ADMIN */}
                <div className="flex items-center gap-4 min-w-[240px] w-full lg:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                    {adminId?.profilePicture ? (
                      <img
                        src={buildImageUrl(adminId.profilePicture)}
                        className="w-full h-full object-cover"
                        alt="Admin"
                      />
                    ) : (
                      <LuUser size={20} className="text-[var(--text-dim)]" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      {adminId?.username || "System"}
                    </p>

                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isModeration
                          ? "text-rose-500 border-rose-500/20 bg-rose-500/5"
                          : "text-blue-500 border-blue-500/20 bg-blue-500/5"
                      }`}
                    >
                      {actionType?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* TARGET + TIME */}
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-8 w-full lg:border-l lg:border-[var(--border)] lg:pl-8">

                  {/* TARGET */}
                  <div className="min-w-[180px]">
                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-2">
                      Target
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
                        {displayImage ? (
                          <img
                            src={buildImageUrl(displayImage)}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <LuBook size={14} className="text-[var(--text-dim)]" />
                        )}
                      </div>

                      <span className="text-sm font-semibold text-[var(--text-main)] truncate max-w-[140px]">
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* TIME */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-2">
                      Timestamp
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)]">
                      <LuClock className="text-[var(--accent)]" size={14} />
                      <span>{date.toLocaleDateString()}</span>
                      <span className="text-[var(--text-dim)] text-xs">
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REASON */}
                <div className="w-full lg:w-1/3 bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-dim)] font-medium italic">
                    {reason
                      ? `"${reason}"`
                      : "No specific reason provided."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedLogId(null);
        }}
        onConfirm={executeDeletion}
        title={selectedLogId ? "Delete Entry" : "Clear All Logs"}
        message={
          selectedLogId
            ? "Are you sure you want to delete this log entry?"
            : "This will permanently delete all activity history. Proceed?"
        }
        confirmText={selectedLogId ? "Delete" : "Clear Everything"}
        type="danger"
      />
    </div>
  );
}
