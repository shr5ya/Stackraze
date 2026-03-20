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

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const username = user?.username || user?.name || "Guest User";
  const userInitial = username.charAt(0).toUpperCase();
  const userAvatar = resolveAvatar(user?.avatar);

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MD_BREAKPOINT,
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    return savedState !== "false";
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MD_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded.toString());
  }, [isExpanded]);

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile]);

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

  // The 4 items shown in bottom nav (remaining go into slide-in sidebar)
  const bottomNavItems = navItems.slice(0, 4);

  /* ─── Desktop sidebar content ─── */
  const desktopSidebarContent = (expanded) => (
    <>
      {/* User Profile Card - Expanded View */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${expanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-3">
          <div className="relative">
            <div className="h-24 rounded-xl bg-gradient-to-br from-sky-200 via-sky-100 to-blue-100 dark:from-sky-900/40 dark:via-blue-900/30 dark:to-indigo-900/40 overflow-hidden">
              <div className="absolute top-4 right-8 w-16 h-8 bg-white/60 dark:bg-white/20 rounded-full blur-sm"></div>
              <div className="absolute top-6 right-4 w-12 h-6 bg-white/50 dark:bg-white/15 rounded-full blur-sm"></div>
              <div className="absolute top-8 left-6 w-10 h-5 bg-white/40 dark:bg-white/10 rounded-full blur-sm"></div>

              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-white/30 transition-all duration-300 shadow-sm hover:scale-110"
              >
                <ArrowBigLeft size={16} />
              </button>
            </div>

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

      {/* Collapsed Avatar Only */}
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

      {!expanded && (
        <div className="flex items-center justify-center transition-all duration-300">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-110"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

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

              {!expanded && (
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

  /* ─── Mobile slide-in sidebar content ─── */
  const mobileSidebarContent = () => (
    <>
      {/* Profile Card */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${username}`}
            onClick={closeMobile}
            className="shrink-0"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={username}
                className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-500 to-zinc-200 flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-blue-500/30">
                {userInitial}
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
              {"@" + username}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {(user?.about || "No bio available").slice(0, 60)}
              {(user?.about || "").length > 60 && "..."}
            </p>
          </div>
        </div>
      </div>

      {/* All Nav Items */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={closeMobile}
              style={{ transitionDelay: `${index * 30}ms` }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out group
                ${
                  isActive
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              <Icon
                size={22}
                className={`shrink-0 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                }`}
              />
              <span className="text-sm font-medium">{item.name}</span>
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
        {/* ── Bottom Navigation Bar ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/40 dark:bg-gray-900/30 backdrop-blur-2xl border-t border-white/40 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.4)]" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
          <div className="flex items-center justify-around px-2 py-2 pb-safe">
            {/* First 4 nav items */}
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0
                    ${
                      isActive
                        ? "text-zinc-900 dark:text-zinc-200"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  <div className="relative">
                    <Icon
                      size={24}
                      className={`transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"}`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                    {/* Active dot indicator */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-none mt-1 truncate max-w-[52px] text-center">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* More / Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                ${mobileOpen ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
              `}
            >
              <div className="relative">
                <Menu size={24} strokeWidth={1.8} />
              </div>
              <span className="text-[10px] font-medium leading-none mt-1">
                More
              </span>
            </button>
          </div>
        </nav>

        {/* ── Slide-in Full Sidebar ── */}

        {/* Backdrop */}
        <div
          onClick={closeMobile}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Slide-in panel from left */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 flex flex-col
            bg-white/95 dark:bg-gray-950/98 backdrop-blur-xl
            border-r border-white/20 dark:border-gray-800/50 shadow-2xl
            transition-transform duration-300 ease-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 pt-14 pb-2">
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Menu
            </span>
            <button
              onClick={closeMobile}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {mobileSidebarContent()}
        </aside>
      </>
    );
  }

  /* ─── DESKTOP RENDER ─── */
  return (
    <aside
      className={`fixed top-20 pb-10 bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 transition-all duration-500 ease-out flex flex-col shadow-xl rounded-2xl ${isExpanded ? "w-64" : "w-16"}`}
      style={{ right: "calc(50% + 18rem + 1.25rem)" }}
    >
      {desktopSidebarContent(isExpanded)}
    </aside>
  );
};

export default Sidebar;