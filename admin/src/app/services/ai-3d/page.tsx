"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Eye, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  LayoutTemplate,
  Box
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";
import ServiceDetailSectionEditor from "../components/ServiceDetailSectionEditor";
import ServiceCatalogCardEditor from "../components/ServiceCatalogCardEditor";
import ServiceDetailPreviewModal from "../components/ServiceDetailPreviewModal";

export default function Ai3dAdminPage() {
  const SLUG = "ai-3d";
  const [mounted, setMounted] = useState(false);
  const [allPackages, setAllPackages] = useState<any>({});
  const [allServices, setAllServices] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"detail" | "catalog">("detail");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const fresh = await adminApi.getContent("servicePackages");
      if (fresh && Object.keys(fresh).length > 0) {
        setAllPackages(fresh);
      }
      const freshServices = await adminApi.getServices();
      if (freshServices && Array.isArray(freshServices) && freshServices.length > 0) {
        setAllServices(freshServices);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const serviceDetail = allPackages[SLUG] || {
    image: "",
    heroTitlePrefix: "",
    heroTitleGradient: "",
    heroTitleSuffix: "",
    paragraphs: [],
    packages: []
  };

  const catalogServiceIndex = allServices.findIndex((s: any) => s.slug === SLUG || s.category === SLUG);
  const catalogService = catalogServiceIndex >= 0 ? allServices[catalogServiceIndex] : {
    id: "",
    slug: SLUG,
    title: "",
    category: SLUG,
    badge: "",
    startingPrice: 0,
    deliveryDays: 0,
    shortDesc: "",
    features: [],
    image: ""
  };

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
    const features = [...(list[pkgIdx]?.features || []), "Interactive 3D Shader Feature"];
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
    const features = [...(catalogService.features || []), "Three.js Performance Optimization"];
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

  const handleSave = async () => {
    try {
      await adminApi.saveContent("servicePackages", allPackages);
      const currentService = allServices.find((s: any) => s.slug === SLUG);
      if (currentService && currentService.id && !currentService.id.startsWith("temp-")) {
        await adminApi.updateService(currentService.id, currentService);
      }
      setSaved(true);
      toast.success("AI & 3D Web/Apps CMS saved live to database!", {
        description: "Persisted to PostgreSQL and synchronized with frontend."
      });
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save to database");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset AI & 3D Web/Apps content back to database state?")) {
      try {
        const fresh = await adminApi.getContent("servicePackages");
        if (fresh) {
          setAllPackages(fresh);
        }
        const freshServices = await adminApi.getServices();
        if (freshServices) {
          setAllServices(freshServices);
        }
        toast.info("AI & 3D Web/Apps reset from database.");
      } catch {
        toast.error("Failed to refresh from database.");
      }
    }
  };

  const activePkg = (serviceDetail.packages && serviceDetail.packages[0]) || {
    id: "pkg-5",
    title: "Interactive 3D Web App",
    meta: "Three.js + Real-Time Shaders + WebGL Performance",
    price: "Start $550",
    description: "Interactive Three.js visualizer with custom 3D models, smooth camera orbits, real-time materials tweaking, and mobile responsiveness.",
    features: [
      "Three.js / React Three Fiber",
      "Blender Model Optimization",
      "Interactive Physics & Lighting",
      "Zero Plugin In-Browser Running"
    ],
    image: serviceDetail.image
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
      {/* 1. Header Toolbar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Link href="/services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">AI &amp; 3D Web/Apps CMS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Box className="w-6 h-6 text-purple-600" />
            <span>AI &amp; 3D Web/Apps Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live synchronization across Frontend and Admin. Dedicated URL: /services/ai-3d
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Page</span>
          </button>

          <a
            href={`${FRONTEND_URL}/services/ai-3d`}
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
          onClick={() => setActiveTab("detail")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "detail"
              ? "bg-purple-50 text-purple-950 border-2 border-purple-600/80 shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeTab === "detail" ? "text-purple-700" : "text-slate-400"}`} />
          <span>Section 1: Details Page (/services/ai-3d)</span>
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

      {activeTab === "detail" && (
        <ServiceDetailSectionEditor
          serviceDetail={serviceDetail}
          activePkg={activePkg}
          updateDetailField={updateDetailField}
          updatePackage={updatePackage}
          addPackageFeature={addPackageFeature}
          updatePackageFeature={updatePackageFeature}
          removePackageFeature={removePackageFeature}
        />
      )}

      {activeTab === "catalog" && (
        <ServiceCatalogCardEditor
          catalogService={catalogService}
          updateCatalogField={updateCatalogField}
          addCatalogFeature={addCatalogFeature}
          updateCatalogFeature={updateCatalogFeature}
          removeCatalogFeature={removeCatalogFeature}
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

      <ServiceDetailPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        slug={SLUG}
        serviceDetail={serviceDetail}
        activePkg={activePkg}
      />
    </div>
  );
}
