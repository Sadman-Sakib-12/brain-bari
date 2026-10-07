"use client";

import React, { useState, useEffect } from "react";
import {
  Info,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  Megaphone,
  Calendar
} from "lucide-react";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import AboutContentTab from "./components/AboutContentTab";
import AboutMissionTab from "./components/AboutMissionTab";
import AboutJourneyTab from "./components/AboutJourneyTab";
import AboutServicesAndCtaTab from "./components/AboutServicesAndCtaTab";

type AboutTab = "content" | "mission" | "journey" | "services" | "cta";

export default function WebsiteAboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>("content");
  const [mounted, setMounted] = useState(false);
  const [about, setAbout] = useState<any>({});
  const [saved, setSaved] = useState(false);

  const loadData = async () => {
    try {
      const fresh = await adminApi.getContent("about");
      if (fresh) {
        setAbout(fresh);
        adminStore.setAbout(fresh);
        return;
      }
      const stored = adminStore.getAbout();
      if (stored && Object.keys(stored).length > 0) {
        setAbout(stored);
      }
    } catch {
      const stored = adminStore.getAbout();
      if (stored && Object.keys(stored).length > 0) {
        setAbout(stored);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSave = async () => {
    adminStore.setAbout(about);
    try {
      await adminApi.saveContent("about", about);
      setSaved(true);
      toast.success("About page content saved!", {
        description: "Synchronized with backend database and frontend /about page."
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save About content to database.");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all About content from database?")) {
      try {
        const fresh = await adminApi.getContent("about");
        if (fresh) {
          setAbout(fresh);
          adminStore.setAbout(fresh);
          toast.info("Refreshed content from database.");
        }
      } catch {
        toast.error("Failed to refresh from database.");
      }
    }
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
    <div className="space-y-6">
      <PageHeader
        badge="Website CMS / About Section"
        title="About Page Manager"
        description="Manage company vision, work areas, and milestones. Managed Frontend Section: About Us Page (/about)."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "content"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Hero &amp; Story</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mission")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "mission"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mission &amp; Strategy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("journey")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "journey"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Journey Milestones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "services"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Lifecycle Services</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cta")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "cta"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Conversion CTA</span>
          </button>
        </div>
      </PageHeader>

      {/* TAB PANELS */}
      {activeTab === "content" && (
        <AboutContentTab about={about} setAbout={setAbout} />
      )}

      {activeTab === "mission" && (
        <AboutMissionTab about={about} setAbout={setAbout} />
      )}

      {activeTab === "journey" && (
        <AboutJourneyTab about={about} setAbout={setAbout} />
      )}

      {activeTab === "services" && (
        <AboutServicesAndCtaTab type="services" about={about} setAbout={setAbout} />
      )}

      {activeTab === "cta" && (
        <AboutServicesAndCtaTab type="cta" about={about} setAbout={setAbout} />
      )}
    </div>
  );
}
