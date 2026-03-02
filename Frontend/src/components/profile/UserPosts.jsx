import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config/api';
import Post from '@/components/post/Post';
import PostSkeleton from '@/components/post/PostSkeleton';
import { FileText, Bookmark, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

function UserPosts({ username }) {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'

  const isOwnProfile = user?.username === username;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // window.scrollTo(0, 0);
  }, [username]);

  useEffect(() => {
    // Only fetch posts if username is provided
    if (!username) {
      setLoading(false);
      return;
    }

    // Only fetch if logged in (route requires auth)
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/user/post/userposts/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Don't show anything if there's no username
  if (error === "User not found") return null;

  const postLabel = isOwnProfile ? 'Your Posts' : `Posts`;
  const savedLabel = 'Saved';

  return (
    <div className="max-w-3xl w-full mx-auto mt-4 pb-8">
      {/* Tab Header */}
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

        {/* Saved Posts Tab */}
        {isOwnProfile && (
          <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 text-sm font-semibold text-center flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'saved'
            ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          <Bookmark className="w-4 h-4" />
          {savedLabel}
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
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="text-sm">Could not load posts: {error}</p>
            </div>
          )}

          {/* Not logged in state */}
          {!token && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
              <LogIn className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">Please login to see posts</p>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
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
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
          <Bookmark className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">Saved posts coming soon.</p>
        </div>
      )}
    </div>
  );
}

export default UserPosts;