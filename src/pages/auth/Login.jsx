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
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            // 1. Store user session data
            localStorage.setItem("token", data.token);
            localStorage.setItem("data", JSON.stringify(data.user));
            
            showAlert("Login successful", "success");

            // 2. CHECK FOR REDIRECT PATH
            const redirectTo = localStorage.getItem("redirectAfterLogin");

            setTimeout(() => {
                if (redirectTo) {
                    // Clear the redirect path so it doesn't trigger on next login
                    localStorage.removeItem("redirectAfterLogin");
                    // Send user back to their specific chapter
                    window.location.href = redirectTo;
                } else {
                    // Default fallback to home
                    window.location.href = "/";
                }
            }, 1000);

        } catch (err) {
            showAlert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#050505] px-4 overflow-hidden">
            {/* Background Ambient Orbs for Refraction */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />

            {/* Main Glass Card */}
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.08] p-10 z-10 before:absolute before:inset-0 before:rounded-[2.5rem] before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:pointer-events-none">
                
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="hover:scale-105 transition-transform duration-500">
                        <NovelHubLogo />
                    </div>
                    <p className="text-gray-400 text-xs mt-4 tracking-[0.2em] uppercase font-light">
                        Enter the World of Stories
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={loginHandler} className="space-y-5">
                    {/* Email Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-300"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <ul className="list-none"><Lock className="text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} /></ul>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all duration-300"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 mt-4 rounded-2xl overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
                        <span className="relative z-10 text-white font-bold tracking-wider text-sm">
                            {loading ? "AUTHENTICATING..." : "SIGN IN"}
                        </span>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </form>

                {/* Action Footer */}
                <div className="mt-10 flex flex-col items-center space-y-4">
                    <p className="text-gray-500 text-sm">
                        New explorer?{" "}
                        <a href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                            Create an account
                        </a>
                    </p>
                    <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}