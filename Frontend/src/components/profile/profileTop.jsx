import React, { useState, useEffect } from "react";
import { resolveAvatar } from "@/utils/avatarHelper";
import { useAuth } from "@/context/AuthContext";
import { Link, Pen, X } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import { API_URL } from "@/config/api";

function ProfileTop({ username }) {
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/user/profile?username=${username}`);
        if (!res.ok) {
          throw new Error("Profile not found");
        }
        const data = await res.json();
        setProfileUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const isOwnProfile = user?.username === username;
  const displayUser = isOwnProfile ? user : profileUser;
  const userAvatar = resolveAvatar(displayUser?.avatar);

  if (loading) {
    return (
      <div className="max-w-3xl w-full mx-auto p-10 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !displayUser) {
    return (
      <div className="max-w-3xl w-full mx-auto p-10 text-center text-gray-500 dark:text-gray-400">
        <p className="text-xl font-semibold mb-2">User not found</p>
        <p>The profile you are looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-black rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-200">
        {/* Banner */}
        <div className="h-28 bg-gray-200 sm:h-40 w-full" />

        {/* Profile Info */}
        <div className="relative px-6 sm:px-8 pb-6">
          {/* Avatar + Edit Row */}
          <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-3">
            <div className="relative inline-block">
              <img
                onClick={() => setIsImageModalOpen(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 cursor-pointer active:scale-95"
                src={userAvatar}
                alt={displayUser?.name || "Avatar"}
              />
            </div>

            {/* ORIGINAL Edit Button — unchanged */}
            <div className="flex gap-4 text-gray-400 dark:text-gray-500 mb-2 sm:mb-4">
              <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors hidden">
                <Link className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {isOwnProfile && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Pen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                    Edit Profile
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Name + Username */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {displayUser?.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            @{displayUser?.username}
          </p>

          {/* Divider */}
          <hr className="my-4 border-gray-300 dark:border-gray-600" />

          {/* About */}
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
            About
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {displayUser?.about || "....."}
          </p>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* Modal Content Container */}
          <div
            className="relative flex justify-center max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevents clicking the image from closing the modal
          >
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Enlarged Avatar */}
            <img
              src={userAvatar}
              alt={displayUser?.name || "Full size avatar"}
              className="object-contain max-w-full max-h-[85vh] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export default ProfileTop;
