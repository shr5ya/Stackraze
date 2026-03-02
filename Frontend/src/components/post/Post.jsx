import React, { useState, useMemo, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostMoreOptions from './PostMoreOptions';
import PostContent from './PostContent';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { resolveAvatar } from '../../utils/avatarHelper';

function Post({ post }) {
    const { user, token } = useAuth();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
    const [comment, setComment] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);

    // Initialize liked state based on user and post.likes
    useEffect(() => {
        if (user && post?.likes) {
            // Handle user ID if it has $oid structure
            const userId = user._id?.$oid || user._id || user.id;
            const hasLiked = post.likes.some(like => {
                // Handle various like formats: string ID, object with _id, or object with $oid
                const likeId = typeof like === 'string' ? like : (like._id || like.$oid);
                return likeId === userId;
            });
            setLiked(hasLiked);
        }
    }, [user, post?.likes]);

    // Load current user avatar from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                const avatar = resolveAvatar(userData.avatar);
                setCurrentUserAvatar(avatar);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Format time ago
    const getTimeAgo = (dateString) => {
        if (!dateString) return '';

        const dateVal =
            typeof dateString === 'object' && dateString.$date
                ? dateString.$date
                : dateString;

        const now = new Date();
        const date = new Date(dateVal);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    };

    // Get author initials
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLike = async () => {
        if (!user) {
            // Optional: Prompt login
            return;
        }

        // Optimistic update
        const previousLiked = liked;
        const previousCount = likesCount;

        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);

        try {
            // Determine post ID (handle $oid if necessary)
            const postId = post._id?.$oid || post._id;

            const response = await fetch(`${API_URL}/user/post/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            // Optional: Update state with actual data from backend if it returns the updated post
            // const updatedPost = await response.json();
            // setLikesCount(updatedPost.likes.length);

        } catch (error) {
            console.error('Error liking post:', error);
            // Revert on error
            setLiked(previousLiked);
            setLikesCount(previousCount);
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            console.log('Comment:', comment);
            setComment('');
        }
    };

    // Format numbers (1000 -> 1k)
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    if (!post) {
        return null;
    }

    // Hide post if image failed to load
    if (imageError) {
        return null;
    }

    const { content, photos = [], author, createdAt, comments = [], shares = 0 } = post;

    // Handle author ID and name extraction safely
    const authorName = author?.name || 'Unknown';
    const authorUsername = author?.username || 'anonymous';
    const authorAvatar = author?.avatar;
    const authorId = author?._id?.$oid || author?._id;
    const postId = post._id?.$oid || post._id;

    return (
        <div className="bg-white dark:bg-[#0c0e12] rounded-xl border-2 border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {/* Author Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
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

                    {/* Author Info */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                            {authorName}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            <Link
                                to={`/profile/${authorUsername}`}
                                className="hover:underline cursor-pointer"
                            >
                                @{authorUsername}
                            </Link>
                            {" · "}{getTimeAgo(createdAt)}
                        </span>
                    </div>
                </div>

                {/* More Options */}
                <PostMoreOptions postId={postId} authorId={authorId} />
            </div>

            {/* Content */}
            <PostContent content={post.content} />


            {/* Photos */}
            {photos.length > 0 && (
                <div className="relative group">
                    <img
                        src={photos[currentImageIndex]}
                        alt="Post"
                        className="w-full aspect-video object-contain bg-black"
                        onError={() => setImageError(true)}
                    />

                    {/* Left Arrow Button */}
                    {photos.length > 1 && currentImageIndex > 0 && (
                        <button
                            onClick={() => setCurrentImageIndex(prev => prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/90 hover:scale-110"
                        >
                            <ChevronLeft className="w-5 h-5 text-neutral-800 dark:text-white" />
                        </button>
                    )}

                    {/* Right Arrow Button */}
                    {photos.length > 1 && currentImageIndex < photos.length - 1 && (
                        <button
                            onClick={() => setCurrentImageIndex(prev => prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/90 hover:scale-110"
                        >
                            <ChevronRight className="w-5 h-5 text-neutral-800 dark:text-white" />
                        </button>
                    )}

                    {/* Image Navigation Dots */}
                    {photos.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                        ? 'bg-white w-4'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image Counter */}
                    {photos.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {currentImageIndex + 1}/{photos.length}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 group"
                    >
                        <Heart
                            className={`w-6 h-6 transition-all ${liked
                                ? 'fill-red-500 text-red-500 scale-110'
                                : 'text-neutral-600 dark:text-neutral-400 group-hover:text-red-500'
                                }`}
                        />
                        {likesCount > 0 && (
                            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400'
                                }`}>
                                {formatNumber(likesCount)}
                            </span>
                        )}
                    </button>

                    {/* Comment */}
                    <button className="flex items-center gap-1.5 group">
                        <MessageCircle className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-blue-500 transition-colors" />
                        {comments.length > 0 && (
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                {formatNumber(comments.length)}
                            </span>
                        )}
                    </button>

                    {/* Save */}
                    <button
                        onClick={() => setSaved(!saved)}
                        className="flex items-center gap-1.5 group"
                    >
                        <Bookmark
                            className={`w-6 h-6 transition-all ${saved
                                ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                                : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
                                }`}
                        />
                    </button>
                </div>

                {/* Share */}
                <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Send className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                    {currentUserAvatar ? (
                        <img src={currentUserAvatar} alt="You" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        'U'
                    )}
                </div>
                <form onSubmit={handleComment} className="flex-1 flex items-center">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment"
                        className="flex-1 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
                    />
                    {comment.trim() && (
                        <button
                            type="submit"
                            className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors"
                        >
                            Post
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Post;