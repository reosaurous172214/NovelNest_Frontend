import axios from "axios";
import { useState, useMemo } from "react";
import { BookOpen, ImageIcon, X, UploadCloud, Search } from "lucide-react";

// It's best practice to keep these in a constants.js file
const GENRES = ["Fantasy", "Romance", "Action", "Adventure", "Sci-Fi", "Mystery", "Thriller", "Horror", "Drama", "Comedy", "Slice of Life", "Supernatural", "Historical", "Isekai", "LitRPG", "Cultivation", "Martial Arts", "Psychological", "Tragedy", "Mythology", "Post-Apocalyptic", "Cyberpunk", "Steampunk", "Dark Fantasy", "Urban Fantasy", "War", "Politics"];
const TAGS = ["Slow Burn", "Fast Paced", "Character Driven", "Plot Heavy", "World Building", "Short Chapters", "Long Chapters", "Revenge", "Redemption", "Betrayal", "Friendship", "Love Triangle", "Found Family", "Coming of Age", "Survival", "Power Struggle", "Politics", "War", "Dark", "Light Hearted", "Emotional", "Wholesome", "Gritty", "Tragic", "Hopeful", "Strong Female Lead", "Anti Hero", "Villain MC", "Overpowered MC", "Weak to Strong", "Genius MC", "Morally Grey", "Time Loop", "Reincarnation", "Regression", "Multiple POV", "First Person", "Unreliable Narrator", "Twists", "Cliffhangers", "Enemies to Lovers", "Friends to Lovers", "Slow Romance", "No Romance", "Harem", "Reverse Harem", "Binge Worthy", "Addictive", "Easy Read", "Thought Provoking"];

export default function CreateNovel() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genres: [],
    tags: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState({ genre: "", tag: "" });

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Preview Logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleItem = (listName, item) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter((i) => i !== item)
        : [...prev[listName], item],
    }));
  };

  // Filtered Lists for Search
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
      await axios.post("http://localhost:5000/api/novels/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Novel created successfully ✨");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create novel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 py-20 px-4 flex justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Preview Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <h3 className="text-lg font-medium text-slate-400 px-2">Cover Preview</h3>
            <div className="aspect-[2/3] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center overflow-hidden relative group">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {setCoverImage(null); setPreviewUrl(null);}}
                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <UploadCloud className="mx-auto mb-4 text-slate-600" size={48} />
                  <p className="text-sm text-slate-500">No cover uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Main Form */}
        <form onSubmit={submitHandler} className="lg:col-span-2 space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
          <header className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              New Masterpiece
            </h1>
            <p className="text-slate-400">Fill in the details to launch your novel.</p>
          </header>

          <section className="space-y-4">
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a catchy title..."
              className="w-full text-2xl font-semibold bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none pb-2 transition"
            />
            
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="What's your story about?"
              className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </section>
          

          {/* Dynamic Selector (Genre) */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-400">Genres</label>
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  placeholder="Search genres..." 
                  className="bg-slate-800 text-xs pl-8 pr-2 py-1 rounded-md outline-none"
                  onChange={(e) => setSearchTerm({...searchTerm, genre: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-black/20 rounded-xl">
              {filteredGenres.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => toggleItem("genres", g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    formData.genres.includes(g) 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </section>
          {/* Dynamic Selector (Tags) */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-400">Tags</label>
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  placeholder="Search tags..." 
                  className="bg-slate-800 text-xs pl-8 pr-2 py-1 rounded-md outline-none"
                  onChange={(e) => setSearchTerm({...searchTerm, tag: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-black/20 rounded-xl">
              {filteredTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleItem("tags", tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    formData.tags.includes(tag) 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
          {/* File Upload Hidden Input */}
          <section>
            <label className="block text-sm font-medium text-slate-400 mb-2">Upload Cover</label>
            <label className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-800 transition">
              <ImageIcon className="text-blue-400" />
              <span className="text-sm text-slate-300">{coverImage ? coverImage.name : "Choose a high-quality JPG/PNG"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Novel"}
          </button>
        </form>
      </div>
    </div>
  );
}