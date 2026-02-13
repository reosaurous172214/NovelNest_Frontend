import { useState } from "react";
import {
  Star,
  BookmarkPlus,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { getToken } from "../../getItems/getAuthItems";
import { useAddBookmark } from "../../hooks/useBookmarks";

export default function NovelCard({ novel }) {
  const [expanded, setExpanded] = useState(false);
  const { showAlert } = useAlert();
  const token = getToken();
  const { addToBookmark, adding } = useAddBookmark();

  const coverUrl = novel.coverImage?.startsWith("http")
    ? novel.coverImage
    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

  const handleBookmark = async () => {
    if (!token) {
      showAlert("Please log in to save bookmarks.", "info");
      return;
    }

    try {
      await addToBookmark(novel._id);
      showAlert(`"${novel.title}" saved to your library.`, "success");
    } catch {
      showAlert("Could not update bookmarks.", "error");
    }
  };

  const StatBox = ({ children }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm font-medium text-[var(--text-dim)]">
      {children}
    </div>
  );

  return (
    <div className="group w-full max-w-5xl mx-auto mb-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">

      {/* ===== MAIN SECTION ===== */}
      <Link
        to={`/novel/${novel._id}`}
        className="
          flex flex-col
          sm:flex-row
          gap-5
          p-5
        "
      >
        {/* COVER */}
        <div className="w-full sm:w-40 shrink-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--border)]">
            <img
              src={coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {novel.status || "Ongoing"}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* TITLE */}
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--text-main)] break-words">
              {novel.title}
            </h2>

            <p className="text-sm text-[var(--text-dim)] mt-1">
              By{" "}
              <span className="font-semibold text-[var(--text-main)]">
                {novel.author?.username || "Anonymous"}
              </span>
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox>📖 {novel.totalChapters}</StatBox>

            <StatBox>
              👁{" "}
              {novel.views > 999
                ? (novel.views / 1000).toFixed(1) + "k"
                : novel.views}
            </StatBox>

            <StatBox>
              <Star size={14} className="fill-current text-yellow-500" />
              {novel.rating || "4.8"}
            </StatBox>

            <StatBox>
              <Clock size={14} className="text-emerald-500" />
              Verified
            </StatBox>
          </div>
        </div>
      </Link>

      {/* ===== LOWER SECTION ===== */}
      <div className="px-5 pb-5 flex flex-col gap-4">

        {/* GENRES */}
        <div className="flex flex-wrap gap-2">
          {novel.genres?.slice(0, 3).map((g) => (
            <div
              key={g}
              className="px-3 py-1 text-xs rounded-md bg-[var(--bg-primary)] border border-[var(--border)]"
            >
              {g}
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3">
          <p
            className={`text-sm text-[var(--text-dim)] ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {novel.description}
          </p>

          {novel.description?.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-[var(--accent)] flex items-center gap-1 hover:underline"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? "Less" : "More"}
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/novel/${novel._id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition"
          >
            <BookOpen size={16} />
            Read
          </Link>

          <button
            disabled={adding}
            onClick={handleBookmark}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-[var(--border)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition disabled:opacity-50"
          >
            <BookmarkPlus size={16} />
            {adding ? "..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
