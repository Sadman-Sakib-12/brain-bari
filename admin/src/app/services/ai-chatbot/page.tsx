"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Eye, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  RotateCcw,
  LayoutTemplate
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";
import ChatbotDetailTab from "./components/ChatbotDetailTab";
import ChatbotCatalogTab from "./components/ChatbotCatalogTab";
import ChatbotPreviewModal from "./components/ChatbotPreviewModal";

export default function AiChatbotCmsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "catalog">("details");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // 1. Service Detail Page State (/services/ai-chatbot)
  const [detailData, setDetailData] = useState<any>({
    image: "",
    heroTitlePrefix: "",
    heroTitleGradient: "",
    heroTitleSuffix: "",
    paragraphs: [],
    packages: []
  });

  const [coverImage, setCoverImage] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");
  const [ctaHeadline, setCtaHeadline] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");

  const [catalogCard, setCatalogCard] = useState<any>({
    id: "",
    slug: "ai-chatbot",
    title: "",
    shortDesc: "",
    startingPrice: 0,
    deliveryDays: 0,
    badge: "",
    features: []
  });

  const loadData = async () => {
    try {
      const freshPackages = await adminApi.getContent("servicePackages");
      if (freshPackages && freshPackages["ai-chatbot"]) {
        const botData = freshPackages["ai-chatbot"];
        setDetailData(botData);
        if (botData.coverImage) setCoverImage(botData.coverImage);
        if (Array.isArray(botData.highlights)) setHighlights(botData.highlights);
        if (botData.subtitle) setSubtitle(botData.subtitle);
        if (botData.ctaHeadline) setCtaHeadline(botData.ctaHeadline);
        if (botData.ctaDesc) setCtaDesc(botData.ctaDesc);
        if (botData.ctaButtonText) setCtaButtonText(botData.ctaButtonText);
      }

      const freshServices = await adminApi.getServices();
      if (Array.isArray(freshServices) && freshServices.length > 0) {
        const match = freshServices.find((s: any) => s.slug === "ai-chatbot");
        if (match) setCatalogCard(match);
      }
    } catch (e) {
      console.error("Failed to load chatbot data:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const currentPackages = (await adminApi.getContent("servicePackages")) || {};
      const updatedPackages = {
        ...currentPackages,
        "ai-chatbot": {
          ...detailData,
          coverImage,
          highlights,
          subtitle,
          ctaHeadline,
          ctaDesc,
          ctaButtonText
        }
      };
      await adminApi.saveContent("servicePackages", updatedPackages);

      const currentServices = (await adminApi.getServices()) || [];
      const targetService = currentServices.find((s: any) => s.slug === "ai-chatbot");
      if (targetService) {
        const payload = {
          ...targetService,
          ...catalogCard,
          features: catalogCard.features || targetService.features
        };
        await adminApi.updateService(targetService.id, payload);
      }

      setSaved(true);
      toast.success("AI Chatbot settings saved live to database!", {
        description: "Persisted to PostgreSQL and synchronized with frontend."
      });
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      console.error("Chatbot save error:", e);
      toast.error(e?.message || "Failed to save changes.");
    }
  };

  const handleAddPackageTier = () => {
    const nextIdx = (detailData.packages || []).length + 1;
    const newTier = {
      id: `pkg-${Date.now()}`,
      title: `Tier ${nextIdx} Chatbot Solution`,
      meta: "Automated Conversational Support",
      price: "Start $499",
      description: "Custom enterprise tier with expanded tokens, automated workflows, and dedicated database sync.",
      features: ["Custom Integrations", "Dedicated RAG Pipeline", "Priority SLA Response"],
      image: detailData.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      link: "/order?service=Custom%20Chatbot",
      isConsulting: false
    };
    setDetailData({
      ...detailData,
      packages: [...(detailData.packages || []), newTier]
    });
  };

  const handleRemovePackageTier = (idx: number) => {
    if ((detailData.packages || []).length <= 1) {
      toast.error("At least one package tier must remain.");
      return;
    }
    const updated = (detailData.packages || []).filter((_: any, i: number) => i !== idx);
    setDetailData({ ...detailData, packages: updated });
  };

  const handleUpdatePackage = (pkgIdx: number, field: string, value: any) => {
    const updated = [...(detailData.packages || [])];
    updated[pkgIdx] = { ...updated[pkgIdx], [field]: value };
    setDetailData({ ...detailData, packages: updated });
  };

  const handleAddFeatureToPackage = (pkgIdx: number) => {
    const updated = [...(detailData.packages || [])];
    const currentFeatures = updated[pkgIdx].features || [];
    updated[pkgIdx] = {
      ...updated[pkgIdx],
      features: [...currentFeatures, "New Feature Capability"]
    };
    setDetailData({ ...detailData, packages: updated });
  };

  const handleRemovePackageFeature = (pkgIdx: number, featIdx: number) => {
    const updated = [...(detailData.packages || [])];
    const currentFeatures = updated[pkgIdx].features || [];
    updated[pkgIdx] = {
      ...updated[pkgIdx],
      features: currentFeatures.filter((_: any, i: number) => i !== featIdx)
    };
    setDetailData({ ...detailData, packages: updated });
  };

  const handleUpdatePackageFeature = (pkgIdx: number, featIdx: number, value: string) => {
    const updated = [...(detailData.packages || [])];
    const currentFeatures = [...(updated[pkgIdx].features || [])];
    currentFeatures[featIdx] = value;
    updated[pkgIdx] = {
      ...updated[pkgIdx],
      features: currentFeatures
    };
    setDetailData({ ...detailData, packages: updated });
  };

  const handleAddHighlight = () => {
    setHighlights([...highlights, "New Enterprise SLA Guarantee or capability point."]);
  };

  const handleUpdateHighlight = (idx: number, val: string) => {
    const updated = [...highlights];
    updated[idx] = val;
    setHighlights(updated);
  };

  const handleRemoveHighlight = (idx: number) => {
    if (highlights.length <= 1) {
      toast.error("At least one highlight must be kept.");
      return;
    }
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddCatalogFeature = () => {
    setCatalogCard({
      ...catalogCard,
      features: [...(catalogCard.features || []), "New Directory Feature Point"]
    });
  };

  const handleUpdateCatalogFeature = (idx: number, val: string) => {
    const updated = [...(catalogCard.features || [])];
    updated[idx] = val;
    setCatalogCard({ ...catalogCard, features: updated });
  };

  const handleRemoveCatalogFeature = (idx: number) => {
    const updated = (catalogCard.features || []).filter((_: any, i: number) => i !== idx);
    setCatalogCard({ ...catalogCard, features: updated });
  };

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header Toolbar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Link href="/services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">AI Chatbots CMS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Bot className="w-6 h-6 text-purple-600" />
            <span>AI Chatbot Service CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the frontend content of the dedicated landing page (/services/ai-chatbot) and catalog preview.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Page</span>
          </button>

          <a
            href={`${FRONTEND_URL}/services/ai-chatbot`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Live Site</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
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

      {/* Tabs */}
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

      {activeTab === "details" && (
        <ChatbotDetailTab
          detailData={detailData}
          setDetailData={setDetailData}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          catalogCard={catalogCard}
          setCatalogCard={setCatalogCard}
          highlights={highlights}
          setHighlights={setHighlights}
          ctaHeadline={ctaHeadline}
          setCtaHeadline={setCtaHeadline}
          ctaDesc={ctaDesc}
          setCtaDesc={setCtaDesc}
          ctaButtonText={ctaButtonText}
          setCtaButtonText={setCtaButtonText}
          handleAddPackageTier={handleAddPackageTier}
          handleRemovePackageTier={handleRemovePackageTier}
          handleUpdatePackage={handleUpdatePackage}
          handleAddFeatureToPackage={handleAddFeatureToPackage}
          handleRemovePackageFeature={handleRemovePackageFeature}
          handleUpdatePackageFeature={handleUpdatePackageFeature}
          handleAddHighlight={handleAddHighlight}
          handleUpdateHighlight={handleUpdateHighlight}
          handleRemoveHighlight={handleRemoveHighlight}
        />
      )}

      {activeTab === "catalog" && (
        <ChatbotCatalogTab
          catalogCard={catalogCard}
          setCatalogCard={setCatalogCard}
          handleAddCatalogFeature={handleAddCatalogFeature}
          handleUpdateCatalogFeature={handleUpdateCatalogFeature}
          handleRemoveCatalogFeature={handleRemoveCatalogFeature}
        />
      )}

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved Live</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <ChatbotPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        detailData={detailData}
        coverImage={coverImage}
      />
    </div>
  );
}
