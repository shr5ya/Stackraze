import React, { useState } from "react";
import { Pen } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

const EditProfileButton = ({ showLabel = true, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 ${className}`}
      >
        <Pen className="w-4 h-4 sm:w-5 sm:h-5" />
        {showLabel && (
          <span className="text-sm font-medium hidden sm:inline">
            Edit Profile
          </span>
        )}
      </button>

      <EditProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default EditProfileButton;