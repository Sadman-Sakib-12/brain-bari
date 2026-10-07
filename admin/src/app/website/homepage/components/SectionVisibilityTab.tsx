"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Bot,
  GitBranch,
  Briefcase,
  Star,
  Megaphone,
  Eye,
  EyeOff,
  Check,
  SlidersHorizontal,
  ArrowRight,
  Save,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { toast } from "sonner";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";

interface SectionVisibilityTabProps {
  settings: any;
  setSettings: (s: any) => void;
  onSwitchTab?: (tab: string) => void;
}

interface SectionDefinition {
  key: string;
  name: string;
  order: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tabId?: string;
  directUrl?: string;
  previewHint: string;
}

const HOMEPAGE_SECTIONS: SectionDefinition[] = [
  {
    key: "hero",
    name: "Hero Section",
    order: "01",
    description: "Main landing H1 headline, robot illustration, interactive search bar, speech bubbles, and quick filter pills.",
    icon: Sparkles,
    tabId: "hero",
    previewHint: "Top of the homepage banner",
  },
  {
    key: "coreServices",
    name: "Core Services & Pricing Cards",
    order: "02",
    description: "The 4 core service cards with starting prices, delivery days, feature checklists, and 'View Details' triggers.",
    icon: Layers,
    directUrl: "/services",
    previewHint: "Services catalog showcase",
  },
  {
    key: "whyChooseUs",
    name: "Why Choose Us (3 Value Pillars)",
    order: "03",
    description: "Three strategic enterprise pillars highlighting precision AI, reliability, fast delivery, and SOC2 compliance.",
    icon: ShieldCheck,
    tabId: "whyChooseUs",
    previewHint: "Middle trust & authority section",
  },
  {
    key: "specializedChatbots",
    name: "Specialized AI Chatbots Showcase",
    order: "04",
    description: "Interactive showcase of customer service, sales, and internal automation chatbots with live demo links.",
    icon: Bot,
    directUrl: "/chatbots",
    previewHint: "Interactive chatbots carousel",
  },
  {
    key: "workflow",
    name: "Capabilities & 4-Step Workflow",
    order: "05",
    description: "Detailed step-by-step enterprise AI delivery workflow from initial discovery to production deployment.",
    icon: GitBranch,
    tabId: "workflow",
    previewHint: "Roadmap & capabilities guide",
  },
  {
    key: "portfolio",
    name: "Portfolio / Our Projects",
    order: "06",
    description: "Completed client case studies, live production demo buttons, tag chips, and deliverables preview.",
    icon: Briefcase,
    directUrl: "/projects",
    previewHint: "Work deliverables showcase",
  },
  {
    key: "reviews",
    name: "Client Reviews & Testimonials",
    order: "07",
    description: "Client feedback quotes, ratings (5.0), verified reviewer roles, and company affiliations.",
    icon: Star,
    tabId: "reviews",
    previewHint: "Social proof testimonial slider",
  },
  {
    key: "cta",
    name: "Conversion CTA Booking Banner",
    order: "08",
    description: "Final high-impact banner inviting users to schedule a 45-minute strategic consultation with Brain Bari.",
    icon: Megaphone,
    tabId: "cta",
    previewHint: "Bottom call-to-action banner",
  },
];

export default function SectionVisibilityTab({
  settings,
  setSettings,
  onSwitchTab,
}: SectionVisibilityTabProps) {
  const sections = settings?.homepageSections || {};

  // Check if a section is visible (defaults to true if unset)
  const isSectionVisible = (key: string): boolean => {
    return sections[key] !== false;
  };

  const handleToggle = (key: string, name: string) => {
    const currentStatus = isSectionVisible(key);
    const newStatus = !currentStatus;

    const updatedSettings = {
      ...settings,
      homepageSections: {
        ...(settings.homepageSections || {}),
        [key]: newStatus,
      },
    };

    setSettings(updatedSettings);
    adminStore.setSettings(updatedSettings);

    adminApi
      .updateSettings(updatedSettings)
      .then(() => {
        if (newStatus) {
          toast.success(`${name} is now Visible on the live homepage!`);
        } else {
          toast.warning(`${name} is now Hidden from the live homepage.`);
        }
      })
      .catch((err) => {
        console.error("Failed to update section visibility:", err);
        toast.error("Failed to save visibility changes to backend.");
      });
  };

  const handleSetAll = (visible: boolean) => {
    const newSections: Record<string, boolean> = {};
    HOMEPAGE_SECTIONS.forEach((s) => {
      newSections[s.key] = visible;
    });

    const updatedSettings = {
      ...settings,
      homepageSections: newSections,
    };

    setSettings(updatedSettings);
    adminStore.setSettings(updatedSettings);

    adminApi
      .updateSettings(updatedSettings)
      .then(() => {
        toast.success(
          visible
            ? "All 8 homepage sections are now Visible!"
            : "All 8 homepage sections are now Hidden."
        );
      })
      .catch(() => {
        toast.error("Failed to update sections.");
      });
  };

  const visibleCount = HOMEPAGE_SECTIONS.filter((s) => isSectionVisible(s.key)).length;

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Live Section Controller</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              Homepage Layout &amp; Visibility Controls
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Turn individual sections on or off with instant toggle switches. Hidden sections will immediately disappear from your live public homepage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Active Sections
              </span>
              <span className="text-xl font-black text-white">
                {visibleCount} <span className="text-xs font-normal text-slate-400">/ 8</span>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleSetAll(true)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer transition-colors"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => handleSetAll(false)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/40 cursor-pointer transition-colors"
              >
                Hide All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 8 Sections with Toggle Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOMEPAGE_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isVisible = isSectionVisible(section.key);

          return (
            <div
              key={section.key}
              className={`rounded-2xl border transition-all p-4.5 flex flex-col justify-between gap-4 ${
                isVisible
                  ? "bg-white border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300"
                  : "bg-slate-50/70 border-slate-200/60 opacity-80"
              }`}
            >
              {/* Top row: Order, Icon, Title, and Toggle Switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isVisible
                        ? "bg-indigo-50 border-indigo-200/80 text-indigo-600"
                        : "bg-slate-200/80 border-slate-300 text-slate-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {section.order}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                        {section.name}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {section.previewHint}
                    </span>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(section.key, section.name)}
                  role="switch"
                  aria-checked={isVisible}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isVisible ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  title={isVisible ? "Click to Hide this section" : "Click to Show this section"}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isVisible ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {section.description}
              </p>

              {/* Bottom footer: Status badge + quick action link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {isVisible ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Visible on Homepage</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold">
                    <EyeOff className="w-3 h-3 text-slate-400" />
                    <span>Hidden from Public</span>
                  </span>
                )}

                {/* Edit Link */}
                {section.tabId && onSwitchTab && (
                  <button
                    type="button"
                    onClick={() => onSwitchTab(section.tabId!)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <span>Edit Content</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {section.directUrl && (
                  <Link
                    href={section.directUrl}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>Manage Module</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
