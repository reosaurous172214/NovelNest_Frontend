import { FaCheck, FaTimes } from 'react-icons/fa';

export default function AdminRequests() {
  const requests = [
    { id: 1, user: "Writer_X", type: "New Novel", subject: "The Great Voyage", date: "2 mins ago" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Pending Submissions</h2>
      {requests.map(req => (
        <div key={req.id} className="bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] uppercase">{req.type}</span>
            <h4 className="text-lg font-bold">{req.subject}</h4>
            <p className="text-sm text-[var(--text-dim)]">Requested by {req.user} • {req.date}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition"><FaCheck /></button>
            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition"><FaTimes /></button>
          </div>
        </div>
      ))}
    </div>
  );
}