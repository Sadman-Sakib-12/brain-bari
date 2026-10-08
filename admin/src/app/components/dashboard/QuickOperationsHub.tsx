"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Layers,
  FolderGit2,
  Inbox,
  ChevronRight,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface QuickOperationsHubProps {
  servicesCount: number;
  pendingCount: number;
}

export default function QuickOperationsHub({ servicesCount, pendingCount }: QuickOperationsHubProps) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Operations Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Frequently used actions to manage your website and business</p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showGuide ? "Hide Quick Guide" : "View Client Guide"}</span>
        </button>
      </div>

      {/* Collapsible Client Guide Card */}
      {showGuide && (
        <div className="mb-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-5 text-slate-800 dark:text-slate-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Client Guide: How to manage your website effortlessly</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <p className="font-bold text-slate-900 dark:text-white mb-1">1. Editing Website Content</p>
              <p>Navigate to <strong>Website CMS</strong> to change headlines, hero banners, Why Choose Us points, or about stories. Changes update on your live website in real time.</p>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <p className="font-bold text-slate-900 dark:text-white mb-1">2. Updating Photos &amp; Banners</p>
              <p>You can upload or replace images directly inside any page (Services, Homepage, Team, Portfolio). Images are automatically formatted and optimized.</p>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <p className="font-bold text-slate-900 dark:text-white mb-1">3. Managing Client Orders</p>
              <p>When clients submit quotes or book appointments, check <strong>Orders &amp; Inquiries</strong>. You can approve quotes, update prices, and change statuses.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Website CMS */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Website CMS &amp; Pages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Update homepage hero, why choose us points, about story, and contact details.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">3 Managed Pages</span>
            <Link
              href="/website/homepage"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Edit Content</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Services & Pricing */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                AI Services &amp; Pricing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Control all core service offerings, pricing tiers, deliverables, and turnaround times.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{servicesCount} Services Active</span>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Portfolio & Projects */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Portfolio &amp; Projects
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Showcase client case studies, live demo links, and completed AI solutions.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Showcase Works</span>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Client Leads & Inquiries */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Client Leads &amp; Quotes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Review customer quotes from /order, booking calls from /schedule, and messages.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono">
              {pendingCount} Pending
            </span>
            <Link
              href="/requests?tab=quotes"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Review Leads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
