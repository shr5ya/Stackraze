import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { resolveAvatar } from '../../utils/avatarHelper';
import SavePost from '../post/savepost';

function NewsletterPost({ newsletter }) {
    const { user, token } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(newsletter?.likes?.length || 0);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (user && newsletter?.likes) {
            const userId = user._id?.$oid || user._id || user.id;
            const hasLiked = newsletter.likes.some(like => {
                const likeId = typeof like === 'string' ? like : (like._id || like.$oid);
                return likeId === userId;
            });
            setLiked(hasLiked);
        }
    }, [user, newsletter?.likes]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateVal = typeof dateString === 'object' && dateString.$date ? dateString.$date : dateString;
        return new Date(dateVal).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLike = async () => {
        if (!user) return;

        const prevLiked = liked;
        const prevCount = likesCount;

        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);

        try {
            const postId = newsletter._id?.$oid || newsletter._id;

            const res = await fetch(`${API_URL}/user/post/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error();
        } catch (err) {
            setLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    if (!newsletter) return null;

    const {
        title,
        content,
        coverImage,
        author,
        createdAt,
        summary,
    } = newsletter;

    const authorName = author?.name || 'Unknown';
    const authorUsername = author?.username || 'anonymous';
    const authorAvatar = author?.avatar;
    const postId = newsletter._id?.$oid || newsletter._id;

    return (
        <article className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#0c0e12] transition-colors duration-200">

            {/* Cover Image */}
            {coverImage && (
                <div
                    className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Reading time */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/50 rounded-full">
                        <Clock className="w-3 h-3 text-white/80" />
                        <span className="text-[10px] text-white/90">
                            {Math.max(1, Math.ceil((content?.length || 0) / 1000))} min
                        </span>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-3 sm:p-4">

                {/* Author */}
                <div className="flex items-center gap-2 mb-2">
                    <Link to={`/profile/${authorUsername}`}>
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs overflow-hidden">
                            {authorAvatar ? (
                                <img
                                    src={resolveAvatar(authorAvatar) || authorAvatar}
                                    alt={authorName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getInitials(authorName)
                            )}
                        </div>
                    </Link>

                    <div className="flex flex-col leading-tight">
                        <Link
                            to={`/profile/${authorUsername}`}
                            className="text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
                        >
                            {authorName}
                        </Link>

                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {formatDate(createdAt)}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h2
                    onClick={() => setExpanded(!expanded)}
                    className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white leading-snug mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                >
                    {title}
                </h2>

                {/* Content */}
                <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {expanded ? (
                        <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                        <p>
                            {summary || (content?.length > 180 ? content.slice(0, 180) + '...' : content)}
                            {content?.length > 180 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="ml-1 text-blue-600 dark:text-blue-400 text-xs"
                                >
                                    Read more
                                </button>
                            )}
                        </p>
                    )}

                    {expanded && (
                        <button
                            onClick={() => setExpanded(false)}
                            className="mt-2 text-blue-600 dark:text-blue-400 text-xs"
                        >
                            Show less
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 mt-4 pt-3">
                    {!newsletter.isExternal ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">

                                {/* Like */}
                                <button onClick={handleLike} className="flex items-center gap-1">
                                    <Heart
                                        className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`}
                                    />
                                    {likesCount > 0 && (
                                        <span className="text-xs">
                                            {formatNumber(likesCount)}
                                        </span>
                                    )}
                                </button>

                                {/* Comments */}
                                <div className="flex items-center gap-1 text-neutral-500">
                                    <MessageCircle className="w-4 h-4" />
                                    {newsletter.commentsCount > 0 && (
                                        <span className="text-xs">
                                            {formatNumber(newsletter.commentsCount)}
                                        </span>
                                    )}
                                </div>

                                {/* Save */}
                                <SavePost postId={postId} initialSaved={!!newsletter.isSaved} />
                            </div>

                            {/* Share */}
                            <button className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <Send className="w-4 h-4 text-neutral-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <a
                                href={newsletter.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Read Full <Send className="w-3 h-3" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default NewsletterPost;