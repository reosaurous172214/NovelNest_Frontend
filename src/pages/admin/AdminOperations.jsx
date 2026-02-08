import { useState, useEffect } from "react";
import { LuShieldAlert, LuHistory, LuSearch, LuFilter, LuActivity } from "react-icons/lu";
import { getAllLogs } from "../../api/apiAdmin";

export default function AdminAuditLedger() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, MODERATION, SYSTEM

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getAllLogs();
        const registryData = Array.isArray(data) ? data : (data?.data || []);
        setLogs(registryData);
      } catch (e) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Filter logic based on the action type
  const filteredLogs = logs.filter(log => {
    if (filter === "ALL") return true;
    if (filter === "MODERATION") return log.actionType.includes("BAN") || log.actionType.includes("DELETE");
    if (filter === "SYSTEM") return !log.actionType.includes("BAN") && !log.actionType.includes("DELETE");
    return true;
  });

  if (loading) return (
    <div className="p-10 text-xs font-bold text-[var(--text-dim)] animate-pulse tracking-widest uppercase">
      Accessing System History...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-main)]">
            <LuHistory className="text-[var(--accent)]" /> Audit Trail
          </h2>
          <p className="text-[var(--text-dim)] text-sm">Historical record of all administrative actions.</p>
        </div>

        <div className="flex bg-[var(--bg-secondary)] border border-[var(--border)] p-1 rounded-lg shadow-sm">
          {["ALL", "MODERATION", "SYSTEM"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                filter === type 
                ? "bg-[var(--accent)] text-white shadow-sm" 
                : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                <th className="p-4 font-bold text-[var(--text-dim)] uppercase tracking-wider">Admin User</th>
                <th className="p-4 font-bold text-[var(--text-dim)] uppercase tracking-wider">Action Protocol</th>
                <th className="p-4 font-bold text-[var(--text-dim)] uppercase tracking-wider">Target</th>
                <th className="p-4 font-bold text-[var(--text-dim)] uppercase tracking-wider">Timestamp</th>
                <th className="p-4 font-bold text-[var(--text-dim)] uppercase tracking-wider text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[var(--bg-primary)] transition-colors">
                    <td className="p-4 font-bold text-[var(--text-main)]">
                      {typeof log.adminId === "object" ? log.adminId?.username : "System Agent"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase border ${
                        log.actionType.includes("BAN") 
                        ? "bg-red-500/10 text-red-500 border-red-500/20" 
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}>
                        {log.actionType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[var(--text-dim)] opacity-70">
                      {String(log.targetId).slice(-8)}
                    </td>
                    <td className="p-4 text-[var(--text-dim)]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-right italic text-[var(--text-dim)] max-w-[200px] truncate">
                      {log.reason || "Standard Operation"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-[var(--text-dim)]">
                    No records found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}