import axios from "axios";
import { useState } from "react";
import {
  User,
  Mail,
  Camera,
  ArrowRight,
  Loader2,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import NovelHubLogo from "../../components/layout/Logo";

export default function Register() {
  const { showAlert } = useAlert();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= GOOGLE AUTH HANDLER ================= */
  const handleGoogleRegister = () => {
    // Direct redirect to backend to start the Google OAuth cycle
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  /* ================= STEP 1: REQUEST OTP ================= */
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
        email,
        type: "new",
      });

      showAlert("Verification code sent to your email!", "success");
      setStep(2);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to send verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2: FINALIZE REGISTRATION ================= */
  const registerHandler = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("otpCode", otp);
    if (avatar) formData.append("profilePicture", avatar);

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      showAlert("Account verified and created successfully!", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      showAlert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 pt-24 pb-10 overflow-hidden transition-colors duration-500">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Glass Card Container */}
      <div className="relative w-full max-w-lg rounded-[2.5rem] bg-[var(--bg-secondary)] opacity-95 backdrop-blur-[30px] shadow-2xl border border-[var(--border)] p-8 md:p-12 z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="transform hover:scale-105 transition-transform duration-500">
            <NovelHubLogo />
          </div>
          <h2 className="text-[var(--text-main)] text-xl font-bold mt-6">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="text-[var(--text-dim)] text-xs mt-2 uppercase tracking-widest font-semibold">
            {step === 1 ? "Join the reader community" : `Code sent to ${email}`}
          </p>
        </div>

        {/* GOOGLE FAST-TRACK (Step 1 Only) */}
        {step === 1 && (
          <div className="animate-in fade-in duration-700">
            <button
              onClick={handleGoogleRegister}
              className="w-full py-4 rounded-2xl bg-white/5 border border-[var(--border)] hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 group mb-6"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="G"
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              <span className="text-[var(--text-main)] text-[10px] font-bold uppercase tracking-widest">
                Fast Track with Google
              </span>
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)] opacity-30"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-dim)]">
                <span className="bg-[var(--bg-secondary)] px-4">
                  Or Register Manually
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center tracking-wide">
            Error: {error}
          </div>
        )}

        {/* Main Form */}
        <form
          onSubmit={step === 1 ? handleRequestOTP : registerHandler}
          className="space-y-5"
        >
          {step === 1 ? (
            /* STEP 1: DETAILS & AVATAR */
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-center mb-10">
                <label className="relative cursor-pointer group">
                  <div className="w-32 h-32 rounded-[2.5rem] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] shadow-2xl group-hover:border-[var(--accent)]/50 transition-all duration-500">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <User
                        className="text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors"
                        size={48}
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-[var(--accent)] rounded-2xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                    <Camera className="text-white" size={20} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a display name"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: OTP INPUT */
            <div className="w-full max-w-md mx-auto px-6 py-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 border border-[var(--accent)]/20 shadow-inner">
                  <ShieldCheck className="text-[var(--accent)]" size={36} />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-semibold text-[var(--text-main)] tracking-tight">
                  Enter Verification Code
                </h2>
                <p className="text-sm text-[var(--text-dim)]">
                  We’ve sent a 6-digit code to your email
                </p>
              </div>

              {/* OTP Input */}
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full py-5 px-4 rounded-2xl 
            bg-[var(--bg-primary)] 
            border border-[var(--border)] 
            text-[var(--text-main)] 
            text-center text-3xl tracking-[0.6em] font-semibold
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 
            focus:border-[var(--accent)] 
            transition-all duration-200"
                />
              </div>

              {/* Helper Text */}
              <p className="text-xs text-[var(--text-dim)] text-center mt-4">
                Code expires in 10 minutes
              </p>

              {/* Divider */}
              <div className="my-6 border-t border-[var(--border)]" />

              {/* Edit Info */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-[var(--accent)] hover:opacity-80 
        flex items-center justify-center gap-2 font-medium transition-opacity"
              >
                <Edit2 size={14} />
                Edit Registration Details
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-5 mt-6 rounded-[1.5rem] overflow-hidden group shadow-xl transition-all active:scale-95 disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-[var(--accent)] hover:brightness-110 transition-all duration-500"></div>
            <span className="relative z-10 text-white font-bold tracking-widest text-sm flex items-center justify-center gap-3 uppercase">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </>
              ) : step === 1 ? (
                <>
                  Get Verification Code <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Verify & Complete <ShieldCheck size={16} />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="text-center mt-10">
          <p className="text-[var(--text-dim)] text-xs font-semibold">
            Already have an account?{" "}
            <a href="/login" className="text-[var(--accent)] hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
