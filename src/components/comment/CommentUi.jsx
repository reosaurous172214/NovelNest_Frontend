import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaHeart,
  FaBold,
  FaItalic,
  FaSmile,
  FaTrash,
  FaReply,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
} from "react-icons/fa";
import { commentApi } from "../../api/commentApi";

const MAX_CHARS = 1000;

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
            <FaExclamationCircle size={24} />
          </div>
          <h4 className="text-lg font-bold text-[var(--text-main)] mb-2">
            Delete Comment?
          </h4>
          <p className="text-sm text-[var(--text-dim)] mb-8">
            Permanent actions cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold text-[var(--text-dim)] hover:bg-[var(--bg-primary)] rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ novelId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  const loadComments = async () => {
    try {
      const data = await commentApi.getByNovel(novelId);
      setComments(data);
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [novelId]);

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
    } catch (err) {
      console.error("Post failed", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    setDeleteLoading(true);
    try {
      await commentApi.remove(commentToDelete);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowModal(false);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInsertText = (before, after, inputId, currentVal, setter) => {
    const textarea = document.getElementById(inputId);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const result =
      currentVal.substring(0, start) +
      before +
      currentVal.substring(start, end) +
      after +
      currentVal.substring(end);
    setter(result);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="w-full mt-12 space-y-8 pb-20 text-left px-2 sm:px-0">
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--border)] pb-4 gap-4">
        <h3 className="text-lg font-bold text-[var(--text-main)]">
          Discussion ({comments.length})
        </h3>
        <div className="flex gap-2 sm:gap-4 items-center">
          {["newest", "popular"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all ${sortBy === type ? "text-[var(--accent)] border-b-2 border-[var(--accent)]" : "text-[var(--text-dim)]"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FORM - Responsive Adjustments */}
      <div
        className={`transition-all border rounded-2xl ${isFocused ? "border-[var(--accent)] bg-[var(--bg-secondary)] shadow-lg" : "border-[var(--border)] bg-[var(--bg-secondary)]/50"} p-3 sm:p-5 w-full`}
      >
        <form onSubmit={handlePostComment} className="w-full">
          <textarea
            id="main-editor"
            value={newComment}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setNewComment(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Write your thoughts..."
            className="w-full bg-transparent text-sm text-[var(--text-main)] focus:outline-none resize-none min-h-[44px]"
            style={{ height: isFocused || newComment ? "120px" : "44px" }}
          />
          {(isFocused || newComment) && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-[var(--border)] gap-4">
              <div className="flex gap-6 text-[var(--text-dim)]">
                <button
                  type="button"
                  onClick={() =>
                    handleInsertText(
                      "**",
                      "**",
                      "main-editor",
                      newComment,
                      setNewComment,
                    )
                  }
                  className="hover:text-[var(--accent)]"
                >
                  <FaBold size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertText(
                      "_",
                      "_",
                      "main-editor",
                      newComment,
                      setNewComment,
                    )
                  }
                  className="hover:text-[var(--accent)]"
                >
                  <FaItalic size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertText(
                      "😊",
                      "",
                      "main-editor",
                      newComment,
                      setNewComment,
                    )
                  }
                  className="hover:text-[var(--accent)]"
                >
                  <FaSmile size={14} />
                </button>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[10px] font-mono text-[var(--text-dim)]">
                  {newComment.length}/{MAX_CHARS}
                </span>
                <button
                  disabled={loading || !newComment.trim()}
                  className="bg-[var(--accent)] text-white text-xs font-bold px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-30"
                >
                  {loading ? "..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {sortedComments.map((c) => (
          <CommentCard
            key={c._id}
            comment={c}
            currentUser={currentUser}
            novelId={novelId}
            onRefresh={loadComments}
            onDelete={triggerDelete}
            handleInsertText={handleInsertText}
          />
        ))}
      </div>
    </div>
  );
};

