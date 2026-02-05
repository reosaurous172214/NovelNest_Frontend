// pages/admin/AdminDashboard.js
export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      
      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-[var(--text-dim)] text-sm mb-1">Total Novels</p>
          <p className="text-3xl font-bold">1,240</p>
        </div>
        <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-[var(--text-dim)] text-sm mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-500">12</p>
        </div>
        <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-[var(--text-dim)] text-sm mb-1">New Users (Today)</p>
          <p className="text-3xl font-bold text-green-500">45</p>
        </div>
        <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-[var(--text-dim)] text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">$4,200</p>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="font-bold mb-4">Recent Operations</h3>
        <p className="text-[var(--text-dim)]">No recent logs to display.</p>
      </div>
    </div>
  );
}