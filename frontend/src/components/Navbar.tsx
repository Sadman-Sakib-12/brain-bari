"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useSiteSettings, useServices } from "@/hooks/useApi";
import { getServiceIcon, DynamicServiceItem } from "./navbar/navbarHelpers";
import ServicesMegaMenu from "./navbar/ServicesMegaMenu";
import ResourcesMegaMenu from "./navbar/ResourcesMegaMenu";
import MobileMenuDrawer from "./navbar/MobileMenuDrawer";

export default function Navbar() {
  const { data: rawSettings } = useSiteSettings();
  const { data: dbServices = [] } = useServices();
  const siteSettings: any = rawSettings || {};
  const logoUrl = siteSettings.logoUrl || siteSettings.logo || siteSettings.navbar?.logoUrl;
  const siteName = siteSettings.siteName || "Brain Bari";
  const primaryCtaLink = siteSettings.navbar?.ctaLink || "/schedule";
  const primaryCtaText = siteSettings.navbar?.ctaText || "Book Consultation";
  const secondaryCtaLink =
    (siteSettings.navbar as any)?.secondaryCtaLink ||
    siteSettings.contact?.whatsappUrl ||
    (siteSettings.contact?.whatsapp
      ? `https://wa.me/${siteSettings.contact.whatsapp.replace(/[^0-9]/g, "")}`
      : siteSettings.phone
      ? `tel:${siteSettings.phone}`
      : "/contact");
  const secondaryCtaText = (siteSettings.navbar as any)?.secondaryCtaText || "Get a Quote";
  const resourcesLinks = siteSettings.navbar?.resourcesLinks;

  const dynamicServices: DynamicServiceItem[] = (dbServices || []).map((srv: any, idx: number) => ({
    id: srv.id,
    title: srv.title,
    description: srv.shortDesc || srv.category || "Professional AI & Software solution.",
    href: `/services/${srv.slug}`,
    icon: getServiceIcon(srv.category || srv.title, idx),
  }));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop dropdown state
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 150);
  };

  const handleResourcesEnter = () => {
    if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    setResourcesOpen(true);
  };

  const handleResourcesLeave = () => {
    resourcesTimeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 150);
  };

  // Close dropdowns on route change
  useEffect(() => {
    setServicesOpen(false);
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click & cleanup timers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    };
  }, []);

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-3 sm:py-4 lg:py-5 min-h-[76px] sm:min-h-[86px] lg:min-h-[96px] flex flex-col justify-center bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-b border-purple-100/90 dark:border-white/10 shadow-[0_4px_24px_rgba(181,123,228,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300">
      {siteSettings.navbar?.showAnnouncement !== false && siteSettings.navbar?.announcement && !announcementDismissed && (
        <div className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white text-[11px] h-7 px-4 flex items-center justify-center gap-2 border-b border-slate-700/50 mb-2">
          <span className="truncate text-center">{siteSettings.navbar.announcement}</span>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 ml-2 cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between lg:justify-center lg:gap-10 xl:gap-14">

        {/* Top/Logo bar for mobile & desktop */}
        <div className="relative flex items-center justify-between w-full lg:w-auto lg:contents">
          <div className="w-9 lg:hidden shrink-0"></div>

          {/* Dynamic Brand Logo */}
          <Link className="flex items-center justify-center lg:justify-start shrink-0 mx-auto lg:mx-0 py-0.5 group select-none" href="/">
            <div className="text-[#0d2a4a] dark:text-white flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="w-auto h-10 sm:h-11 md:h-12 max-w-[150px] object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <svg className="w-11 h-11 sm:w-12 sm:h-12 md:w-[48px] md:h-[48px] text-[#0d2a4a] dark:text-white transition-transform group-hover:scale-105" viewBox="0 0 40 40" fill="currentColor">
                  <circle cx="20" cy="5" r="2.5" />
                  <rect x="18.5" y="7" width="3" height="4" rx="1" />
                  <rect x="6" y="11" width="28" height="23" rx="7" />
                  <rect x="2" y="18" width="4" height="9" rx="2" />
                  <rect x="34" y="18" width="4" height="9" rx="2" />
                  <circle cx="14" cy="20" r="3" fill="white" />
                  <circle cx="26" cy="20" r="3" fill="white" />
                  <path d="M14 27 C16 30, 24 30, 26 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              )}
              {(!logoUrl || siteSettings.showLogoText !== false) && (
                <div className="flex flex-col leading-[0.92] font-black text-[#0d2a4a] dark:text-white text-[22px] sm:text-[24px] md:text-[26px] tracking-tight">
                  {siteName.includes(" ") ? (
                    <>
                      <span>{siteName.split(" ")[0]}</span>
                      <span>{siteName.slice(siteName.indexOf(" ") + 1)}</span>
                    </>
                  ) : (
                    <span>{siteName}</span>
                  )}
                </div>
              )}
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-blue-50/90 dark:bg-white/10 border border-blue-200/90 dark:border-white/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 z-10 shadow-xs active:scale-90 transition-transform cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Quick Action Buttons Row */}
        <div className="w-full mt-2 flex gap-2 md:hidden shrink-0">
          <Link
            href={primaryCtaLink}
            className="flex-1 text-center py-2 border border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[12px] font-extrabold rounded-full hover:bg-blue-100 transition-all shadow-xs"
          >
            {primaryCtaText}
          </Link>
          <a
            href={secondaryCtaLink}
            target={secondaryCtaLink.startsWith("http") ? "_blank" : undefined}
            rel={secondaryCtaLink.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-extrabold rounded-full transition-all shadow-md active:scale-95"
          >
            {secondaryCtaText}
          </a>
        </div>

        {/* Desktop Navigation Capsule */}
        <nav className="hidden lg:flex items-center justify-center gap-7 px-10 py-3.5 rounded-[34px] border border-purple-300/50 dark:border-purple-400/40 bg-white/40 dark:bg-white/5 backdrop-blur-md shrink-0 shadow-2xs">
          {Array.isArray(siteSettings?.navbar?.links) && siteSettings.navbar.links.length > 0 ? (
            siteSettings.navbar.links.map((link: any, i: number) => {
              const isServices = link.href === "/services" || link.label?.toLowerCase() === "services";
              const isResources = link.href === "/resources" || link.label?.toLowerCase() === "resources";

              if (isServices) {
                return (
                  <div
                    key={link.id || i}
                    className="relative"
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesOpen((prev) => !prev)}
                      className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${
                        pathname.startsWith("/services") || servicesOpen
                          ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                          : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>
                    {servicesOpen && (
                      <ServicesMegaMenu
                        servicesRef={servicesRef}
                        services={dynamicServices}
                        onMouseEnter={handleServicesEnter}
                        onMouseLeave={handleServicesLeave}
                        onClose={() => setServicesOpen(false)}
                      />
                    )}
                  </div>
                );
              }

              if (isResources) {
                return (
                  <div
                    key={link.id || i}
                    className="relative"
                    onMouseEnter={handleResourcesEnter}
                    onMouseLeave={handleResourcesLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setResourcesOpen((prev) => !prev)}
                      className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${
                        pathname.startsWith("/resources") || resourcesOpen
                          ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                          : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>
                    {resourcesOpen && (
                      <ResourcesMegaMenu
                        resourcesRef={resourcesRef}
                        onMouseEnter={handleResourcesEnter}
                        onMouseLeave={handleResourcesLeave}
                        onClose={() => setResourcesOpen(false)}
                        links={resourcesLinks}
                      />
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id || i}
                  href={link.href}
                  className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                    isActive
                      ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                      : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })
          ) : (
            <>
              {/* Home */}
              <Link
                href="/"
                className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                  pathname === "/"
                    ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
              >
                Home
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                  pathname === "/about"
                    ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
              >
                About
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <button
                  type="button"
                  onClick={() => setServicesOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${
                    pathname.startsWith("/services") || servicesOpen
                      ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                      : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Services Mega Menu */}
                {servicesOpen && (
                  <ServicesMegaMenu
                    servicesRef={servicesRef}
                    services={dynamicServices}
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                    onClose={() => setServicesOpen(false)}
                  />
                )}
              </div>

              {/* Work */}
              <Link
                href="/new-work"
                className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                  pathname === "/new-work"
                    ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
              >
                Work
              </Link>

              {/* Industries */}
              <Link
                href="/industries"
                className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                  pathname === "/industries"
                    ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
              >
                Industries
              </Link>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleResourcesEnter}
                onMouseLeave={handleResourcesLeave}
              >
                <button
                  type="button"
                  onClick={() => setResourcesOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${
                    pathname.startsWith("/resources") || resourcesOpen
                      ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                      : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Resources Mega Menu */}
                {resourcesOpen && (
                  <ResourcesMegaMenu
                    resourcesRef={resourcesRef}
                    onMouseEnter={handleResourcesEnter}
                    onMouseLeave={handleResourcesLeave}
                    onClose={() => setResourcesOpen(false)}
                    links={resourcesLinks}
                  />
                )}
              </div>

              {/* Product */}
              <Link
                href="/product"
                className={`text-[16px] transition-colors duration-200 font-medium select-none ${
                  pathname === "/product" || pathname === "/products"
                    ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
              >
                Product
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3.5 shrink-0">
          <Link
            href={primaryCtaLink}
            className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 text-[14.5px] font-bold rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors duration-200 shrink-0 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {primaryCtaText}
          </Link>
          <a
            href={secondaryCtaLink}
            target={secondaryCtaLink.startsWith("http") ? "_blank" : undefined}
            rel={secondaryCtaLink.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[14.5px] font-semibold rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer"
          >
            {secondaryCtaText}
          </a>
        </div>

      </div>

      {/* Mobile Drawer */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        dynamicServices={dynamicServices}
        siteSettings={siteSettings}
      />
    </header>
  );
}
