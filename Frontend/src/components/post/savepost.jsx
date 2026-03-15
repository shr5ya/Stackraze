import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

function SavePost({ postId, initialSaved = false }) {
  const { user, token } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  // Sync with initialSaved if it changes (e.g. parent re-renders)
  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleToggleSave = async () => {
    if (!user || !token) return; // silently ignore if not logged in

    const previousSaved = saved;
    // Optimistic update
    setSaved(!saved);
    setLoading(true);

    try {
      const method = previousSaved ? "DELETE" : "POST";
      const response = await fetch(`${API_URL}/user/post/savepost/${postId}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle save");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      // Revert on error
      setSaved(previousSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading || !user}
      title={!user ? "Log in to save posts" : saved ? "Unsave post" : "Save post"}
      className={`flex items-center gap-1.5 group transition-opacity ${loading ? "opacity-50 cursor-wait" : !user ? "opacity-40 cursor-default" : "cursor-pointer"
        }`}
    >
      <Bookmark
        className={`w-6 h-6 transition-all duration-200 ${saved
            ? "fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white scale-110"
            : "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
          }`}
      />
    </button>
  );
}

export default SavePost;
