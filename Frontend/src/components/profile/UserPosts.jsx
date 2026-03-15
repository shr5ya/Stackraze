import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config/api';
import Post from '@/components/post/Post';
import PostSkeleton from '@/components/post/PostSkeleton';
import { FileText, Bookmark, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

function UserPosts({ username }) {
  const { user, token } = useAuth();

  // Own posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'

  // Saved posts state
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState(null);
  const [savedFetched, setSavedFetched] = useState(false); // lazy — only fetch once

  const isOwnProfile = user?.username === username;

  // Scroll to top on profile change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [username]);

  // ── Fetch user's own posts ──
  useEffect(() => {
    if (!username) { setLoading(false); return; }
    if (!token) { setLoading(false); return; }

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/user/post/userposts/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch posts');
        }

        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, token]);

  // ── Fetch saved posts (lazy — only runs when Saved tab is first opened) ──
  useEffect(() => {
    if (activeTab !== 'saved') return;
    if (savedFetched) return;
    if (!token || !username) return;

    const fetchSavedPosts = async () => {
      try {
        setSavedLoading(true);
        setSavedError(null);

        const res = await fetch(`${API_URL}/user/post/savedposts/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch saved posts');
        }

        const data = await res.json();
        setSavedPosts(Array.isArray(data.savedPosts) ? data.savedPosts : []);
        setSavedFetched(true);
      } catch (err) {
        console.error('Error fetching saved posts:', err);
        setSavedError(err.message);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchSavedPosts();
  }, [activeTab, savedFetched, token, username]);

  // Reset saved cache when navigating to a different profile
  useEffect(() => {
    setSavedPosts([]);
    setSavedFetched(false);
    setSavedError(null);
    setActiveTab('posts');
  }, [username]);

  if (error === 'User not found') return null;

  const postLabel = isOwnProfile ? 'Your Posts' : 'Posts';

  return (
    <div className="max-w-3xl w-full mx-auto mt-4 pb-8">

      {/* Tab Header — only shown when logged in */}
      {user && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 bg-white dark:bg-black rounded-t-md shadow-sm">

          {/* Posts Tab */}
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-semibold text-center flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'posts'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <FileText className="w-4 h-4" />
            {postLabel}
          </button>

          {/* Saved Posts Tab — own profile only */}
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 text-sm font-semibold text-center flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'saved'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          )}
        </div>
      )}

      {/* ── POSTS TAB ── */}
      {activeTab === 'posts' && (
        <>
          {/* Loading skeletons */}
          {loading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="text-sm">Could not load posts: {error}</p>
            </div>
          )}

          {/* Not logged in */}
          {!token && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
              <LogIn className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">Please login to see posts</p>
              <Link to="/login" className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors">
                Login
              </Link>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && token && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
              <FileText className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">
                {isOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
              </p>
            </div>
          )}

          {/* Posts list */}
          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── SAVED POSTS TAB ── */}
      {activeTab === 'saved' && (
        <>
          {/* Loading skeletons */}
          {savedLoading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
            </div>
          )}

          {/* Error state */}
          {!savedLoading && savedError && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="text-sm">Could not load saved posts: {savedError}</p>
            </div>
          )}

          {/* Empty state */}
          {!savedLoading && !savedError && savedPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
              <Bookmark className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">No saved posts yet.</p>
              <p className="text-xs opacity-60">Posts you bookmark will appear here.</p>
            </div>
          )}

          {/* Saved posts list */}
          {!savedLoading && !savedError && savedPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              {savedPosts.map((post) => (
                <Post key={post._id?.$oid || post._id} post={post} initialSaved={true} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default UserPosts;