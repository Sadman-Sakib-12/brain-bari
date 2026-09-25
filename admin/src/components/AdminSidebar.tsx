"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Code2,
  FolderGit2,
  ShoppingBag,
  BookOpen,
  Users,
  Handshake,
  Calendar,
  Inbox,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Sparkles,
  Bot,
  Briefcase
} from "lucide-react";
import { adminStore } from "@/lib/store";

interface SubItem {
  id: string;
  label: string;
  href: string;
  badge?: number | string;
  isHeader?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number | string;
  items: SubItem[];
}

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
  mounted = true
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get("tab") : null;
  const currentAction = searchParams ? searchParams.get("action") : null;
  const currentView = searchParams ? searchParams.get("view") : null;

  const [pendingRequests, setPendingRequests] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dashboard: true,
    website: true,
    services: true,
    chatbots: false,
    projects: false,
    "case-studies": false,
    products: false,
    blog: false,
    team: false,
    partners: false,
    events: false,
    requests: true,
    media: false,
    settings: false
  });

  const [hoveredTooltip, setHoveredTooltip] = useState<{
    title: string;
    items: SubItem[];
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

  // Auto-expand the section matching current path
  useEffect(() => {
    const matchedSection = navSections.find(
      (sec) =>
        pathname === sec.href ||
        pathname.startsWith(sec.href + "/") ||
        sec.items.some((item) => item.href.split("?")[0] === pathname)
    );
    if (matchedSection) {
      setOpenSections((prev) => ({ ...prev, [matchedSection.id]: true }));
    }
  }, [pathname]);

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

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMouseEnterRail = (section: NavSection, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTooltip({
      title: section.title,
      items: section.items,
      top: rect.top + rect.height / 2
    });
  };

  const handleMouseLeaveRail = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTooltip(null);
    }, 200);
  };

  const handleMouseEnterTooltip = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleMouseLeaveTooltip = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTooltip(null);
    }, 150);
  };

  const navSections: NavSection[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      items: [
        { id: "dash-overview", label: "Overview", href: "/" },
        { id: "dash-stats", label: "Statistics", href: "/?tab=statistics" },
        { id: "dash-activity", label: "Recent Activity", href: "/?tab=activity" },
        { id: "dash-actions", label: "Quick Actions", href: "/?tab=actions" }
      ]
    },
    {
      id: "website",
      title: "Website CMS",
      icon: Globe,
      href: "/website/homepage",
      items: [
        { id: "web-home", label: "Homepage Overview", href: "/website/homepage" },
        { id: "web-hero", label: "• Hero Section", href: "/website/homepage?tab=hero" },
        { id: "web-services-prev", label: "• Services Preview", href: "/website/homepage?tab=services" },
        { id: "web-projects-prev", label: "• Projects Preview", href: "/website/homepage?tab=projects" },
        { id: "web-why", label: "• Why Choose Us", href: "/website/homepage?tab=whyChooseUs" },
        { id: "web-workflow", label: "• Workflow", href: "/website/homepage?tab=workflow" },
        { id: "web-partners-prev", label: "• Partners", href: "/website/homepage?tab=partners" },
        { id: "web-cta", label: "• CTA Section", href: "/website/homepage?tab=cta" },
        { id: "web-about", label: "About Page", href: "/website/about" },
        { id: "web-contact", label: "Contact Page", href: "/website/contact" }
      ]
    },
    {
      id: "services",
      title: "Services",
      icon: Code2,
      href: "/services",
      items: [
        { id: "srv-catalog", label: "Service Catalog", href: "/services" },
        { id: "srv-add", label: "Add New Service", href: "/services?action=add" },
        { id: "srv-pkg", label: "Packages", href: "/services?tab=packages" },
        { id: "srv-dedicated-heading", label: "Dedicated Pages", href: "#", isHeader: true },
        { id: "srv-ai-chatbot", label: "• AI Chatbot", href: "/services/ai-chatbot" },
        { id: "srv-ai-saas", label: "• AI SaaS", href: "/services/ai-saas" },
        { id: "srv-custom-ai", label: "• Custom AI Assistant", href: "/services/custom-ai" },
        { id: "srv-ai-3d", label: "• AI & 3D Web Apps", href: "/services/ai-3d" }
      ]
    },
    {
      id: "chatbots",
      title: "Chatbots",
      icon: Bot,
      href: "/chatbots",
      items: [
        { id: "cb-all", label: "Specialized Chatbots", href: "/chatbots" },
        { id: "cb-add", label: "Add Chatbot", href: "/chatbots?action=add" }
      ]
    },
    {
      id: "projects",
      title: "Projects",
      icon: FolderGit2,
      href: "/projects",
      items: [
        { id: "prj-all", label: "All Projects", href: "/projects" },
        { id: "prj-add", label: "Add Project", href: "/projects?action=add" },
        { id: "prj-cat", label: "Categories", href: "/projects?tab=categories" }
      ]
    },
    {
      id: "case-studies",
      title: "Case Studies",
      icon: Briefcase,
      href: "/case-studies",
      items: [
        { id: "cs-studies", label: "Featured Studies", href: "/case-studies" },
        { id: "cs-capabilities", label: "Capabilities (13 Cards)", href: "/case-studies" },
        { id: "cs-testimonials", label: "Client Testimonials", href: "/case-studies" },
        { id: "cs-hero", label: "Hero & Header", href: "/case-studies" }
      ]
    },
    {
      id: "products",
      title: "Products",
      icon: ShoppingBag,
      href: "/products",
      items: [
        { id: "prd-all", label: "All Products", href: "/products" },
        { id: "prd-add", label: "Add Product", href: "/products?action=add" },
        { id: "prd-cat", label: "Categories", href: "/products?tab=categories" },
        { id: "prd-feat", label: "Featured Products", href: "/products?tab=featured" }
      ]
    },
    {
      id: "blog",
      title: "Blog",
      icon: BookOpen,
      href: "/blog",
      items: [
        { id: "blg-all", label: "All Posts", href: "/blog" },
        { id: "blg-add", label: "Add Post", href: "/blog?action=add" },
        { id: "blg-cat", label: "Categories", href: "/blog?tab=categories" },
        { id: "blg-tag", label: "Tags", href: "/blog?tab=tags" }
      ]
    },
    {
      id: "team",
      title: "Team",
      icon: Users,
      href: "/team",
      items: [
        { id: "tm-all", label: "Team Members", href: "/team" },
        { id: "tm-add", label: "Add Member", href: "/team?action=add" },
        { id: "tm-dep", label: "Departments", href: "/team?tab=departments" },
        { id: "tm-expertises", label: "Industry Expertises", href: "/team?tab=expertises" }
      ]
    },
    {
      id: "partners",
      title: "Partners",
      icon: Handshake,
      href: "/partners",
      items: [
        { id: "pt-all", label: "All Partners", href: "/partners" },
        { id: "pt-add", label: "Add Partner", href: "/partners?action=add" },
        { id: "pt-cat", label: "Categories", href: "/partners?tab=categories" }
      ]
    },
    {
      id: "events",
      title: "Events",
      icon: Calendar,
      href: "/events",
      items: [
        { id: "ev-all", label: "All Events", href: "/events" },
        { id: "ev-add", label: "Add Event", href: "/events?action=add" },
        { id: "ev-cat", label: "Categories", href: "/events?tab=categories" }
      ]
    },
    {
      id: "requests",
      title: "Requests",
      icon: Inbox,
      href: "/requests",
      badge: pendingRequests > 0 ? pendingRequests : undefined,
      items: [
        { id: "req-contact", label: "Contact Messages", href: "/requests?tab=contact" },
        { id: "req-quotes", label: "Quote Requests", href: "/requests?tab=quotes" },
        { id: "req-cons", label: "Consultation Requests", href: "/requests?tab=consultations" },
        { id: "req-sub", label: "Newsletter Subscribers", href: "/requests?tab=subscribers" }
      ]
    },
    {
      id: "media",
      title: "Media",
      icon: ImageIcon,
      href: "/media",
      items: [
        { id: "med-all", label: "Media Library", href: "/media" },
        { id: "med-img", label: "Images", href: "/media?tab=images" },
        { id: "med-doc", label: "Documents", href: "/media?tab=documents" }
      ]
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      href: "/settings",
      items: [
        { id: "set-gen", label: "General Settings", href: "/settings?tab=general" },
        { id: "set-seo", label: "SEO Settings", href: "/settings?tab=seo" },
        { id: "set-soc", label: "Social Settings", href: "/settings?tab=social" },
        { id: "set-eml", label: "Email Settings", href: "/settings?tab=email" },
        { id: "set-pro", label: "Admin Profile", href: "/settings?tab=profile" },
        { id: "set-sec", label: "Security", href: "/settings?tab=security" }
      ]
    }
  ];

  const isItemActive = (itemHref: string) => {
    if (itemHref === "#") return false;
    const [path, query] = itemHref.split("?");
    if (pathname !== path) return false;
    if (!query) {
      if (path === "/services") {
        return (!currentTab || currentTab === "all") && !currentAction;
      }
      return !currentTab && !currentAction;
    }
    const params = new URLSearchParams(query);
    const itemTab = params.get("tab");
    const itemAction = params.get("action");
    if (itemTab && itemTab !== currentTab) return false;
    if (itemAction && itemAction !== currentAction) return false;
    return true;
  };

  const isSectionActive = (section: NavSection) => {
    if (pathname === section.href) return true;
    if (section.href !== "/" && pathname.startsWith(section.href)) return true;
    return section.items.some((sub) => isItemActive(sub.href));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity cursor-pointer"
        />
      )}

      {/* Floating Hover Tooltip in collapsed mini-rail mode */}
      {isCollapsed && hoveredTooltip && (
        <div
          style={{ top: hoveredTooltip.top }}
          className="fixed left-[72px] -translate-y-1/2 z-60 hidden lg:flex flex-col min-w-[210px] bg-white text-slate-900 p-2 rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100 shadow-xl"
          onMouseEnter={handleMouseEnterTooltip}
          onMouseLeave={handleMouseLeaveTooltip}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1.5 border-b border-slate-100">
            {hoveredTooltip.title}
          </div>
          <div className="py-1 space-y-0.5 max-h-[300px] overflow-y-auto no-scrollbar">
            {hoveredTooltip.items.map((sub) => {
              if (sub.isHeader) {
                return (
                  <div
                    key={sub.id}
                    className="pt-2 pb-0.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{sub.label}</span>
                  </div>
                );
              }
              return (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={() => setHoveredTooltip(null)}
                  className="block px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Sidebar: 300px Expanded or 72px Collapsed Mini-Rail */}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white border-r border-slate-200 text-slate-900 z-50 flex flex-col justify-between shadow-2xs ${
          mounted ? "transition-all duration-200 ease-in-out" : ""
        } ${
          mobileOpen
            ? "translate-x-0 w-[300px] border-r border-slate-200"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[72px]" : "lg:w-[300px]"}`}
      >
        {/* Brand Header */}
        <div
          className={`border-b border-slate-200 flex items-center transition-all ${
            isCollapsed ? "h-16 px-0 justify-center" : "h-16 px-5 justify-between"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-900 cursor-pointer transition-all active:scale-95 group border border-slate-200"
            >
              <span className="text-xs font-black tracking-tight select-none">BB</span>
              <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-black text-xs tracking-wider border border-blue-200">
                  BB
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    Brain Bari
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Enterprise Admin
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Collapse Sidebar"
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 no-scrollbar">
          {navSections.map((section) => {
            const Icon = section.icon;
            const active = isSectionActive(section);
            const isOpen = !!openSections[section.id];

            if (isCollapsed) {
              return (
                <div
                  key={section.id}
                  className="relative flex justify-center py-1"
                  onMouseEnter={(e) => handleMouseEnterRail(section, e)}
                  onMouseLeave={handleMouseLeaveRail}
                >
                  <Link
                    href={section.href}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative border cursor-pointer ${
                      active
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent"
                    }`}
                    title={section.title}
                  >
                    <Icon className="w-4 h-4" />
                    {section.badge !== undefined && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </Link>
                </div>
              );
            }

            return (
              <div key={section.id} className="space-y-0.5">
                {/* Section Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors border text-left select-none ${
                    active
                      ? "bg-slate-100 text-slate-900 border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pointer-events-none">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{section.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pointer-events-none">
                    {section.badge !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {section.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-150 ${
                        isOpen ? "" : "-rotate-90"
                      }`}
                    />
                  </div>
                </button>

                {/* Sub-items accordion */}
                {isOpen && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-200 ml-4">
                    {section.items.map((sub) => {
                      if (sub.isHeader) {
                        return (
                          <div
                            key={sub.id}
                            className="pt-2.5 pb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>{sub.label}</span>
                          </div>
                        );
                      }
                      const subActive = isItemActive(sub.href);
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => {
                            if (mobileOpen) onCloseMobile();
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors border cursor-pointer ${
                            subActive
                              ? "font-bold text-blue-600 bg-blue-50 border-blue-200"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent font-medium"
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Quick Live Preview & Status */}
        <div className="p-3 border-t border-slate-200">
          {isCollapsed ? (
            <div className="flex justify-center">
              <a
                href="https://botbari.com"
                target="_blank"
                rel="noreferrer"
                title="View Live Site"
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <a
                href="https://botbari.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Live Site</span>
                </div>
                <span className="text-[10px] text-slate-400">botbari.com</span>
              </a>

              <div className="px-3 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                <span>CMS v2.4 Enterprise</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Sync Active
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
