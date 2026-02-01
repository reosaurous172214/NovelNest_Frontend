import { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Edit3, Lock, RefreshCw, User, Mail, Globe, Settings, ShieldCheck, Activity, Save, CheckCircle2 } from "lucide-react";
import { useAlert } from "../context/AlertContext";

export default function Profile() {
  const { showAlert } = useAlert();

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("Personal");

  const [form, setForm] = useState({
    username: "", bio: "", mobile: "", country: "", state: "", city: "", timezone: "",
    theme: "default", language: "en", matureContent: false, notifications: true,
    showEmail: false, showMobile: false, showLocation: true,
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        setForm(prev => ({
          ...prev,
          username: data.username || "",
          bio: data.bio || "",
          mobile: data.mobile || "",
          country: data.location?.country || "",
          state: data.location?.state || "",
          city: data.location?.city || "",
          timezone: data.location?.timezone || "",
          theme: data.preferences?.theme || "default",
          language: data.preferences?.language || "en",
          matureContent: data.preferences?.matureContent || false,
          notifications: data.preferences?.notifications || true,
          showEmail: data.privacy?.showEmail || false,
          showMobile: data.privacy?.showMobile || false,
          showLocation: data.privacy?.showLocation || true,
        }));

        setPreview(data.profilePicture ? `${process.env.REACT_APP_API_URL}${data.profilePicture}` : null);
      } catch (err) {
        showAlert("Unable to load profile.", "error");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (!['currentPassword', 'newPassword', 'confirmPassword'].includes(key)) {
            formData.append(key, form[key]);
        }
      });
      if (avatar) formData.append("profilePicture", avatar);

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/updateProfile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(data);
      setEdit(false);
      showAlert("Profile updated successfully.", "success");
    } catch (err) {
      showAlert("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async (field) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/privacy`,
        { [field]: form[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, privacy: data });
      showAlert("Privacy settings updated.", "success");
    } catch {
      showAlert("Unable to update privacy settings.", "error");
    }
  };

  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirmPassword) return showAlert("Passwords do not match.", "error");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/changePassword`,
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
      showAlert("Password changed successfully.", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Unable to change password.", "error");
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--accent)] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Identity...</div>;

  const glassStyle = "bg-[var(--bg-secondary)] opacity-95 backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem]";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-24 px-4 md:px-12 transition-colors duration-500 selection:bg-[var(--accent)]/20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className={`${glassStyle} overflow-hidden shadow-2xl relative`}>
          <div className="absolute inset-0 h-52 overflow-hidden">
             <img 
                src={preview || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} 
                className="w-full h-full object-cover blur-[80px] opacity-20 scale-125" 
                alt=""
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)]"></div>
          </div>

          <div className="relative p-8 flex flex-col md:flex-row items-center md:items-end gap-8 pt-20">
            <div className="relative group text-left">
              <div className="absolute -inset-1 bg-[var(--accent)] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <img
                src={preview || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                className="relative w-44 h-44 rounded-[2.2rem] object-cover border-4 border-[var(--bg-primary)] shadow-2xl"
                alt="Profile"
              />
              {edit && (
                <label className="absolute -bottom-2 -right-2 bg-[var(--accent)] p-3 rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-xl border border-white/20">
                  <Camera size={20} className="text-white" />
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">{user.username}</h1>
              <p className="text-[var(--text-dim)] max-w-lg italic font-medium">{user.bio || "No biography provided."}</p>
            </div>
            
            <div className="hidden md:block text-right pb-2">
                <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] mb-3 text-right">Sync Integrity</p>
                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]" style={{ width: '88%' }}></div>
                </div>
            </div>
          </div>

          {/* --- TAB NAVIGATION --- */}
          <nav className="flex px-8 mt-6 border-t border-[var(--border)] overflow-x-auto no-scrollbar bg-black/5">
            {[
              {id: "Personal", icon: <User size={14}/>},
              {id: "Contact", icon: <Globe size={14}/>},
              {id: "Preferences", icon: <Settings size={14}/>},
              {id: "Privacy", icon: <ShieldCheck size={14}/>},
              {id: "Stats", icon: <Activity size={14}/>},
              {id: "Password", icon: <Lock size={14}/>},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
              >
                {tab.icon} {tab.id}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" />}
              </button>
            ))}
          </nav>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {activeTab === "Personal" && (
              <TabWrapper title="Personal Data" edit={edit} toggleEdit={() => setEdit(!edit)}>
                <InputField label="Identity Tag" name="username" value={form.username} onChange={handleChange} edit={edit} />
                <TextAreaField label="User Biography" name="bio" value={form.bio} onChange={handleChange} edit={edit} />
                {edit && <SaveButton loading={loading} onClick={handleSaveProfile} />}
              </TabWrapper>
            )}

            {activeTab === "Contact" && (
              <TabWrapper title="Uplink Information" edit={edit} toggleEdit={() => setEdit(!edit)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Secure Email" value={user.email} edit={false} />
                  <InputField label="Mobile Comm" name="mobile" value={form.mobile} onChange={handleChange} edit={edit} />
                  <InputField label="Country Sector" name="country" value={form.country} onChange={handleChange} edit={edit} />
                  <InputField label="Temporal Zone" name="timezone" value={form.timezone} onChange={handleChange} edit={edit} />
                </div>
                {edit && <SaveButton loading={loading} onClick={handleSaveProfile} />}
              </TabWrapper>
            )}

            {activeTab === "Preferences" && (
              <TabWrapper title="System Interface" edit={edit} toggleEdit={() => setEdit(!edit)}>
                <div className="grid md:grid-cols-2 gap-6">
                    <SelectField label="Visual Theme" name="theme" value={form.theme} onChange={handleChange} edit={edit} options={["default","cyberpunk","emerald"]}/>
                    <SelectField label="Interface Language" name="language" value={form.language} onChange={handleChange} edit={edit} options={["en","es","fr","jp"]}/>
                </div>
                <div className="flex flex-col gap-5 mt-4">
                    <CheckboxField label="Enable Mature Data Extraction" name="matureContent" checked={form.matureContent} onChange={handleChange} edit={edit}/>
                    <CheckboxField label="Enable Push Notifications" name="notifications" checked={form.notifications} onChange={handleChange} edit={edit}/>
                </div>
                {edit && <SaveButton loading={loading} onClick={handleSaveProfile} />}
              </TabWrapper>
            )}

            {activeTab === "Privacy" && (
              <TabWrapper title="Privacy Protocols">
                <div className="space-y-6">
                    <CheckboxField label="Broadcast Email Publicly" name="showEmail" checked={form.showEmail} onChange={(e)=>{handleChange(e); handlePrivacyUpdate("showEmail")}}/>
                    <CheckboxField label="Broadcast Mobile Number" name="showMobile" checked={form.showMobile} onChange={(e)=>{handleChange(e); handlePrivacyUpdate("showMobile")}}/>
                    <CheckboxField label="Expose Location Metadata" name="showLocation" checked={form.showLocation} onChange={(e)=>{handleChange(e); handlePrivacyUpdate("showLocation")}}/>
                </div>
              </TabWrapper>
            )}

            {activeTab === "Stats" && (
              <TabWrapper title="Activity Metrics">
                <div className="space-y-8">
                    <DataBar label="Knowledge Base Extracted" value={user.readingStats?.totalNovelsRead || 12} max={100} color="bg-[var(--accent)]" />
                    <DataBar label="Contribution Level" value={65} max={100} color="bg-indigo-500" />
                    <div className="pt-4 border-t border-[var(--border)]">
                        <DataRow label="Last Uplink" value={new Date(user.readingStats?.lastActiveAt).toLocaleDateString()}/>
                        <DataRow label="Account Created" value={new Date(user.createdAt).toLocaleDateString()}/>
                    </div>
                </div>
              </TabWrapper>
            )}

            {activeTab === "Password" && (
              <TabWrapper title="Security Override">
                <div className="space-y-6">
                    <InputField label="Current Key" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
                    <InputField label="New Security Key" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                    <InputField label="Verify New Key" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                    <button onClick={handleChangePassword} className="w-full bg-red-500/10 border border-red-500/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
                        <Lock size={14}/> Rewrite Security Key
                    </button>
                </div>
              </TabWrapper>
            )}

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
             <div className={`${glassStyle} p-8 space-y-8 text-left`}>
                <h4 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.4em]">Node Status</h4>
                <div className="flex items-center gap-4 p-5 bg-[var(--bg-primary)] rounded-[1.5rem] border border-[var(--border)]">
                    <CheckCircle2 className="text-[var(--accent)]" size={24} />
                    <div>
                        <p className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight">Verified Entity</p>
                        <p className="text-[9px] text-[var(--text-dim)] uppercase font-mono tracking-widest mt-1">Trust Status: Optimal</p>
                    </div>
                </div>
                <div className="space-y-5 pt-6 border-t border-[var(--border)]">
                    <DataRow label="Data Integrity" value="Stable" />
                    <DataRow label="Archive Sector" value={form.country || "GLOBAL"} />
                    <DataRow label="Role" value={user.role || "Reader"} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI SUB-COMPONENTS (Dynamic) ---------------- */

const TabWrapper = ({ title, children, edit, toggleEdit }) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 text-left relative overflow-hidden">
    <div className="flex justify-between items-center mb-10">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)]">{title}</h3>
      {toggleEdit && (
        <button onClick={toggleEdit} className="p-3 bg-[var(--bg-primary)] rounded-2xl hover:border-[var(--accent)] transition-all border border-[var(--border)] group">
          <Edit3 size={18} className={edit ? "text-[var(--accent)]" : "text-[var(--text-dim)] group-hover:text-[var(--text-main)]"} />
        </button>
      )}
    </div>
    <div className="space-y-8">{children}</div>
  </div>
);

const InputField = ({ label, edit=true, ...props }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1">{label}</label>
    <input {...props} disabled={!edit} className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-main)] focus:border-[var(--accent)]/50 outline-none transition-all ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-[var(--text-dim)]"}`}/>
  </div>
);

