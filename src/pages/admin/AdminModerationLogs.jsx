import { useState, useEffect } from "react"; // Added useEffect import
import { getAllLogs } from "../../api/apiAdmin";
import { FaShieldAlt, FaHistory } from "react-icons/fa";

const AdminModerationLogs = () => {
  const [modLogs, setModLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState([]);

  useEffect(() => {
    // Create an internal async function
    // AdminModerationLogs.jsx
    const fetchLogs = async () => {
  try {
    setLoading(true);
    const data = await getAllLogs();
    const logs = Array.isArray(data) ? data : (data?.data || []);
    
    setModLogs(logs);
  } catch (e) {
    console.error("Sync error", e);
    setModLogs([]); // Always fallback to an empty array
  } finally {
    setLoading(false);
  }
};

    fetchLogs();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-[10px] uppercase font-black opacity-20 animate-pulse">
        Accessing Logs...
      </div>
    );

  return (
    <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl shadow-xl animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-8 border-b border-[var(--border)] pb-4">
        <FaShieldAlt className="text-[var(--accent)]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">
          System Moderation Records
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[8px] font-black uppercase text-[var(--text-dim)] tracking-widest px-4">
              <th className="pb-4 px-4">Admin</th>
              <th className="pb-4">Action</th>
              <th className="pb-4">Target ID</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4 text-right px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium">
            {modLogs.map((log) => (
              <tr
                key={log._id}
                className="bg-[var(--bg-primary)] hover:bg-[var(--accent)]/5 transition-colors border border-[var(--border)] rounded-xl group"
              >
                <td className="py-4 px-4 rounded-l-xl font-bold text-[var(--accent)]">
                  {/* Check if it's an object with username, else use the ID string */}
                  {typeof log.adminId === "object"
                    ? log.adminId?.username
                    : String(log.adminId)}
                </td>
                <td>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      log.actionType === "BAN_USER"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-orange-500/10 text-orange-500"
                    }`}
                  >
                    {log.actionType.replace("_", " ")}
                  </span>
                </td>
                <td className="font-mono text-[var(--text-dim)]">
                  {/* Force convert to string just in case Mongoose returned an ObjectId object */}
                  {String(log.targetId)}
                </td>
                <td className="max-w-[200px] truncate italic text-gray-400">
                  "{log.reason}"
                </td>
                <td className="py-4 px-4 rounded-r-xl text-right text-[var(--text-dim)] tabular-nums">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminModerationLogs;
