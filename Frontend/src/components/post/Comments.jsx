import React, { useState, useEffect } from 'react';
import { Loader2, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { resolveAvatar } from '../../utils/avatarHelper';

function Comments({ postId, latestComment, commentsCount: initialCount, currentUserAvatar, forceOpen }) {
    const { user, token } = useAuth();

    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentsCount, setCommentsCount] = useState(initialCount || 0);
    const [error, setError] = useState(null);

    // Sync with the comment icon toggle from Post.jsx
    useEffect(() => {
        if (forceOpen && !open) {
            setOpen(true);
            fetchComments();
        } else if (!forceOpen && open) {
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forceOpen]);

    // Fetch comments from API
    const fetchComments = async () => {
        if (comments.length > 0) return; // already fetched
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/user/post/comments/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setComments(data.comments || []);
                setCommentsCount(data.totalComments || 0);
            } else {
                setError('Failed to load comments.');
            }
        } catch {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    // Toggle open/close (called from within component)
    const handleToggle = () => {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
            fetchComments();
        }
    };

    // Submit a new comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = commentText.trim();
        if (!text || !user) return;

        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/user/post/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            });

            const data = await res.json();
            if (res.ok) {
                // Prepend new comment (open the section if not already open)
                setComments((prev) => [data.comment, ...prev]);
                setCommentsCount(data.totalComments);
                setCommentText('');
                if (!open) setOpen(true);
            } else {
                setError(data.message || 'Failed to post comment.');
            }
        } catch {
            setError('Network error.');
        } finally {
            setSubmitting(false);
        }
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const CommentItem = ({ comment }) => (
        <div className="flex items-start gap-2.5 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                {comment.avatar ? (
                    <img src={resolveAvatar(comment.avatar)} alt={comment.username} className="w-full h-full object-cover" />
                ) : (
                    <span>{comment.username?.[0]?.toUpperCase() || 'U'}</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3 py-2">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mr-1.5">
                        @{comment.username}
                    </span>
                    <span className="text-sm text-neutral-800 dark:text-neutral-200 break-words">
                        {comment.text}
                    </span>
                </div>
                <span className="text-xs text-neutral-400 ml-2 mt-0.5 block">
                    {getTimeAgo(comment.createdAt)}
                </span>
            </div>
        </div>
    );

    return (
        <div className="border-t border-neutral-100 dark:border-neutral-800">

            {/* Latest comment preview (collapsed state) */}
            {!open && latestComment && (
                <button
                    onClick={handleToggle}
                    className="w-full text-left px-4 pt-2 pb-1 group"
                >
                    <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                            {latestComment.avatar ? (
                                <img src={resolveAvatar(latestComment.avatar)} alt={latestComment.username} className="w-full h-full object-cover" />
                            ) : (
                                <span>{latestComment.username?.[0]?.toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3 py-2">
                                <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mr-1.5">
                                    @{latestComment.username}
                                </span>
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-1">
                                    {latestComment.text}
                                </span>
                            </div>
                        </div>
                    </div>
                    {commentsCount > 1 && (
                        <p className="text-xs text-neutral-400 ml-9 mt-1 group-hover:text-blue-500 transition-colors">
                            View all {commentsCount} comments
                        </p>
                    )}
                </button>
            )}

            {/* View / hide comments toggle button */}
            {commentsCount > 0 && (
                <button
                    onClick={handleToggle}
                    className="flex items-center gap-1 px-4 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-blue-500 transition-colors"
                >
                    {open ? (
                        <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Hide comments
                        </>
                    ) : (
                        !latestComment ? `View ${commentsCount} comment${commentsCount !== 1 ? 's' : ''}` : null
                    )}
                </button>
            )}

            {/* Expanded comments list */}
            {open && (
                <div className="px-4 pb-2 max-h-72 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                        </div>
                    ) : error ? (
                        <p className="text-xs text-red-500 py-2">{error}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-xs text-neutral-400 py-2">No comments yet. Be the first!</p>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                            {comments.map((c, i) => (
                                <CommentItem key={i} comment={c} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Comment input */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                    {currentUserAvatar ? (
                        <img src={currentUserAvatar} alt="You" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user?.username?.[0]?.toUpperCase() || 'U'
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment…"
                        maxLength={300}
                        disabled={submitting}
                        className="flex-1 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none disabled:opacity-50"
                    />
                    {commentText.trim() && (
                        <button
                            type="submit"
                            disabled={submitting}
                            className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Comments;