import React from 'react';
import { FaHistory, FaSearch, FaFilter } from 'react-icons/fa';

export default function AdminActivity() {
  // Example activity data
  const logs = [
    { id: 1, admin: "Admin_User", action: "Approved Novel", target: "Shadow Slave", time: "10 mins ago", type: "Approval" },
    { id: 2, admin: "Admin_User", action: "Deleted Comment", target: "User_123", time: "1 hour ago", type: "Moderation" },
    { id: 3, admin: "Editor_X", action: "Updated Chapter", target: "Void Walker - Ch 45", time: "3 hours ago", type: "Update" },
    { id: 4, admin: "System", action: "Backup Completed", target: "Database_Main", time: "5 hours ago", type: "System" },
  ];

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Approval': return 'text-green-500 bg-green-500/10';
      case 'Moderation': return 'text-red-500 bg-red-500/10';
      case 'Update': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-[var(--text-dim)] bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaHistory className="text-[var(--accent)]" /> Operations Log
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-[var(--text-dim)] text-xs" />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              className="pl-9 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm w-full outline-none focus:border-[var(--accent)]"
            />
          </div>
          <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-dim)] hover:text-[var(--text-main)]">
            <FaFilter />
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-primary)] text-[var(--text-dim)] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Admin</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Target</th>
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-sm">{log.admin}</span>
                  </td>
                  <td className="p-4 text-sm">{log.action}</td>
                  <td className="p-4">
                    <span className="text-[var(--text-dim)] text-sm">{log.target}</span>
                  </td>
                  <td className="p-4 text-[var(--text-dim)] text-xs font-mono">
                    {log.time}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getTypeStyle(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-primary)] flex justify-center">
          <button className="text-xs font-bold text-[var(--accent)] hover:underline">
            Load Older Activities
          </button>
        </div>
      </div>
    </div>
  );
}