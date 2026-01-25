import axios from "axios";
import { useState } from "react";
import { User, Mail, Lock, Camera, ArrowRight } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import NovelHubLogo from "../../components/layout/Logo";

export default function Register() {
    const { showAlert } = useAlert();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

    const registerHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("profilePicture", avatar);

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            showAlert("Registration successful", "success");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch (err) {
            showAlert("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#050505] px-4 pt-24 pb-10 overflow-hidden">
            {/* Dynamic Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Glass Card Container */}
            <div className="relative w-full max-w-lg rounded-[2.5rem] bg-white/[0.02] backdrop-blur-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.08] p-8 md:p-12 z-10 before:absolute before:inset-0 before:rounded-[2.5rem] before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none">

                {/* Header & Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="transform hover:scale-105 transition-transform duration-500">
                        <NovelHubLogo />
                    </div>
                    <h2 className="text-md md:text-xl font-light text-gray-400 mt-2 tracking-widest uppercase">
                        Create Your <span className="text-white font-bold">Character</span>
                    </h2>
                </div>

                {/* Avatar Section */}
                <div className="flex justify-center mb-8">
                    <label className="relative cursor-pointer group">
                        <div className="w-28 h-28 rounded-3xl border-2 border-white/10 flex items-center justify-center overflow-hidden bg-black/60 shadow-inner group-hover:border-blue-500/50 transition-all duration-300">
                            {preview ? (
                                <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-gray-600 group-hover:text-blue-400 transition-colors" size={40} />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                            <Camera className="text-white" size={18} />
                        </div>
                        <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    </label>
                </div>

                {error && (
                    <div className="mb-6 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center tracking-wide">
                        {error.toUpperCase()}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={registerHandler} className="space-y-4">
                    
                    <div className="grid grid-cols-1  gap-4">
                        {/* Username */}
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input
                                type="text"
                                required
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 mt-4 rounded-2xl overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
                        <span className="relative z-10 text-white font-bold tracking-widest text-sm flex items-center justify-center gap-2">
                            {loading ? "INITIALIZING..." : "START YOUR JOURNEY"}
                            {!loading && <ArrowRight size={18} />}
                        </span>
                    </button>
                </form>

                <div className="text-center mt-8 text-gray-500 text-sm font-medium">
                    Already a member?{" "}
                    <a href="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
                        Sign in here
                    </a>
                </div>
            </div>
        </div>
    );
}