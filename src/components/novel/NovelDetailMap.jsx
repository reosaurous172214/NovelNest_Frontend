import PropTypes from "prop-types";

const NovelDetailMap = ({ novel }) => {
  if (!novel) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-500
        bg-[var(--bg-secondary)] border border-[var(--border)]"
    >
      <DetailRow label="Titles">
        <ul className="list-disc pl-5 space-y-1 text-[var(--text-dim)]">
          <li className="font-black text-[var(--text-main)] italic">{novel.title}</li>
          {novel.altTitles?.map((t, i) => (
            <li key={i} className="text-[var(--text-dim)] opacity-70 italic font-medium">
              {t}
            </li>
          ))}
        </ul>
      </DetailRow>

      <DetailRow label="Status">
        <span className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">
          {novel.status || "Ongoing"}
        </span>
      </DetailRow>

      <DetailRow label="Date Added">
        {novel.createdAt
          ? new Date(novel.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })
          : "—"}
      </DetailRow>

      <DetailRow label="Author">
        <div className="space-y-1">
          <div className="text-[var(--text-main)] font-bold">{novel.authorNative}</div>
          <div className="text-[var(--accent)] font-mono text-xs uppercase tracking-tighter">
            {novel.author}
          </div>
        </div>
      </DetailRow>

      <DetailRow label="Genres">
        <div className="flex flex-wrap gap-2">
          {novel.genres?.map((g, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg
                bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
            >
              {g}
            </span>
          ))}
        </div>
      </DetailRow>

      <DetailRow label="Tags">
        <div className="flex flex-wrap gap-2">
          {novel.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-lg
                bg-[var(--bg-primary)] text-[var(--text-dim)] border border-[var(--border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </DetailRow>
    </div>
  );
};

/* Consistent Row using System Variables */
const DetailRow = ({ label, children }) => (
  <div className="flex border-b border-[var(--border)] last:border-b-0 group">
    <div
      className="w-36 md:w-44 px-5 py-4 font-mono uppercase tracking-[0.2em]
        bg-[var(--bg-primary)] text-[var(--text-dim)] opacity-80 text-[10px] font-black"
    >
      {label}
    </div>
    <div className="flex-1 px-5 py-4 text-[var(--text-main)] text-sm font-medium">
      {children}
    </div>
  </div>
);

NovelDetailMap.propTypes = {
  novel: PropTypes.object.isRequired,
};

export default NovelDetailMap;