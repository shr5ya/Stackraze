import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { API_URL } from "@/config/api";
import { usePopup } from "@/context/PopupContext";

function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showPopup("User not authenticated", "error");
        return;
      }

      const res = await fetch(`${API_URL}/user/account/abhi`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        showPopup("Account deleted successfully", "success");

        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }, 1000);
      } else {
        showPopup(data.message || "Failed to delete account", "error");
      }
    } catch (error) {
      showPopup("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <hr className="text-zinc-300 dark:text-gray-600 mt-4" />

      <button
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center my-5 dark:bg-zinc-800 gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 group"
      >
        <Trash2 className="w-5 h-5 text-gray-700 dark:text-gray-50 group-hover:text-red-500 transition" />

        <span className="text-sm font-medium dark:text-gray-50 text-gray-800 group-hover:text-red-500 transition">
          {loading ? "Deleting..." : "Delete Account"}
        </span>
      </button>
    </div>
  );
}

export default DeleteAccountButton;