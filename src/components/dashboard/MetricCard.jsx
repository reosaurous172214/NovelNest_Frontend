
const MetricCard = ({ icon, label, value }) => (
  <div className="p-4 md:p-7 rounded-[1.5rem] md:rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group shadow-sm">
    <div className="text-base md:text-xl text-[var(--accent)] mb-2 md:mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
    <div className="text-left">
      <h3 className="text-lg md:text-2xl font-semibold  leading-none">{value}</h3>
      <p className="text-[9px] md:text-[10px]  text-[var(--text-dim)] font-semibold mt-1 md:mt-2">{label}</p>
    </div>
  </div>
);
export default MetricCard;