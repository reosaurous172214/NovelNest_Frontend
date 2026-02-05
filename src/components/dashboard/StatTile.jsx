import React from 'react';

const StatTile = ({ color, label, value, desc }) => {
  const colorStyles = {
    blue: "bg-blue-500/5 border-blue-500/20 text-blue-500",
    emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-500",
    orange: "bg-orange-500/5 border-orange-500/20 text-orange-500"
  };

  return (
    <div className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border text-left shadow-lg transition-all hover:scale-[1.02] ${colorStyles[color] || colorStyles.blue}`}>
      <h4 className="text-[7px] md:text-[9px] font-black uppercase mb-1 tracking-widest opacity-80">{label}</h4>
      <p className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-1 leading-none">{value}</p>
      <p className="text-[7px] md:text-[8px] font-bold opacity-60 uppercase tracking-tighter">{desc}</p>
    </div>
  );
};

export default StatTile;