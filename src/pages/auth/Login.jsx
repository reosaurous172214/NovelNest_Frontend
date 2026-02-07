import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import NovelHubLogo from "../../components/layout/Logo";

export default function Login() {
    const { showAlert } = useAlert();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/login`,
                { email, password }
            );
            
            if (data.user.isBanned) {
                showAlert("Your account has been restricted. Please contact support.", "error");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("data", JSON.stringify(data.user));
            
            showAlert("Login successful!", "success");

            const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");

            setTimeout(() => {
                window.location.href = redirectTo;
            }, 1000);

        } catch (err) {
            showAlert(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 overflow-hidden transition-colors duration-500 py-24">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />

            {/* Login Card */}
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-[var(--bg-secondary)] opacity-95 backdrop-blur-[25px] shadow-2xl border border-[var(--border)] p-10 z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="hover:scale-105 transition-transform duration-500">
                        <NovelHubLogo />
                    </div>
                    <h2 className="text-[var(--text-main)] text-xl font-bold mt-6">Welcome Back</h2>
                    <p className="text-[var(--text-dim)] text-xs mt-2 uppercase tracking-widest font-semibold">
                        Login to your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={loginHandler} className="space-y-6">
                    {/* Email */}
                    <div className="group relative">
                        <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="group relative">
                        <div className="flex justify-between items-center ml-1 mb-2">
                            <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider block">Password</label>
                            <a href="/forgot-password" size={16} className="text-[10px] text-[var(--accent)] hover:underline font-bold">Forgot?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-5 mt-4 rounded-2xl overflow-hidden group shadow-xl transition-all active:scale-95 disabled:opacity-70"
                    >
                        <div className="absolute inset-0 bg-[var(--accent)] hover:brightness-110 transition-all duration-500"></div>
                        <span className="relative z-10 text-white font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-2">
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Authenticating...</>
                            ) : (
                                "Login"
                            )}
                        </span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-10 flex flex-col items-center space-y-4">
                    <p className="text-[var(--text-dim)] text-xs font-semibold">
                        Don't have an account?{" "}
                        <a href="/register" className="text-[var(--accent)] hover:underline">
                            Register now
                        </a>
                    </p>
                    <a href="/" className="text-[10px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] uppercase tracking-widest transition-colors">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}