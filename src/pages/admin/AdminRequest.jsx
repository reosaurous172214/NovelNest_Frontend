import { useState } from "react";
import { 
  LuCheck, 
  LuX, 
  LuClock, 
  LuFilePlus, 
  LuWallet, 
  LuBadgeCheck, 
  LuEye,
  LuTerminal
} from "react-icons/lu";

export default function AdminRequests() {
  // Real-world dummy data for different request scenarios
  const [requests, setRequests] = useState([
    { 
      id: "REQ-901", 
      user: "Writer_X", 
      type: "New Novel", 
      subject: "The Great Voyage", 
      details: "Fantasy • 12 Chapters",
      date: "2 mins ago",
      icon: LuFilePlus,
      color: "text-blue-500"
    },
    { 
      id: "REQ-902", 
      user: "NovelMaster", 
      type: "Withdrawal", 
      subject: "₹4,500.00", 
      details: "Bank Transfer • UPI",
      date: "15 mins ago",
      icon: LuWallet,
      color: "text-emerald-500"
    },
    { 
      id: "REQ-903", 
      user: "ShadowWriter", 
      type: "Verification", 
      subject: "Author Badge", 
      details: "ID Verified • 3 Published Works",
      date: "1 hour ago",
      icon: LuBadgeCheck,
      color: "text-purple-500"
    },
  ]);

  const handleAction = (id, action) => {
    // Logic to handle approval or rejection
    console.log(`Request ${id} ${action}`);
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--accent)] bg-opacity-10 rounded-lg text-[var(--accent)]">
            <LuTerminal size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Pending_Protocols</h2>
            <p className="text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest">Awaiting Administrative Clearance</p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-2 rounded-xl text-[var(--text-dim)] tracking-tighter">
          {requests.length} ACTIVE_QUEUE
        </span>
      </div>

      <div className="grid gap-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div 
              key={req.id} 
              className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-[2rem] flex items-center justify-between shadow-xl hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex items-center gap-6">
                {/* Type Icon */}
                <div className={`p-4 rounded-2xl bg-opacity-5 bg-white border border-[var(--border)] ${req.color} group-hover:scale-110 transition-transform`}>
                  <req.icon size={24} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-[var(--border)] ${req.color}`}>
                      {req.type}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-dim)] opacity-50">{req.id}</span>
                  </div>
                  <h4 className="text-lg font-black text-[var(--text-main)] tracking-tight">{req.subject}</h4>
                  <p className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wide">
                    {req.user} <span className="opacity-30 mx-2">|</span> {req.details} <span className="opacity-30 mx-2">|</span> {req.date}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] transition-all"
                  title="View Details"
                >
                  <LuEye size={18} />
                </button>
                <button 
                  onClick={() => handleAction(req.id, "Approved")}
                  className="p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-900/10"
                >
                  <LuCheck size={18} />
                </button>
                <button 
                  onClick={() => handleAction(req.id, "Rejected")}
                  className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-900/10"
                >
                  <LuX size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] opacity-30">
            <p className="font-black uppercase tracking-widest text-sm">Clearance Complete - No Pending Tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}