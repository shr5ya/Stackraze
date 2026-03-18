import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  MessageSquare,
  Users,
  Plug,
  Mail,
  Info,
  Menu,
  X,
  ArrowBigLeft,
} from "lucide-react";

import { resolveAvatar } from "../utils/avatarHelper";

const MD_BREAKPOINT = 768;

const Sidebar = ({ className = "", style = {} }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Get username and avatar from auth context
  const username = user?.username || user?.name || "Guest User";
  const userInitial = username.charAt(0).toUpperCase();
  const userAvatar = resolveAvatar(user?.avatar);

  // Track whether we're on a mobile screen
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MD_BREAKPOINT,
  );

  // Mobile sidebar open state (only relevant when isMobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop expand/collapse state (persisted to localStorage)
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    return savedState !== "false";
  });

  // Listen for resize to toggle isMobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MD_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // close overlay when switching to desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persist desktop expand state
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded.toString());
  }, [isExpanded]);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "News Letter", path: "/newsletter", icon: Mail },
    { name: "Community", path: "/community", icon: MessageSquare },
    { name: "Connect", path: "/connect", icon: Users },
    { name: "Contact", path: "/contact", icon: Plug },
    { name: "About", path: "/about", icon: Info },
  ];

  /* ─── Shared sidebar content ─── */
  const sidebarContent = (expanded) => (
    <>
      {/* User Profile Card - Expanded View */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${expanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-3">
          <div className="relative">
            {/* Banner Background */}
            <div className="h-24 rounded-xl bg-gradient-to-br from-sky-200 via-sky-100 to-blue-100 dark:from-sky-900/40 dark:via-blue-900/30 dark:to-indigo-900/40 overflow-hidden">
              {/* Cloud-like decorations */}
              <div className="absolute top-4 right-8 w-16 h-8 bg-white/60 dark:bg-white/20 rounded-full blur-sm"></div>
              <div className="absolute top-6 right-4 w-12 h-6 bg-white/50 dark:bg-white/15 rounded-full blur-sm"></div>
              <div className="absolute top-8 left-6 w-10 h-5 bg-white/40 dark:bg-white/10 rounded-full blur-sm"></div>

              {/* Close / Minimize Button */}
              <button
                onClick={() =>
                  isMobile ? closeMobile() : setIsExpanded(false)
                }
                className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-white/30 transition-all duration-300 shadow-sm hover:scale-110"
              >
                {isMobile ? <X size={16} /> : <ArrowBigLeft size={16} />}
              </button>
            </div>

            {/* Avatar - Overlapping Banner */}
            <Link
              to={`/profile/${username}`}
              className="absolute -bottom-6 left-3"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={username}
                  className="w-18 h-18 rounded-full object-cover shadow-lg ring-3 ring-white dark:ring-gray-800 transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-zinc-500 to-zinc-200 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-3 ring-white dark:ring-gray-800 transition-transform duration-300 hover:scale-110">
                  {userInitial}
                </div>
              )}
            </Link>
          </div>

          {/* User Info */}
          <div className="mt-8 px-1">
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              {"@" + username}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-10">
              {(user?.about || "No bio available").slice(0, 120)}
              {(user?.about || "").length > 120 && "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Collapsed Avatar Only (desktop only) */}
      {!isMobile && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${!expanded ? "max-h-20 opacity-100 p-3" : "max-h-0 opacity-0 p-0"}`}
        >
          <div className="flex justify-center">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-110">
                {userInitial}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button - Only visible when collapsed on desktop */}
      {!isMobile && !expanded && (
        <div className="flex items-center justify-center transition-all duration-300">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-110"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        className={`mb-5 flex flex-col gap-1 transition-all duration-300 ${expanded ? "px-3" : "px-2"}`}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => isMobile && closeMobile()}
              style={{ transitionDelay: `${index * 30}ms` }}
              className={`flex items-center rounded-xl transition-all duration-300 ease-out group relative
                                ${expanded ? "gap-3 px-3 py-3" : "justify-center p-3"}
                                ${
                                  isActive
                                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                                }
                            `}
            >
              <Icon
                size={22}
                className={`shrink-0 transition-transform duration-300 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110"
                }`}
              />

              <span
                className={`whitespace-nowrap transition-all duration-300 ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}`}
              >
                {item.name}
              </span>

              {/* Hover Tooltip for collapsed state */}
              {!expanded && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900/95 backdrop-blur text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 whitespace-nowrap pointer-events-none shadow-xl translate-x-2 group-hover:translate-x-0">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );

  /* ─── MOBILE RENDER ─── */
  if (isMobile) {
    return (
      <>
        {/* Hamburger toggle — fixed top-left, below the navbar */}
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="fixed top-16 left-3 z-50 p-2 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/30 dark:border-gray-700/50 shadow-lg text-gray-700 dark:text-gray-200 hover:scale-110 transition-all duration-300"
          >
            <Menu size={22} />
          </button>
        )}

        {/* Backdrop */}
        <div
          onClick={closeMobile}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

        {/* Slide-in sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 pt-20 pb-10 bg-white/90 dark:bg-gray-950/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/50 shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent(true)}
        </aside>
      </>
    );
  }

  /* ─── DESKTOP RENDER ─── */
  // Posts are centered with max-w-xl (36rem = 576px).
  // Sidebar right edge = 20px left of the posts left edge.
  // Posts left edge from viewport center = 50% - 18rem.
  // So sidebar right = calc(50% + 18rem + 1.25rem) from right edge of viewport.
  return (
    <aside
      className={`fixed top-20 pb-10 bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 transition-all duration-500 ease-out flex flex-col shadow-xl rounded-2xl ${isExpanded ? "w-64" : "w-16"} ${className}`}
      style={{ right: "calc(50% + 18rem + 1.25rem)", ...style }}
    >
      {sidebarContent(isExpanded)}
    </aside>
  );
};

export default Sidebar;
