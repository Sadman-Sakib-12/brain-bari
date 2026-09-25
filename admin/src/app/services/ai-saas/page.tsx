"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Eye, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Upload,
  X,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  LayoutTemplate,
  SlidersHorizontal,
  Image as ImageIcon,
  Cpu,
  FileText,
  ShieldCheck,
  Tag
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialPackages from "@/data/servicePackages.json";
import initialServices from "@/data/services.json";
import { toast } from "sonner";

export default function AiSaasAdminPage() {
  const SLUG = "ai-saas";
  const [allPackages, setAllPackages] = useState<any>(initialPackages);
  const [allServices, setAllServices] = useState<any[]>(initialServices);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"detail" | "catalog">("detail");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const loadData = () => {
    try {
      const storedPackages = adminStore.getServicePackages();
      if (storedPackages) setAllPackages(storedPackages);
      const storedServices = adminStore.getServices();
      if (storedServices && storedServices.length > 0) setAllServices(storedServices);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  const serviceDetail = allPackages[SLUG] || initialPackages[SLUG] || {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    heroTitlePrefix: "End-to-End Scalable ",
    heroTitleGradient: "AI SaaS Solutions",
    heroTitleSuffix: " from Scratch",
    paragraphs: [
      "We take your AI startup or enterprise SaaS concept from initial architecture design to production deployment and global scalability.",
      "Built with modern stacks including Next.js, FastAPI, multi-tenant databases, Stripe billing, and automated CI/CD pipelines."
    ],
    packages: [
      {
        id: "pkg-4",
        title: "Full-Stack AI Micro-SaaS MVP",
        meta: "Next.js 16 + FastAPI + Multi-Tenant Cloud Scaling",
        price: "Start $850",
        description: "Production-ready SaaS boilerplate with authentication, subscription tiers, Stripe checkout, AI inference engine, and admin dashboard.",
        features: [
          "Next.js & Tailwind Frontend",
          "FastAPI / Python AI Backend",
          "Stripe Subscription Billing",
          "Multi-Tenant Cloud Hosting"
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        link: "/order?service=AI%20SaaS%20MVP",
        isConsulting: false
      }
    ]
  };

  const catalogServiceIndex = allServices.findIndex((s: any) => s.slug === SLUG || s.category === SLUG);
  const catalogService = catalogServiceIndex >= 0 ? allServices[catalogServiceIndex] : {
    id: "srv-2",
    slug: "ai-saas",
    title: "Ai Saas",
    category: "ai-saas",
    badge: "High ROI",
    startingPrice: 450,
    deliveryDays: 14,
    shortDesc: "End-to-end multi-tenant SaaS application development powered by generative AI and modern cloud architecture.",
    features: [
      "Multi-Tenant Architecture & Database",
      "Subscription Billing & Invoicing (Stripe)",
      "High-Speed LLM Inference Pipelines (OpenAI/Claude)",
      "Real-Time Analytics & User Dashboard",
      "Role-Based Access Control (RBAC)"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
  };

  // Updaters for detail page
  const updateDetailField = (field: string, value: any) => {
    const updated = {
      ...allPackages,
      [SLUG]: {
        ...serviceDetail,
        [field]: value
      }
    };
    setAllPackages(updated);
  };

  const updatePackage = (pkgIdx: number, field: string, value: any) => {
    const list = [...(serviceDetail.packages || [])];
    list[pkgIdx] = { ...list[pkgIdx], [field]: value };
    updateDetailField("packages", list);
  };

  const addPackageFeature = (pkgIdx: number) => {
    const list = [...(serviceDetail.packages || [])];
    const features = [...(list[pkgIdx]?.features || []), "Automated Multi-Tenant Database Sharding"];
    list[pkgIdx] = { ...list[pkgIdx], features };
    updateDetailField("packages", list);
  };

  const removePackageFeature = (pkgIdx: number, featIdx: number) => {
    const list = [...(serviceDetail.packages || [])];
    const features = (list[pkgIdx]?.features || []).filter((_: any, i: number) => i !== featIdx);
    list[pkgIdx] = { ...list[pkgIdx], features };
    updateDetailField("packages", list);
  };

  const updatePackageFeature = (pkgIdx: number, featIdx: number, value: string) => {
    const list = [...(serviceDetail.packages || [])];
    const features = [...(list[pkgIdx]?.features || [])];
    features[featIdx] = value;
    list[pkgIdx] = { ...list[pkgIdx], features };
    updateDetailField("packages", list);
  };

  // Updaters for catalog card
  const updateCatalogField = (field: string, value: any) => {
    const updated = [...allServices];
    if (catalogServiceIndex >= 0) {
      updated[catalogServiceIndex] = {
        ...updated[catalogServiceIndex],
        [field]: value
      };
    } else {
      updated.push({
        ...catalogService,
        [field]: value
      });
    }
    setAllServices(updated);
  };

  const addCatalogFeature = () => {
    const features = [...(catalogService.features || []), "Zero-Downtime Microservices Architecture"];
    updateCatalogField("features", features);
  };

  const removeCatalogFeature = (fIdx: number) => {
    const features = (catalogService.features || []).filter((_: any, i: number) => i !== fIdx);
    updateCatalogField("features", features);
  };

  const updateCatalogFeature = (fIdx: number, value: string) => {
    const features = [...(catalogService.features || [])];
    features[fIdx] = value;
    updateCatalogField("features", features);
  };

  const handleSave = () => {
    adminStore.setServicePackages(allPackages);
    adminStore.setServices(allServices);
    setSaved(true);
    toast.success("AI SaaS CMS saved live!", {
      description: "Updated frontend /services/ai-saas and /services catalog."
    });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset AI SaaS content back to default values?")) {
      const resetPackages = {
        ...allPackages,
        [SLUG]: initialPackages[SLUG]
      };
      setAllPackages(resetPackages);
      adminStore.setServicePackages(resetPackages);

      const resetServices = [...initialServices];
      setAllServices(resetServices);
      adminStore.setServices(resetServices);

      toast.info("AI SaaS reset to defaults.");
    }
  };

  const activePkg = (serviceDetail.packages && serviceDetail.packages[0]) || {
    id: "pkg-4",
    title: "Full-Stack AI Micro-SaaS MVP",
    meta: "Next.js 16 + FastAPI + Multi-Tenant Cloud Scaling",
    price: "Start $850",
    description: "Production-ready SaaS boilerplate with authentication, subscription tiers, Stripe checkout, AI inference engine, and admin dashboard.",
    features: [
      "Next.js & Tailwind Frontend",
      "FastAPI / Python AI Backend",
      "Stripe Subscription Billing",
      "Multi-Tenant Cloud Hosting"
    ],
    image: serviceDetail.image
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI SaaS Platforms CMS
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage the AI SaaS dedicated details page (/services/ai-saas) and its /services directory catalog card.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Page</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
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
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("detail")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "detail"
              ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Section 1: AI SaaS Details Page (/services/ai-saas)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Section 2: Directory Catalog Card (/services)</span>
        </button>
      </div>

      {/* TAB 1: DEDICATED PAGE SECTIONS */}
      {activeTab === "detail" && (
        <div className="space-y-6">

          {/* CARD SECTION 1: Headline Structure */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Service Headers &amp; Headline Structure
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Main title prefix, gradient highlight text, and suffix displayed at the top of the details page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Title Prefix
                </label>
                <input
                  type="text"
                  value={serviceDetail.heroTitlePrefix || ""}
                  onChange={(e) => updateDetailField("heroTitlePrefix", e.target.value)}
                  placeholder="e.g. End-to-End Scalable "
                  className="w-full text-sm bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-700 mb-1.5">
                  Gradient Accent Text (Highlight)
                </label>
                <input
                  type="text"
                  value={serviceDetail.heroTitleGradient || ""}
                  onChange={(e) => updateDetailField("heroTitleGradient", e.target.value)}
                  placeholder="e.g. AI SaaS Solutions"
                  className="w-full text-sm font-bold text-[#e464a4] bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Title Suffix
                </label>
                <input
                  type="text"
                  value={serviceDetail.heroTitleSuffix || ""}
                  onChange={(e) => updateDetailField("heroTitleSuffix", e.target.value)}
                  placeholder="e.g.  from Scratch"
                  className="w-full text-sm bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Live Headline Visual Preview Badge */}
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Rendered Headline Preview:</span>
              <span className="text-sm font-extrabold text-slate-900">
                {serviceDetail.heroTitlePrefix}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {serviceDetail.heroTitleGradient}
                </span>
                {serviceDetail.heroTitleSuffix}
              </span>
            </div>
          </div>

          {/* CARD SECTION 2: 2-Column Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Card: Hero Cover/Banner Image */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Hero Cover / Banner Image</h3>
              </div>
              <p className="text-xs text-slate-500 -mt-2">
                Background 4:3 illustration for the service page header.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter new image URL for Hero Banner:", serviceDetail.image);
                    if (url) updateDetailField("image", url);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <input
                  type="text"
                  value={serviceDetail.image || ""}
                  onChange={(e) => updateDetailField("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2 shadow-inner">
                <img
                  src={serviceDetail.image}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"; }}
                />
                <button
                  type="button"
                  onClick={() => updateDetailField("image", "")}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow cursor-pointer transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Card: Package Featured Image */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Main Offering Featured Image</h3>
              </div>
              <p className="text-xs text-slate-500 -mt-2">
                Large photo displayed inside the package card list.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter image URL for Package Offering:", activePkg.image);
                    if (url) updatePackage(0, "image", url);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <input
                  type="text"
                  value={activePkg.image || ""}
                  onChange={(e) => updatePackage(0, "image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2 shadow-inner">
                <img
                  src={activePkg.image}
                  alt="Offering Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"; }}
                />
                <button
                  type="button"
                  onClick={() => updatePackage(0, "image", "")}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow cursor-pointer transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* CARD SECTION 3: Full Article Content */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Full Article &amp; Service Content
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete multiline text displayed under the hero title on the dedicated details page.
              </p>
            </div>

            <div className="space-y-3">
              {(serviceDetail.paragraphs || []).map((para: string, pIdx: number) => (
                <div key={pIdx}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Paragraph {pIdx + 1}
                  </label>
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => {
                      const updated = [...(serviceDetail.paragraphs || [])];
                      updated[pIdx] = e.target.value;
                      updateDetailField("paragraphs", updated);
                    }}
                    className="w-full text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none leading-relaxed transition-all shadow-2xs"
                  />
                </div>
              ))}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(serviceDetail.paragraphs || []), "New scalable AI SaaS framework paragraph."];
                    updateDetailField("paragraphs", updated);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Paragraph</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD SECTION 4: Package Offerings Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Package Offering Card Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Title, subtitle meta, and description for the SaaS MVP package offering card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Package Offering Title
                </label>
                <input
                  type="text"
                  value={activePkg.title || ""}
                  onChange={(e) => updatePackage(0, "title", e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Price Tag Label
                </label>
                <input
                  type="text"
                  value={activePkg.price || ""}
                  onChange={(e) => updatePackage(0, "price", e.target.value)}
                  placeholder="e.g. Start $850"
                  className="w-full text-sm font-bold text-emerald-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-700 mb-1.5">
                Category Subtitle / Meta Tagline
              </label>
              <input
                type="text"
                value={activePkg.meta || ""}
                onChange={(e) => updatePackage(0, "meta", e.target.value)}
                className="w-full text-xs font-semibold text-purple-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Offering Summary
              </label>
              <textarea
                rows={2}
                value={activePkg.description || ""}
                onChange={(e) => updatePackage(0, "description", e.target.value)}
                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none leading-relaxed transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* CARD SECTION 5: Key Highlights & Guarantees */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Key Highlights &amp; Guarantees
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bullet points shown in the highlight list on the SaaS package card.
                </p>
              </div>

              <button
                type="button"
                onClick={() => addPackageFeature(0)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-600" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(activePkg.features || []).map((feat: string, fIdx: number) => (
                <div
                  key={fIdx}
                  className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs focus-within:border-indigo-500 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updatePackageFeature(0, fIdx, e.target.value)}
                    className="flex-1 text-sm text-slate-800 bg-transparent border-0 py-2 px-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePackageFeature(0, fIdx)}
                    className="p-1.5 mr-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Delete Point"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CARD SECTION 6: Consultation Call To Action Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Consultation Call To Action Banner
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bottom banner encouraging visitors to schedule a SaaS strategy consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Headline</label>
                <input
                  type="text"
                  defaultValue="Ready to transfer your Business"
                  className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Button Text</label>
                <input
                  type="text"
                  defaultValue="Schedule A Consultation"
                  className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DIRECTORY CATALOG CARD (/services) */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                /services Directory Card Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Parameters shown for this service in the 4-column catalog grid on the /services page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Service Card Title</label>
                <input
                  type="text"
                  value={catalogService.title || ""}
                  onChange={(e) => updateCatalogField("title", e.target.value)}
                  className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#602b0c] mb-1.5">Catalog Badge</label>
                <input
                  type="text"
                  value={catalogService.badge || ""}
                  onChange={(e) => updateCatalogField("badge", e.target.value)}
                  className="w-full text-xs font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-emerald-700 mb-1.5">From Price ($)</label>
                  <input
                    type="number"
                    value={catalogService.startingPrice || 450}
                    onChange={(e) => updateCatalogField("startingPrice", Number(e.target.value))}
                    className="w-full text-sm font-bold text-emerald-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-700 mb-1.5">Days</label>
                  <input
                    type="number"
                    value={catalogService.deliveryDays || 14}
                    onChange={(e) => updateCatalogField("deliveryDays", Number(e.target.value))}
                    className="w-full text-sm font-bold text-amber-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Excerpt / Description</label>
              <textarea
                rows={2}
                value={catalogService.shortDesc || ""}
                onChange={(e) => updateCatalogField("shortDesc", e.target.value)}
                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Catalog Bullet Points Repeater */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Catalog Feature Checklist Points
                </label>
                <button
                  type="button"
                  onClick={addCatalogFeature}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Point</span>
                </button>
              </div>

              <div className="space-y-2">
                {(catalogService.features || []).map((feat: string, fIdx: number) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <Check className="w-4 h-4 text-purple-600 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => updateCatalogFeature(fIdx, e.target.value)}
                      className="flex-1 text-xs text-slate-800 bg-transparent border-0 py-2 px-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeCatalogFeature(fIdx)}
                      className="p-1.5 mr-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM ACTION BAR */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
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

      {/* 4. PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-300">
            {/* Modal Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-purple-300">Preview:</span>
                <span className="font-bold">/services/ai-saas</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Exact Frontend Render */}
            <div className="overflow-y-auto p-6 sm:p-10 bg-[#fcfbfe] space-y-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                  <img src={serviceDetail.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                    {serviceDetail.heroTitlePrefix}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                      {serviceDetail.heroTitleGradient}
                    </span>
                    {serviceDetail.heroTitleSuffix}
                  </h1>
                  {(serviceDetail.paragraphs || []).map((p: string, i: number) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <span className="px-6 py-2.5 bg-[#602b0c] text-white text-xs font-medium rounded-xl">Read More</span>
                    <span className="px-6 py-2.5 bg-[#b57be4] text-white text-xs font-medium rounded-xl">Work Prove</span>
                  </div>
                </div>
              </div>

              {/* Package Offering Preview */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-[280px] aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={activePkg.image} alt="Pkg" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">{activePkg.title}</h3>
                  <p className="text-xs font-semibold text-gray-500">{activePkg.meta}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{activePkg.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                    {(activePkg.features || []).map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex gap-3">
                    <span className="px-6 py-2 border border-[#602b0c] text-[#602b0c] rounded-xl text-xs font-semibold">Learn More</span>
                    <span className="px-6 py-2 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white rounded-xl text-xs font-bold">Order Now</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
