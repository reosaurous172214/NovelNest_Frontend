import React, { useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaCheckCircle, FaInfoCircle, FaChevronDown } from "react-icons/fa";
import { useAlert } from "../../context/AlertContext";
import { getHeaders } from "../../getItems/getAuthItems";

const RequestPage = () => {
  const [formData, setFormData] = useState({
    type: "author_upgrade",
    subject: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      return showAlert("Please provide more detail (min 20 chars).", "info");
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests`, // Updated to generic requests endpoint
        formData,
        getHeaders() 
      );
      setSubmitted(true);
      showAlert("Protocol submitted to registry!", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Transmission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const balancedRounded = "rounded-2xl";
  const glassStyle = `bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl ${balancedRounded} transition-colors`;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className={`max-w-md w-full p-10 text-center ${glassStyle}`}>
          <FaCheckCircle className="text-emerald-500 mx-auto mb-6" size={50} />
          <h2 className="text-2xl font-black uppercase text-[var(--text-main)] mb-2">Request Logged</h2>
          <p className="text-[var(--text-dim)] text-sm font-medium leading-relaxed">
            Your inquiry has been stored in the neural ledger. Admins will review the status shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <div className={`p-8 md:p-12 ${glassStyle}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[var(--accent)]/10 flex items-center justify-center rounded-xl text-[var(--accent)]">
              <FaPaperPlane size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--text-main)]">Submit Request</h1>
              <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">Global Inquiry Protocol</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* REQUEST TYPE SELECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest mb-2">Request Type</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-3 text-[var(--text-main)] text-xs font-bold focus:border-[var(--accent)] outline-none transition-all ${balancedRounded} cursor-pointer`}
                  >
                    <option value="author_upgrade">Author Status</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="moderator_apply">Moderator Application</option>
                    <option value="feature_suggestion">Feature Suggestion</option>
                    <option value="other">General Inquiry</option>
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none" size={10} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary..."
                  className={`w-full bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-3 text-[var(--text-main)] text-xs font-bold focus:border-[var(--accent)] outline-none transition-all ${balancedRounded}`}
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest mb-2">Detailed Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your request in detail..."
                className={`w-full h-40 bg-[var(--bg-primary)] border border-[var(--border)] p-4 text-[var(--text-main)] text-sm focus:border-[var(--accent)] outline-none transition-all resize-none ${balancedRounded}`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-[var(--accent)] text-white font-black text-[11px] uppercase tracking-[0.2em] ${balancedRounded} hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20`}
            >
              {loading ? "Transmitting..." : "Initialize Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;