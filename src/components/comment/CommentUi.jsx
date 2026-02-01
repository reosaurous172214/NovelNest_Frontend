import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import { 
  FaHeart, FaBold, FaItalic, FaSmile, FaPaperPlane, FaCommentAlt 
} from "react-icons/fa";
import { commentApi } from "../../api/commentApi";

const MAX_CHARS = 1000;

const CommentSection = ({ novelId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => { loadComments(); }, [novelId]);

  const loadComments = async () => {
    try {
      const data = await commentApi.getByNovel(novelId);
      setComments(data);
    } catch (err) { console.error("Sync error:", err); }
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [comments, sortBy]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length > MAX_CHARS) return;
    setLoading(true);
    try {
      const posted = await commentApi.post(novelId, newComment);
      setComments([posted, ...comments]);
      setNewComment("");
      setIsFocused(false);
    } catch (err) { console.error("Post failed", err); } 
    finally { setLoading(false); }
  };

  const handleInsertText = (before, after, inputId, currentVal, setter) => {
    const textarea = document.getElementById(inputId);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const result = currentVal.substring(0, start) + before + currentVal.substring(start, end) + after + currentVal.substring(end);
    
    setter(result);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    // Changed: Removed any max-width constraints to ensure full width
    <div className="w-full mt-12 space-y-8 pb-20 text-left px-0 animate-in fade-in duration-700">
      
      {/* HEADER SECTION - Simple & Wide */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 px-2">
        <h3 className="text-sm font-bold text-[var(--text-main)]">Comments</h3>
        <div className="flex gap-6 items-center">
            {['newest', 'popular'].map(type => (
                <button 
                    key={type}
                    onClick={() => setSortBy(type)}
                    className={`text-[11px] font-bold tracking-tight transition-all capitalize ${sortBy === type ? "text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      {/* FULL-WIDTH COMMENT FORM */}
      <div className={`transition-all duration-300 border-y sm:border sm:rounded-2xl ${isFocused ? 'border-[var(--accent)] shadow-sm' : 'border-[var(--border)]'} bg-[var(--bg-secondary)] p-4 sm:p-5 w-full`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
          {/* Avatar row for mobile, side-by-side for desktop */}
          <div className="flex items-center gap-3 sm:block">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--accent)] text-xs shadow-inner">
              {currentUser?.username?.charAt(0) || "U"}
            </div>
            <span className="sm:hidden text-xs font-bold text-[var(--text-main)]">{currentUser?.username}</span>
          </div>
          
          <form onSubmit={handlePostComment} className="w-full flex-1">
            <textarea
              id="main-editor"
              value={newComment}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setNewComment(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Add a comment..."
              className="w-full bg-transparent py-1 text-sm text-[var(--text-main)] focus:outline-none resize-none min-h-[44px] placeholder:text-[var(--text-dim)]/50 leading-relaxed"
              style={{ height: isFocused || newComment ? '140px' : '44px' }}
            />
            
            {(isFocused || newComment) && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border)] animate-in slide-in-from-top-1">
                <div className="flex gap-5 text-[var(--text-dim)]">
                  <button type="button" onClick={() => handleInsertText("**", "**", "main-editor", newComment, setNewComment)} className="hover:text-[var(--accent)] transition-transform active:scale-125"><FaBold size={14}/></button>
                  <button type="button" onClick={() => handleInsertText("_", "_", "main-editor", newComment, setNewComment)} className="hover:text-[var(--accent)] transition-transform active:scale-125"><FaItalic size={14}/></button>
                  <button type="button" onClick={() => handleInsertText("😊", "", "main-editor", newComment, setNewComment)} className="hover:text-[var(--accent)] transition-transform active:scale-125"><FaSmile size={14}/></button>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold tracking-tighter ${newComment.length >= MAX_CHARS ? 'text-red-500' : 'text-[var(--text-dim)]'}`}>
                    {newComment.length}/{MAX_CHARS}
                  </span>
                  <button 
                    disabled={loading || !newComment.trim()} 
                    className="text-xs font-bold text-[var(--accent)] px-2 hover:opacity-70 disabled:opacity-30 transition-all uppercase tracking-widest"
                  >
                    {loading ? "..." : "Post"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* FULL-WIDTH COMMENTS LIST */}
      <div className="space-y-10 mt-10 w-full max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
        {sortedComments.map(c => (
          <CommentCard 
            key={c._id} 
            comment={c} 
            currentUser={currentUser} 
            novelId={novelId}
            onRefresh={loadComments}
            handleInsertText={handleInsertText}
          />
        ))}
      </div>
    </div>
  );
};

const CommentCard = ({ comment, currentUser, novelId, onRefresh, handleInsertText, isReply = false }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showNested, setShowNested] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || replyText.length > MAX_CHARS) return;
    try {
      await commentApi.postReply(comment._id, replyText, novelId);
      setReplyText("");
      setShowReplyInput(false);
      onRefresh();
    } catch (err) { console.error("Reply failed:", err); }
  };

  const uniqueReplyId = `reply-editor-${comment._id}`;

  return (
    <div className={`w-full animate-in fade-in slide-in-from-bottom-1 ${isReply ? 'pl-6 sm:pl-12 border-l border-[var(--border)] ml-4 sm:ml-6' : 'px-2'}`}>
      <div className="flex gap-3 items-start w-full">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden flex-shrink-0">
          {comment.userId?.profilePicture ? 
            <img src={`${process.env.REACT_APP_API_URL}${comment.userId.profilePicture}`} className="w-full h-full object-cover" alt="" /> :
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{comment.userId?.username?.charAt(0)}</div>
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[var(--text-main)] truncate">{comment.userId?.username}</span>
            <span className="text-[10px] text-[var(--text-dim)] whitespace-nowrap opacity-60 font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="text-[14px] text-[var(--text-main)] leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>
          
          <div className="flex items-center gap-6 mt-3">
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">Reply</button>
            <button 
              onClick={() => commentApi.vote(comment._id, 'like').then(onRefresh)} 
              className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-red-500 transition-all group"
            >
              <FaHeart size={11} className={comment.likes > 0 ? "text-red-500" : "group-hover:text-red-500"} />
              <span className="text-[11px] font-bold">{comment.likes || 0}</span>
            </button>
          </div>

          {showReplyInput && (
            <div className="mt-4 p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border)] w-full">
              <input 
                id={uniqueReplyId}
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value.slice(0, MAX_CHARS))}
                placeholder={`Reply to ${comment.userId?.username}...`}
                className="w-full bg-transparent border-b border-[var(--accent)]/30 py-1 text-sm text-[var(--text-main)] outline-none mb-3"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                   <button type="button" onClick={() => handleInsertText("**", "**", uniqueReplyId, replyText, setReplyText)} className="text-[var(--text-dim)] hover:text-[var(--accent)]"><FaBold size={12}/></button>
                   <button type="button" onClick={() => handleInsertText("_", "_", uniqueReplyId, replyText, setReplyText)} className="text-[var(--text-dim)] hover:text-[var(--accent)]"><FaItalic size={12}/></button>
                </div>
                <button onClick={handleReply} className="text-[11px] font-bold text-[var(--accent)] uppercase">Post</button>
              </div>
            </div>
          )}

          {comment.replies?.length > 0 && !isReply && (
            <button 
              onClick={() => setShowNested(!showNested)}
              className="flex items-center gap-3 mt-4 text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              <div className="w-8 h-[1px] bg-[var(--border)]" />
              {showNested ? "Hide replies" : `View ${comment.replies.length} replies`}
            </button>
          )}
        </div>
      </div>

      {showNested && comment.replies?.length > 0 && (
        <div className="mt-6 space-y-8 w-full">
          {comment.replies.map(r => (
            <CommentCard 
              key={r._id} 
              comment={r} 
              isReply={true} 
              novelId={novelId} 
              currentUser={currentUser} 
              onRefresh={onRefresh}
              handleInsertText={handleInsertText}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;