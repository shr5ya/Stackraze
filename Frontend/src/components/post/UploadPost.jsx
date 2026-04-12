import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "../../config/api";
import { X, Image, Send, Globe, Loader2 } from "lucide-react";
import { uploadMultipleImagesToCloudinary } from "../../utils/cloudinaryUpload";
import { resolveAvatar } from "../../utils/avatarHelper";
import { Avatar1 } from "../../assets/Avatars";
// import Doodle from "@/assets/doodle.jpg"
import PostTextInput from "./PostTextInput";

// Compact inline component (what user sees on the page)
function UploadPostCompact({ onClick }) {
  const [user, setUser] = useState({ name: "", username: "", avatar: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const avatarImage = resolveAvatar(userData.avatar) || Avatar1;
        setUser({
          name: userData.name || "User",
          username: userData.username || "username",
          avatar: avatarImage,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-900 rounded-xl p-3 cursor-pointer 
             hover:bg-neutral-50 dark:hover:bg-neutral-800
             border border-neutral-200 dark:border-neutral-800"
    >
      {/* Avatar + Placeholder */}
      <div className="flex items-center gap-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full 
                      bg-gradient-to-br from-zinc-500 to-zinc-600 
                      flex items-center justify-center 
                      text-white font-semibold text-xs"
          >
            {getInitials(user.name || "U")}
          </div>
        )}

        <span className="text-neutral-400 dark:text-neutral-500 text-base">
          Start writing...
        </span>
      </div>

      {/* Share Something (compact) */}
      <div className="flex items-center gap-1.5 mt-2 ml-10">
        <Globe className="w-4 h-4 text-blue-500" />
        <span className="text-blue-500 text-sm font-medium">
          Share Something
        </span>
      </div>

      {/* Divider + Toolbar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 mt-2 pt-2 ml-10">
        <div className="flex items-center justify-between">
          <button className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Image className="w-5 h-5 text-blue-500" />
          </button>

          <button
            className="px-4 py-1.5 bg-neutral-300 dark:bg-neutral-700 
                   text-neutral-500 dark:text-neutral-400 rounded-full 
                   font-medium text-sm cursor-not-allowed"
            disabled
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

// Full modal component (opens when compact is clicked)
function UploadPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [user, setUser] = useState({ name: "", username: "", avatar: "" });
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 2;
  const MAX_CONTENT_LENGTH = 800;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const username = userData.username ? userData.username : "username";
        const avatarImage = resolveAvatar(userData.avatar) || Avatar1;

        setUser({
          name: userData.name || "User",
          username: username,
          avatar: avatarImage,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, { file, preview: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);
    setUploadProgress({ current: 0, total: images.length });

    try {
      const token = localStorage.getItem("token");
      let photoUrls = [];

      // Upload images to Cloudinary if there are any
      if (images.length > 0) {
        const imageFiles = images.map((img) => img.file);

        photoUrls = await uploadMultipleImagesToCloudinary(
          imageFiles,
          (current, total) => {
            setUploadProgress({ current, total });
          },
        );
      }

      // Create post with Cloudinary URLs
      const response = await fetch(`${API_URL}/user/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          photos: photoUrls,
          isPublic: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        setImages([]);
        setUploadProgress({ current: 0, total: 0 });
        if (onSubmit) onSubmit(data.post);
        if (onClose) onClose();
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 md:p-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-[500px] md:max-w-[750px] rounded-2xl h-[450px] md:h-[600px] max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header with User Info */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          {/* User Info */}
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-neutral-200 dark:ring-neutral-700">
                {getInitials(user.name || "U")}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                {user.name || "User"}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                @{user.username || "username"}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          {/* Text Input */}
          <div className="flex-1 w-full min-h-0 flex flex-col relative">
            <PostTextInput
              content={content}
              setContent={setContent}
              maxLength={MAX_CONTENT_LENGTH}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Upload Progress Indicator */}
          {isSubmitting && uploadProgress.total > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Uploading Your Post...
                </span>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {uploadProgress.current} of {uploadProgress.total} images
                uploaded
              </div>
            </div>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-auto pt-4 flex justify-start gap-3 overflow-x-auto border-t border-neutral-100 dark:border-neutral-800">
              {images.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-2xl">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || isSubmitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${images.length >= MAX_IMAGES || isSubmitting
              ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200"
              }`}
          >
            <Image className="w-5 h-5" />
            <span className="text-sm">Image</span>
            {images.length > 0 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                ({images.length}/{MAX_IMAGES})
              </span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && images.length === 0)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all font-semibold text-sm ${isSubmitting || (!content.trim() && images.length === 0)
              ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
              : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-black dark:hover:bg-neutral-100 shadow-lg"
              }`}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component that combines both
function UploadPost({ onSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <UploadPostCompact onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <UploadPostModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(post) => {
            setIsModalOpen(false);
            if (onSubmit) onSubmit(post);
          }}
        />
      )}
    </>
  );
}

export default UploadPost;
export { UploadPostCompact, UploadPostModal };
