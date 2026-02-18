import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaUserCircle, FaEnvelopeOpenText, FaExternalLinkAlt, FaFingerprint, FaClock } from "react-icons/fa"; 
import { useAlert } from "../../context/AlertContext";
import { getHeaders } from "../../getItems/getAuthItems";
import RequestActionModal from "../../components/admin/ActionModel";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("all");
  const { showAlert } = useAlert();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/request`, getHeaders());
      setRequests(res.data.data);
    } catch (err) {
      showAlert("Failed to sync with neural ledger", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => { 
    fetchRequests(); 
  }, [fetchRequests]);

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "rejected": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-4 sm:px-8 lg:px-12 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-main)] flex items-center gap-4">
              Neural Queue <span className="text-[var(--accent)] text-sm font-bold bg-[var(--accent)]/10 px-4 py-1 rounded-full border border-[var(--accent)]/20">{requests.length}</span>
            </h1>
            <p className="text-[11px] font-black text-[var(--text-dim)] uppercase tracking-[0.2em] mt-2 opacity-60">Administrative Override Console</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)] w-full sm:w-auto">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${filter === s ? "bg-[var(--accent)] text-white shadow-xl scale-105" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING OVERLAY */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md z-50 rounded-3xl">
              <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* CARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
              <div 
                key={req._id} 
                className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Card Header: User & Status */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] overflow-hidden shadow-inner shrink-0">
                      {req.user?.profilePicture ? (
                        <img 
                          src={req.user.profilePicture.startsWith("http") ? req.user.profilePicture : `${process.env.REACT_APP_API_URL}${req.user.profilePicture}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : <FaUserCircle size={24} />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-[var(--text-main)] truncate">{req.user?.username || "Unknown"}</p>
                      <p className="text-[10px] text-[var(--text-dim)] font-medium truncate">{req.user?.email}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </div>
                </div>

                {/* Card Body: Type & Subject */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaFingerprint size={12} className="text-[var(--accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                      {req.type?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="bg-[var(--bg-primary)]/50 p-4 rounded-2xl border border-[var(--border)] min-h-[80px]">
                    <p className="text-sm text-[var(--text-main)] font-medium leading-relaxed italic line-clamp-3">
                      "{req.subject}"
                    </p>
                  </div>

                  {/* Metadata & Action */}
                  <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
                     <div className="flex items-center gap-2 text-[var(--text-dim)] text-[10px]">
                        <FaClock />
                        <span className="font-bold uppercase tracking-tighter">Active Protocol</span>
                     </div>
                     <button 
                      onClick={() => setSelectedRequest(req)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all group"
                     >
                        Inspect <FaExternalLinkAlt className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!loading && filteredRequests.length === 0 && (
            <div className="py-32 text-center bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)]">
              <FaEnvelopeOpenText size={60} className="mx-auto text-[var(--border)] mb-6 animate-pulse" />
              <p className="text-[var(--text-dim)] font-black uppercase text-sm tracking-[0.3em]">Neural queue empty</p>
            </div>
          )}
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