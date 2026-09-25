"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Code2,
  FolderGit2,
  ShieldCheck,
  Handshake,
  Megaphone,
  Settings,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  Globe,
  ExternalLink,
  MessageSquare,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Tag,
  LayoutGrid
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialSettings from "@/data/siteSettings.json";
import initialWhyChooseUs from "@/data/whyChooseUs.json";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type HomepageSection =
  | "overview"
  | "hero"
  | "services"
  | "projects"
  | "whyChooseUs"
  | "partners"
  | "workflow"
  | "cta";

function HomepageContent() {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get("tab") as HomepageSection | null;
  const initialSection: HomepageSection =
    paramTab && ["hero", "services", "projects", "whyChooseUs", "partners", "workflow", "cta"].includes(paramTab)
      ? paramTab
      : "hero";

  const [activeTab, setActiveTab] = useState<HomepageSection>(initialSection);
  const [settings, setSettings] = useState<any>(initialSettings);
  const [whyChooseUs, setWhyChooseUs] = useState<any>(
    Array.isArray(initialWhyChooseUs) ? { heading: "Why choose us?", items: initialWhyChooseUs } : initialWhyChooseUs
  );
  const [saved, setSaved] = useState(false);

  const loadData = () => {
    try {
      const st = adminStore.getSettings();
      if (st && st.hero) setSettings(st);
      const wcu: any = adminStore.getWhyChooseUs();
      if (wcu) {
        setWhyChooseUs(Array.isArray(wcu) ? { heading: "Why choose us?", items: wcu } : wcu);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as HomepageSection | null;
    if (tab && ["hero", "services", "projects", "whyChooseUs", "partners", "workflow", "cta", "overview"].includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleTabChange = (tab: HomepageSection) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "overview") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  const handleSaveAll = () => {
    // Ensure conversionCta and ctaBanner stay synchronized
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

    setSaved(true);
    toast.success("Homepage content saved successfully!", {
      description: "Frontend homepage sections are updated in real time."
    });

    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset homepage settings back to defaults?")) {
      setSettings(initialSettings);
      setWhyChooseUs(
        Array.isArray(initialWhyChooseUs)
          ? { heading: "Why choose us?", items: initialWhyChooseUs }
          : initialWhyChooseUs
      );
      adminStore.setSettings(initialSettings);
      adminStore.setWhyChooseUs(initialWhyChooseUs);
      toast.info("Reset to default configuration.");
    }
  };

  const tabsConfig = [
    { id: "overview" as HomepageSection, label: "All Sections", icon: LayoutGrid },
    { id: "hero" as HomepageSection, label: "Hero Section", icon: Sparkles },
    { id: "services" as HomepageSection, label: "Services Preview", icon: Code2 },
    { id: "projects" as HomepageSection, label: "Projects Preview", icon: FolderGit2 },
    { id: "whyChooseUs" as HomepageSection, label: "Why Choose Us", icon: ShieldCheck },
    { id: "workflow" as HomepageSection, label: "Workflow Capabilities", icon: Layers },
    { id: "partners" as HomepageSection, label: "Partners Section", icon: Handshake },
    { id: "cta" as HomepageSection, label: "CTA Banner", icon: Megaphone }
  ];

  const sectionsList = [
    {
      id: "hero" as HomepageSection,
      title: "Hero Section",
      badge: "Above the Fold",
      icon: Sparkles,
      description: "Primary H1 headline, robot illustration, search bar placeholder, filter pills, and AI chat bubbles.",
      status: "Configured & Live",
      previewText: `"${settings.hero?.headline || "Powering Ideas with"} ${settings.hero?.headlineGradient || "AI & Software"}"`
    },
    {
      id: "services" as HomepageSection,
      title: "Services Preview",
      badge: "4 Offerings",
      icon: Code2,
      description: "Showcases 4 core service cards with direct 'Order' and 'Learn More' action buttons.",
      status: "4 Cards Active",
      previewText: `Order: "${settings.coreServices?.orderText || "Order"}" · Secondary: "${settings.coreServices?.learnMoreText || "Learn More"}"`
    },
    {
      id: "projects" as HomepageSection,
      title: "Projects Preview",
      badge: "Portfolio Showcase",
      icon: FolderGit2,
      description: "Featured client projects and intelligent systems: ABC24, TaxBot, and CCcalculator live previews.",
      status: "3 Featured Live",
      previewText: "ABC24 Asian Bioethics · TaxBot System · CCcalculator ROI Analyzer"
    },
    {
      id: "whyChooseUs" as HomepageSection,
      title: "Why Choose Us",
      badge: "3 Pillars",
      icon: ShieldCheck,
      description: "Three strategic feature pillars: Creative Thinking, Career Planning, and Public Speaking capabilities.",
      status: "3 Pillars Active",
      previewText: `Heading: "${whyChooseUs.heading || "Why choose us?"}"`
    },
    {
      id: "workflow" as HomepageSection,
      title: "Workflow Capabilities",
      badge: "Automation Flow",
      icon: Layers,
      description: "Three automated execution stages: Website Assistant Chatbot, Schedule setup, and Content Generation pipeline.",
      status: "Configured & Live",
      previewText: `Card 1: "${settings.workflow?.card1Title || "Website Assistant Chatbot"}" · Card 2: "${settings.workflow?.card2Title || "Schedule"}"`
    },
    {
      id: "partners" as HomepageSection,
      title: "Partners Section",
      badge: "Trust & Ecosystem",
      icon: Handshake,
      description: "Ecosystem partner logos, strategic technology alliances, and institutional integrations.",
      status: "Active",
      previewText: "Strategic Integration Partners & Collaborative Network"
    },
    {
      id: "cta" as HomepageSection,
      title: "Conversion CTA Banner",
      badge: "Lead Generator",
      icon: Megaphone,
      description: "Full-width conversion banner redirecting visitors to 60-min strategy consultation bookings.",
      status: "Active",
      previewText: `Heading: "${settings.conversionCta?.heading || settings.ctaBanner?.headline || "Ready to transfer your Business"}"`
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Website CMS / Homepage Manager"
        title="Homepage Section Manager"
        description="Configure each individual section of the public homepage. Content updates are synchronized directly to the frontend."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:text-slate-900 cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save All Changes"}</span>
            </button>
            <a
              href="http://localhost:3000"
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

      {/* Modern Page Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs no-scrollbar">
        {tabsConfig.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white font-semibold border border-slate-900 shadow-2xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: ALL SECTIONS OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Homepage Sections Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any section below to configure its texts, buttons, and live elements directly on the page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionsList.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{sec.title}</h3>
                          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                            {sec.badge}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sec.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{sec.description}</p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium truncate">
                      <span className="text-slate-400 mr-1.5">Live Preview:</span>
                      <span>{sec.previewText}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Section 0{idx + 1} of 07</span>
                    <button
                      type="button"
                      onClick={() => handleTabChange(sec.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Edit on Page</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: HERO SECTION */}
      {activeTab === "hero" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hero Section Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Primary H1 headline, robot illustration, search bar placeholder, filter pills, and AI chat bubbles.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Hero</span>
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Directly synchronized with frontend hero banner.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("services")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
                >
                  <span>Next: Services Preview</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Headline Prefix" required hint="Main white headline text before highlight">
                <input
                  type="text"
                  value={settings.hero?.headline || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, headline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Powering Ideas with"
                />
              </FormField>

              <FormField label="Headline Gradient Words" required hint="Words styled with high-tech cyan/blue gradient">
                <input
                  type="text"
                  value={settings.hero?.headlineGradient || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, headlineGradient: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="AI & Software"
                />
              </FormField>
            </div>

            <FormField label="Subheadline / Tagline Description">
              <textarea
                rows={3}
                value={settings.hero?.subheadline || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, subheadline: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border rounded-xl"
                placeholder="We build cutting-edge conversational AI chatbots..."
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Primary CTA Text">
                <input
                  type="text"
                  value={settings.hero?.ctaText || "Start Your Project"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, ctaText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </FormField>

              <FormField label="Top Announcement Badge">
                <input
                  type="text"
                  value={settings.hero?.badge || "✨ Next-Gen AI & Web Agency"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, badge: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Search Box Placeholder">
                <input
                  type="text"
                  value={settings.hero?.searchPlaceholder || "What do you want to build?"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, searchPlaceholder: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="What do you want to build?"
                />
              </FormField>

              <FormField label="Robot / Banner Image URL">
                <input
                  type="text"
                  value={settings.hero?.robotImage || "/images/hero_robot.jpg"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, robotImage: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
                  placeholder="/images/hero_robot.jpg"
                />
              </FormField>
            </div>

            {/* Filter Pills Repeater */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span>Search Category Filter Pills ({settings.hero?.filterPills?.length || 0})</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Pills displayed below the search bar on the homepage hero.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const pills = [...(settings.hero?.filterPills || [])];
                    pills.push("New Category");
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, filterPills: pills }
                    });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {settings.hero?.filterPills?.map((pill: string, pIdx: number) => (
                  <div key={pIdx} className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-xl shadow-2xs">
                    <input
                      type="text"
                      value={pill}
                      onChange={(e) => {
                        const updated = [...settings.hero.filterPills];
                        updated[pIdx] = e.target.value;
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, filterPills: updated }
                        });
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-transparent border-0 text-xs text-slate-900 focus:outline-none"
                      placeholder="e.g. AI Solutions"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = settings.hero.filterPills.filter((_: any, i: number) => i !== pIdx);
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, filterPills: updated }
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Simulation Bubbles */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Interactive AI Chat Simulation Widget</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Bot Dialogue Bubble 1">
                  <input
                    type="text"
                    value={settings.hero?.speechBubble1 || "Hi! How can I help you?"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, speechBubble1: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </FormField>

                <FormField label="Client Dialogue Bubble 2">
                  <input
                    type="text"
                    value={settings.hero?.speechBubble2 || "Hi Brainbari! I need your help."}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, speechBubble2: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: SERVICES PREVIEW */}
      {activeTab === "services" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Services Preview Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Manage action buttons and card behaviors for the 4 core offerings on the homepage.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Services</span>
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">All 4 services link directly to individual product details and booking.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("projects")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
                >
                  <span>Next: Projects Preview</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Card Primary Button Label" hint="Redirects users directly to /order checkout">
                <input
                  type="text"
                  value={settings.coreServices?.orderText || "Order"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      coreServices: { ...settings.coreServices, orderText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Order"
                />
              </FormField>

              <FormField label="Card Secondary Button Label" hint="Redirects to service detail overview">
                <input
                  type="text"
                  value={settings.coreServices?.learnMoreText || "Learn More"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      coreServices: { ...settings.coreServices, learnMoreText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Learn More"
                />
              </FormField>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-xs">4 Core Services Active on Homepage:</p>
                <a
                  href="/services"
                  className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>Manage All Services in Full CMS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {[
                  { name: "AI Chatbot", price: "$259+", desc: "Conversational customer engagement", link: "/chatbots" },
                  { name: "AI SaaS", price: "$450+", desc: "Enterprise cloud platforms", link: "/services/ai-saas" },
                  { name: "Custom AI Assistant", price: "$650+", desc: "Bespoke LLM models", link: "/services/custom-ai" },
                  { name: "AI & 3D Web Apps", price: "$450+", desc: "Three.js immersive experiences", link: "/services/ai-3d" }
                ].map((s, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-600">{s.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: PROJECTS PREVIEW */}
      {activeTab === "projects" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Projects Preview Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Showcase featured productions and case studies on the homepage portfolio section.
                  </p>
                </div>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <span>Manage in Projects CMS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Featured productions are dynamically rendered in the homepage carousel.</span>
              <button
                type="button"
                onClick={() => handleTabChange("whyChooseUs")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
              >
                <span>Next: Why Choose Us</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              The homepage projects section highlights 3 production client solutions with real-time architecture:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "ABC24 Asian Bioethics Conference", category: "Global Event Web App", status: "Live", link: "https://abc24.org" },
                { title: "TaxBot Intelligent Tax System", category: "AI Financial Assistant", status: "Live", link: "#" },
                { title: "CCcalculator Real-Time Analyzer", category: "Interactive Cost Calculator", status: "Live", link: "#" }
              ].map((p, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-blue-600">{p.category}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                  <p className="text-[11px] text-slate-500">Featured on public homepage with direct case study link.</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need to add or edit case studies?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Use the Projects CMS to customize tags, screenshots, metrics, and live demo links.
                </p>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs cursor-pointer shrink-0"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Go to Projects Manager</span>
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: WHY CHOOSE US */}
      {activeTab === "whyChooseUs" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Why Choose Us Section Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Manage headings, subheadings, CTA links, and the 3 strategic pillar cards with custom icons.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Pillars</span>
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Synchronized with frontend /about and homepage why choose us cards.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("workflow")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
                >
                  <span>Next: Workflow Capabilities</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Section Heading" required>
                <input
                  type="text"
                  value={whyChooseUs.heading || "Why choose us?"}
                  onChange={(e) => setWhyChooseUs({ ...whyChooseUs, heading: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </FormField>

              <FormField label="Section Subheading">
                <input
                  type="text"
                  value={whyChooseUs.subheading || ""}
                  onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subheading: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Empowering businesses with AI precision..."
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Button Text">
                <input
                  type="text"
                  value={whyChooseUs.buttonText || settings.whyChooseUs?.buttonText || "Learn more"}
                  onChange={(e) => {
                    setWhyChooseUs({ ...whyChooseUs, buttonText: e.target.value });
                    setSettings({
                      ...settings,
                      whyChooseUs: { ...(settings.whyChooseUs || {}), buttonText: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Learn more"
                />
              </FormField>

              <FormField label="Button Destination Link">
                <input
                  type="text"
                  value={whyChooseUs.buttonLink || settings.whyChooseUs?.buttonLink || "/about"}
                  onChange={(e) => {
                    setWhyChooseUs({ ...whyChooseUs, buttonLink: e.target.value });
                    setSettings({
                      ...settings,
                      whyChooseUs: { ...(settings.whyChooseUs || {}), buttonLink: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
                  placeholder="/about"
                />
              </FormField>
            </div>

            {/* 3 Pillars */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs">3 Core Strategic Pillars:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {whyChooseUs.items?.map((item: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600">Pillar 0{i + 1}</span>
                    </div>

                    <FormField label="Pillar Title">
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const updated = [...whyChooseUs.items];
                          updated[i].title = e.target.value;
                          setWhyChooseUs({ ...whyChooseUs, items: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-xl font-semibold"
                      />
                    </FormField>

                    <FormField label="Pillar Icon">
                      <select
                        value={item.icon || "Sparkles"}
                        onChange={(e) => {
                          const updated = [...whyChooseUs.items];
                          updated[i].icon = e.target.value;
                          setWhyChooseUs({ ...whyChooseUs, items: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-xl font-medium text-xs"
                      >
                        <option value="Sparkles">Sparkles (Creative Thinking)</option>
                        <option value="Compass">Compass (Career Planning / Roadmap)</option>
                        <option value="MessageSquare">MessageSquare (Public Speaking / Chatbots)</option>
                      </select>
                    </FormField>

                    <FormField label="Description">
                      <textarea
                        rows={3}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updated = [...whyChooseUs.items];
                          updated[i].description = e.target.value;
                          setWhyChooseUs({ ...whyChooseUs, items: updated });
                        }}
                        className="w-full px-3 py-1.5 border rounded-xl"
                      />
                    </FormField>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: WORKFLOW CAPABILITIES */}
      {activeTab === "workflow" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Workflow Capabilities Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Manage the 3 automated execution cards: Website Assistant, Schedule, and Autonomous Content.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Workflow</span>
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Workflow cards illustrate the client delivery pipeline.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("partners")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
                >
                  <span>Next: Partners Section</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Card 1: Website Assistant</h4>
                  <span className="text-[10px] font-semibold text-blue-600">Step 1</span>
                </div>

                <FormField label="Card 1 Title">
                  <input
                    type="text"
                    value={settings.workflow?.card1Title || "Website Assistant Chatbot"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card1Title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl font-semibold"
                  />
                </FormField>

                <FormField label="Progress Indicator (e.g. 50%)">
                  <input
                    type="text"
                    value={settings.workflow?.card1Progress || "50%"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card1Progress: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>

                <FormField label="Card 1 Subtitle">
                  <input
                    type="text"
                    value={settings.workflow?.card1Subtitle || "WP Content Write"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card1Subtitle: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>

                <FormField label="Card 1 Description">
                  <textarea
                    rows={3}
                    value={settings.workflow?.card1Desc || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card1Desc: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>
              </div>

              {/* Card 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Card 2: Schedule & Setup</h4>
                  <span className="text-[10px] font-semibold text-cyan-700">Step 2</span>
                </div>

                <FormField label="Card 2 Title">
                  <input
                    type="text"
                    value={settings.workflow?.card2Title || "Schedule"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card2Title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl font-semibold"
                  />
                </FormField>

                <FormField label="Card 2 Subtitle">
                  <input
                    type="text"
                    value={settings.workflow?.card2Subtitle || "AI Chatbot Setup"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card2Subtitle: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>

                <FormField label="Card 2 Description">
                  <textarea
                    rows={5}
                    value={settings.workflow?.card2Desc || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card2Desc: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Card 3: Content Generation</h4>
                  <span className="text-[10px] font-semibold text-indigo-600">Step 3</span>
                </div>

                <FormField label="Card 3 Title">
                  <input
                    type="text"
                    value={settings.workflow?.card3Title || "Generate Unique Content"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card3Title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl font-semibold"
                  />
                </FormField>

                <FormField label="Card 3 Description">
                  <textarea
                    rows={8}
                    value={settings.workflow?.card3Desc || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workflow: { ...settings.workflow, card3Desc: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: PARTNERS SECTION */}
      {activeTab === "partners" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Partners Section Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Manage institutional alliances, technology integration logos, and homepage trust badges.
                  </p>
                </div>
              </div>
              <a
                href="/partners"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <span>Manage in Partners CMS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Partner logos automatically scroll in the infinite client showcase.</span>
              <button
                type="button"
                onClick={() => handleTabChange("cta")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs"
              >
                <span>Next: CTA Banner</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              Partner logos and strategic integration badges are pulled dynamically from the{" "}
              <a href="/partners" className="text-blue-600 font-semibold underline">
                Partners Manager
              </a>
              .
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Currently Active Partner Ecosystem (5 Companies):</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {["TechBangla", "CarePoint AI", "Apex Financial", "Asian Bioethics", "EduInteractive"].map((name, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center font-bold text-slate-600 text-xs">
                      {name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900 text-[11px] block truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Add new partners or update logos?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload high-res PNG/SVG logos, specify websites, and manage alliance tiers in the Partners Manager.
                </p>
              </div>
              <a
                href="/partners"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs cursor-pointer shrink-0"
              >
                <Handshake className="w-3.5 h-3.5 text-slate-500" />
                <span>Go to Partners Manager</span>
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 7: CTA SECTION */}
      {activeTab === "cta" && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Conversion CTA Banner Configuration</h3>
                  <p className="text-xs text-slate-500">
                    Manage the global bottom conversion banner headline, description, button label, and target link.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Banner</span>
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Displayed at the bottom of the public homepage directly above the footer.</span>
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Banner</span>
              </button>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <FormField label="CTA Heading" required hint="Bold invitation headline for consultation">
              <input
                type="text"
                value={settings.conversionCta?.heading || settings.ctaBanner?.headline || "Ready to transfer your Business"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    conversionCta: {
                      ...(settings.conversionCta || {}),
                      heading: e.target.value
                    },
                    ctaBanner: {
                      ...(settings.ctaBanner || {}),
                      headline: e.target.value
                    }
                  })
                }
                className="w-full px-3 py-2 border rounded-xl"
              />
            </FormField>

            <FormField label="CTA Description">
              <textarea
                rows={3}
                value={
                  settings.conversionCta?.description ||
                  settings.ctaBanner?.subheadline ||
                  "Developing and maintaining web applications using React.js, Next.js, and other related technologies."
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    conversionCta: {
                      ...(settings.conversionCta || {}),
                      description: e.target.value
                    },
                    ctaBanner: {
                      ...(settings.ctaBanner || {}),
                      subheadline: e.target.value
                    }
                  })
                }
                className="w-full px-3 py-2 border rounded-xl"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Button Label Text">
                <input
                  type="text"
                  value={settings.conversionCta?.buttonText || settings.ctaBanner?.buttonText || "Schedule A Consultation"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      conversionCta: {
                        ...(settings.conversionCta || {}),
                        buttonText: e.target.value
                      },
                      ctaBanner: {
                        ...(settings.ctaBanner || {}),
                        buttonText: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </FormField>

              <FormField label="Target Destination Link (URL)">
                <input
                  type="text"
                  value={settings.conversionCta?.buttonLink || settings.ctaBanner?.buttonLink || "/schedule"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      conversionCta: {
                        ...(settings.conversionCta || {}),
                        buttonLink: e.target.value
                      },
                      ctaBanner: {
                        ...(settings.ctaBanner || {}),
                        buttonLink: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
                />
              </FormField>
            </div>
          </div>
        </Card>
      )}
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
