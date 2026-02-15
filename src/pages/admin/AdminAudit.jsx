import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaEnvelopeOpenText, FaFilter, FaExternalLinkAlt } from "react-icons/fa";
import { useAlert } from "../../context/AlertContext";
import { getHeaders } from "../../getItems/getAuthItems";
import RequestActionModal from "../../components/admin/ActionModel";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("all");
  const { showAlert } = useAlert();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/request`, getHeaders());
      setRequests(res.data.data);
    } catch (err) {
      showAlert("Failed to sync with neural ledger", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter);

  const balancedRounded = "rounded-xl";
  const glassStyle = `bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl ${balancedRounded}`;

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-emerald-500 bg-emerald-500/10";
      case "rejected": return "text-rose-500 bg-rose-500/10";
      default: return "text-amber-500 bg-amber-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)] flex items-center gap-3">
              Global Requests <span className="text-[var(--accent)] text-sm font-bold bg-[var(--accent)]/10 px-3 py-1 rounded-full">{requests.length}</span>
            </h1>
            <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest mt-1">Administrative Override Console</p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border)]">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${balancedRounded} ${filter === s ? "bg-[var(--accent)] text-white shadow-lg" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className={`${glassStyle} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                  <th className="p-5 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">User / Origin</th>
                  <th className="p-5 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">Type</th>
                  <th className="p-5 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">Subject</th>
                  <th className="p-5 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-[var(--accent)]/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] overflow-hidden">
                          {req.user?.profilePicture ? <img 
  src={
    req.user.profilePicture?.startsWith("http")
      ? req.user.profilePicture
      : `${process.env.REACT_APP_API_URL}${req.user.profilePicture}`
  } 
  alt="Profile" 
  className="w-10 h-10 rounded-full object-cover"
/> : <FaUserCircle size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-main)]">{req.user?.username || "Unknown"}</p>
                          <p className="text-[10px] text-[var(--text-dim)] font-medium">{req.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] font-black uppercase py-1 px-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-md text-[var(--text-dim)]">
                        {req.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="text-sm text-[var(--text-main)] font-medium line-clamp-1">{req.subject}</p>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(req.status)}`}>
                        {req.status}
                      </div>
                    </td>
                    <td className="p-5">
                      <button onClick={() => setSelectedRequest(req)} className="p-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                        <FaExternalLinkAlt size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <div className="py-20 text-center">
                <FaEnvelopeOpenText size={40} className="mx-auto text-[var(--border)] mb-4" />
                <p className="text-[var(--text-dim)] font-bold uppercase text-xs tracking-widest">No protocols found in the queue</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedRequest && (
  <RequestActionModal 
    request={selectedRequest} 
    onClose={() => setSelectedRequest(null)} 
    onRefresh={fetchRequests} 
    showAlert={showAlert}
  />
)}
    </div>
  );
};

export default AdminRequests;