const TextAreaField = ({ label, edit=true, ...props }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1">{label}</label>
    <textarea {...props} disabled={!edit} rows="4" className={`w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[2rem] p-6 text-sm text-[var(--text-main)] focus:border-[var(--accent)]/50 outline-none transition-all ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-[var(--text-dim)]"}`}/>
  </div>
);

const SelectField = ({ label, options, edit=true, ...props }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1">{label}</label>
    <select {...props} disabled={!edit} className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-main)] focus:border-[var(--accent)]/50 outline-none transition-all uppercase font-bold tracking-tight ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-[var(--text-dim)]"}`}>
      {options.map(opt => <option key={opt} value={opt} className="bg-[var(--bg-secondary)]">{opt.toUpperCase()}</option>)}
    </select>
  </div>
);

const CheckboxField = ({ label, edit=true, ...props }) => (
  <label className="flex items-center gap-4 cursor-pointer select-none group">
    <input type="checkbox" disabled={!edit} {...props} className="w-5 h-5 accent-[var(--accent)] rounded-lg cursor-pointer"/>
    <span className={`text-xs font-black uppercase tracking-widest ${!edit ? "opacity-40" : "text-[var(--text-dim)] group-hover:text-[var(--text-main)]"}`}>{label}</span>
  </label>
);

const SaveButton = ({ loading, onClick }) => (
  <button onClick={onClick} disabled={loading} className="w-full bg-[var(--accent)] hover:brightness-110 text-white font-black text-[10px] uppercase tracking-widest py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-[var(--accent-glow)]">
    <Save size={16}/>{loading ? "Synchronizing..." : "Overwrite Identity Data"}
  </button>
);

const DataBar = ({ label, value, max=100, color }) => (
  <div className="space-y-3 text-left">
    <p className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-[0.2em]">{label}</p>
    <div className="w-full bg-[var(--bg-primary)] rounded-full h-3 border border-[var(--border)]">
      <div style={{ width: `${(value/max)*100}%` }} className={`h-full rounded-full ${color} shadow-[0_0_15px_var(--accent-glow)] transition-all duration-1000`}></div>
    </div>
  </div>
);

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
    <span className="text-[var(--text-dim)]">{label}</span>
    <span className="text-[var(--text-main)]">{value}</span>
  </div>
);