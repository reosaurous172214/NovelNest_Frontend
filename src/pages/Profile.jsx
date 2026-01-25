import { useState, useEffect } from "react";
import axios from "axios";
import { Camera, ShieldCheck, PenTool, Save, Globe } from "lucide-react";
import { useAlert } from "../context/AlertContext";

export default function Profile() {
  const { showAlert } = useAlert();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    favoriteGenre: "",
    password: "",
    confirmPassword: "",
  });

  // Load User Data on Mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("data"));
    if (storedUser) {
      setUser(storedUser);
      setForm((prev) => ({
        ...prev,
        username: storedUser.username || "",
        email: storedUser.email || "",
        bio: storedUser.bio || "",
        favoriteGenre: storedUser.favoriteGenre || "",
      }));
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview); // Clean memory
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      return showAlert("Security mismatch: Passwords do not match", "error");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("favoriteGenre", form.favoriteGenre);
      if (form.password) formData.append("password", form.password);
      if (avatar) formData.append("profilePicture", avatar);

      const { data } = await axios.put(
        "http://localhost:5000/api/auth/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // --- CRITICAL FIX: MERGE DATA ---
      // We take the existing user object and overwrite ONLY the fields the server updated.
      // This prevents 'role', 'history', etc., from being deleted.
      const serverResponse = data.user || data;
      const updatedUser = { ...user, ...serverResponse }; 

      setUser(updatedUser);
      localStorage.setItem("data", JSON.stringify(updatedUser));
      
      // Reset UI States
      setEdit(false);
      setPreview(null);
      setAvatar(null);
      setForm(f => ({ ...f, password: "", confirmPassword: "" })); 
      showAlert("Personnel dossier updated successfully", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Sync failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-400 font-mono tracking-widest uppercase">Loading Intelligence...</div>;

  const glassStyle = "bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.08] shadow-2xl";

  return (
    <div className="relative min-h-screen bg-[#050505] text-white px-6 pb-20 pt-32 overflow-hidden font-sans antialiased">
      {/* Structural Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* TOP STATUS BAR */}
        <div className={`mb-8 flex items-center justify-between p-6 rounded-[2rem] ${glassStyle}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase font-mono">Registry Status</p>
              <p className="text-sm font-bold text-green-400 uppercase tracking-widest">Verified {user.role || "User"}</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase font-mono">Member Since</p>
            <p className="text-sm font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Active"}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: IDENTITY CARD */}
          <div className={`${glassStyle} rounded-[2.5rem] p-10 text-center h-fit`}>
            <div className="relative w-44 h-44 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-10"></div>
              <img
                src={preview || (user.profilePicture?.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Avatar"
                className="relative w-full h-full rounded-[2.5rem] object-cover border border-white/10 shadow-2xl"
              />
              {edit && (
                <label className="absolute -bottom-3 -right-3 bg-indigo-600 p-3 rounded-2xl cursor-pointer hover:bg-indigo-500 transition-all shadow-xl border border-white/20">
                  <Camera size={20} className="text-white" />
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              )}
            </div>

            <h2 className="text-3xl font-black tracking-tighter italic uppercase">{user.username}</h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
              <Globe size={14} />
              <p className="text-xs font-bold uppercase tracking-widest">{user.email}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
                 <button
                   onClick={() => setEdit(!edit)}
                   className={`w-full py-4 rounded-2xl transition-all font-black text-[10px] tracking-[0.3em] uppercase ${edit ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/[0.05] border border-white/10 hover:bg-white/10'}`}
                 >
                   {edit ? "Cancel Editing" : "Edit Credentials"}
                 </button>
            </div>
          </div>

          {/* RIGHT: DATA GRID */}
          <div className={`lg:col-span-2 ${glassStyle} rounded-[2.5rem] p-10 md:p-14`}>
            {!edit ? (
              <div className="space-y-12">
                <section>
                  <h3 className="text-[11px] font-black tracking-[0.4em] text-blue-400 uppercase mb-8 border-b border-white/5 pb-4 font-mono">Dossier Overview</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InfoField label="Favorite Sector" value={user.favoriteGenres || "Universal"} />
                    <InfoField label="Archived Files" value={user.bookmarks?.length || 0} />
                    <InfoField label="Registry Activity" value={user.history?.length || 0} />
                    <InfoField label="System Auth" value={user.role || "Member"} />
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-black tracking-[0.4em] text-purple-400 uppercase mb-8 border-b border-white/5 pb-4 font-mono">Personnel Bio</h3>
                  <p className="text-gray-400 leading-relaxed font-medium italic text-[15px]">
                    {user.bio || "No biography provided in records."}
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <PenTool className="text-blue-500" size={20} />
                  <h3 className="text-xl font-black tracking-tight uppercase">Update Personnel Registry</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  <InputField label="Public Username" name="username" value={form.username} onChange={handleChange} />
                  <InputField label="Preferred Genre" name="favoriteGenre" value={form.favoriteGenre} onChange={handleChange} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Biography</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="Enter professional bio..."
                  />
                </div>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 font-mono">Security Override</p>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <InputField type="password" label="New Access Key" name="password" value={form.password} onChange={handleChange} />
                    <InputField type="password" label="Confirm Access Key" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                  </div>
                </div>

                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full mt-10 bg-white text-black py-5 rounded-[1.5rem] font-black tracking-[0.2em] text-xs uppercase hover:bg-blue-50 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Save size={16} /> {loading ? "Synchronizing..." : "Commit Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value }) => (
  <div className="bg-white/[0.01] border-l-2 border-white/5 p-4 pl-6">
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1 font-mono">{label}</p>
    <p className="text-base font-bold text-gray-200 uppercase tracking-tight">{value}</p>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 font-mono">{label}</label>
    <input
      {...props}
      className={`w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-all ${props.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    />
  </div>
);