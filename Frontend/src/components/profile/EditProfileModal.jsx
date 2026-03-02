import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, User, Mail, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAvatarUpload from "@/hooks/useAvatarUpload";
import { useAuth } from "@/context/AuthContext";
import { resolveAvatar } from "@/utils/avatarHelper";
import { API_URL } from "@/config/api";
import { usePopup } from "@/context/PopupContext";

function EditProfileModal({ isOpen, onClose }) {
  const { user, login, token } = useAuth();
  const { uploadAvatar, isUploading } = useAvatarUpload();
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    about: user?.about || "",
  });

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [previewAvatar, setPreviewAvatar] = useState(
    resolveAvatar(user?.avatar),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Reset the modal state every time it opens to reflect the latest user data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        about: user?.about || "",
      });
      setAvatarUrl(user?.avatar || "");
      setPreviewAvatar(resolveAvatar(user?.avatar));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewAvatar(localUrl);

    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
      showPopup("Profile photo uploaded successfully!", "success");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      showPopup(err.message || "Failed to upload profile photo", "error");
      // Revert preview on failure
      setPreviewAvatar(resolveAvatar(user?.avatar));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        avatar: avatarUrl,
      };

      const res = await fetch(`${API_URL}/user/updateData`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Handle non-JSON responses (like 404 HTML pages or empty responses)
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from server:", res.status, text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (res.ok) {
        showPopup("Profile updated successfully!", "success");
        // Update local context
        const oldUsername = user.username;
        const newUsername = data.userData.username;
        login(data.userData, token);

        setTimeout(() => {
          onClose();
          if (oldUsername !== newUsername) {
            navigate(`/profile/${newUsername}`);
          }
        }, 500);
      } else {
        throw new Error(data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      showPopup(err.message || "Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={previewAvatar}
                  alt="Profile"
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-sm transition-opacity ${isUploading ? "opacity-50" : "group-hover:opacity-75"}`}
                />

                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Upload className="w-8 h-8 text-white" />
                </div>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                Change Profile Photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                    placeholder="choose_username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  About / Bio
                </label>
                <textarea
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleInputChange}
                  className="block w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow resize-none"
                  placeholder="Tell us a little bit about yourself..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 dark:border-zinc-800 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
