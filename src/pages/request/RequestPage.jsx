import React, { useState } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaChevronDown,
  FaFileSignature
} from "react-icons/fa";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";
import { getHeaders } from "../../getItems/getAuthItems";

const RequestPage = () => {
  const { user } = useAuth();
  const username = user?.username;

  const [formData, setFormData] = useState({
    type: "author_upgrade",
    subject: "",
    description: ""
  });

  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showAlert } = useAlert();

  const balanced = "rounded-xl";

  const inputStyle = `w-full bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--accent)] outline-none transition-all ${balanced}`;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isSignatureValid =
    signature.trim().toLowerCase() === username?.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.description.length < 20)
      return showAlert("Please provide more details (minimum 20 characters).", "info");

    if (formData.type === "author_upgrade") {
      if (!agreed)
        return showAlert("You must accept the agreement before continuing.", "info");

      if (!isSignatureValid)
        return showAlert("Your signature must match your username exactly.", "info");
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests`,
        {
          ...formData,
          signature: formData.type === "author_upgrade" ? signature : null
        },
        getHeaders()
      );

      setSubmitted(true);
      showAlert("Your request has been submitted successfully.", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Submission failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUCCESS PAGE ---------------- */

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
        <div className={`w-full max-w-md p-10 text-center shadow-xl border border-[var(--border)] bg-[var(--bg-secondary)] ${balanced}`}>
          <FaCheckCircle className="mx-auto mb-4 text-emerald-500" size={50} />
          <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2">
            Request Submitted
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Your request has been received and will be reviewed by the administration team shortly.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN PAGE ---------------- */

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <div className={`p-6 sm:p-10 shadow-xl border border-[var(--border)] bg-[var(--bg-secondary)] ${balanced}`}>

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[var(--accent)]/10 rounded-lg">
              <FaPaperPlane size={22} className="text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)]">
                Submit a Request
              </h1>
              <p className="text-[10px] tracking-widest text-[var(--accent)] font-semibold">
                Support & Upgrade Portal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TYPE + SUBJECT */}
            <div className="grid sm:grid-cols-2 gap-5">

              <div className="relative">
                <label className="text-[10px] tracking-widest font-semibold text-[var(--text-dim)] block mb-2">
                  Request Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`${inputStyle} appearance-none cursor-pointer`}
                >
                  <option value="author_upgrade">Author Status Upgrade</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="feature_suggestion">Feature Suggestion</option>
                  <option value="other">Other</option>
                </select>

                <FaChevronDown className="absolute right-4 top-[42px] text-xs opacity-60 text-[var(--text-dim)] pointer-events-none" />
              </div>

              <div>
                <label className="text-[10px] tracking-widest font-semibold text-[var(--text-dim)] block mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your request"
                  className={inputStyle}
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-[10px] tracking-widest font-semibold text-[var(--text-dim)] block mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe your request in detail..."
                className={`${inputStyle} h-32 resize-none`}
                required
              />
            </div>

            {/* CONTRACT */}
            {formData.type === "author_upgrade" && (
              <div className={`border border-[var(--border)] p-5 bg-[var(--bg-primary)]/50 space-y-4 ${balanced}`}>

                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-main)]">
                  <FaFileSignature className="text-[var(--accent)]" />
                  Author Agreement
                </div>

                <div className="h-32 overflow-y-auto text-xs leading-relaxed p-4 border border-[var(--border)] bg-[var(--bg-secondary)]/50 rounded-lg text-[var(--text-dim)]">
                  By applying for Author status, you confirm that:
                  <br /><br />
                  • You own or have the rights to all submitted content.<br />
                  • Your work does not violate copyright or intellectual property laws.<br />
                  • The platform may review, moderate, or remove content when necessary.<br />
                  • Violations may result in suspension or removal of author privileges.<br /><br />
                  This agreement is binding within the platform.
                </div>

                <label className="flex gap-3 items-center text-xs font-semibold text-[var(--text-main)] cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent)]"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                  />
                  I agree to the terms and conditions
                </label>

                <div>
                  <label className="text-[10px] tracking-widest font-semibold text-[var(--text-dim)] block mb-2">
                    Signature (enter your username: {username})
                  </label>

                  <input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder={username}
                    className={inputStyle}
                  />

                  {signature && !isSignatureValid && (
                    <p className="text-[10px] text-rose-400 mt-2 font-semibold">
                      Signature does not match your username
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <button
              disabled={loading}
              className={`w-full py-4 font-semibold text-sm bg-[var(--accent)] text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent)]/20 ${balanced} disabled:opacity-50`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
