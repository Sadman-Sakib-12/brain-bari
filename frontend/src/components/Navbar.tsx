"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Cpu,
  Layers,
  Box,
  Globe,
  Building2,
  Code2,
  Check,
  ArrowRight,
  Monitor,
  MessageSquare,
  Package,
  ShieldCheck,
} from "lucide-react";
import siteSettings from "@/data/siteSettings.json";

const servicesList = [
  {
    title: "AI & Software Solutions",
    description: "AI automation for your business & reliable cloud infrastructure.",
    href: "/services",
    icon: Monitor,
  },
  {
    title: "AI Chatbot Systems",
    description: "Intelligent chatbots for customer support & sales growth.",
    href: "/services/ai-chatbot",
    icon: MessageSquare,
  },
  {
    title: "Custom AI Assistants",
    description: "AI assistants tailored to your business knowledge & workflows.",
    href: "/services/custom-ai",
    icon: Sparkles,
  },
  {
    title: "AI Agents & Automation",
    description: "Intelligent AI agents that automate complex tasks & workflows.",
    href: "/services/custom-ai",
    icon: Cpu,
  },
  {
    title: "AI SaaS Development",
    description: "Transform AI ideas into scalable subscription SaaS products.",
    href: "/services/ai-saas",
    icon: Layers,
  },
  {
    title: "SaaS Product Development",
    description: "Build, launch, and scale modern SaaS products from MVP.",
    href: "/services/ai-saas",
    icon: Package,
  },
  {
    title: "Web & App Development",
    description: "Modern, responsive & high performance web & mobile apps.",
    href: "/services/ai-3d",
    icon: Globe,
  },
  {
    title: "Enterprise Software Solutions",
    description: "Powerful ERP, CRM, and custom enterprise software applications.",
    href: "/services",
    icon: Building2,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

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
      {siteSettings.navbar?.showAnnouncement && siteSettings.navbar?.announcement && !announcementDismissed && (
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

          {/* Brand Logo - BotBari style */}
          <Link className="flex items-center justify-center lg:justify-start shrink-0 mx-auto lg:mx-0 py-0.5 group select-none" href="/">
            <div className="text-[#0d2a4a] dark:text-white flex items-center gap-3">
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
              <div className="flex flex-col leading-[0.92] font-black text-[#0d2a4a] dark:text-white text-[22px] sm:text-[24px] md:text-[26px] tracking-tight">
                <span>Brain</span>
                <span>Bari</span>
              </div>
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
            href={siteSettings.navbar?.ctaLink || "/schedule"}
            className="flex-1 text-center py-2 border border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[12px] font-extrabold rounded-full hover:bg-blue-100 transition-all shadow-xs"
          >
            {siteSettings.navbar?.ctaText || "Book Consultation"}
          </Link>
          <a
            href={(siteSettings.navbar as any)?.secondaryCtaLink || siteSettings.contact?.whatsappUrl || "https://wa.me/8801754958008"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-extrabold rounded-full transition-all shadow-md active:scale-95"
          >
            {(siteSettings.navbar as any)?.secondaryCtaText || "Get a Quote"}
          </a>
        </div>

        {/* Desktop Navigation Capsule */}
        <nav className="hidden lg:flex items-center justify-center gap-7 px-10 py-3.5 rounded-[34px] border border-purple-300/50 dark:border-purple-400/40 bg-white/40 dark:bg-white/5 backdrop-blur-md shrink-0 shadow-2xs">
          {/* Home */}
          <Link
            href="/"
            className={`text-[16px] transition-colors duration-200 font-medium select-none ${pathname === "/"
                ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
              }`}
          >
            Home
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`text-[16px] transition-colors duration-200 font-medium select-none ${pathname === "/about"
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
              className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${pathname.startsWith("/services") || servicesOpen
                  ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                  : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
            >
              <span>Services</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Services Mega Menu */}
            {servicesOpen && (
              <div
                ref={servicesRef}
                className="absolute top-full left-1/2 -translate-x-[48%] w-[960px] max-w-[calc(100vw-32px)] z-[999] pt-3"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <div className="bg-[#f4f2ff] dark:bg-[#121626] rounded-[28px] shadow-[0_24px_60px_-12px_rgba(112,68,220,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 border border-purple-200/70 dark:border-white/10 text-left">
                  {/* Top Header Section */}
                  <div className="mb-4 pb-3 border-b border-purple-200/50 dark:border-white/10">
                    <h3 className="text-[19px] font-extrabold text-slate-950 dark:text-white tracking-tight">
                      Our Services
                    </h3>
                    <div className="w-10 h-[3px] bg-[#9a3412] dark:bg-[#f97316] rounded-full mt-1.5"></div>
                  </div>

                  {/* Mega Menu Body */}
                  <div className="flex gap-5 items-stretch">
                    {/* Left 2-Column Services Grid (8 Services) */}
                    <div className="flex-1 grid grid-cols-2 gap-x-2.5 gap-y-1.5">
                      {servicesList.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                          <Link
                            key={index}
                            href={service.href}
                            onClick={() => setServicesOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-all group/item cursor-pointer border border-transparent hover:border-purple-100/80 dark:hover:border-white/5"
                          >
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs group-hover/item:scale-105 group-hover/item:border-purple-300 group-hover/item:text-[#8b4ec9] transition-all">
                              <IconComponent className="w-4.5 h-4.5 stroke-[1.8]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13.5px] font-bold text-slate-950 dark:text-white group-hover/item:text-[#8b4ec9] dark:group-hover/item:text-[#c084fc] transition-colors leading-tight mb-0.5">
                                {service.title}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-snug line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Right Spotlight Card */}
                    <div className="w-[305px] shrink-0 bg-white dark:bg-[#1a233a] rounded-[22px] p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6036] via-[#f43f5e] to-[#ec4899] text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                            <ShieldCheck className="w-5 h-5 stroke-[2]" />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-slate-950 dark:text-white leading-tight">
                              Custom Software Solutions
                            </h4>
                          </div>
                        </div>
                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                          Complete technology & security solutions to protect and scale your business.
                        </p>
                        <div className="mt-3.5 space-y-2">
                          {[
                            "Security Audit & Architecture",
                            "Vulnerability & Code Assessment",
                            "SaaS & Cloud Infrastructure",
                            "Network & System Protection",
                            "Web & Mobile App Security",
                            "Compliance & Risk Management",
                          ].map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 stroke-[3]" />
                              <span className="truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
                        <Link
                          href="/services"
                          onClick={() => setServicesOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#9a3412] hover:text-[#7c2d12] dark:text-orange-400 dark:hover:text-orange-300 transition-colors group/link"
                        >
                          <span>Explore Custom Software</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Work */}
          <Link
            href="/new-work"
            className={`text-[16px] transition-colors duration-200 font-medium select-none ${pathname === "/new-work"
                ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
              }`}
          >
            work
          </Link>

          {/* Industries */}
          <Link
            href="/industries"
            className={`text-[16px] transition-colors duration-200 font-medium select-none ${pathname === "/industries"
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
              className={`flex items-center gap-1.5 text-[16px] transition-colors duration-200 font-medium select-none cursor-pointer ${pathname.startsWith("/resources") || resourcesOpen
                  ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                  : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
                }`}
            >
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Resources Dropdown Menu */}
            {resourcesOpen && (
              <div
                ref={resourcesRef}
                className="absolute top-full left-0 w-[220px] z-[999] pt-3"
                onMouseEnter={handleResourcesEnter}
                onMouseLeave={handleResourcesLeave}
              >
                <div className="bg-white dark:bg-[#13192b] rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/10">
                  <div className="flex flex-col py-1">
                    <Link
                      className="block px-5 py-3 text-[14px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-[#8b4ec9] transition-colors border-b border-slate-100 dark:border-white/5 cursor-pointer"
                      href="/resources/case-studies"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Case Studies
                    </Link>
                    <Link
                      className="block px-5 py-3 text-[14px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-[#8b4ec9] transition-colors border-b border-slate-100 dark:border-white/5 cursor-pointer"
                      href="/resources/partners"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Partners
                    </Link>
                    <Link
                      className="block px-5 py-3 text-[14px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-[#8b4ec9] transition-colors border-b border-slate-100 dark:border-white/5 cursor-pointer"
                      href="/resources/event"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Event
                    </Link>
                    <Link
                      className="block px-5 py-3 text-[14px] font-medium text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-[#8b4ec9] transition-colors cursor-pointer"
                      href="/resources/team"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Team
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product */}
          <Link
            href="/product"
            className={`text-[16px] transition-colors duration-200 font-medium select-none ${pathname === "/product" || pathname === "/products"
                ? "text-[#8b4ec9] dark:text-[#c084fc] font-bold"
                : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] dark:hover:text-[#c084fc]"
              }`}
          >
            Product
          </Link>
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3.5 shrink-0">
          <Link
            href={siteSettings.navbar?.ctaLink || "/schedule"}
            className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 text-[14.5px] font-bold rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors duration-200 shrink-0 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {siteSettings.navbar?.ctaText || "Book Consultation"}
          </Link>
          <a
            href={(siteSettings.navbar as any)?.secondaryCtaLink || siteSettings.contact?.whatsappUrl || "https://wa.me/8801754958008"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[14.5px] font-semibold rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer"
          >
            {(siteSettings.navbar as any)?.secondaryCtaText || "Get a Quote"}
          </a>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0c1220] shadow-xl border-t border-slate-200 dark:border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col w-full py-2">
            <Link
              className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${pathname === "/" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
                }`}
              href="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${pathname === "/about" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
                }`}
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
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
                  {servicesList.map((srv, idx) => {
                    const IconComp = srv.icon;
                    return (
                      <Link
                        key={idx}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-xs text-gray-800 dark:text-gray-200 font-medium border-b border-purple-100/60 dark:border-white/5 last:border-b-0"
                        href={srv.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-purple-200/60 dark:border-white/10 flex items-center justify-center shrink-0">
                          <IconComp className="w-3.5 h-3.5 text-[#8b4ec9] shrink-0" />
                        </div>
                        <span className="truncate">{srv.title}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-2 pb-1">
                    <Link
                      href="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1a233a] text-xs font-bold text-[#9a3412] dark:text-orange-400 border border-purple-200/80 dark:border-white/10 shadow-xs"
                    >
                      <span>Explore Custom Software</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${pathname === "/new-work" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
                }`}
              href="/new-work"
              onClick={() => setMobileMenuOpen(false)}
            >
              Work
            </Link>

            <Link
              className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${pathname.startsWith("/industries") ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
                }`}
              href="/industries"
              onClick={() => setMobileMenuOpen(false)}
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
                <div className="bg-[#f4f2ff]/60 dark:bg-[#13192b] pl-6 py-1">
                  <Link className="block px-6 py-2.5 text-xs text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] border-b border-purple-100/60 dark:border-white/5" href="/resources/case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</Link>
                  <Link className="block px-6 py-2.5 text-xs text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] border-b border-purple-100/60 dark:border-white/5" href="/resources/partners" onClick={() => setMobileMenuOpen(false)}>Partners</Link>
                  <Link className="block px-6 py-2.5 text-xs text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9] border-b border-purple-100/60 dark:border-white/5" href="/resources/event" onClick={() => setMobileMenuOpen(false)}>Event</Link>
                  <Link className="block px-6 py-2.5 text-xs text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]" href="/resources/team" onClick={() => setMobileMenuOpen(false)}>Team</Link>
                </div>
              )}
            </div>

            <Link
              className={`text-base font-semibold block w-full px-6 py-3.5 text-left border-b border-slate-100 dark:border-white/5 ${pathname === "/product" || pathname === "/products" ? "text-[#8b4ec9] font-bold bg-purple-50/50 dark:bg-purple-950/20" : "text-gray-800 dark:text-gray-200 hover:text-[#8b4ec9]"
                }`}
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </Link>

            <div className="p-5 flex flex-col gap-3">
              <Link
                href={siteSettings.navbar?.ctaLink || "/schedule"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[15px] font-bold rounded-full text-center transition-colors shadow-xs"
              >
                {siteSettings.navbar?.ctaText || "Book Consultation"}
              </Link>
              <a
                href={(siteSettings.navbar as any)?.secondaryCtaLink || siteSettings.contact?.whatsappUrl || "https://wa.me/8801754958008"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold rounded-full text-center shadow-md transition-colors"
              >
                {(siteSettings.navbar as any)?.secondaryCtaText || "Get a Quote"}
              </a>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
