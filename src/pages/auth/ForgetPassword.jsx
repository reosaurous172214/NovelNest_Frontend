import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import NovelHubLogo from "../../components/layout/Logo";

export default function ForgotPassword() {
    const { showAlert } = useAlert();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, { email , type:"reset"});
            showAlert("Reset code sent to your email", "success");
            setStep(2);
        } catch (err) {
            showAlert(err.response?.data?.message || "Email not found");
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, { 
                email, otpCode: otp, newPassword 
            });
            showAlert("Password updated! You can now login.", "success");
            setTimeout(() => { window.location.href = "/login"; }, 1500);
        } catch (err) {
            showAlert("Invalid code or reset failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 overflow-hidden transition-colors duration-500 py-24">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-[var(--bg-secondary)] opacity-95 backdrop-blur-[25px] shadow-2xl border border-[var(--border)] p-10 z-10">
                <div className="flex flex-col items-center mb-10">
                    <NovelHubLogo />
                    <h2 className="text-[var(--text-main)] text-xl font-bold mt-6">
                        {step === 1 ? "Forgot Password?" : "Reset Password"}
                    </h2>
                    <p className="text-[var(--text-dim)] text-xs mt-2 uppercase tracking-widest font-semibold text-center">
                        {step === 1 ? "Enter email to receive code" : "Verify code and set new password"}
                    </p>
                </div>

                <form onSubmit={step === 1 ? handleRequestOTP : handleResetPassword} className="space-y-6">
                    {step === 1 ? (
                        <div className="group relative">
                            <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
                                <input type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] text-center tracking-[0.3em] font-bold focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
                                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="relative w-full py-5 mt-4 rounded-2xl overflow-hidden group shadow-xl transition-all active:scale-95 disabled:opacity-70">
                        <div className="absolute inset-0 bg-[var(--accent)] hover:brightness-110"></div>
                        <span className="relative z-10 text-white font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : step === 1 ? <>Send Code <ArrowRight size={16}/></> : "Update Password"}
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/login" className="text-[10px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] uppercase tracking-widest transition-colors">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}