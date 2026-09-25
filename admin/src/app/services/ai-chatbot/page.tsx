"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Eye, 
  Save, 
  CheckCircle2, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ImageIcon, 
  LayoutTemplate, 
  FileText, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialPackages from "@/data/servicePackages.json";
import initialServices from "@/data/services.json";
import { toast } from "sonner";

export default function AiChatbotCmsPage() {
  const [activeTab, setActiveTab] = useState<"details" | "catalog">("details");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // 1. Service Detail Page State (/services/ai-chatbot)
  const [detailData, setDetailData] = useState<any>(initialPackages["ai-chatbot"] || {
    image: "/images/service_ai_chatbot.jpg",
    heroTitlePrefix: "Intelligent Conversational ",
    heroTitleGradient: "AI Chatbots",
    heroTitleSuffix: " for Enterprise",
    paragraphs: [
      "We design, build, and deploy domain-trained AI chatbots capable of human-like comprehension, multi-turn reasoning, and instant query resolution across 50+ languages.",
      "Whether integrated into your customer-facing web portal, WhatsApp Business, or internal Slack channels, our bots connect directly to your knowledge base."
    ],
    packages: [
      {
        id: "pkg-1",
        title: "Smart Website Chatbot",
        meta: "AI Customer Support & Lead Capture",
        price: "Start $259",
        description: "Interactive, branded website bot trained on your documentation, FAQs, and product catalogs with automated lead qualification.",
        features: [
          "Instant 24/7 Support",
          "RAG Pipeline Training",
          "Human Agent Handoff",
          "Custom UI Theming"
        ],
        image: "/images/service_ai_chatbot.jpg",
        link: "/order?service=Website%20Chatbot",
        isConsulting: false
      },
      {
        id: "pkg-2",
        title: "WhatsApp Auto-Order Bot",
        meta: "Conversational Commerce & WhatsApp Cloud API",
        price: "Start $350",
        description: "Automated order booking and customer retention bot directly on WhatsApp Business with real-time payment link dispatch.",
        features: [
          "WhatsApp Cloud API Integration",
          "Catalog Browsing",
          "Order Confirmation & Invoicing",
          "Multi-Admin Dashboard"
        ],
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        link: "/order?service=WhatsApp%20Bot",
        isConsulting: false
      }
    ]
  });

  // Secondary/Cover image state
  const [coverImage, setCoverImage] = useState<string>(
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80"
  );

  // Key Highlights repeater state
  const [highlights, setHighlights] = useState<string[]>([
    "Custom RAG pipeline trained on your business documents and knowledge base",
    "Multi-channel deployment: Web widget, WhatsApp Cloud API, Telegram & Slack",
    "Automated lead capture with instant CRM and webhook dispatch",
    "Zero hallucination guardrails with seamless human agent handoff"
  ]);

  // Tagline / Subtitle
  const [subtitle, setSubtitle] = useState<string>(
    "Omnichannel conversational AI that resolves 80%+ customer inquiries instantly."
  );

  // CTA Section
  const [ctaHeadline, setCtaHeadline] = useState("Empower Your Customer Support with Conversational AI");
  const [ctaDesc, setCtaDesc] = useState("Book a 30-minute discovery call to see how custom AI chatbots can automate support workflows and drive revenue.");
  const [ctaButtonText, setCtaButtonText] = useState("Schedule Consultation");

  // 2. Catalog Card State (/services card representation)
  const [catalogCard, setCatalogCard] = useState<any>(() => {
    const found = (initialServices || []).find((s: any) => s.slug === "ai-chatbot");
    return found || {
      id: "srv-chatbot",
      slug: "ai-chatbot",
      title: "AI Chatbots & Agents",
      shortDesc: "Domain-trained conversational AI chatbots with RAG pipelines for 24/7 client automation.",
      startingPrice: 250,
      deliveryDays: 7,
      badge: "Most Popular",
      features: [
        "RAG Document Training",
        "Omnichannel Deployment",
        "CRM & Webhook Sync",
        "Human Handoff Protocol"
      ]
    };
  });

  // Load from store on mount
  useEffect(() => {
    try {
      const storedPackages = adminStore.getServicePackages();
      if (storedPackages && storedPackages["ai-chatbot"]) {
        setDetailData(storedPackages["ai-chatbot"]);
      }
      const storedServices = adminStore.getServices();
      const match = (storedServices || []).find((s: any) => s.slug === "ai-chatbot");
      if (match) {
        setCatalogCard(match);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save changes handler
  const handleSave = () => {
    try {
      const currentPackages = adminStore.getServicePackages() || initialPackages;
      const updatedPackages = {
        ...currentPackages,
        "ai-chatbot": detailData
      };
      adminStore.setServicePackages(updatedPackages);

      const currentServices = adminStore.getServices() || initialServices;
      const updatedServices = currentServices.map((s: any) => {
        if (s.slug === "ai-chatbot") {
          return {
            ...s,
            ...catalogCard,
            features: catalogCard.features || s.features
          };
        }
        return s;
      });
      adminStore.setServices(updatedServices);

      setSaved(true);
      toast.success("AI Chatbots CMS updated successfully!", {
        description: "Changes are live on both /services/ai-chatbot and /services catalog."
      });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error("Failed to save changes.");
      console.error(err);
    }
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlights([...highlights, "New guarantee or enterprise capability"]);
  };

  const handleUpdateHighlight = (idx: number, val: string) => {
    const updated = [...highlights];
    updated[idx] = val;
    setHighlights(updated);
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  // Package field updater
  const handleUpdatePackage = (pkgIdx: number, field: string, value: any) => {
    const pkgs = [...(detailData.packages || [])];
    pkgs[pkgIdx] = { ...pkgs[pkgIdx], [field]: value };
    setDetailData({ ...detailData, packages: pkgs });
  };

  const handleAddFeatureToPackage = (pkgIdx: number) => {
    const pkgs = [...(detailData.packages || [])];
    const feats = [...(pkgs[pkgIdx].features || []), "New feature item"];
    pkgs[pkgIdx] = { ...pkgs[pkgIdx], features: feats };
    setDetailData({ ...detailData, packages: pkgs });
  };

  const handleUpdatePackageFeature = (pkgIdx: number, featIdx: number, val: string) => {
    const pkgs = [...(detailData.packages || [])];
    const feats = [...(pkgs[pkgIdx].features || [])];
    feats[featIdx] = val;
    pkgs[pkgIdx] = { ...pkgs[pkgIdx], features: feats };
    setDetailData({ ...detailData, packages: pkgs });
  };

  const handleRemovePackageFeature = (pkgIdx: number, featIdx: number) => {
    const pkgs = [...(detailData.packages || [])];
    const feats = (pkgs[pkgIdx].features || []).filter((_: any, i: number) => i !== featIdx);
    pkgs[pkgIdx] = { ...pkgs[pkgIdx], features: feats };
    setDetailData({ ...detailData, packages: pkgs });
  };

  const handleAddPackageTier = () => {
    const newPkg = {
      id: `pkg-${Date.now()}`,
      title: "New AI Bot Tier",
      meta: "Advanced AI Capability",
      price: "Start $399",
      description: "Custom conversational AI framework with domain knowledge indexing, webhook triggers, and human handoff.",
      features: [
        "24/7 Intelligent Support",
        "RAG Knowledge Base Sync",
        "CRM & Webhook Handlers",
        "Custom UI Widget"
      ],
      image: "/images/service_ai_chatbot.jpg",
      link: "/order?service=Custom%20Bot",
      isConsulting: false
    };
    setDetailData({
      ...detailData,
      packages: [...(detailData.packages || []), newPkg]
    });
    toast.success("New package tier added!");
  };

  const handleRemovePackageTier = (pkgIdx: number) => {
    const pkgs = (detailData.packages || []).filter((_: any, i: number) => i !== pkgIdx);
    setDetailData({ ...detailData, packages: pkgs });
    toast.info("Package tier removed.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-28 pt-2">
      {/* Top Header & Action Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-[#1e1b4b]" />
            <span>AI Chatbots Service CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the conversational bot offerings, hero assets, details page content, and frontend catalog card.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Preview Page</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1e1b4b] hover:bg-[#2e2a72] text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tabs Pill Navigation */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "details"
              ? "bg-purple-50 text-purple-950 border-2 border-purple-600/80 shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeTab === "details" ? "text-purple-700" : "text-slate-400"}`} />
          <span>Section 1: Details Page (/services/ai-chatbot)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "bg-purple-50 text-purple-950 border-2 border-purple-600/80 shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <LayoutTemplate className={`w-3.5 h-3.5 ${activeTab === "catalog" ? "text-purple-700" : "text-slate-400"}`} />
          <span>Section 2: Directory Catalog Card (/services)</span>
        </button>
      </div>

      {/* TAB 1: DETAILS PAGE CMS */}
      {activeTab === "details" && (
        <div className="space-y-6">
          
          {/* Card 1: Service Headers & Excerpt */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Service Headers &amp; Excerpt</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Main title, tagline, and intro excerpt shown at the top of the details page and summary card.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Headline Structure (Prefix + Gradient Accent + Suffix)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">Title Prefix</span>
                    <input
                      type="text"
                      value={detailData.heroTitlePrefix}
                      onChange={(e) => setDetailData({ ...detailData, heroTitlePrefix: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                      placeholder="e.g. Intelligent Conversational"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-purple-600 block mb-1">Gradient Accent (Highlighted)</span>
                    <input
                      type="text"
                      value={detailData.heroTitleGradient}
                      onChange={(e) => setDetailData({ ...detailData, heroTitleGradient: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold text-purple-900 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none bg-purple-50/30"
                      placeholder="e.g. AI Chatbots"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">Title Suffix</span>
                    <input
                      type="text"
                      value={detailData.heroTitleSuffix}
                      onChange={(e) => setDetailData({ ...detailData, heroTitleSuffix: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                      placeholder="e.g. for Enterprise"
                    />
                  </div>
                </div>

                {/* Live rendered title preview badge */}
                <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Live Preview:</span>
                  <span className="font-extrabold text-slate-900">
                    {detailData.heroTitlePrefix}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                      {detailData.heroTitleGradient}
                    </span>
                    {detailData.heroTitleSuffix}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                  placeholder="Your Trusted Solution for Conversational AI..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Homepage Preview Excerpt (Short description on catalog &amp; meta preview)
                </label>
                <textarea
                  rows={2}
                  value={catalogCard.shortDesc}
                  onChange={(e) => setCatalogCard({ ...catalogCard, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40 resize-y"
                  placeholder="Short description under title on homepage..."
                />
              </div>
            </div>
          </div>

          {/* Cards 2 & 3: 2-Column Responsive Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left Image: Hero Cover Banner Image */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <LayoutTemplate className="w-4 h-4 text-purple-700" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Hero Cover Banner Image</h3>
                    <p className="text-[11px] text-slate-500">Background banner for detail page header</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setCoverImage(url);
                          toast.success("Cover image staged.");
                        }
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none truncate"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 16:9 Thumbnail preview */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/service_ai_chatbot.jpg"; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span>No cover image selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Image: Main Story Featured Image */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ImageIcon className="w-4 h-4 text-purple-700" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Main Story Featured Image</h3>
                    <p className="text-[11px] text-slate-500">Large photo displayed at the top of the service body</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setDetailData({ ...detailData, image: url });
                          toast.success("Featured image staged.");
                        }
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={detailData.image}
                    onChange={(e) => setDetailData({ ...detailData, image: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none truncate"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => setDetailData({ ...detailData, image: "" })}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 16:9 Thumbnail preview */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                {detailData.image ? (
                  <img
                    src={detailData.image}
                    alt="Featured Story"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/service_ai_chatbot.jpg"; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span>No featured image selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Full Article & Story Content */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Full Article &amp; Story Content</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete multiline text displayed on the dedicated details page (/services/ai-chatbot).
                </p>
              </div>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-3">
              {(detailData.paragraphs || []).map((para: string, pIdx: number) => (
                <div key={pIdx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Paragraph {pIdx + 1}</span>
                    {detailData.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = detailData.paragraphs.filter((_: any, i: number) => i !== pIdx);
                          setDetailData({ ...detailData, paragraphs: updated });
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...detailData.paragraphs];
                      updated[pIdx] = e.target.value;
                      setDetailData({ ...detailData, paragraphs: updated });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs leading-relaxed rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40 resize-y"
                    placeholder="Write detailed paragraph content..."
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setDetailData({
                    ...detailData,
                    paragraphs: [...(detailData.paragraphs || []), "New informative paragraph about this AI chatbot capability."]
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Paragraph</span>
              </button>
            </div>
          </div>

          {/* Card 5: Service Packages & Offerings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Package Offerings &amp; Deliverables</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configured pricing tiers, meta tags, and feature lists rendered in the packages grid.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPackageTier}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-700" />
                <span>Add Package Tier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(detailData.packages || []).map((pkg: any, pkgIdx: number) => (
                <div
                  key={pkg.id || pkgIdx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                      Tier #{pkgIdx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => handleUpdatePackage(pkgIdx, "price", e.target.value)}
                        className="w-24 text-xs font-black text-right px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        placeholder="e.g. Start $259"
                      />
                      {(detailData.packages || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePackageTier(pkgIdx)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Delete package tier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Package Title</label>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => handleUpdatePackage(pkgIdx, "title", e.target.value)}
                      className="w-full text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Meta Tagline</label>
                    <input
                      type="text"
                      value={pkg.meta}
                      onChange={(e) => handleUpdatePackage(pkgIdx, "meta", e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Summary Description</label>
                    <textarea
                      rows={2}
                      value={pkg.description}
                      onChange={(e) => handleUpdatePackage(pkgIdx, "description", e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Feature repeater */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Features Checklist</label>
                      <button
                        type="button"
                        onClick={() => handleAddFeatureToPackage(pkgIdx)}
                        className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {(pkg.features || []).map((feat: string, featIdx: number) => (
                      <div key={featIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdatePackageFeature(pkgIdx, featIdx, e.target.value)}
                          className="flex-1 text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePackageFeature(pkgIdx, featIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Key Highlights & Guarantees Repeater */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Key Highlights &amp; Guarantees</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bullet points shown in the highlight card on the details page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddHighlight}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {highlights.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                    className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                    placeholder="Enter highlight feature or guarantee..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Delete highlight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 7: Consultation CTA Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Bottom CTA Banner</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion banner displayed at the bottom of the details page.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={ctaHeadline}
                  onChange={(e) => setCtaHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={ctaDesc}
                  onChange={(e) => setCtaDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Button Label</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CATALOG CARD CMS */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Catalog Card Settings (/services)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage how this AI Chatbots service card appears on the main services directory page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
                <input
                  type="text"
                  value={catalogCard.title}
                  onChange={(e) => setCatalogCard({ ...catalogCard, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ribbon Badge</label>
                <input
                  type="text"
                  value={catalogCard.badge}
                  onChange={(e) => setCatalogCard({ ...catalogCard, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Starting Price ($)</label>
                <input
                  type="number"
                  value={catalogCard.startingPrice}
                  onChange={(e) => setCatalogCard({ ...catalogCard, startingPrice: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Delivery Days</label>
                <input
                  type="number"
                  value={catalogCard.deliveryDays}
                  onChange={(e) => setCatalogCard({ ...catalogCard, deliveryDays: Number(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={catalogCard.shortDesc}
                  onChange={(e) => setCatalogCard({ ...catalogCard, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
              </div>
            </div>

            {/* Catalog features list */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Card Features List</label>
                <button
                  type="button"
                  onClick={() => {
                    const feats = [...(catalogCard.features || []), "New feature item"];
                    setCatalogCard({ ...catalogCard, features: feats });
                  }}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              {(catalogCard.features || []).map((feat: string, fIdx: number) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const feats = [...catalogCard.features];
                      feats[fIdx] = e.target.value;
                      setCatalogCard({ ...catalogCard, features: feats });
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const feats = catalogCard.features.filter((_: any, i: number) => i !== fIdx);
                      setCatalogCard({ ...catalogCard, features: feats });
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-xs text-slate-500">
          Syncs automatically with frontend JSON data structures.
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1e1b4b] hover:bg-[#2e2a72] text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved Live!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Frontend Preview: /services/ai-chatbot
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body replica */}
            <div className="p-6 sm:p-8 space-y-10 bg-[#fcfbfe]">
              {/* Hero Banner Replica */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={detailData.image}
                    alt="Hero"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/service_ai_chatbot.jpg"; }}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight font-sans">
                    {detailData.heroTitlePrefix}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                      {detailData.heroTitleGradient}
                    </span>{" "}
                    {detailData.heroTitleSuffix}
                  </h1>
                  {(detailData.paragraphs || []).map((p: string, i: number) => (
                    <p key={i} className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#602b0c] text-white">
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Offerings Grid Replica */}
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Custom Deployment Packages</h3>
                  <p className="text-xs text-gray-500">Choose the ideal framework for your enterprise.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(detailData.packages || []).map((pkg: any, idx: number) => (
                    <div
                      key={pkg.id || idx}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                            {pkg.meta}
                          </span>
                          <span className="text-sm font-black text-gray-950">{pkg.price}</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">{pkg.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{pkg.description}</p>
                        <div className="space-y-1.5 pt-2">
                          {(pkg.features || []).map((f: string, fIdx: number) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-700">
                              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-purple-900 transition-colors"
                      >
                        Order This Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
