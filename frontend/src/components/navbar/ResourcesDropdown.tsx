"use client";

import React from "react";
import Link from "next/link";

import { useCmsContent } from "@/hooks/useApi";

interface ResourcesDropdownProps {
  resourcesRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
  links?: Array<{ label: string; href: string }>;
}

export default function ResourcesDropdown({
  resourcesRef,
  onMouseEnter,
  onMouseLeave,
  onClose,
  links,
}: ResourcesDropdownProps) {
  const { data: dbResources } = useCmsContent<any[]>("resourcesLinks");
  const displayLinks = Array.isArray(dbResources) && dbResources.length > 0
    ? dbResources.map((d: any) => ({ label: d.title || d.label || "", href: d.href || "#" }))
    : (Array.isArray(links) && links.length > 0 ? links : []);

  return (
    <div
      ref={resourcesRef}
      className="absolute top-full left-0 w-[220px] z-[999] pt-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white dark:bg-[#13192b] rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/10">
        <div className="flex flex-col py-1">
          {displayLinks.map((item, idx) => (
            <Link
              key={item.href || idx}
              className={`block px-5 py-3 text-[14px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-[#8b4ec9] transition-colors cursor-pointer ${
                idx < displayLinks.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""
              }`}
              href={item.href}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
