"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  PanelLeft, 
  PanelLeftClose, 
  Menu, 
  ExternalLink, 
  LogOut, 
  UserPlus, 
  ShieldCheck, 
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";
import { useTheme } from "@/context/ThemeContext";

interface AdminHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export default function AdminHeader({ 
  isCollapsed, 
  onToggleCollapse, 
  onOpenMobile 
}: AdminHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAuthUser = () => {
    try {
      const raw = localStorage.getItem("brainbari_admin_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name && /botbari/i.test(parsed.name)) {
          parsed.name = parsed.name.replace(/botbari/gi, "Brain Bari");
          localStorage.setItem("brainbari_admin_user", JSON.stringify(parsed));
        }
        setCurrentUser(parsed);
      } else {
        setCurrentUser({
          name: "Brain Bari Admin",
          email: "admin@brainbari.com",
          role: "Super Admin",
        });
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadAuthUser();
    window.addEventListener("admin_auth_updated", loadAuthUser);
    return () => window.removeEventListener("admin_auth_updated", loadAuthUser);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("brainbari_admin_user");
      localStorage.removeItem("brainbari_admin_auth");

      // Clear auth cookies
      document.cookie = "brainbari_admin_auth=; path=/; max-age=0";
      document.cookie = "brainbari_admin_token=; path=/; max-age=0";
    } catch {
      // safe fallback
    }
    setDropdownOpen(false);
    toast.info("Signed out from admin workspace.");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-6 flex items-center justify-between text-slate-900 dark:text-white transition-colors duration-200 shadow-xs">
      {/* Left: Desktop Toggle / Mobile Menu Trigger & Status Indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
          title="Open Navigation"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse / Expand Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar labels" : "Collapse to icon rail"}
          aria-label={isCollapsed ? "Expand sidebar labels" : "Collapse to icon rail"}
        >
          {isCollapsed ? (
            <>
              <PanelLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Expand</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Collapse</span>
            </>
          )}
        </button>

        {/* Live Active Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50" />
          <span>Brain Bari Engine Active</span>
        </div>
      </div>

      {/* Right: Theme Toggle, Quick Live Site Link & Admin Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Live Website Link */}
        <a
          href={FRONTEND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs group"
        >
          <span>Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs active:scale-95 ${
            theme === "dark"
              ? "bg-[#111827] hover:bg-[#1a2333] text-amber-300 border-slate-700/80 hover:border-amber-400/40"
              : "bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border-slate-200/90 hover:border-slate-300"
          }`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline text-slate-200 font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline text-slate-700 font-medium">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 group-hover:from-indigo-900 group-hover:to-slate-900 text-white flex items-center justify-center text-xs font-bold transition-all shadow-xs border border-white/10">
              {currentUser?.name
                ? currentUser.name
                    .trim()
                    .split(/\s+/)
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "BB"}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {currentUser?.name || "Admin Portal"}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {currentUser?.role || "Verified Root"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 space-y-1 z-50 text-left animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 dark:text-white shadow-xl">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser?.name || "Administrator"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email || "admin@brainbari.com"}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser?.role || "Super Admin"}
                </span>
              </div>

              {/* Theme Toggle option inside profile menu */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-500" />
                  )}
                  <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {theme}
                </span>
              </button>

              <a
                href="/register"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
                <span>Register New Admin</span>
              </a>

              <a
                href="/login"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Switch / Login Account</span>
              </a>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

