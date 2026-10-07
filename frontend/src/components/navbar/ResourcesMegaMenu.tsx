"use client";

import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Handshake, 
  Calendar, 
  UserCheck, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Globe,
  FileText,
  Users,
  Award,
  Star,
  Zap,
  Search
} from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";

interface ResourcesMegaMenuProps {
  resourcesRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
  links?: Array<{ label: string; href: string }>;
}

interface ResourceCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Handshake,
  Calendar,
  UserCheck,
  Layers,
  BookOpen,
  Sparkles,
  Cpu,
  ShieldCheck,
  Globe,
  FileText,
  Users,
  Award,
  Star,
  Zap,
  Search,
};

const DEFAULT_RESOURCE_LINKS = [
  { id: "res-case-studies", title: "Case Studies", description: "In-depth analyses of enterprise AI and SaaS implementations.", href: "/resources/case-studies", icon: "Briefcase" },
  { id: "res-partners", title: "Partners", description: "Our global technology network and strategic collaborative alliances.", href: "/resources/partners", icon: "Handshake" },
  { id: "res-events", title: "Events", description: "Community gatherings, webinars, and hackathons hosted by Brain Bari.", href: "/resources/event", icon: "Calendar" },
  { id: "res-team", title: "Team", description: "Meet our engineers, researchers, and executive leadership.", href: "/resources/team", icon: "UserCheck" },
];

export default function ResourcesMegaMenu({
  resourcesRef,
  onMouseEnter,
  onMouseLeave,
  onClose,
  links,
}: ResourcesMegaMenuProps) {
  const { data: spotlight } = useCmsContent<any>("resourcesSpotlight");
  const { data: dbResources } = useCmsContent<any[]>("resourcesLinks");

  const spotlightTitle = spotlight?.title || "Explore Brain Bari Insights";
  const spotlightDesc = spotlight?.description || "Read our technical whitepapers, architectural deep dives, and conversational AI case studies.";
  const spotlightFeatures: string[] = Array.isArray(spotlight?.features) && spotlight.features.length > 0
    ? spotlight.features
    : ["Autonomous RAG Agents", "High-Throughput SaaS", "Model Fine-tuning"];
  const spotlightLinkText = spotlight?.linkText || "Explore Blog & Insights";
  const spotlightLinkUrl = spotlight?.linkUrl || "/blog";

  // Map incoming links, dbResources from NeonDB, or default fallback
  const resourceCards = React.useMemo(() => {
    const source = (Array.isArray(dbResources) && dbResources.length > 0)
      ? dbResources
      : (Array.isArray(links) && links.length > 0 ? links : DEFAULT_RESOURCE_LINKS);

    return source.map((item: any, idx: number) => {
      const iconKey = typeof item.icon === "string" ? item.icon : "";
      const IconComponent = (iconKey && ICON_MAP[iconKey]) || (typeof item.icon === "function" ? item.icon : Layers);
      return {
        id: item.id || `custom-res-${idx}`,
        title: item.title || item.label || "",
        description: item.description || "Access specialized ecosystem assets, guides, and documentation.",
        href: item.href || "#",
        icon: IconComponent,
      };
    });
  }, [dbResources, links]);

  return (
    <div
      ref={resourcesRef}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] max-w-[calc(100vw-32px)] z-[999] pt-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-[#f4f2ff] dark:bg-[#121626] rounded-[28px] shadow-[0_24px_60px_-12px_rgba(112,68,220,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 border border-purple-200/70 dark:border-white/10 text-left">
        {/* Top Header Section */}
        <div className="mb-4 pb-3 border-b border-purple-200/50 dark:border-white/10">
          <h3 className="text-[19px] font-extrabold text-slate-950 dark:text-white tracking-tight">
            {spotlight?.headerTitle || "Our Resources"}
          </h3>
          <div className="w-10 h-[3px] bg-[#9a3412] dark:bg-[#f97316] rounded-full mt-1.5"></div>
        </div>

        {/* Mega Menu Body */}
        <div className="flex gap-5 items-stretch">
          {/* Left Single-Column Resources List (One below another / নিচে নিচে) */}
          <div className="flex-1 flex flex-col justify-between gap-2.5">
            {resourceCards.map((res, index) => {
              const IconComponent = res.icon;
              return (
                <Link
                  key={res.id || index}
                  href={res.href}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all group/item cursor-pointer border border-purple-100/70 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-white/10 text-[#8b4ec9] dark:text-[#c084fc] flex items-center justify-center shrink-0 shadow-2xs group-hover/item:scale-105 group-hover/item:bg-[#8b4ec9] group-hover/item:text-white transition-all">
                    <IconComponent className="w-5 h-5 stroke-[1.9]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-slate-950 dark:text-white group-hover/item:text-[#8b4ec9] dark:group-hover/item:text-[#c084fc] transition-colors leading-tight mb-0.5">
                      {res.title}
                    </div>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal leading-snug line-clamp-1">
                      {res.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Spotlight Card */}
          <div className="w-[310px] shrink-0 bg-white dark:bg-[#1a233a] rounded-[22px] p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b4ec9] via-[#a855f7] to-[#ec4899] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                  <BookOpen className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-950 dark:text-white leading-tight">
                    {spotlightTitle}
                  </h4>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                {spotlightDesc}
              </p>
              <div className="mt-3.5 space-y-2">
                {spotlightFeatures.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[3]" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
              <Link
                href={spotlightLinkUrl}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#8b4ec9] hover:text-[#703ab0] dark:text-purple-400 dark:hover:text-purple-300 transition-colors group/link"
              >
                <span>{spotlightLinkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
