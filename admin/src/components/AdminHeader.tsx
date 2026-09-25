"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  PanelLeft, 
  PanelLeftClose, 
  Menu, 
  ExternalLink, 
  LogOut, 
  UserPlus, 
  ShieldCheck, 
  ChevronDown,
  RotateCw 
} from "lucide-react";
import { toast } from "sonner";
import { adminStore } from "@/lib/store";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAuthUser = () => {
    try {
      const raw = localStorage.getItem("brainbari_admin_user");
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      } else {
        setCurrentUser({
          name: "Lead Admin",
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

  const handleLogout = () => {
    try {
      localStorage.removeItem("brainbari_admin_user");
      localStorage.removeItem("brainbari_admin_auth");
    } catch {
      // safe fallback
    }
    setDropdownOpen(false);
    toast.info("Signed out from admin workspace.");
    router.push("/login");
  };

  const handleFullRefresh = () => {
    toast.success("Synchronizing & reloading full admin panel...");
    setTimeout(() => {
      adminStore.fullRefresh();
    }, 150);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between text-slate-900 transition-colors shadow-2xs">
      {/* Left: Desktop Toggle / Mobile Menu Trigger & Status Indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
          title="Open Navigation"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse / Expand Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar labels" : "Collapse to icon rail"}
          aria-label={isCollapsed ? "Expand sidebar labels" : "Collapse to icon rail"}
        >
          {isCollapsed ? (
            <>
              <PanelLeft className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-600">Expand</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-500">Collapse</span>
            </>
          )}
        </button>

        {/* Live Active Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Brain Bari Engine Active</span>
        </div>
      </div>

      {/* Right: Full Refresh, Quick Live Site Link & Admin Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Full Refresh Button */}
        <button
          type="button"
          onClick={handleFullRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer group shadow-2xs"
          title="Full Refresh: Clear cached data and reload full admin panel from disk"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 group-hover:rotate-180 transition-all duration-300" />
          <span>Full Refresh</span>
        </button>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 group-hover:bg-slate-800 flex items-center justify-center text-white text-xs font-bold transition-colors shadow-2xs">
              {currentUser?.name?.slice(0, 2).toUpperCase() || "BB"}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {currentUser?.name || "Admin Portal"}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                {currentUser?.role || "Verified Root"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-2 space-y-1 z-50 text-left animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 shadow-xl">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || "Administrator"}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || "admin@brainbari.com"}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser?.role || "Super Admin"}
                </span>
              </div>

              <a
                href="/register"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
                <span>Register New Admin</span>
              </a>

              <a
                href="/login"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Switch / Login Account</span>
              </a>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
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

