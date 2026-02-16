import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Camera,
  Edit3,
  Lock,
  User,
  Globe,
  Settings,
  ShieldCheck,
  Activity,
  Save,
  CheckCircle2,
  Crown, // Added for Premium Badge
} from "lucide-react";
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
    username: "",
    bio: "",
    mobile: "",
    country: "",
    state: "",
    city: "",
    timezone: "",
    theme: "default",
    language: "en",
    matureContent: false,
    notifications: true,
    showEmail: false,
    showMobile: false,
    showLocation: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* --- PREMIUM CHECK --- */
  const isPremium =
    user?.subscription?.plan && user?.subscription?.plan !== "free";

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUser(data);
      setForm((prev) => ({
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

      setPreview(
        data.profilePicture
          ? `${process.env.REACT_APP_API_URL}${data.profilePicture}`
          : null,
      );
    } catch (err) {
      showAlert("Unable to load profile.", "error");
    }
  }, [showAlert]); // 3. showAlert is a safe dependency here

  // 4. Now the useEffect array is clean and satisfies ESLint
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      Object.keys(form).forEach((key) => {
        if (
          !["currentPassword", "newPassword", "confirmPassword"].includes(key)
        ) {
          formData.append(key, form[key]);
        }
      });
      if (avatar) formData.append("profilePicture", avatar);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser({ ...user, privacy: data });
      showAlert("Privacy settings updated.", "success");
    } catch {
      showAlert("Unable to update privacy settings.", "error");
    }
  };

  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirmPassword)
      return showAlert("Passwords do not match.", "error");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/changePassword`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showAlert("Password changed successfully.", "success");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Unable to change password.",
        "error",
      );
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--accent)] font-semibold uppercase tracking-tight animate-pulse">
        Loading Profile...
      </div>
    );

  const glassStyle =
    "bg-[var(--bg-secondary)] border border-white/10 shadow-lg rounded-[2rem]";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-20 px-4 md:px-12 transition-colors duration-500">
      <style>{`
        @keyframes premium-pulse {
          0% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); border-color: rgba(234, 179, 8, 0.5); }
          50% { box-shadow: 0 0 25px rgba(234, 179, 8, 0.8); border-color: rgba(234, 179, 8, 1); }
          100% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); border-color: rgba(234, 179, 8, 0.5); }
        }
        .premium-glow-profile {
          animation: premium-pulse 3s infinite ease-in-out;
          border: 2px solid #eab308 !important;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- HERO HEADER --- */}
        <div className={`${glassStyle} overflow-hidden relative`}>
          <div className="relative p-8 flex flex-col md:flex-row items-center md:items-center gap-8">
            <div className="relative">
              <img
                src={
                  preview ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                }
                className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-[var(--bg-primary)] shadow-md transition-all ${isPremium ? "premium-glow-profile" : ""}`}
                alt="Profile"
              />
              {/* Premium Crown Badge Overlay */}
              {isPremium && (
                <div className="absolute -top-3 -right-3 bg-yellow-500 text-black p-2 rounded-xl shadow-lg border-4 border-[var(--bg-secondary)] animate-bounce">
                  <Crown size={20} fill="black" />
                </div>
              )}

              {edit && (
                <label className="absolute -bottom-2 -right-2 bg-[var(--accent)] p-2.5 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg">
                  <Camera size={18} className="text-white" />
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
              {" "}
              {/* Added min-w-0 to allow shrinking */}
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-main)] uppercase truncate max-w-full">
                  {user.username}
                </h1>{" "}
                {/* Added truncate and max-w-full for long names */}
                {isPremium && (
                  <span className="shrink-0 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Crown size={10} fill="currentColor" /> Premium Member
                  </span> /* Added shrink-0 so the badge doesn't squish */
                )}
              </div>
              <p className="text-[var(--text-dim)] max-w-lg font-medium leading-relaxed opacity-90 break-words">
                {user.bio || "No biography provided."}
              </p>{" "}
              {/* Added break-words to handle long strings in bio */}
            </div>

            <div className="hidden md:block text-right">
              <p className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Account Health
              </p>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* --- TAB NAVIGATION --- */}
          <nav className="flex px-8 border-t border-white/5 overflow-x-auto no-scrollbar bg-black/10">
            {[
              { id: "Personal", icon: <User size={14} /> },
              { id: "Contact", icon: <Globe size={14} /> },
              { id: "Preferences", icon: <Settings size={14} /> },
              { id: "Privacy", icon: <ShieldCheck size={14} /> },
              { id: "Stats", icon: <Activity size={14} /> },
              { id: "Password", icon: <Lock size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[10px] font-semibold uppercase tracking-tight transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-dim)] hover:text-[var(--text-main)]"
                }`}
              >
                {tab.icon} {tab.id}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "Personal" && (
              <TabWrapper
                title="Personal Information"
                edit={edit}
                toggleEdit={() => setEdit(!edit)}
              >
                <InputField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  edit={edit}
                />
                <TextAreaField
                  label="Biography"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  edit={edit}
                />
                {edit && (
                  <SaveButton loading={loading} onClick={handleSaveProfile} />
                )}
              </TabWrapper>
            )}

            {activeTab === "Contact" && (
              <TabWrapper
                title="Contact Details"
                edit={edit}
                toggleEdit={() => setEdit(!edit)}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Email Address"
                    value={user.email}
                    edit={false}
                  />
                  <InputField
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    edit={edit}
                  />
                  <InputField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    edit={edit}
                  />
                  <InputField
                    label="Timezone"
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    edit={edit}
                  />
                </div>
                {edit && (
                  <SaveButton loading={loading} onClick={handleSaveProfile} />
                )}
              </TabWrapper>
            )}

            {activeTab === "Preferences" && (
              <TabWrapper
                title="Interface Settings"
                edit={edit}
                toggleEdit={() => setEdit(!edit)}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <SelectField
                    label="Theme"
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    edit={edit}
                    options={["default", "cyberpunk", "emerald"]}
                  />
                  <SelectField
                    label="Language"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    edit={edit}
                    options={["en", "es", "fr", "jp"]}
                  />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <CheckboxField
                    label="Show Mature Content"
                    name="matureContent"
                    checked={form.matureContent}
                    onChange={handleChange}
                    edit={edit}
                  />
                  <CheckboxField
                    label="Enable Notifications"
                    name="notifications"
                    checked={form.notifications}
                    onChange={handleChange}
                    edit={edit}
                  />
                </div>
                {edit && (
                  <SaveButton loading={loading} onClick={handleSaveProfile} />
                )}
              </TabWrapper>
            )}

            {activeTab === "Privacy" && (
              <TabWrapper title="Privacy Controls">
                <div className="space-y-6">
                  <CheckboxField
                    label="Public Email"
                    name="showEmail"
                    checked={form.showEmail}
                    onChange={(e) => {
                      handleChange(e);
                      handlePrivacyUpdate("showEmail");
                    }}
                  />
                  <CheckboxField
                    label="Public Mobile"
                    name="showMobile"
                    checked={form.showMobile}
                    onChange={(e) => {
                      handleChange(e);
                      handlePrivacyUpdate("showMobile");
                    }}
                  />
                  <CheckboxField
                    label="Public Location"
                    name="showLocation"
                    checked={form.showLocation}
                    onChange={(e) => {
                      handleChange(e);
                      handlePrivacyUpdate("showLocation");
                    }}
                  />
                </div>
              </TabWrapper>
            )}

            {activeTab === "Stats" && (
              <TabWrapper title="User Statistics">
                <div className="space-y-8">
                  <DataBar
                    label="Novels Read"
                    value={user.readingStats?.totalNovelsRead || 12}
                    max={100}
                    color="bg-[var(--accent)]"
                  />
                  <DataBar
                    label="Activity Level"
                    value={65}
                    max={100}
                    color="bg-blue-500"
                  />
                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                    <DataRow
                      label="Last Active"
                      value={
                        user.readingStats?.lastActiveAt
                          ? new Date(
                              user.readingStats.lastActiveAt,
                            ).toLocaleDateString()
                          : "Today"
                      }
                    />
                    <DataRow
                      label="Member Since"
                      value={new Date(user.createdAt).toLocaleDateString()}
                    />
                  </div>
                </div>
              </TabWrapper>
            )}

            {activeTab === "Password" && (
              <TabWrapper title="Security">
                <div className="space-y-6">
                  <InputField
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                  />
                  <InputField
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-red-500/10 border border-red-500/20 py-4 rounded-xl font-semibold text-[11px] uppercase tracking-tight text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Update Password
                  </button>
                </div>
              </TabWrapper>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className={`${glassStyle} p-8 space-y-6 text-left`}>
              <h4 className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">
                Status
              </h4>
              <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl border border-white/5">
                <CheckCircle2 className="text-[var(--accent)]" size={24} />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-tight">
                    Verified
                  </p>
                  <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider opacity-60">
                    Status: Active
                  </p>
                </div>
              </div>

              {/* --- PREMIUM SECTION IN SIDEBAR --- */}
              {isPremium ? (
                <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown size={16} className="text-yellow-500" />
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
                      Premium Active
                    </p>
                  </div>
                  <p className="text-[10px] text-yellow-500/70 font-medium leading-relaxed">
                    You have full access to bonus novels and exclusive
                    discounts.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[var(--accent)]/5 rounded-xl border border-[var(--accent)]/10">
                  <p className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tight mb-2">
                    Standard Plan
                  </p>
                  <button
                    onClick={() => (window.location.href = "/subscription")}
                    className="text-[9px] text-[var(--accent)] font-bold uppercase hover:underline"
                  >
                    Upgrade to Premium →
                  </button>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-white/5">
                <DataRow label="Integrity" value="Stable" />
                <DataRow label="Region" value={form.country || "GLOBAL"} />
                <DataRow label="Role" value={user.role || "Reader"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

const TabWrapper = ({ title, children, edit, toggleEdit }) => (
  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-[2rem] p-8 shadow-md text-left relative overflow-hidden">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] opacity-70">
        {title}
      </h3>
      {toggleEdit && (
        <button
          onClick={toggleEdit}
          className="p-2.5 bg-[var(--bg-primary)] rounded-xl hover:border-[var(--accent)]/50 transition-all border border-white/5"
        >
          <Edit3
            size={16}
            className={edit ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}
          />
        </button>
      )}
    </div>
    <div className="space-y-8">{children}</div>
  </div>
);

const InputField = ({ label, edit = true, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-tight ml-1">
      {label}
    </label>
    <input
      {...props}
      disabled={!edit}
      className={`w-full px-5 py-3.5 rounded-xl bg-[var(--bg-primary)] border border-white/5 text-[14px] text-[var(--text-main)] focus:border-[var(--accent)]/40 outline-none transition-all ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-white/10"}`}
    />
  </div>
);

const TextAreaField = ({ label, edit = true, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-tight ml-1">
      {label}
    </label>
    <textarea
      {...props}
      disabled={!edit}
      rows="4"
      className={`w-full bg-[var(--bg-primary)] border border-white/5 rounded-xl p-5 text-[14px] leading-relaxed text-[var(--text-main)] focus:border-[var(--accent)]/40 outline-none transition-all ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-white/10"}`}
    />
  </div>
);

const SelectField = ({ label, options, edit = true, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-tight ml-1">
      {label}
    </label>
    <select
      {...props}
      disabled={!edit}
      className={`w-full px-5 py-3.5 rounded-xl bg-[var(--bg-primary)] border border-white/5 text-[13px] text-[var(--text-main)] focus:border-[var(--accent)]/40 outline-none transition-all uppercase font-semibold tracking-tight appearance-none ${!edit ? "opacity-40 cursor-not-allowed" : "hover:border-white/10"}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[var(--bg-secondary)]">
          {opt.toUpperCase()}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, edit = true, ...props }) => (
  <label className="flex items-center gap-4 cursor-pointer select-none w-fit">
    <input
      type="checkbox"
      disabled={!edit}
      {...props}
      className="w-5 h-5 rounded bg-[var(--bg-primary)] border-white/10 accent-[var(--accent)] transition-all cursor-pointer"
    />
    <span
      className={`text-[11px] font-semibold uppercase tracking-tight ${!edit ? "opacity-40" : "text-[var(--text-dim)]"}`}
    >
      {label}
    </span>
  </label>
);

const SaveButton = ({ loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full bg-[var(--accent)] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-[11px] uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
  >
    <Save size={16} />
    {loading ? "Saving..." : "Update Profile"}
  </button>
);

const DataBar = ({ label, value, max = 100, color }) => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-end">
      <p className="text-[10px] font-semibold uppercase text-[var(--text-dim)] tracking-tight">
        {label}
      </p>
      <p className="text-[10px] font-semibold text-[var(--text-main)]">
        {Math.round((value / max) * 100)}%
      </p>
    </div>
    <div className="w-full bg-white/5 rounded-full h-[5px]">
      <div
        style={{ width: `${(value / max) * 100}%` }}
        className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
      ></div>
    </div>
  </div>
);

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-tight py-1">
    <span className="text-[var(--text-dim)] opacity-60">{label}</span>
    <span className="text-[var(--text-main)]">{value}</span>
  </div>
);
