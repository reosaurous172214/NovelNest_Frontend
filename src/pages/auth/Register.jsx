import axios from "axios";
import { useState } from "react";
import { User, Mail, Lock, Camera, ArrowRight, Loader2, Edit2, ShieldCheck } from "lucide-react";
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

    // Step 1: Request OTP and validate local details
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // Call the backend endpoint to send OTP
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, { email ,type:"new"});
            
            showAlert("Verification code sent to your email!", "success");
            setStep(2); // Move to OTP input step
        } catch (err) {
            showAlert(err.response?.data?.message || "Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Finalize Registration with OTP
    const registerHandler = async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("otpCode", otp); // Send the OTP for verification
        if (avatar) formData.append("profilePicture", avatar);

        setLoading(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/register`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
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
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

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

                {error && (
                    <div className="mb-6 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center tracking-wide">
                        Error: {error}
                    </div>
                )}

                {/* Form Logic */}
                <form onSubmit={step === 1 ? handleRequestOTP : registerHandler} className="space-y-5">
                    
                    {step === 1 ? (
                        /* Step 1 Fields: Details & Avatar */
                        <>
                            <div className="flex justify-center mb-10">
                                <label className="relative cursor-pointer group">
                                    <div className="w-32 h-32 rounded-[2.5rem] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] shadow-2xl group-hover:border-[var(--accent)]/50 transition-all duration-500">
                                        {preview ? (
                                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <User className="text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors" size={48} />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-[var(--accent)] rounded-2xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                                        <Camera className="text-white" size={20} />
                                    </div>
                                    <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                </label>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]" size={18} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Choose a display name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]" size={18} />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)]" size={18} />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Repeat your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Step 2 Field: OTP Input */
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-[var(--accent)]/10 rounded-3xl">
                                    <ShieldCheck className="text-[var(--accent)]" size={40} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider block">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full py-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:tracking-normal placeholder:text-gray-700"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="text-xs text-[var(--accent)] hover:underline flex items-center justify-center gap-1 mx-auto font-bold"
                            >
                                <Edit2 size={12} /> Edit Registration Info
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
                                <><Loader2 className="animate-spin" size={18} /> Processing...</>
                            ) : (
                                step === 1 ? <>Get Verification Code <ArrowRight size={16} /></> : <>Verify & Complete <ShieldCheck size={16} /></>
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