const CommentCard = ({
  comment,
  currentUser,
  novelId,
  onRefresh,
  onDelete,
  handleInsertText,
  isReply = false,
  rootId = null,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [replyText, setReplyText] = useState("");
  const [showNested, setShowNested] = useState(false);

  const isOwner = currentUser?._id === comment.userId?._id;
  const currentRootId = rootId || comment._id;
  const editorId = `edit-${comment._id}`;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      // FIX: Always reply to the rootId to keep flat threading, but add @mention
      const contentWithMention = isReply
        ? `@${comment.userId?.username} ${replyText}`
        : replyText;
      await commentApi.postReply(currentRootId, contentWithMention, novelId);
      setReplyText("");
      setShowReplyInput(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await commentApi.edit(comment._id, novelId, editText);
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`group w-full ${isReply ? "pl-4 sm:pl-8 border-l-2 border-[var(--border)] mt-4" : "border-b border-[var(--border)]/30 pb-6"}`}
    >
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden flex-shrink-0">
          {comment.userId?.profilePicture ? (
            <img
              src={`${process.env.REACT_APP_API_URL}${comment.userId.profilePicture}`}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-[var(--accent)] text-white">
              {comment.userId?.username?.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                {comment.userId?.username}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--text-dim)] opacity-70 italic">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isOwner && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[var(--text-dim)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="text-[var(--text-dim)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaTrash size={12} />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                id={editorId}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--accent)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-3 text-[var(--text-dim)]">
                  <button
                    onClick={() =>
                      handleInsertText(
                        "**",
                        "**",
                        editorId,
                        editText,
                        setEditText,
                      )
                    }
                  >
                    <FaBold size={12} />
                  </button>
                  <button
                    onClick={() =>
                      handleInsertText(
                        "_",
                        "_",
                        editorId,
                        editText,
                        setEditText,
                      )
                    }
                  >
                    <FaItalic size={12} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] font-bold text-[var(--text-dim)] px-3 py-1 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="bg-[var(--accent)] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[13px] sm:text-[14px] text-[var(--text-main)] leading-relaxed prose prose-invert max-w-none mb-3 overflow-hidden">
              <ReactMarkdown>{comment.content}</ReactMarkdown>
            </div>
          )}

          <div className="flex items-center gap-4 sm:gap-6 mt-3">
            <button
              onClick={() =>
                commentApi.vote(comment._id, "like").then(onRefresh)
              }
              className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-red-500"
            >
              <FaHeart
                size={11}
                className={comment.likes > 0 ? "text-red-500" : ""}
              />
              <span className="text-[11px] font-bold">
                {comment.likes || 0}
              </span>
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--accent)]"
            >
              <FaReply size={11} /> Reply
            </button>
          </div>

          {showReplyInput && (
            <div className="mt-4 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] w-full animate-in slide-in-from-top-1">
              <input
                id={`reply-${comment._id}`}
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.userId?.username}...`}
                className="w-full bg-transparent border-b border-[var(--accent)]/30 py-2 text-sm text-[var(--text-main)] outline-none mb-3"
              />
              <div className="flex justify-end gap-3 items-center">
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="text-[10px] font-bold text-[var(--text-dim)] uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="text-[10px] font-bold text-[var(--accent)] uppercase"
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {comment.replies?.length > 0 && !isReply && (
            <button
              onClick={() => setShowNested(!showNested)}
              className="mt-4 text-[11px] font-bold text-[var(--accent)] flex items-center gap-2"
            >
              {showNested ? (
                <FaChevronUp size={10} />
              ) : (
                <FaChevronDown size={10} />
              )}
              {showNested ? "Hide" : `Show ${comment.replies.length} replies`}
            </button>
          )}

          {showNested &&
            comment.replies?.map((r) => (
              <CommentCard
                key={r._id}
                comment={r}
                isReply={true}
                rootId={currentRootId} // Pass down the rootId to flat-thread deep replies
                novelId={novelId}
                currentUser={currentUser}
                onRefresh={onRefresh}
                onDelete={onDelete}
                handleInsertText={handleInsertText}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
