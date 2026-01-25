import axios from "axios";
import { useState } from "react";
import { BookOpen, ImageIcon } from "lucide-react";

const GENRES = [
  "Fantasy",
  "Romance",
  "Action",
  "Adventure",
  "Sci-Fi",
  "Mystery",
  "Thriller",
  "Horror",
  "Drama",
  "Comedy",
  "Slice of Life",
  "Supernatural",
  "Historical",
  "Isekai",
  "LitRPG",
  "Cultivation",
  "Martial Arts",
  "Psychological",
  "Tragedy",
  "Mythology",
  "Post-Apocalyptic",
  "Cyberpunk",
  "Steampunk",
  "Dark Fantasy",
  "Urban Fantasy",
  "War",
  "Politics"
];
const TAGS = [
  // Story style
  "Slow Burn",
  "Fast Paced",
  "Character Driven",
  "Plot Heavy",
  "World Building",
  "Short Chapters",
  "Long Chapters",

  // Themes
  "Revenge",
  "Redemption",
  "Betrayal",
  "Friendship",
  "Love Triangle",
  "Found Family",
  "Coming of Age",
  "Survival",
  "Power Struggle",
  "Politics",
  "War",

  // Tone / Mood
  "Dark",
  "Light Hearted",
  "Emotional",
  "Wholesome",
  "Gritty",
  "Tragic",
  "Hopeful",

  // Character types
  "Strong Female Lead",
  "Anti Hero",
  "Villain MC",
  "Overpowered MC",
  "Weak to Strong",
  "Genius MC",
  "Morally Grey",

  // Plot devices
  "Time Loop",
  "Reincarnation",
  "Regression",
  "Multiple POV",
  "First Person",
  "Unreliable Narrator",
  "Twists",
  "Cliffhangers",

  // Relationship dynamics
  "Enemies to Lovers",
  "Friends to Lovers",
  "Slow Romance",
  "No Romance",
  "Harem",
  "Reverse Harem",

  // Reader experience
  "Binge Worthy",
  "Addictive",
  "Easy Read",
  "Thought Provoking"
];


export default function CreateNovel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };
  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("genres", JSON.stringify(genres));
    data.append("tags", JSON.stringify(tags));
    data.append("coverImage", coverImage);

    try {
      await axios.post(
        "http://localhost:5000/api/novels/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Novel created successfully");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create novel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900 py-20 px-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl font-light text-white mt-4">
            Create <span className="font-semibold">Novel</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Begin your story
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">

          {/* Title */}
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Novel title"
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white
                       placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500 transition"
          />

          {/* Description */}
          <textarea
            rows="4"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Novel description"
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white
                       placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-purple-500 transition"
          />

          {/* Genres */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Select genres</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
              {GENRES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-2 rounded-lg text-sm transition
                    ${
                      genres.includes(g)
                        ? "bg-indigo-600 text-white"
                        : "bg-black/40 text-gray-300 hover:bg-black/60"
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs rounded-full
                               bg-indigo-500/20 text-indigo-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Tags */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Select Tags</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
              {TAGS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-2 rounded-lg text-sm transition
                    ${
                      tags.includes(t)
                        ? "bg-indigo-600 text-white"
                        : "bg-black/40 text-gray-300 hover:bg-black/60"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-full
                               bg-indigo-500/20 text-indigo-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="relative">
            <ImageIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40
                         text-gray-300 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r
                       from-blue-500 to-purple-600 text-white font-semibold
                       hover:scale-[1.02] active:scale-[0.98]
                       transition transform shadow-lg"
          >
            {loading ? "Creating..." : "Create Novel"}
          </button>
        </form>
      </div>
    </div>
  );
}
