"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Layers,
  Megaphone,
  Save,
  RotateCcw,
  Eye,
  Info,
  Star,
  Building2
} from "lucide-react";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";
import HeroSectionTab from "./components/HeroSectionTab";
import WhyChooseUsTab from "./components/WhyChooseUsTab";
import WorkflowTab from "./components/WorkflowTab";
import CtaTab from "./components/CtaTab";
import SectionVisibilityTab from "./components/SectionVisibilityTab";
import ClientReviewsTab from "./components/ClientReviewsTab";
import ClientLogosTab from "./components/ClientLogosTab";

type HomepageSection = "sections" | "hero" | "whyChooseUs" | "workflow" | "reviews" | "logos" | "cta";

function HomepageContent() {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get("tab") as HomepageSection | null;
  const initialSection: HomepageSection =
    paramTab && ["sections", "hero", "whyChooseUs", "workflow", "reviews", "logos", "cta"].includes(paramTab)
      ? paramTab
      : "sections";

  const [activeTab, setActiveTab] = useState<HomepageSection>(initialSection);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [whyChooseUs, setWhyChooseUs] = useState<any>({ heading: "Why choose us?", items: [] });
  const [reviewsSettings, setReviewsSettings] = useState<any>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  const loadData = async () => {
    try {
      const freshSettings = await adminApi.getSettings();
      if (freshSettings) {
        setSettings(freshSettings);
      }

      const freshWcu = await adminApi.getContent("whyChooseUs");
      if (freshWcu) {
        const parsed = Array.isArray(freshWcu) ? { heading: "Why choose us?", items: freshWcu } : freshWcu;
        setWhyChooseUs(parsed);
      }

      const [freshRevSettings, freshRevs, freshLogos] = await Promise.all([
        adminApi.getContent("reviewsSettings"),
        adminApi.getContent("reviews"),
        adminApi.getContent("clientLogos"),
      ]);
      if (freshRevSettings) setReviewsSettings(freshRevSettings);
      if (freshRevs && Array.isArray(freshRevs)) setReviews(freshRevs);
      if (freshLogos && Array.isArray(freshLogos)) {
        setClientLogos(freshLogos);
      }
    } catch (e) {
      console.error("Failed to load homepage CMS data:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as HomepageSection | null;
    if (tab && ["sections", "hero", "whyChooseUs", "workflow", "reviews", "logos", "cta"].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("sections");
    }
  }, [searchParams]);

  const handleTabChange = (tab: HomepageSection) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const handleSaveAll = async () => {
    const conv = settings.conversionCta || {
      heading: settings.ctaBanner?.headline || "Ready to transfer your Business",
      description: settings.ctaBanner?.subheadline || "Developing and maintaining web applications using React.js, Next.js, and other related technologies.",
      buttonText: settings.ctaBanner?.buttonText || "Schedule A Consultation",
      buttonLink: settings.ctaBanner?.buttonLink || "/schedule"
    };
    const ctaB = settings.ctaBanner || {
      headline: conv.heading,
      subheadline: conv.description,
      buttonText: conv.buttonText,
      buttonLink: conv.buttonLink
    };

    const updatedSettings = {
      ...settings,
      workflow: settings.workflow || {},
      conversionCta: conv,
      ctaBanner: ctaB,
      whyChooseUs: {
        ...(settings.whyChooseUs || {}),
        heading: whyChooseUs.heading,
        subheading: whyChooseUs.subheading,
        buttonText: whyChooseUs.buttonText || settings.whyChooseUs?.buttonText || "Learn more",
        buttonLink: whyChooseUs.buttonLink || settings.whyChooseUs?.buttonLink || "/about",
        items: whyChooseUs.items
      }
    };

    adminStore.setSettings(updatedSettings);
    adminStore.setWhyChooseUs(whyChooseUs);

    try {
      await Promise.all([
        adminApi.updateSettings(updatedSettings),
        adminApi.saveContent("whyChooseUs", whyChooseUs),
        adminApi.saveContent("reviewsSettings", reviewsSettings),
        adminApi.saveContent("reviews", reviews),
      ]);
      setSettings(updatedSettings);
      setSaved(true);
      toast.success("Homepage content saved successfully!", {
        description: "Changes are synchronized with your live website."
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Save error in homepage CMS:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to save homepage content to database.");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset homepage settings back to database state?")) {
      try {
        const freshSettings = await adminApi.getSettings();
        if (freshSettings) {
          setSettings(freshSettings);
          adminStore.setSettings(freshSettings);
        }
        const freshWcu = await adminApi.getContent("whyChooseUs");
        if (freshWcu) {
          const parsed = Array.isArray(freshWcu) ? { heading: "Why choose us?", items: freshWcu } : freshWcu;
          setWhyChooseUs(parsed);
          adminStore.setWhyChooseUs(parsed);
        }
        const [freshRevSettings, freshRevs] = await Promise.all([
          adminApi.getContent("reviewsSettings"),
          adminApi.getContent("reviews"),
        ]);
        if (freshRevSettings) setReviewsSettings(freshRevSettings);
        if (freshRevs && Array.isArray(freshRevs)) setReviews(freshRevs);
        toast.info("Homepage settings reset from database.");
      } catch {
        toast.error("Failed to refresh from database.");
      }
    }
  };

  const sectionMeta: Record<HomepageSection, { title: string; desc: string }> = {
    sections: {
      title: "Section Visibility",
      desc: "Turn any of the 8 homepage sections on or off with live 1-click toggle switches."
    },
    hero: {
      title: "Hero Section",
      desc: "Controls the main landing title, robot graphic, search bar, filter pills, and speech bubbles."
    },
    whyChooseUs: {
      title: "Why Choose Us (3 Pillars)",
      desc: "Controls the 3 strategic pillar cards shown prominently on the homepage."
    },
    workflow: {
      title: "Workflow Capabilities (3 Steps)",
      desc: "Controls the step-by-step interactive workflow breakdown cards."
    },
    reviews: {
      title: "Client Testimonials",
      desc: "Controls client review cards, rating summaries, client names, roles, services, and avatars."
    },
    logos: {
      title: "Client Partner Logos",
      desc: "Manage client and partner company logos displayed in the marquee ticker section."
    },
    cta: {
      title: "Conversion CTA Banner",
      desc: "Controls the global call to action banner directly above the homepage footer."
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
      {/* Top Page Header */}
      <PageHeader
        badge={`Website CMS / Homepage / ${sectionMeta[activeTab]?.title || "Hero Section"}`}
        title={`Homepage CMS — ${sectionMeta[activeTab]?.title || "Hero Section"}`}
        description={sectionMeta[activeTab]?.desc || "Manage the essential content sections that control your live homepage."}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-900 cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
            <a
              href={FRONTEND_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview Live Site</span>
            </a>
          </div>
        }
      />

      {/* TAB PANELS */}
      {activeTab === "sections" && (
        <SectionVisibilityTab
          settings={settings}
          setSettings={setSettings}
          onSwitchTab={(tabKey: string) => handleTabChange(tabKey as HomepageSection)}
        />
      )}

      {activeTab === "hero" && (
        <HeroSectionTab
          settings={settings}
          setSettings={setSettings}
          onSave={handleSaveAll}
        />
      )}

      {activeTab === "whyChooseUs" && (
        <WhyChooseUsTab
          whyChooseUs={whyChooseUs}
          setWhyChooseUs={setWhyChooseUs}
          settings={settings}
          setSettings={setSettings}
          onSave={handleSaveAll}
        />
      )}

      {activeTab === "workflow" && (
        <WorkflowTab
          settings={settings}
          setSettings={setSettings}
          onSave={handleSaveAll}
        />
      )}

      {activeTab === "reviews" && (
        <ClientReviewsTab
          reviewsSettings={reviewsSettings}
          setReviewsSettings={setReviewsSettings}
          reviews={reviews}
          setReviews={setReviews}
          onSaveAll={handleSaveAll}
        />
      )}

      {activeTab === "logos" && (
        <ClientLogosTab
          clientLogos={clientLogos}
          setClientLogos={setClientLogos}
        />
      )}

      {activeTab === "cta" && (
        <CtaTab
          settings={settings}
          setSettings={setSettings}
          onSave={handleSaveAll}
        />
      )}

      {/* Helpful Guidance Footer for other Homepage Modules */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Looking to update other parts of your website? Services, portfolio projects, client reviews, and chatbots are managed in their dedicated modules:
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/services"
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs transition-colors"
          >
            Core Services
          </Link>
          <Link
            href="/chatbots"
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs transition-colors"
          >
            Chatbots
          </Link>
          <Link
            href="/projects"
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs transition-colors"
          >
            Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageManagerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Homepage Manager...</div>}>
      <HomepageContent />
    </Suspense>
  );
}
