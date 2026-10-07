"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  Sparkles,
  Layers,
  Save,
  Plus,
  Trash2,
  Edit2,
  HelpCircle,
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Landmark,
  ShoppingCart,
  Smartphone,
  Home,
  Monitor,
  Truck,
  Heart,
  Camera,
  ShoppingBag,
  Zap,
  Infinity,
  Users,
  Scale,
  Globe,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import { adminStore } from "@/lib/store";
import { toast } from "sonner";

const BADGE_ICONS: Record<string, any> = {
  Landmark,
  ShoppingCart,
  Smartphone,
  Home,
  Monitor,
  Truck,
  Heart,
  Camera,
  ShoppingBag,
  Zap,
  Infinity,
  Users,
  Scale,
  Building2,
  Sparkles,
  Cpu,
  ShieldCheck,
  Globe,
};

const PRESET_COLORS = [
  { name: "Cream", hex: "#fdf5eb" },
  { name: "Sky", hex: "#eaf4fd" },
  { name: "Yellow", hex: "#fdfae5" },
  { name: "Peach", hex: "#faede8" },
  { name: "Purple", hex: "#f1eefa" },
  { name: "Lime", hex: "#faf8e4" },
  { name: "Mint", hex: "#eaf7ec" },
  { name: "Warm Orange", hex: "#fdf4e8" },
  { name: "Lavender", hex: "#f2eff9" },
  { name: "Cyan", hex: "#e6f8fa" },
  { name: "Blush", hex: "#f6eff1" },
];

type IndustriesTab = "hero" | "industries" | "badges";

function IndustriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as IndustriesTab) || "hero";

  const [activeTab, setActiveTab] = useState<IndustriesTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  // TAB 1: industriesPage CMS (Hero, ROI, FAQs)
  const [pageCms, setPageCms] = useState<any>({
    hero: {
      badge: "Domain-Specific AI Architecture",
      title: "Engineering AI & Software Across",
      titleHighlight: "High-Impact Industries",
      description: "We don't build one-size-fits-all software. We architect specialized conversational chatbots, intelligent automation pipelines, and enterprise web solutions tailored directly to your industry's regulatory and customer realities.",
    },
    roiSection: {
      heading: "Why Domain Expertise Drives Superior AI ROI",
      subheading: "Generic LLM wrappers fail when confronted with real-world jargon, strict compliance protocols, and nuanced customer inquiries. Here is how Brain Bari designs for measurable outcomes:",
    },
    roiCards: [
      {
        id: "roi-1",
        icon: "Cpu",
        title: "Deep Knowledge Base Fine-Tuning",
        description: "We ingest and structure your proprietary catalogues, documentation, and historic client interactions into private RAG vectors with zero data leakage.",
        badge: "Tailored Embeddings",
      },
      {
        id: "roi-2",
        icon: "ShieldCheck",
        title: "Security & Regulatory Compliance",
        description: "Whether adhering to healthcare privacy or banking confidentiality, our systems incorporate strict permission guards and audit logs.",
        badge: "Enterprise Grade Security",
      },
      {
        id: "roi-3",
        icon: "TrendingUp",
        title: "Quantifiable Business Results",
        description: "Every solution is engineered around core KPIs: cut response times from hours to seconds, automate up to 85% of repeat tasks, and lift conversions.",
        badge: "Measurable Efficiency",
      },
    ],
    faqs: [
      {
        question: "Can our AI chatbot connect directly to our proprietary CRM or ERP?",
        answer: "Yes. We build custom API connectors for Salesforce, HubSpot, SAP, custom SQL databases, Shopify, and local ERP systems to ensure bidirectional real-time data sync.",
      },
      {
        question: "Is our confidential industry data used to train public AI models?",
        answer: "Never. We deploy private virtual private cloud (VPC) embeddings and enterprise agreements that legally guarantee your company data and customer chats are never used for public LLM training.",
      },
      {
        question: "How long does an industry-specific deployment take?",
        answer: "Standard conversational AI chatbots and RAG assistants are typically deployed in 1 to 2 weeks. Custom enterprise software platforms or multi-tenant SaaS MVPs take between 6 to 8 weeks from design to production.",
      },
    ],
  });

  // TAB 2: industries list
  const [industries, setIndustries] = useState<any[]>([]);
  const [editingIndustry, setEditingIndustry] = useState<any | null>(null);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Industry Modal Form Fields
  const [indTitle, setIndTitle] = useState("");
  const [indShortTitle, setIndShortTitle] = useState("");
  const [indBadge, setIndBadge] = useState("");
  const [indTagline, setIndTagline] = useState("");
  const [indDescription, setIndDescription] = useState("");
  const [indIcon, setIndIcon] = useState("Bot");
  const [indChallenges, setIndChallenges] = useState("");
  const [indTechStack, setIndTechStack] = useState("");

  // TAB 3: industryBadges list & CRUD state
  const [industryBadges, setIndustryBadges] = useState<any[]>([]);
  const [editingBadge, setEditingBadge] = useState<any | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [deleteBadgeConfirmId, setDeleteBadgeConfirmId] = useState<string | null>(null);

  // Badge Form fields
  const [badgeName, setBadgeName] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [badgeIcon, setBadgeIcon] = useState("Landmark");
  const [badgeBg, setBadgeBg] = useState("#fdf5eb");
  const [badgeMode, setBadgeMode] = useState<"target" | "query">("target");
  const [badgeTargetId, setBadgeTargetId] = useState("fintech");
  const [badgeSearchQuery, setBadgeSearchQuery] = useState("");

  const loadData = async () => {
    try {
      const [freshPage, freshInds, freshBadges] = await Promise.all([
        adminApi.getContent("industriesPage"),
        adminApi.getContent("industries"),
        adminApi.getContent("industryBadges"),
      ]);

      if (freshPage && freshPage.hero) setPageCms(freshPage);
      if (freshInds && Array.isArray(freshInds)) setIndustries(freshInds);
      if (freshBadges && Array.isArray(freshBadges)) setIndustryBadges(freshBadges);
    } catch (e) {
      console.error("Failed to load industries CMS data:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSavePageCms = async () => {
    try {
      await adminApi.saveContent("industriesPage", pageCms);
      setSaved(true);
      toast.success("Industries page Hero, ROI & FAQs saved to NeonDB!", {
        description: "Frontend /industries page updated immediately.",
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      toast.error("Failed to save: " + (err.message || "Unknown error"));
    }
  };

  const handleSaveIndustriesList = async (updated: any[]) => {
    setIndustries(updated);
    try {
      await adminApi.saveContent("industries", updated);
      toast.success("Industries directory updated in NeonDB!", {
        description: "Frontend /industries showcases synchronized.",
      });
    } catch {
      toast.error("Failed to save industries list to database.");
    }
  };

  const handleSaveBadges = async (updated: any[]) => {
    setIndustryBadges(updated);
    try {
      await adminApi.saveContent("industryBadges", updated);
      toast.success("Industry badges updated in NeonDB!");
    } catch {
      toast.error("Failed to save badges.");
    }
  };

  const openAddBadge = () => {
    setEditingBadge(null);
    setBadgeName("");
    setBadgeId("");
    setBadgeIcon("Sparkles");
    setBadgeBg("#fdf5eb");
    setBadgeMode("target");
    setBadgeTargetId("");
    setBadgeSearchQuery("");
    setIsBadgeModalOpen(true);
  };

  const openEditBadge = (badge: any) => {
    setEditingBadge(badge);
    setBadgeName(badge.name || "");
    setBadgeId(badge.id || "");
    setBadgeIcon(badge.icon || "Sparkles");
    setBadgeBg(badge.bg || "#fdf5eb");
    if (badge.targetId) {
      setBadgeMode("target");
      setBadgeTargetId(badge.targetId);
      setBadgeSearchQuery("");
    } else {
      setBadgeMode("query");
      setBadgeSearchQuery(badge.searchQuery || "");
      setBadgeTargetId("");
    }
    setIsBadgeModalOpen(true);
  };

  const handleSaveBadgeForm = () => {
    if (!badgeName.trim()) {
      toast.error("Badge name is required");
      return;
    }
    const finalId = badgeId.trim() || badgeName.toLowerCase().replace(/[^a-z0-9]/g, "");

    const newBadge: any = {
      id: finalId,
      name: badgeName.trim(),
      icon: badgeIcon,
      bg: badgeBg,
    };

    if (badgeMode === "target") {
      newBadge.targetId = badgeTargetId.trim() || finalId;
    } else {
      newBadge.searchQuery = badgeSearchQuery.trim() || finalId;
    }

    let updated: any[];
    if (editingBadge) {
      updated = industryBadges.map((b) => (b.id === editingBadge.id ? newBadge : b));
    } else {
      updated = [...industryBadges, newBadge];
    }

    handleSaveBadges(updated);
    setIsBadgeModalOpen(false);
  };

  const handleDeleteBadge = () => {
    if (!deleteBadgeConfirmId) return;
    const updated = industryBadges.filter((b) => b.id !== deleteBadgeConfirmId);
    handleSaveBadges(updated);
    setDeleteBadgeConfirmId(null);
  };

  const openAddIndustry = () => {
    setEditingIndustry(null);
    setIndTitle("");
    setIndShortTitle("");
    setIndBadge("AI Architecture");
    setIndTagline("");
    setIndDescription("");
    setIndIcon("Cpu");
    setIndChallenges("");
    setIndTechStack("Next.js, Python, FastAPI, PostgreSQL");
    setIsIndustryModalOpen(true);
  };

  const openEditIndustry = (ind: any) => {
    setEditingIndustry(ind);
    setIndTitle(ind.title || "");
    setIndShortTitle(ind.shortTitle || "");
    setIndBadge(ind.badge || "AI Architecture");
    setIndTagline(ind.tagline || "");
    setIndDescription(ind.description || "");
    setIndIcon(ind.icon || "Cpu");
    setIndChallenges(Array.isArray(ind.challenges) ? ind.challenges.join("\n") : "");
    setIndTechStack(Array.isArray(ind.techStack) ? ind.techStack.join(", ") : "");
    setIsIndustryModalOpen(true);
  };

  const handleSaveIndustryForm = () => {
    if (!indTitle.trim()) {
      toast.error("Industry title is required");
      return;
    }

    const challengesArr = indChallenges.split("\n").map((c) => c.trim()).filter(Boolean);
    const techStackArr = indTechStack.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingIndustry) {
      const updated = industries.map((item) => {
        if (item.id === editingIndustry.id) {
          return {
            ...item,
            title: indTitle,
            shortTitle: indShortTitle || indTitle,
            badge: indBadge,
            tagline: indTagline,
            description: indDescription,
            icon: indIcon,
            challenges: challengesArr,
            techStack: techStackArr,
          };
        }
        return item;
      });
      handleSaveIndustriesList(updated);
    } else {
      const newId = indTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const newInd = {
        id: newId,
        title: indTitle,
        shortTitle: indShortTitle || indTitle,
        badge: indBadge,
        tagline: indTagline,
        description: indDescription,
        icon: indIcon,
        colorGradient: "from-blue-600 via-indigo-600 to-blue-700",
        bgLight: "bg-blue-50/70 border-blue-100",
        challenges: challengesArr,
        solutions: [
          { title: "Specialized AI Workflow", desc: "Engineered specifically to solve core friction points for this sector." },
        ],
        keyMetrics: [
          { value: "85%", label: "Faster Operations" },
          { value: "24/7", label: "Availability" },
          { value: "99.8%", label: "Accuracy" },
        ],
        techStack: techStackArr,
      };
      handleSaveIndustriesList([newInd, ...industries]);
    }

    setIsIndustryModalOpen(false);
  };

  const handleDeleteIndustry = () => {
    if (!deleteConfirmId) return;
    const updated = industries.filter((ind) => ind.id !== deleteConfirmId);
    handleSaveIndustriesList(updated);
    setDeleteConfirmId(null);
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
        badge="Website CMS / Industries"
        title="Industries &amp; Badges Manager"
        description="Manage the 8 specialized industry sectors, ROI value pillars, petal filter badges, and FAQs on /industries."
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "industries" && (
              <button
                type="button"
                onClick={openAddIndustry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Industry</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSavePageCms}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save Page CMS"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "hero", label: "Hero, ROI & FAQs", icon: Sparkles },
            { id: "industries", label: "8 Specialized Industries", icon: Building2, count: industries.length },
            { id: "badges", label: "14 Filter Badges", icon: Layers, count: industryBadges.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as IndustriesTab);
                  router.push(tab.id === "hero" ? "/website/industries" : `/website/industries?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: HERO, ROI & FAQS */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Hero Headline &amp; Introduction</h3>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <FormField label="Hero Badge">
                <input
                  type="text"
                  value={pageCms.hero?.badge || ""}
                  onChange={(e) =>
                    setPageCms({
                      ...pageCms,
                      hero: { ...pageCms.hero, badge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Domain-Specific AI Architecture"
                />
              </FormField>

              <FormField label="Hero Headline First Line">
                <input
                  type="text"
                  value={pageCms.hero?.title || ""}
                  onChange={(e) =>
                    setPageCms({
                      ...pageCms,
                      hero: { ...pageCms.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  placeholder="Engineering AI & Software Across"
                />
              </FormField>

              <FormField label="Hero Headline Highlight (Gradient Text)">
                <input
                  type="text"
                  value={pageCms.hero?.titleHighlight || ""}
                  onChange={(e) =>
                    setPageCms({
                      ...pageCms,
                      hero: { ...pageCms.hero, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  placeholder="High-Impact Industries"
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Hero Description Paragraph">
                  <textarea
                    rows={3}
                    value={pageCms.hero?.description || ""}
                    onChange={(e) =>
                      setPageCms({
                        ...pageCms,
                        hero: { ...pageCms.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                    placeholder="We don't build one-size-fits-all software..."
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* 3 ROI Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3 Domain ROI Value Cards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(pageCms.roiCards || []).map((card: any, idx: number) => (
                <Card
                  key={card.id || idx}
                  header={
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">ROI Pillar {idx + 1}</span>
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {card.badge}
                      </span>
                    </div>
                  }
                >
                  <div className="space-y-3 text-xs">
                    <FormField label="Title">
                      <input
                        type="text"
                        value={card.title || ""}
                        onChange={(e) => {
                          const copy = [...pageCms.roiCards];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setPageCms({ ...pageCms, roiCards: copy });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                      />
                    </FormField>

                    <FormField label="Description">
                      <textarea
                        rows={3}
                        value={card.description || ""}
                        onChange={(e) => {
                          const copy = [...pageCms.roiCards];
                          copy[idx] = { ...copy[idx], description: e.target.value };
                          setPageCms({ ...pageCms, roiCards: copy });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                      />
                    </FormField>

                    <FormField label="Badge Pill">
                      <input
                        type="text"
                        value={card.badge || ""}
                        onChange={(e) => {
                          const copy = [...pageCms.roiCards];
                          copy[idx] = { ...copy[idx], badge: e.target.value };
                          setPageCms({ ...pageCms, roiCards: copy });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </FormField>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 3 FAQs */}
          <Card header={<h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>}>
            <div className="space-y-4 text-xs">
              {(pageCms.faqs || []).map((faq: any, fIdx: number) => (
                <div key={fIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                  <FormField label={`FAQ Question ${fIdx + 1}`}>
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={(e) => {
                        const copy = [...pageCms.faqs];
                        copy[fIdx] = { ...copy[fIdx], question: e.target.value };
                        setPageCms({ ...pageCms, faqs: copy });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold"
                    />
                  </FormField>
                  <FormField label="FAQ Answer">
                    <textarea
                      rows={2}
                      value={faq.answer || ""}
                      onChange={(e) => {
                        const copy = [...pageCms.faqs];
                        copy[fIdx] = { ...copy[fIdx], answer: e.target.value };
                        setPageCms({ ...pageCms, faqs: copy });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg resize-none"
                    />
                  </FormField>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePageCms}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs cursor-pointer transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Page CMS to NeonDB</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ALL 8 INDUSTRIES */}
      {activeTab === "industries" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        {ind.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{ind.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{ind.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditIndustry(ind)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(ind.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ind.description}
                  </p>

                  {/* Tech stack */}
                  {Array.isArray(ind.techStack) && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {ind.techStack.map((tech: string, tIdx: number) => (
                        <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>ID: <code className="text-slate-700">{ind.id}</code></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FILTER BADGES WITH FULL CRUD */}
      {activeTab === "badges" && (
        <Card
          header={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Industry Filter Badges ({industryBadges.length} Petal Badges)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Hero Interactive
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  These badges appear in the organic leaf/petal layout in the hero section of <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">/industries</code> and enable 1-click filtering.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddBadge}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Filter Badge</span>
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {industryBadges.map((badge, bIdx) => {
                const IconComponent = BADGE_ICONS[badge.icon] || Sparkles;
                return (
                  <div
                    key={badge.id || bIdx}
                    style={{ backgroundColor: badge.bg || "#f8fafc" }}
                    className="group relative p-3.5 rounded-2xl border border-slate-200/90 hover:border-slate-400/80 flex flex-col items-center justify-between text-center space-y-2 shadow-2xs transition-all duration-200 hover:shadow-md"
                  >
                    {/* Hover Action Controls (Edit & Delete) */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs rounded-lg p-0.5 shadow-2xs border border-slate-200">
                      <button
                        type="button"
                        onClick={() => openEditBadge(badge)}
                        title="Edit Badge"
                        className="p-1 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteBadgeConfirmId(badge.id)}
                        title="Delete Badge"
                        className="p-1 hover:bg-rose-50 rounded-md text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Icon & Title */}
                    <div className="w-8 h-8 rounded-xl bg-white/80 shadow-2xs border border-black/5 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4 text-slate-800" />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-900 leading-tight block line-clamp-2">
                        {badge.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {badge.targetId ? `#${badge.targetId}` : `?q=${badge.searchQuery}`}
                      </span>
                    </div>

                    {/* Quick Edit Trigger Pill */}
                    <button
                      type="button"
                      onClick={() => openEditBadge(badge)}
                      className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-slate-200/60 transition-colors cursor-pointer w-full"
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* EDIT INDUSTRY MODAL */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingIndustry ? `Edit Industry: ${editingIndustry.title}` : "Add Specialized Industry"}
              </h3>
              <button
                type="button"
                onClick={() => setIsIndustryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <FormField label="Industry Full Title" required>
                <input
                  type="text"
                  value={indTitle}
                  onChange={(e) => setIndTitle(e.target.value)}
                  placeholder="Healthcare & Life Sciences"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Short Title (Button CTA)">
                  <input
                    type="text"
                    value={indShortTitle}
                    onChange={(e) => setIndShortTitle(e.target.value)}
                    placeholder="Healthcare"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>

                <FormField label="Badge Pill">
                  <input
                    type="text"
                    value={indBadge}
                    onChange={(e) => setIndBadge(e.target.value)}
                    placeholder="HealthTech & Clinical AI"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>
              </div>

              <FormField label="Tagline">
                <input
                  type="text"
                  value={indTagline}
                  onChange={(e) => setIndTagline(e.target.value)}
                  placeholder="Intelligent clinical guidance, patient triage, and multilingual assistants."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Full Description">
                <textarea
                  rows={3}
                  value={indDescription}
                  onChange={(e) => setIndDescription(e.target.value)}
                  placeholder="Comprehensive description of the industry solution..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                />
              </FormField>

              <FormField label="Core Industry Friction (one challenge per line)">
                <textarea
                  rows={3}
                  value={indChallenges}
                  onChange={(e) => setIndChallenges(e.target.value)}
                  placeholder="Friction point 1&#10;Friction point 2&#10;Friction point 3"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                />
              </FormField>

              <FormField label="Architecture & Frameworks (comma-separated)">
                <input
                  type="text"
                  value={indTechStack}
                  onChange={(e) => setIndTechStack(e.target.value)}
                  placeholder="Next.js, Python, FastAPI, HIPAA Cloud"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsIndustryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveIndustryForm}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs rounded-xl shadow-xs"
              >
                Save Industry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteIndustry}
        title="Delete Industry"
        message="Are you sure you want to remove this industry from the showcase?"
        confirmLabel="Delete Industry"
        isDestructive={true}
      />

      {/* ADD / EDIT BADGE MODAL */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingBadge ? "Edit Filter Badge" : "Add Filter Badge"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure petal badge icon, color, and filter behavior on /industries
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Live Petal Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Live Petal Preview</span>
              <div
                style={{
                  backgroundColor: badgeBg,
                  borderRadius: "28px 10px 28px 10px",
                }}
                className="px-6 py-4 border border-black/5 shadow-2xs flex flex-col items-center gap-2 min-w-[170px]"
              >
                {(() => {
                  const PreviewIcon = BADGE_ICONS[badgeIcon] || Sparkles;
                  return (
                    <div className="w-9 h-9 rounded-xl bg-white/85 shadow-2xs border border-black/5 flex items-center justify-center">
                      <PreviewIcon className="w-4 h-4 text-slate-800" />
                    </div>
                  );
                })()}
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {badgeName || "Badge Name"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {badgeMode === "target"
                      ? `#${badgeTargetId || "fintech"}`
                      : `?q=${badgeSearchQuery || "query"}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <FormField label="Badge Display Name" required>
                <input
                  type="text"
                  value={badgeName}
                  onChange={(e) => {
                    setBadgeName(e.target.value);
                    if (!editingBadge && !badgeId) {
                      setBadgeId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                    }
                  }}
                  placeholder="e.g. Finance & Banking"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </FormField>

              <FormField label="Unique ID (Slug)">
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. finance, ecommerce, health"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </FormField>

              {/* Select Icon */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Badge Icon ({badgeIcon})
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                  {Object.keys(BADGE_ICONS).map((iconKey) => {
                    const IconComp = BADGE_ICONS[iconKey];
                    const isSelected = badgeIcon === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setBadgeIcon(iconKey)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs scale-105"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                        title={iconKey}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[9px] truncate w-full text-center mt-1">
                          {iconKey}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Color & Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Background Color
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      type="button"
                      key={preset.hex}
                      onClick={() => setBadgeBg(preset.hex)}
                      style={{ backgroundColor: preset.hex }}
                      className={`h-6 px-2.5 rounded-full border text-[10px] font-semibold text-slate-700 cursor-pointer transition-transform ${
                        badgeBg === preset.hex
                          ? "ring-2 ring-blue-600 scale-105 border-slate-400"
                          : "border-slate-300 hover:scale-105"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={badgeBg}
                    onChange={(e) => setBadgeBg(e.target.value)}
                    className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={badgeBg}
                    onChange={(e) => setBadgeBg(e.target.value)}
                    placeholder="#fdf5eb"
                    className="w-32 px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              {/* Filter Action Mode */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  Filter Click Behavior
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBadgeMode("target")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left cursor-pointer transition-all ${
                      badgeMode === "target"
                        ? "bg-blue-50 border-blue-400 text-blue-700 ring-1 ring-blue-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">Anchor Scroll (#id)</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Scrolls to matching industry section
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBadgeMode("query")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left cursor-pointer transition-all ${
                      badgeMode === "query"
                        ? "bg-blue-50 border-blue-400 text-blue-700 ring-1 ring-blue-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">Search Filter (?q=...)</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Filters cards via keyword query
                    </div>
                  </button>
                </div>

                {badgeMode === "target" ? (
                  <FormField label="Target Anchor ID (without #)">
                    <input
                      type="text"
                      value={badgeTargetId}
                      onChange={(e) => setBadgeTargetId(e.target.value)}
                      placeholder="e.g. fintech, ecommerce, real-estate"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-700"
                    />
                  </FormField>
                ) : (
                  <FormField label="Search Query Keyword">
                    <input
                      type="text"
                      value={badgeSearchQuery}
                      onChange={(e) => setBadgeSearchQuery(e.target.value)}
                      placeholder="e.g. telecom, video, saas"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-700"
                    />
                  </FormField>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBadgeForm}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs cursor-pointer"
              >
                Save Badge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE BADGE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteBadgeConfirmId}
        onClose={() => setDeleteBadgeConfirmId(null)}
        onConfirm={handleDeleteBadge}
        title="Delete Filter Badge"
        message="Are you sure you want to remove this petal filter badge from the /industries showcase?"
        confirmLabel="Delete Badge"
        isDestructive={true}
      />
    </div>
  );
}

export default function IndustriesManagerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Industries CMS...</div>}>
      <IndustriesContent />
    </Suspense>
  );
}
