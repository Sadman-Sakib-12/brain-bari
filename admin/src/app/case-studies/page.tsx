"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";
import {
  Briefcase,
  Save,
  RotateCcw,
  CheckCircle2,
  Layers,
  Check,
  ExternalLink
} from "lucide-react";
import { CaseStudy, CapabilityItem, TestimonialItem, CaseStudiesHero } from "./types";
import CaseStudiesTab from "./components/CaseStudiesTab";
import CapabilitiesTab from "./components/CapabilitiesTab";

type ActiveTab = "studies" | "capabilities";

export default function CaseStudiesCmsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("studies");
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  // Core Datasets
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [hero, setHero] = useState<CaseStudiesHero>({
    badge: "Solutions & Capabilities",
    title: "What product do you want to",
    titleHighlight: "build?",
    description: "Delivering value with tailored software solutions. Brain Bari is your trusted software and AI development partner.",
    buttonText: "Start Your Solution",
    buttonLink: "/order"
  });

  const loadData = useCallback(async () => {
    try {
      const freshStudies = await adminApi.getContent("caseStudies");
      if (freshStudies && Array.isArray(freshStudies)) {
        setCaseStudies(freshStudies as CaseStudy[]);
      }

      const freshPage = await adminApi.getContent("caseStudiesPage");
      if (freshPage) {
        if (freshPage.capabilities) setCapabilities(freshPage.capabilities as CapabilityItem[]);
        if (freshPage.testimonials) setTestimonials(freshPage.testimonials as TestimonialItem[]);
        if (freshPage.hero) setHero(freshPage.hero as CaseStudiesHero);
      }
    } catch (e) {
      console.error("Error loading case studies data:", e);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        adminApi.saveContent("caseStudies", caseStudies),
        adminApi.saveContent("caseStudiesPage", {
          hero,
          capabilities,
          testimonials
        })
      ]);
      setSaved(true);
      toast.success("Case Studies CMS updated successfully!", {
        description: "Live synchronization across Frontend and Database is active."
      });
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save Case Studies to database.");
    }
  };

  const handleResetAll = async () => {
    if (confirm("Reset all Case Studies, Capabilities, and Testimonials back to database state?")) {
      try {
        const freshStudies = await adminApi.getContent("caseStudies");
        if (freshStudies && Array.isArray(freshStudies)) {
          setCaseStudies(freshStudies as CaseStudy[]);
        }
        const freshPage = await adminApi.getContent("caseStudiesPage");
        if (freshPage) {
          if (freshPage.capabilities) setCapabilities(freshPage.capabilities as CapabilityItem[]);
          if (freshPage.testimonials) setTestimonials(freshPage.testimonials as TestimonialItem[]);
          if (freshPage.hero) setHero(freshPage.hero as CaseStudiesHero);
        }
        toast.info("Content refreshed from database.");
      } catch {
        toast.error("Failed to refresh from database.");
      }
    }
  };

  const handleUpdateStudies = (updated: CaseStudy[]) => {
    setCaseStudies(updated);
  };

  const handleUpdateCapabilities = (updated: CapabilityItem[]) => {
    setCapabilities(updated);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* SaaS Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Resources</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Case Studies CMS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Briefcase className="w-6 h-6 text-slate-800" />
            <span>Case Studies &amp; Capabilities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise content management. Manage Deliverable Case Studies catalog and Technical Development Capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={`${FRONTEND_URL}/resources/case-studies`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Page</span>
          </a>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-300" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* KPI Overview Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Case Studies
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {caseStudies.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Deliverables Catalog</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Capabilities
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {capabilities.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Development Offerings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-100">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Sync Engine
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-900">Active</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Disk &amp; Frontend Live</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Check className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav aria-label="CMS Tabs" className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("studies")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "studies"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Featured Case Studies</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "studies" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {caseStudies.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("capabilities")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "capabilities"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Development Capabilities</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "capabilities" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {capabilities.length}
          </span>
        </button>
      </nav>

      {/* Tab Panels */}
      {activeTab === "studies" && (
        <CaseStudiesTab
          caseStudies={caseStudies}
          onUpdate={handleUpdateStudies}
        />
      )}

      {activeTab === "capabilities" && (
        <CapabilitiesTab
          capabilities={capabilities}
          onUpdate={handleUpdateCapabilities}
        />
      )}
    </div>
  );
}
