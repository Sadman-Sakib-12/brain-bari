"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, X, ExternalLink } from "lucide-react";
import { adminStore } from "@/lib/store";
import { getNavGroups, NavItem } from "./sidebar/navConfig";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import { FRONTEND_URL } from "@/lib/axios";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  mounted?: boolean;
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  mounted = true,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [homepageDropdownOpen, setHomepageDropdownOpen] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(0);

  const [hoveredTooltip, setHoveredTooltip] = useState<{
    title: string;
    subtitle: string;
    href: string;
    top: number;
  } | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateBadgeCounts = () => {
    try {
      const orders = adminStore.getOrders();
      const consultations = adminStore.getConsultations();
      const requests = adminStore.getRequests();
      const pendingOrders = orders.filter((o: any) => o.status === "Pending").length;
      const pendingCons = consultations.filter((c: any) => c.status === "Pending").length;
      const newMsgs = requests?.contactMessages?.filter((m: any) => m.status === "New")?.length || 0;
      setPendingRequests(pendingOrders + pendingCons + newMsgs);
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    updateBadgeCounts();
    window.addEventListener("admin_store_updated", updateBadgeCounts);
    return () => window.removeEventListener("admin_store_updated", updateBadgeCounts);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleMouseEnterRail = (item: NavItem, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTooltip({
      title: item.title,
      subtitle: item.subtitle,
      href: item.href,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeaveRail = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTooltip(null);
    }, 150);
  };

  const navGroups = getNavGroups(pendingRequests);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      const params = new URLSearchParams(query);
      const tab = params.get("tab");
      const currentTab = searchParams.get("tab");
      return pathname === path && (currentTab === tab || (!currentTab && tab === "hero"));
    }
    return pathname === href || (pathname.startsWith(href + "/") && href !== "/website/homepage");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity cursor-pointer"
        />
      )}

      {/* Floating Hover Tooltip in collapsed mini-rail mode */}
      {isCollapsed && hoveredTooltip && (
        <div
          style={{ top: hoveredTooltip.top }}
          className="fixed left-[72px] -translate-y-1/2 z-60 hidden md:flex flex-col min-w-[200px] bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xl"
        >
          <div className="text-xs font-bold">{hoveredTooltip.title}</div>
          {hoveredTooltip.subtitle && (
            <div className="text-[11px] text-slate-400 mt-0.5">{hoveredTooltip.subtitle}</div>
          )}
        </div>
      )}

      {/* Main Sidebar: 280px Expanded or 72px Collapsed Mini-Rail */}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white dark:bg-[#090d16] border-r border-slate-200/90 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 z-50 flex flex-col justify-between shadow-sm transition-colors duration-200 ${
          mounted ? "transition-all duration-200 ease-in-out" : ""
        } ${
          mobileOpen
            ? "translate-x-0 w-[280px] border-r border-slate-200/90 dark:border-white/[0.08] shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-[72px]" : "md:w-[280px]"}`}
      >
        {/* Brand Header */}
        <div
          className={`border-b border-slate-200/80 dark:border-white/[0.08] flex items-center transition-all ${
            isCollapsed ? "h-16 px-0 justify-center" : "h-16 px-4 justify-between"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer transition-all active:scale-95 group border border-slate-200 dark:border-white/[0.08]"
            >
              <span className="text-xs font-black tracking-tight select-none text-blue-600 dark:text-blue-400">BB</span>
              <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-95 transition-opacity cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-black text-xs tracking-wider shadow-sm shadow-blue-500/25">
                  BB
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate tracking-tight">
                    Brain Bari
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse shadow-xs shadow-blue-500/50 shrink-0" />
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase truncate">
                    Operations Console
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Collapse Sidebar"
                  className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 no-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={group.groupTitle || gIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none">
                  {group.groupTitle}
                </div>
              )}

              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  active={isItemActive(item.href)}
                  onMouseEnterRail={handleMouseEnterRail}
                  onMouseLeaveRail={handleMouseLeaveRail}
                  mobileOpen={mobileOpen}
                  onCloseMobile={onCloseMobile}
                  pathname={pathname}
                  currentTab={currentTab}
                  searchParams={searchParams}
                  router={router}
                  homepageDropdownOpen={homepageDropdownOpen}
                  setHomepageDropdownOpen={setHomepageDropdownOpen}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Footer: Live Website Preview & DB Sync Status */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-transparent transition-colors duration-200">
          {isCollapsed ? (
            <div className="flex justify-center">
              <a
                href={FRONTEND_URL}
                target="_blank"
                rel="noreferrer"
                title="Open Live Website"
                className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <a
                href={FRONTEND_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/[0.04] hover:bg-blue-50 dark:hover:bg-white/[0.08] hover:text-blue-700 dark:hover:text-white hover:border-blue-200 dark:hover:border-white/20 border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Open Live Website</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">LIVE</span>
              </a>

              <div className="px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>NeonDB PostgreSQL</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                  Synced
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
