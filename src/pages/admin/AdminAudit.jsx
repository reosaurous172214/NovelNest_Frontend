import  { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaEnvelopeOpenText,
  FaFingerprint,
  FaClock,
} from "react-icons/fa";
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
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/request`,
        getHeaders()
      );

      setRequests(res.data?.data || []);
    } catch (err) {
      showAlert("Unable to load admin requests. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "rejected":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] flex items-center gap-3">
              Admin Requests
              <span className="text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full">
                {requests.length}
              </span>
            </h1>
            <p className="text-sm text-[var(--text-dim)] mt-2">
              Review and manage user requests
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  filter === s
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-dim)] border border-[var(--border)] hover:text-[var(--text-main)]"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative min-h-[300px]">

          {/* LOADING */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/70 backdrop-blur-sm z-50 rounded-2xl">
              <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 transition hover:shadow-lg hover:-translate-y-1"
              >
                {/* USER */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                      {req.user?.profilePicture ? (
                        <img
                          src={
                            req.user.profilePicture.startsWith("http")
                              ? req.user.profilePicture
                              : `${process.env.REACT_APP_API_URL}${req.user.profilePicture}`
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle size={22} />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                        {req.user?.username || "Unknown User"}
                      </p>
                      <p className="text-xs text-[var(--text-dim)] truncate">
                        {req.user?.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-lg text-[10px] font-semibold border ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </div>
                </div>

                {/* BODY */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                    <FaFingerprint className="text-[var(--accent)]" />
                    {req.type?.replace("_", " ") || "General"}
                  </div>

                  <div className="bg-[var(--bg-primary)]/50 p-3 rounded-xl border border-[var(--border)] min-h-[70px]">
                    <p className="text-sm text-[var(--text-main)] line-clamp-3">
                      {req.subject || "No subject provided."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                      <FaClock />
                      <span>Active</span>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {!loading && filteredRequests.length === 0 && (
            <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
              <FaEnvelopeOpenText
                size={50}
                className="mx-auto text-[var(--border)] mb-4"
              />
              <p className="text-[var(--text-dim)] font-medium">
                No requests found.
              </p>
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
