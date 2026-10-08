"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Briefcase, Handshake, Calendar, UserCheck, Layers, BookOpen, Sun, Moon } from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";
import { useTheme } from "@/context/ThemeContext";
import { DynamicServiceItem } from "./navbarHelpers";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  dynamicServices: DynamicServiceItem[];
  siteSettings: any;
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  pathname,
  dynamicServices,
  siteSettings,
}: MobileMenuDrawerProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { data: spotlight } = useCmsContent<any>("navbarSpotlight");
  const { data: dbResources } = useCmsContent<any[]>("resourcesLinks");

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white dark:bg-[#0c1220] shadow-xl border-t border-slate-200 dark:border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto">
      <nav className="flex flex-col w-full py-2">
        <Link
          className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${
            pathname === "/" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          }`}
          href="/"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${
            pathname === "/about" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          }`}
          href="/about"
          onClick={onClose}
        >
          About
        </Link>

        <div className="flex flex-col w-full">
          <button
            type="button"
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="w-full flex items-center justify-between px-6 py-3.5 text-left text-base font-semibold border-b border-slate-100 dark:border-white/5 text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          >
            <span>Services</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileServicesOpen && (
            <div className="bg-[#f4f2ff]/60 dark:bg-[#13192b] px-4 py-2 space-y-1">
              {dynamicServices.length === 0 ? (
                <div className="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  No services available.
                </div>
              ) : (
                dynamicServices.map((srv, idx) => {
                  const IconComp = srv.icon;
                  return (
                    <Link
                      key={srv.id || idx}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-xs text-gray-800 dark:text-gray-200 font-medium border-b border-purple-100/60 dark:border-white/5 last:border-b-0"
                      href={srv.href}
                      onClick={onClose}
                    >
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-purple-200/60 dark:border-white/10 flex items-center justify-center shrink-0">
                        <IconComp className="w-3.5 h-3.5 text-[#8b4ec9] shrink-0" />
                      </div>
                      <span className="truncate">{srv.title}</span>
                    </Link>
                  );
                })
              )}
              <div className="pt-2 pb-1">
                <Link
                  href={spotlight?.linkUrl || "/services"}
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1a233a] text-xs font-bold text-[#9a3412] dark:text-orange-400 border border-purple-200/80 dark:border-white/10 shadow-xs"
                >
                  <span>{spotlight?.linkText || "Explore Custom Software"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link
          className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${
            pathname === "/new-work" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          }`}
          href="/new-work"
          onClick={onClose}
        >
          Work
        </Link>

        <Link
          className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${
            pathname.startsWith("/industries") ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          }`}
          href="/industries"
          onClick={onClose}
        >
          Industries
        </Link>

        <div className="flex flex-col w-full">
          <button
            type="button"
            onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
            className="w-full flex items-center justify-between px-6 py-3.5 text-left text-base font-semibold border-b border-slate-100 dark:border-white/5 text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          >
            <span>Resources</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileResourcesOpen && (
            <div className="bg-[#f4f2ff]/60 dark:bg-[#13192b] px-4 py-2 space-y-1">
              {(() => {
                const iconMap: Record<string, any> = {
                  Briefcase,
                  Handshake,
                  Calendar,
                  UserCheck,
                  Layers,
                };
                const items = Array.isArray(dbResources) && dbResources.length > 0
                  ? dbResources
                  : [];

                return items.map((item: any, idx: number) => {
                  const iconKey = typeof item.icon === "string" ? item.icon : "";
                  const IconComp = (iconKey && iconMap[iconKey]) || Layers;
                  return (
                    <Link
                      key={item.href || idx}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-xs text-gray-800 dark:text-gray-200 font-medium border-b border-purple-100/60 dark:border-white/5 last:border-b-0"
                      href={item.href || "#"}
                      onClick={onClose}
                    >
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-purple-200/60 dark:border-white/10 flex items-center justify-center shrink-0">
                        <IconComp className="w-3.5 h-3.5 text-[#8b4ec9] shrink-0" />
                      </div>
                      <span className="truncate">{item.title || item.label}</span>
                    </Link>
                  );
                });
              })()}
            </div>
          )}
        </div>

        <Link
          className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${
            pathname === "/product" || pathname === "/products" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
          }`}
          href="/product"
          onClick={onClose}
        >
          Product
        </Link>

        <div className="p-5 flex flex-col gap-3">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span>Appearance</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {mounted && theme === "dark" ? "Dark Mode (Active)" : "Light Mode (Active)"}
            </span>
          </button>

          <Link
            href={siteSettings.navbar?.ctaLink || "/schedule"}
            onClick={onClose}
            className="w-full py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[15px] font-bold rounded-full text-center transition-colors shadow-xs"
          >
            {siteSettings.navbar?.ctaText || "Book Consultation"}
          </Link>
          <a
            href={
              (siteSettings.navbar as any)?.secondaryCtaLink ||
              siteSettings.contact?.whatsappUrl ||
              (siteSettings.contact?.whatsapp
                ? `https://wa.me/${siteSettings.contact.whatsapp.replace(/[^0-9]/g, "")}`
                : siteSettings.phone
                ? `tel:${siteSettings.phone}`
                : "/contact")
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold rounded-full text-center shadow-md transition-colors"
          >
            {(siteSettings.navbar as any)?.secondaryCtaText || "Get a Quote"}
          </a>
        </div>
      </nav>
    </div>
  );
}
