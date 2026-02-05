import { IoTrashOutline } from "react-icons/io5";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="bg-[var(--bg-secondary)] w-full max-w-sm rounded-[2.5rem] p-8 md:p-10 text-center border border-[var(--border)] shadow-2xl animate-in zoom-in-95 duration-200">
                
                {/* Warning Icon Hub */}
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/5">
                    <IoTrashOutline size={32} />
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-black uppercase italic mb-3 text-[var(--text-main)] tracking-tighter">
                    {title}
                </h2>
                <p className="text-[10px] text-[var(--text-dim)] mb-8 font-bold uppercase tracking-widest leading-relaxed opacity-60">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onConfirm} 
                        className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 transition-all shadow-xl shadow-red-900/20 active:scale-95"
                    >
                        Confirm Deletion
                    </button>
                    
                    <button 
                        onClick={onCancel} 
                        className="w-full py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-main)] font-black text-[10px] uppercase border border-[var(--border)] hover:bg-white/5 transition-all active:scale-95"
                    >
                        Cancel Protocol
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;