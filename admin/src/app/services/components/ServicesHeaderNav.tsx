"use client";

import React from "react";
import { Layers, Plus, ExternalLink, Layout, PackageCheck, Sparkles } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { FRONTEND_URL } from "@/lib/axios";

export type ServicesTab = "all" | "add" | "categories" | "packages";

interface ServicesHeaderNavProps {
  onOpenAddService: () => void;
  activeTab: ServicesTab;
  onTabChange: (tab: ServicesTab) => void;
  servicesCount: number;
  activeCount: number;
}

export default function ServicesHeaderNav({
  onOpenAddService,
  activeTab,
  onTabChange,
  servicesCount,
  activeCount,
}: ServicesHeaderNavProps) {
  return (
    <>
      <PageHeader
        badge="Core Services Management"
        title="Core Services"
        description="Manage the 8 core AI service offerings displayed on your homepage, navbar menu, and public services catalog."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href={`${FRONTEND_URL}/services`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Live Website Catalog</span>
            </a>

            <button
              type="button"
              onClick={onOpenAddService}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>
        }
      />

      {/* QUICK STATS & TABS BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Core Services</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "all" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {servicesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("categories")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === "categories"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Dedicated Landing Pages</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("packages")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === "packages"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Pricing Packages</span>
          </button>
        </div>

        {/* QUICK STATUS BADGE */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeCount} Active on Website
          </span>
        </div>
      </div>
    </>
  );
}
