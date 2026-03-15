import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UploadPost from "@/components/post/UploadPost";
import Post from "@/components/post/Post";
import PostSkeleton from "@/components/post/PostSkeleton";
import { usePopup } from "@/context/PopupContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const fetchingRef = useRef(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // scroll to top 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // window.scrollTo(0, 0); //hard scroll
  }, []);


  const fetchPosts = async (pageNum) => {
    if (fetchingRef.current || loading) return;
    if (!hasMore && pageNum > 1) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/user/post/allPosts?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const newPosts = data.posts || [];

        setPosts((prev) => {
          if (pageNum === 1) {
            return newPosts;
          }

          const existingIds = new Set(prev.map((p) => p._id));
          const uniqueNewPosts = newPosts.filter(
            (p) => !existingIds.has(p._id),
          );

          return [...prev, ...uniqueNewPosts];
        });

        if (pageNum >= data.totalPages || newPosts.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else if (response.status === 404) {
        setHasMore(false);
      } else if (response.status === 401) {
        setHasMore(false);
        showPopup("Token expired! Please login again.", "error");
        setTimeout(() => {
          logout();
          navigate("/login", { replace: true });
        }, 1000);
        return;
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasMore &&
          !loading &&
          !fetchingRef.current
        ) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchPosts(nextPage);
            return nextPage;
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading]);

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Sidebar />

      {/* Main content — centered on screen */}
      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          {/* Create Post */}
          <UploadPost onSubmit={handleNewPost} />

          {/* Posts Feed */}
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}

          {/* Infinite scroll loader */}
          <div
            ref={loaderRef}
            className="flex items-center justify-center w-full py-4"
          >
            {loading && <PostSkeleton />}
          </div>

          {/* End of Feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4 text-neutral-500 text-sm">
              No more posts to show.
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && !initialLoad && (
            <div className="text-center py-8 text-neutral-500">
              No posts yet. Be the first to share something!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
