import React, { useState, useRef } from "react";
import { API_URL } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo2 from "../assets/logo2.png";
import useAvatarUpload from "../hooks/useAvatarUpload";

// Import avatars
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "../assets/Avatars/index";
import AuthPageHero from "@/components/AuthPages/AuthPageHero";

const API_BASE = `${API_URL}/user`;

const avatars = [
  { name: "Avatar1", src: Avatar1 },
  { name: "Avatar2", src: Avatar2 },
  { name: "Avatar3", src: Avatar3 },
  { name: "Avatar4", src: Avatar4 },
  { name: "Avatar5", src: Avatar5 },
];

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar: "Avatar1",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customAvatarFile, setCustomAvatarFile] = useState(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { uploadAvatar } = useAvatarUpload();

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarSelect = (avatarName) => {
    setForm((prev) => ({ ...prev, avatar: avatarName }));
    setCustomAvatarFile(null);
    setCustomAvatarPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomAvatarFile(file);
      setCustomAvatarPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, avatar: "custom" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      let finalAvatar = form.avatar;

      if (form.avatar === "custom" && customAvatarFile) {
        finalAvatar = await uploadAvatar(customAvatarFile);
      }

      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          avatar: finalAvatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // If email verification is required, redirect to OTP page
      if (data.requiresVerification) {
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        return;
      }

      // Otherwise login directly (shouldn't happen with OTP flow, but as fallback)
      login({
        ...data.user,
        email: form.email,
        name: form.name,
        username: form.username,
        avatar: finalAvatar,
      }, data.token);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/user/auth/google`;
  };

  const selectedAvatarSrc = form.avatar === "custom"
    ? customAvatarPreview
    : avatars.find((a) => a.name === form.avatar)?.src;

  return (
    <>
      <div className="min-h-screen lg:pt-0 pt-20 flex bg-white dark:bg-zinc-950">
        {/* Left Panel - Decorative */}
        <AuthPageHero />

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/">
                <div className="flex gap-4 items-center">
                  <div className="pl-10 flex items-center gap-2">
                    <img src={Logo2} className="h-25 dark:invert" alt="logo" />
                    {/* <p className="text-2xl font-semibold text-black dark:text-white">
                    Algyñ
                  </p> */}
                  </div>
                </div>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sign up
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Create your account to get started
              </p>
            </div>

            {/* Error Message */}
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {message}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Choose your avatar
                </label>
                <div className="flex items-center gap-4">
                  {/* Selected Avatar Preview */}
                  <div className="w-16 h-16 rounded-full ring-4 ring-blue-500 overflow-hidden flex-shrink-0">
                    <img
                      src={selectedAvatarSrc}
                      alt="Selected avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Avatar Options */}
                  <div className="flex gap-2 flex-wrap">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar.name}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.name)}
                        className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${form.avatar === avatar.name
                          ? "ring-2 ring-blue-500 scale-110"
                          : "ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600 opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    <div className="flex items-center justify-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-12 h-12 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-zinc-700 ${form.avatar === "custom" ? "ring-2 ring-blue-500 scale-110" : "opacity-60 hover:opacity-100"}`}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name
                      ? "border-red-500"
                      : "border-gray-200 dark:border-zinc-700"
                      } bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.username
                      ? "border-red-500"
                      : "border-gray-200 dark:border-zinc-700"
                      } bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email
                      ? "border-red-500"
                      : "border-gray-200 dark:border-zinc-700"
                      } bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password
                      ? "border-red-500"
                      : "border-gray-200 dark:border-zinc-700"
                      } bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Requirements - inline, only show when typing */}
                {form.password && (
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className={`flex items-center gap-1 ${form.password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      6+
                    </span>
                    <span className={`flex items-center gap-1 ${/[a-z]/.test(form.password) ? 'text-green-500' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      a-z
                    </span>
                    <span className={`flex items-center gap-1 ${/[A-Z]/.test(form.password) ? 'text-green-500' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      A-Z
                    </span>
                    <span className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? 'text-green-500' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      !@#
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-zinc-950 text-gray-400">or</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Mobile Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
