import PropTypes from "prop-types";

const NovelDetailMap = ({ novel }) => {
  if (!novel) return null;
console.log(novel);

  return (
    <div
      className="rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-xl overflow-hidden"
    >
      <DetailRow label="Titles">
        <ul className="list-disc pl-5 space-y-1 text-gray-200">
          <li className="font-medium text-white">{novel.title}</li>
          {novel.altTitles?.map((t, i) => (
            <li key={i} className="text-gray-400">
              {t}
            </li>
          ))}
        </ul>
      </DetailRow>

      <DetailRow label="Status">{novel.status || "Ongoing"}</DetailRow>
      {/* use time stamp for date added */}
      <DetailRow label="Date Added">
        {novel.createdAt
          ? new Date(novel.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "—"}
      </DetailRow>

      <DetailRow label="Author">
        <div>
          <div className="text-white">{novel.authorNative}</div>
          <div className="text-indigo-400">{novel.author}</div>
        </div>
      </DetailRow>

      <DetailRow label="Genres">
        <div className="flex flex-wrap gap-2">
          {novel.genres?.map((g, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full
                bg-indigo-500/10 text-indigo-300
                border border-indigo-400/20"
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
              className="px-3 py-1 text-xs rounded-full
                bg-white/10 text-gray-300
                border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </DetailRow>
    </div>
  );
};

/* consistent row */
const DetailRow = ({ label, children }) => (
  <div className="flex border-b border-white/10 last:border-b-0">
    <div
      className="w-36 md:w-44 px-4 py-3
        bg-white/5 text-gray-400
        font-medium text-sm"
    >
      {label}
    </div>
    <div className="flex-1 px-4 py-3 text-gray-200">{children}</div>
  </div>
);

NovelDetailMap.propTypes = {
  novel: PropTypes.object.isRequired,
};

export default NovelDetailMap;
