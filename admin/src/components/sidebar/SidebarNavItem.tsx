"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NavItem, SubNavItem } from "./navConfig";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  active: boolean;
  onMouseEnterRail: (item: NavItem, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeaveRail: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pathname: string;
  currentTab: string;
  searchParams: { get: (key: string) => string | null };
  router: { push: (url: string) => void };
  homepageDropdownOpen?: boolean;
  setHomepageDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarNavItem({
  item,
  isCollapsed,
  active,
  onMouseEnterRail,
  onMouseLeaveRail,
  mobileOpen,
  onCloseMobile,
  pathname,
  currentTab,
  searchParams,
  router,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasSubItems = !!(item.subItems && item.subItems.length > 0);

  // Helper to check if a subitem matches the current URL / query param
  const isSubItemActive = (sub: SubNavItem) => {
    if (sub.href.includes("?")) {
      const [path, query] = sub.href.split("?");
      const params = new URLSearchParams(query);
      const tab = params.get("tab");
      const activeTab = searchParams.get("tab");
      return pathname === path && (activeTab === tab || (!activeTab && tab === "hero"));
    }
    return pathname === sub.href || (pathname.startsWith(sub.href + "/") && sub.href !== "/website/homepage");
  };

  const isAnySubActive = hasSubItems && (item.subItems?.some(isSubItemActive) ?? false);
  const isItemActive = active || isAnySubActive;

  // Dropdown open state (default to true so CMS items are immediately visible)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  // Auto-expand dropdown when a child route becomes active
  useEffect(() => {
    if (isAnySubActive) {
      setDropdownOpen(true);
    }
  }, [isAnySubActive, pathname]);

  // Mini-Rail Mode (Collapsed Desktop)
  if (isCollapsed) {
    return (
      <div
        className="relative flex justify-center py-0.5"
        onMouseEnter={(e) => onMouseEnterRail(item, e)}
        onMouseLeave={onMouseLeaveRail}
      >
        <Link
          href={item.href}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative border cursor-pointer ${
            isItemActive
              ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white border-transparent"
          }`}
          title={`${item.title} — ${item.subtitle}`}
        >
          <Icon className="w-4 h-4" />
          {item.badge !== undefined && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#090d16]" />
          )}
        </Link>
      </div>
    );
  }

  // Accordion / Dropdown Item (Expanded)
  if (hasSubItems) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs transition-all border cursor-pointer select-none ${
            isItemActive
              ? "bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-white border-blue-200/80 dark:border-blue-500/40 font-bold shadow-xs"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] border-transparent font-medium"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                isItemActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-200/80 dark:group-hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-left flex-1">
              <div className="truncate text-xs font-semibold leading-tight flex items-center gap-1.5">
                <span>{item.title}</span>
                {isAnySubActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-xs shadow-blue-500/50 animate-pulse shrink-0" />
                )}
              </div>
              {item.subtitle ? (
                <div
                  className={`text-[10px] truncate leading-tight mt-0.5 ${
                    isItemActive ? "text-blue-600/80 dark:text-blue-300/90 font-medium" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
                >
                  {item.subtitle}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {item.badge !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                {item.badge}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                dropdownOpen
                  ? "rotate-0 text-blue-600 dark:text-blue-400"
                  : "-rotate-90 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Items */}
        {dropdownOpen && (
          <div className="ml-4 pl-2.5 border-l-2 border-slate-200 dark:border-white/[0.08] my-1 space-y-0.5">
            {item.subItems!.map((sub) => {
              const activeSub = isSubItemActive(sub);
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={() => {
                    if (mobileOpen) onCloseMobile();
                  }}
                  className={`group/sub flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                    activeSub
                      ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-bold border-l-2 border-blue-600 dark:border-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] font-medium"
                  }`}
                >
                  {SubIcon ? (
                    <SubIcon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        activeSub
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 dark:text-slate-500 group-hover/sub:text-slate-600 dark:group-hover/sub:text-slate-300"
                      }`}
                    />
                  ) : (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                        activeSub
                          ? "bg-blue-600 dark:bg-blue-400 shadow-xs shadow-blue-500/50"
                          : "bg-slate-300 dark:bg-slate-600 group-hover/sub:bg-slate-400"
                      }`}
                    />
                  )}
                  <span className="truncate flex-1">{sub.title}</span>
                  {activeSub && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-xs shadow-blue-500/50 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard Single Link Item
  return (
    <div className="space-y-0.5">
      <Link
        href={item.href}
        onClick={() => {
          if (mobileOpen) onCloseMobile();
        }}
        className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs transition-all border cursor-pointer ${
          active
            ? "bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-white border-blue-200/80 dark:border-blue-500/40 font-bold shadow-xs"
            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] border-transparent font-medium"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
              active
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-200/80 dark:group-hover:bg-white/[0.08]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold leading-tight">
              {item.title}
            </div>
            {item.subtitle ? (
              <div
                className={`text-[10px] truncate leading-tight mt-0.5 ${
                  active ? "text-blue-600/80 dark:text-blue-300 font-medium" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
              >
                {item.subtitle}
              </div>
            ) : null}
          </div>
        </div>

        {item.badge !== undefined && (
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-50 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30 shrink-0">
            {item.badge}
          </span>
        )}
      </Link>
    </div>
  );
}
