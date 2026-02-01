import axios from "axios";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
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
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("data", JSON.stringify(data.user));
            
            showAlert("Access Granted. Synchronizing...", "success");

            const redirectTo = localStorage.getItem("redirectAfterLogin");

            setTimeout(() => {
                if (redirectTo) {
                    localStorage.removeItem("redirectAfterLogin");
                    window.location.href = redirectTo;
                } else {
                    window.location.href = "/";
                }
            }, 1000);

        } catch (err) {
            showAlert(err.response?.data?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 overflow-hidden transition-colors duration-500">
            {/* Dynamic Ambient Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />

            {/* Main Glass Card */}
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-[var(--bg-secondary)] opacity-95 backdrop-blur-[25px] shadow-2xl border border-[var(--border)] p-10 z-10">
                
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-10 text-left">
                    <div className="hover:scale-105 transition-transform duration-500">
                        <NovelHubLogo />
                    </div>
                    <p className="text-[var(--text-dim)] text-[10px] mt-4 tracking-[0.3em] uppercase font-black">
                        Identity Verification Required
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={loginHandler} className="space-y-5">
                    {/* Email Input */}
                    <div className="group relative text-left">
                        <label className="text-[9px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1 mb-2 block">Uplink Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@archive.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group relative text-left">
                        <label className="text-[9px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1 mb-2 block">Security Key</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-main)] placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-5 mt-6 rounded-2xl overflow-hidden group shadow-xl transition-all active:scale-95"
                    >
                        <div className="absolute inset-0 bg-[var(--accent)] hover:brightness-110 transition-all duration-500"></div>
                        <span className="relative z-10 text-white font-black tracking-[0.2em] text-xs uppercase">
                            {loading ? "Authenticating..." : "Establish Link"}
                        </span>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none" />
                    </button>
                </form>

                {/* Action Footer */}
                <div className="mt-10 flex flex-col items-center space-y-4">
                    <p className="text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest">
                        New explorer?{" "}
                        <a href="/register" className="text-[var(--accent)] hover:brightness-125 transition-all">
                            Initialize Account
                        </a>
                    </p>
                    <a href="/" className="text-[9px] font-black text-[var(--text-dim)] hover:text-[var(--text-main)] uppercase tracking-[0.2em] transition-colors">
                        Return to Sector 0-1
                    </a>
                </div>
            </div>
        </div>
    );
}