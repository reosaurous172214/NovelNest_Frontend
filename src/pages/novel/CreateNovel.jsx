import axios from "axios";
import { useState, useMemo } from "react";
import {  X, UploadCloud, Search, Feather, Info } from "lucide-react";

const GENRES = ["Fantasy", "Romance", "Action", "Adventure", "Sci-Fi", "Mystery", "Thriller", "Horror", "Drama", "Comedy", "Slice of Life", "Supernatural", "Historical", "Isekai", "LitRPG", "Cultivation", "Martial Arts", "Psychological", "Tragedy", "Mythology", "Post-Apocalyptic", "Cyberpunk", "Steampunk", "Dark Fantasy", "Urban Fantasy", "War", "Politics"];
const TAGS = ["Slow Burn", "Fast Paced", "Character Driven", "Plot Heavy", "World Building", "Short Chapters", "Long Chapters", "Revenge", "Redemption", "Betrayal", "Friendship", "Love Triangle", "Found Family", "Coming of Age", "Survival", "Power Struggle", "Politics", "War", "Dark", "Light Hearted", "Emotional", "Wholesome", "Gritty", "Tragic", "Hopeful", "Strong Female Lead", "Anti Hero", "Villain MC", "Overpowered MC", "Weak to Strong", "Genius MC", "Morally Grey", "Time Loop", "Reincarnation", "Regression", "Multiple POV", "First Person", "Unreliable Narrator", "Twists", "Cliffhangers", "Enemies to Lovers", "Friends to Lovers", "Slow Romance", "No Romance", "Harem", "Reverse Harem", "Binge Worthy", "Addictive", "Easy Read", "Thought Provoking"];

export default function CreateNovel() {
  const [formData, setFormData] = useState({ title: "", description: "", genres: [], tags: [] });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState({ genre: "", tag: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 

  const toggleItem = (listName, item) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter((i) => i !== item)
        : [...prev[listName], item],
    }));
  };

  const filteredGenres = useMemo(() => 
    GENRES.filter(g => g.toLowerCase().includes(searchTerm.genre.toLowerCase())), 
  [searchTerm.genre]);

  const filteredTags = useMemo(() => 
    TAGS.filter(t => t.toLowerCase().includes(searchTerm.tag.toLowerCase())), 
  [searchTerm.tag]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.genres.length === 0) return alert("Please select at least one genre");
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, Array.isArray(formData[key]) ? JSON.stringify(formData[key]) : formData[key]);
    });
    data.append("coverImage", coverImage);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/novels/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Masterpiece registered in the archives ✨");
      window.location.href = "/author/me";
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create novel");
    } finally {
      setLoading(false);
    }
  };

  // Shared theme class for containers
  const glassPanel = "bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl backdrop-blur-md transition-all duration-500";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-24 px-4 flex justify-center transition-colors duration-500">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Preview & Status */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className={`${glassPanel} rounded-[2rem] p-6 text-left`}>
            <div className="flex items-center gap-2 mb-4 text-[var(--accent)] font-black uppercase text-[10px] tracking-widest">
              <Feather size={14} /> Visual Asset
            </div>
            <div className="aspect-[2/3] rounded-2xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center overflow-hidden relative group">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => {setCoverImage(null); setPreviewUrl(null);}} className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><X size={16} /></button>
                </>
              ) : (
                <div className="text-center p-6 opacity-30">
                  <UploadCloud className="mx-auto mb-4" size={40} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Cover Art</p>
                </div>
              )}
            </div>
          </div>

          <div className={`${glassPanel} rounded-2xl p-5 text-left`}>
             <div className="flex items-center gap-2 mb-2 text-[var(--text-dim)] font-bold text-[10px] uppercase">
               <Info size={12} /> Publication Tips
             </div>
             <p className="text-[11px] text-[var(--text-dim)] leading-relaxed italic opacity-80">
               "High-quality covers increase reader engagement by up to 70%. Ensure your title is legible against the background."
             </p>
          </div>
        </div>

        {/* Right: Authoring Interface */}
        <form onSubmit={submitHandler} className={`lg:col-span-8 space-y-8 p-8 md:p-12 rounded-[2.5rem] ${glassPanel} text-left`}>
          <header className="border-b border-[var(--border)] pb-6">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-[var(--text-main)]">
              New <span className="text-[var(--accent)]">Project</span>
            </h1>
            <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.3em] mt-2">Initialize Narrative Sequence</p>
          </header>

          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Manuscript Title</label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title..."
                className="w-full text-2xl font-black bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] outline-none pb-2 transition-all placeholder:opacity-20"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Synopsis</label>
                <span className="text-[9px] font-bold opacity-40">{formData.description.length} / 2000</span>
              </div>
              <textarea
                name="description"
                required
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief the readers on your universe..."
                className="w-full p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] focus:border-[var(--accent)] outline-none transition-all resize-none text-sm leading-relaxed"
              />
            </div>
          </section>

          {/* Selectors (Genre/Tags) */}
          <div className="grid md:grid-cols-2 gap-8">
            <Selector title="Genres" list={filteredGenres} selected={formData.genres} toggle={(item) => toggleItem("genres", item)} searchKey="genre" setSearch={setSearchTerm} term={searchTerm} />
            <Selector title="Tags" list={filteredTags} selected={formData.tags} toggle={(item) => toggleItem("tags", item)} searchKey="tag" setSearch={setSearchTerm} term={searchTerm} />
          </div>

          <div className="pt-6 border-t border-[var(--border)]">
             <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-[var(--accent)] text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-lg shadow-[var(--accent-glow)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Initialize Publication"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Helper Sub-component for Selectors */
function Selector({ title, list, selected, toggle, searchKey, setSearch, term }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">{title}</label>
        <div className="relative">
          <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30" />
          <input 
            placeholder={`Search...`} 
            className="bg-[var(--bg-primary)] border border-[var(--border)] text-[9px] pl-6 pr-2 py-1 rounded-lg outline-none w-32 focus:border-[var(--accent)]"
            onChange={(e) => setSearch({...term, [searchKey]: e.target.value})}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-3 bg-[var(--bg-primary)]/50 rounded-2xl border border-[var(--border)] no-scrollbar">
        {list.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => toggle(item)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
              selected.includes(item) 
              ? "bg-[var(--accent)] text-white" 
              : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}