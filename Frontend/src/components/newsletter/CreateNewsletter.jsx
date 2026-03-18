import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Send, Loader2, ChevronDown } from 'lucide-react';
import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload';
import { resolveAvatar } from '../../utils/avatarHelper';
import { Avatar1 } from '../../assets/Avatars';
import { API_URL } from '../../config/api';

const CATEGORIES = [
    'General',
    'Technology',
    'Politics',
    'Science',
    'Business',
    'Health',
    'Sports',
    'Entertainment',
    'Education',
    'Climate',
    'World',
];

// Compact trigger bar (what users see on the page)
function CreateNewsletterCompact({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-neutral-900 rounded-xl p-4 cursor-pointer
                hover:bg-neutral-50 dark:hover:bg-neutral-800/50
                transition-colors border border-neutral-200 dark:border-neutral-800"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Send className="w-5 h-5 text-white -rotate-45" />
                </div>
                <div className="flex flex-col">
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">Write an Article</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-xs">Share your insights with the community</span>
                </div>
            </div>
        </div>
    );
}

// Full modal
function CreateNewsletterModal({ onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [summary, setSummary] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [user, setUser] = useState({ name: '', username: '', avatar: '' });
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const MAX_TITLE = 200;
    const MAX_CONTENT = 5000;
    const MAX_SUMMARY = 300;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                const avatarImage = resolveAvatar(userData.avatar) || Avatar1;
                setUser({
                    name: userData.name || 'User',
                    username: userData.username || 'username',
                    avatar: avatarImage,
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCoverImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setCoverPreview(ev.target.result);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeCover = () => {
        setCoverImage(null);
        setCoverPreview(null);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !coverImage) return;

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            let coverUrl = '';

            // Upload cover image to Cloudinary
            setIsUploading(true);
            coverUrl = await uploadImageToCloudinary(coverImage, 'newsletters');
            setIsUploading(false);

            // Create newsletter
            const response = await fetch(`${API_URL}/newsletter/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    category,
                    summary: summary.trim() || undefined,
                    coverImage: coverUrl,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setTitle('');
                setContent('');
                setCategory('General');
                setSummary('');
                setCoverImage(null);
                setCoverPreview(null);
                if (onSubmit) onSubmit(data.newsletter);
                if (onClose) onClose();
            } else {
                alert(data.message || 'Failed to create newsletter');
            }
        } catch (error) {
            console.error('Error creating newsletter:', error);
            alert(error.message || 'Failed to create newsletter');
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    const isValid = title.trim() && content.trim() && coverImage;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-[700px] rounded-2xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Send className="w-5 h-5 text-white -rotate-45" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Write Newsletter</h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Share your story with the world</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Cover Image Upload */}
                    {coverPreview ? (
                        <div className="relative rounded-xl overflow-hidden">
                            <img src={coverPreview} alt="Cover" className="w-full aspect-[16/9] object-cover" />
                            <button
                                onClick={removeCover}
                                disabled={isSubmitting}
                                className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-[16/9] border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                        >
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                <Image className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Upload Cover Image</p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Click to browse · JPG, PNG, WebP</p>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                    />

                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
                            placeholder="Article title..."
                            disabled={isSubmitting}
                            className="w-full bg-transparent text-2xl font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 focus:outline-none"
                        />
                        <div className="text-right text-xs text-neutral-400 mt-1">{title.length}/{MAX_TITLE}</div>
                    </div>

                    {/* Category Selector */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <span>{category}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-10 py-1 min-w-[160px] max-h-[200px] overflow-y-auto">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setCategory(cat);
                                            setShowCategoryDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${category === cat
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value.slice(0, MAX_SUMMARY))}
                            placeholder="Brief summary (optional — auto-generated if left blank)"
                            disabled={isSubmitting}
                            rows={2}
                            className="w-full bg-neutral-50 dark:bg-neutral-800/50 text-sm text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 border border-neutral-200 dark:border-neutral-700"
                        />
                        <div className="text-right text-xs text-neutral-400 mt-1">{summary.length}/{MAX_SUMMARY}</div>
                    </div>

                    {/* Content */}
                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
                            placeholder="Write your article content here..."
                            disabled={isSubmitting}
                            rows={12}
                            className="w-full bg-transparent text-[15px] text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none focus:outline-none leading-relaxed"
                        />
                        <div className="text-right text-xs text-neutral-400 mt-1">{content.length}/{MAX_CONTENT}</div>
                    </div>

                    {/* Upload progress */}
                    {isUploading && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                    Uploading cover image...
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-2xl">
                    <div className="text-xs text-neutral-400">
                        {!coverImage && <span className="text-amber-500">⚠ Cover image required</span>}
                        {coverImage && !title.trim() && <span className="text-amber-500"> ⚠ Title required</span>}
                        {coverImage && title.trim() && !content.trim() && <span className="text-amber-500"> ⚠ Content required</span>}
                        {isValid && <span className="text-green-500">✓ Ready to publish</span>}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isValid}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all font-semibold text-sm ${isSubmitting || !isValid
                            ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                            }`}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main component
function CreateNewsletter({ onSubmit }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <CreateNewsletterCompact onClick={() => setIsModalOpen(true)} />

            {isModalOpen && (
                <CreateNewsletterModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(newsletter) => {
                        setIsModalOpen(false);
                        if (onSubmit) onSubmit(newsletter);
                    }}
                />
            )}
        </>
    );
}

export default CreateNewsletter;
export { CreateNewsletterCompact, CreateNewsletterModal };
