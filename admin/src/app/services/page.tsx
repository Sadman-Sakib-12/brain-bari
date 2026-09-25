"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  Layers,
  Save,
  RotateCcw,
  Bot,
  Box,
  Cpu,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Clock,
  DollarSign,
  Tag,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpRight,
  Globe,
  SlidersHorizontal
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialServices from "@/data/services.json";
import initialPackages from "@/data/servicePackages.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

const serviceIcons: Record<string, React.ElementType> = {
  "ai-chatbot": Bot,
  "ai-saas": Layers,
  "custom-ai": Cpu,
  "ai-3d": Box
};

type ServicesTab = "all" | "add" | "categories" | "packages";
type ViewMode = "grid" | "table";

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = (searchParams.get("tab") as ServicesTab) || "all";
  const initialAction = searchParams.get("action");
  const initialView = (searchParams.get("view") as ViewMode) || "grid";

  const [activeTab, setActiveTab] = useState<ServicesTab>(initialAction === "add" ? "add" : initialTab);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView === "table" ? "table" : "grid");
  const [services, setServices] = useState<any[]>(initialServices);
  const [packagesData, setPackagesData] = useState<any>(initialPackages);
  
  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft">("All");
  const [homepageFilter, setHomepageFilter] = useState<"All" | "Featured" | "Standard">("All");
  
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("AI Chatbot");
  const [formPrice, setFormPrice] = useState(259);
  const [formDays, setFormDays] = useState(7);
  const [formBadge, setFormBadge] = useState("Popular");
  const [formDesc, setFormDesc] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImage, setFormImage] = useState("");

  const loadData = () => {
    try {
      const storedServices = adminStore.getServices();
      if (storedServices && storedServices.length > 0) setServices(storedServices);
      const storedPackages = adminStore.getServicePackages();
      if (storedPackages) setPackagesData(storedPackages);
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
    const tab = searchParams.get("tab") as ServicesTab;
    const action = searchParams.get("action");
    const view = searchParams.get("view") as ViewMode;

    if (action === "add") {
      openAddService();
    } else if (tab && ["all", "add", "categories", "packages"].includes(tab)) {
      setActiveTab(tab);
    }

    if (view && ["grid", "table"].includes(view)) {
      setViewMode(view);
    }
  }, [searchParams]);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.replace(`/services?${params.toString()}`);
  };

  const handleTabChange = (tab: ServicesTab) => {
    setActiveTab(tab);
    if (tab === "all") {
      router.push(viewMode === "table" ? "/services?view=table" : "/services");
    } else {
      router.push(`/services?tab=${tab}`);
    }
  };

  const handleSaveAll = () => {
    adminStore.setServices(services);
    adminStore.setServicePackages(packagesData);
    setSaved(true);
    toast.success("Services & Packages saved successfully!", {
      description: "Frontend /services and live homepage updated."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const openAddService = () => {
    setEditingService(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("AI Chatbot");
    setFormPrice(259);
    setFormDays(7);
    setFormBadge("New");
    setFormDesc("");
    setFormFeatures("24/7 Automated Responses\nRAG Pipeline Integration\nMulti-Platform Deployment");
    setFormStatus("Active");
    setFormFeatured(false);
    setFormImage("https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80");
    setIsModalOpen(true);
  };

  const openEditService = (srv: any) => {
    setEditingService(srv);
    setFormTitle(srv.title || "");
    setFormSlug(srv.slug || "");
    setFormCategory(srv.category || "AI Chatbot");
    setFormPrice(srv.price || srv.startingPrice || 250);
    setFormDays(srv.deliveryDays || 7);
    setFormBadge(srv.badge || "Popular");
    setFormDesc(srv.shortDesc || srv.description || srv.shortDescription || "");
    setFormFeatures(Array.isArray(srv.features) ? srv.features.join("\n") : (srv.features || ""));
    setFormStatus(srv.status || (srv.active !== undefined ? (srv.active ? "Active" : "Draft") : "Active"));
    setFormFeatured(!!srv.isFeatured);
    setFormImage(srv.image || "");
    setIsModalOpen(true);
  };

  const handleSaveServiceForm = () => {
    if (!formTitle.trim()) {
      toast.error("Service title is required");
      return;
    }

    const featureList = formFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const slug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingService) {
      // Update existing
      const updated = services.map((s) => {
        if (s.id === editingService.id || s.slug === editingService.slug) {
          return {
            ...s,
            title: formTitle,
            slug,
            category: formCategory,
            price: formPrice,
            startingPrice: formPrice,
            deliveryDays: formDays,
            badge: formBadge,
            description: formDesc,
            shortDescription: formDesc,
            shortDesc: formDesc,
            fullDesc: s.fullDesc || formDesc,
            features: featureList,
            status: formStatus,
            active: formStatus === "Active",
            isFeatured: formFeatured,
            image: formImage
          };
        }
        return s;
      });
      setServices(updated);
      adminStore.setServices(updated);
      toast.success(`Service "${formTitle}" updated.`);
    } else {
      // Add new
      const newService = {
        id: `srv-${Date.now()}`,
        title: formTitle,
        slug,
        category: formCategory,
        price: formPrice,
        startingPrice: formPrice,
        deliveryDays: formDays,
        badge: formBadge,
        description: formDesc,
        shortDescription: formDesc,
        shortDesc: formDesc,
        fullDesc: formDesc,
        features: featureList,
        status: formStatus,
        active: formStatus === "Active",
        isFeatured: formFeatured,
        image: formImage
      };
      const updated = [newService, ...services];
      setServices(updated);
      adminStore.setServices(updated);
      toast.success(`Service "${formTitle}" created.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteService = () => {
    if (!deleteConfirmId) return;
    const updated = services.filter((s) => s.id !== deleteConfirmId && s.slug !== deleteConfirmId);
    setServices(updated);
    adminStore.setServices(updated);
    toast.success("Service removed.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = (srvId: string) => {
    const updated = services.map((s) => {
      if (s.id === srvId || s.slug === srvId) {
        const nextState = !s.isFeatured;
        toast.info(nextState ? `"${s.title}" featured on Homepage.` : `"${s.title}" removed from Homepage.`);
        return { ...s, isFeatured: nextState };
      }
      return s;
    });
    setServices(updated);
    adminStore.setServices(updated);
  };

  // Helper to resolve dedicated landing page CMS route
  const getDedicatedPageHref = (slug: string) => {
    const normalized = (slug || "").toLowerCase().trim();
    if (normalized.includes("chatbot")) return "/services/ai-chatbot";
    if (normalized.includes("saas")) return "/services/ai-saas";
    if (normalized.includes("custom")) return "/services/custom-ai";
    if (normalized.includes("3d")) return "/services/ai-3d";
    return `/services/${slug}`;
  };

  // Helper to get package count for a service
  const getPackageCount = (slug: string) => {
    if (!packagesData) return 2;
    const entry = packagesData[slug];
    if (entry && Array.isArray(entry.packages)) {
      return entry.packages.length;
    }
    return 2;
  };

  // Categories list
  const categories = ["All", "AI Chatbot", "AI SaaS", "Custom AI Assistant", "AI & 3D Web/Apps"];

  // Filtered services
  const filteredServices = services.filter((s) => {
    // 1. Category
    if (selectedCategory !== "All" && (s.category || "").toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // 2. Status
    if (statusFilter !== "All") {
      const isActive = s.active !== undefined ? s.active : s.status === "Active";
      if (statusFilter === "Active" && !isActive) return false;
      if (statusFilter === "Draft" && isActive) return false;
    }
    // 3. Homepage
    if (homepageFilter !== "All") {
      const isFeatured = !!s.isFeatured;
      if (homepageFilter === "Featured" && !isFeatured) return false;
      if (homepageFilter === "Standard" && isFeatured) return false;
    }
    // 4. Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = (s.title || "").toLowerCase().includes(query);
      const slugMatch = (s.slug || "").toLowerCase().includes(query);
      const categoryMatch = (s.category || "").toLowerCase().includes(query);
      const descMatch = (s.shortDesc || s.description || "").toLowerCase().includes(query);
      const featuresMatch = Array.isArray(s.features)
        ? s.features.some((f: string) => f.toLowerCase().includes(query))
        : false;
      if (!titleMatch && !slugMatch && !categoryMatch && !descMatch && !featuresMatch) {
        return false;
      }
    }
    return true;
  });

  const featuredCount = services.filter((s) => s.isFeatured).length;
  const isAnyFilterActive = searchQuery || selectedCategory !== "All" || statusFilter !== "All" || homepageFilter !== "All";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Services"
        title="Services"
        description="Manage your services, pricing, packages and homepage visibility."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddService}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>{saved ? "Saved!" : "Save All"}</span>
            </button>
            <Link
              href="/website/homepage?tab=services"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:text-slate-900 transition-colors shadow-2xs"
              title="Configure Homepage Services Preview"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Homepage CMS</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Service Catalog", icon: Code2, count: services.length },
            { id: "packages", label: "Packages", icon: Layers, count: Object.keys(packagesData || {}).length },
            { id: "categories", label: "Categories", icon: Tag, count: categories.length - 1 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as ServicesTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: SERVICE CATALOG (GRID & TABLE MODES) */}
      {activeTab === "all" && (
        <div className="space-y-4">
          {/* Top Filter & Search Bar */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services by name, category, or features..."
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-[170px] bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 transition-all outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full sm:w-[130px] bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 transition-all outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft / Inactive</option>
                </select>
              </div>

              {/* Homepage Visibility Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={homepageFilter}
                  onChange={(e) => setHomepageFilter(e.target.value as any)}
                  className="w-full sm:w-[160px] bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 transition-all outline-none cursor-pointer"
                >
                  <option value="All">All Visibility</option>
                  <option value="Featured">★ Homepage Featured</option>
                  <option value="Standard">Standard Catalog</option>
                </select>
              </div>

              {/* Reset Filters button */}
              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setStatusFilter("All");
                    setHomepageFilter("All");
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* View Switcher & Toolbar Subheader */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              {/* Left: View mode buttons & Count */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleViewChange("grid")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewChange("table")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                <span className="text-slate-500 font-medium">
                  Showing <strong className="text-slate-900">{filteredServices.length}</strong> of {services.length} services
                </span>
              </div>

              {/* Right: Homepage counter & Dedicated CMS Shortcuts */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/website/homepage?tab=services"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="Homepage Services Preview"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600 fill-current" />
                  <span>{featuredCount} on Homepage</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="text-slate-400 font-medium pl-1">Dedicated Pages:</span>
                  <Link href="/services/ai-chatbot" className="text-blue-600 hover:underline font-semibold">Chatbot</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/services/ai-saas" className="text-blue-600 hover:underline font-semibold">SaaS</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/services/custom-ai" className="text-blue-600 hover:underline font-semibold">Custom</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/services/ai-3d" className="text-blue-600 hover:underline font-semibold">3D Apps</Link>
                </div>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: GRID VIEW */}
          {viewMode === "grid" && (
            <>
              {filteredServices.length === 0 ? (
                <EmptyState
                  icon={Code2}
                  title="No services found"
                  description={
                    isAnyFilterActive
                      ? "No services match your active filters. Try adjusting your query or reset filters."
                      : "No service offerings configured yet. Click below to add your first service."
                  }
                  action={
                    isAnyFilterActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                          setStatusFilter("All");
                          setHomepageFilter("All");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Filters</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={openAddService}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Service</span>
                      </button>
                    )
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredServices.map((srv) => {
                    const Icon = serviceIcons[srv.slug] || Bot;
                    const pkgCount = getPackageCount(srv.slug);
                    const dedicatedHref = getDedicatedPageHref(srv.slug);

                    return (
                      <div
                        key={srv.id || srv.slug}
                        className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs group relative"
                      >
                        {/* Top Bar: Icon, Category & Status Badges */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              {/* Homepage Feature Toggle Pill */}
                              {srv.isFeatured ? (
                                <button
                                  type="button"
                                  onClick={() => toggleFeatured(srv.id || srv.slug)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                  title="Click to remove from Homepage"
                                >
                                  <Sparkles className="w-3 h-3 text-emerald-600 fill-current" />
                                  <span>Featured on Home</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleFeatured(srv.id || srv.slug)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Click to Feature on Homepage"
                                >
                                  <Star className="w-3 h-3 text-slate-400" />
                                  <span>Standard</span>
                                </button>
                              )}

                              <StatusBadge status={srv.active !== false ? "Active" : "Draft"} size="sm" />
                            </div>
                          </div>

                          {/* Title & Pricing */}
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                                {srv.title}
                              </h3>
                              {srv.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                  {srv.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs font-bold text-blue-600 font-mono">
                                Start ${srv.price || srv.startingPrice || 250}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {srv.deliveryDays || 7} Days Delivery
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] text-slate-500 font-medium capitalize">
                                {srv.category}
                              </span>
                            </div>
                          </div>

                          {/* Short Description */}
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {srv.shortDesc || srv.description || "No description provided."}
                          </p>

                          {/* Feature Bullets Preview */}
                          {srv.features && (
                            <div className="pt-2 border-t border-slate-100 space-y-1">
                              {(Array.isArray(srv.features) ? srv.features.slice(0, 3) : []).map(
                                (feat: string, i: number) => (
                                  <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Packages Indicator */}
                          <div className="pt-2 pb-0.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                              <Layers className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Deliverable Tiers:</span>
                              <span className="font-bold text-slate-900">{pkgCount} Packages</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("packages");
                                router.push("/services?tab=packages");
                              }}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Manage</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Card Actions: Quick Edit vs Full Page CMS */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              type="button"
                              onClick={() => openEditService(srv)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                              title="Quick Edit Basic Service Info"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Quick Edit</span>
                            </button>

                            <Link
                              href={dedicatedHref}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                              title="Open Full Service Landing Page CMS"
                            >
                              <span>Full Page CMS</span>
                              <ExternalLink className="w-3 h-3 text-slate-300" />
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(srv.id || srv.slug)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* VIEW MODE 2: TABLE VIEW */}
          {viewMode === "table" && (
            <>
              {filteredServices.length === 0 ? (
                <EmptyState
                  icon={Code2}
                  title="No services found"
                  description={
                    isAnyFilterActive
                      ? "No services match your active filters. Try adjusting your query or reset filters."
                      : "No service offerings configured yet. Click below to add your first service."
                  }
                  action={
                    isAnyFilterActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                          setStatusFilter("All");
                          setHomepageFilter("All");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Filters</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={openAddService}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Service</span>
                      </button>
                    )
                  }
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Starting Price</th>
                          <th className="py-3 px-4">Delivery</th>
                          <th className="py-3 px-4">Tier Packages</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Homepage</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredServices.map((srv) => {
                          const Icon = serviceIcons[srv.slug] || Bot;
                          const pkgCount = getPackageCount(srv.slug);
                          const dedicatedHref = getDedicatedPageHref(srv.slug);

                          return (
                            <tr key={srv.id || srv.slug} className="hover:bg-slate-50/70 transition-colors">
                              {/* Service Info */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 truncate">
                                      {srv.title}
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">
                                      {srv.category} <span className="text-slate-300">·</span> <span className="font-mono text-[10px] text-slate-400">/{srv.slug}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-3 px-4 font-mono font-bold text-blue-600">
                                ${srv.price || srv.startingPrice || 250}
                              </td>

                              {/* Delivery */}
                              <td className="py-3 px-4 text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{srv.deliveryDays || 7} Days</span>
                                </span>
                              </td>

                              {/* Packages */}
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("packages");
                                    router.push("/services?tab=packages");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 font-semibold transition-colors cursor-pointer"
                                  title="Manage packages in Packages tab"
                                >
                                  <Layers className="w-3 h-3" />
                                  <span>{pkgCount} Packages</span>
                                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                                </button>
                              </td>

                              {/* Status */}
                              <td className="py-3 px-4">
                                <StatusBadge status={srv.active !== false ? "Active" : "Draft"} size="sm" />
                              </td>

                              {/* Homepage Feature */}
                              <td className="py-3 px-4">
                                {srv.isFeatured ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleFeatured(srv.id || srv.slug)}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                    title="Click to remove from Homepage"
                                  >
                                    <Sparkles className="w-3 h-3 text-emerald-600 fill-current" />
                                    <span>Featured</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => toggleFeatured(srv.id || srv.slug)}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Click to Feature on Homepage"
                                  >
                                    <span>Standard</span>
                                  </button>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => openEditService(srv)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                                    title="Quick Edit Service Info"
                                  >
                                    <Edit2 className="w-3 h-3 text-slate-500" />
                                    <span>Quick Edit</span>
                                  </button>

                                  <Link
                                    href={dedicatedHref}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Open Full Service Landing Page CMS"
                                  >
                                    <span>Full CMS</span>
                                    <ExternalLink className="w-3 h-3 text-slate-300" />
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(srv.id || srv.slug)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    title="Delete Service"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: PACKAGES (STRUCTURED TIER PACKAGES) */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Service Deliverable Packages</h3>
              <p className="text-xs text-slate-500">
                Tier packages configured across the 4 specialized service landing pages.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Packages</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.keys(packagesData).map((catKey) => {
              const catObj = packagesData[catKey];
              const pkgs = catObj.packages || [];
              const dedicatedHref = getDedicatedPageHref(catKey);

              return (
                <div key={catKey} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          Service Group
                        </span>
                        <h4 className="text-base font-bold text-slate-900 capitalize">
                          {catKey.replace("-", " ")}
                        </h4>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {pkgs.length} Tiers
                      </span>
                    </div>

                    <div className="space-y-3">
                      {pkgs.map((pkg: any, idx: number) => (
                        <div
                          key={pkg.id || idx}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{pkg.title}</span>
                            <span className="text-xs font-bold text-indigo-600 font-mono">
                              {pkg.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{pkg.description}</p>
                          {pkg.features && (
                            <div className="space-y-0.5 pt-1">
                              {pkg.features.slice(0, 2).map((feat: string, fIdx: number) => (
                                <div key={fIdx} className="text-[10px] text-slate-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                  <span className="truncate">{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={dedicatedHref}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Configure in {catKey} CMS</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "ai-chatbot",
              name: "AI Chatbot",
              starting: "$259",
              desc: "Conversational agents trained on custom docs, FAQs, and APIs for customer care and auto-ordering.",
              activeCount: "11 Solutions",
              href: "/services/ai-chatbot"
            },
            {
              id: "ai-saas",
              name: "AI SaaS",
              starting: "$450",
              desc: "Multi-tenant cloud architectures with AI APIs, billing integrations, and analytics dashboards.",
              activeCount: "8 Solutions",
              href: "/services/ai-saas"
            },
            {
              id: "custom-ai",
              name: "Custom AI Assistant",
              starting: "$650",
              desc: "Specialized enterprise copilot assistants for healthcare, financial triage, and legal workflows.",
              activeCount: "8 Solutions",
              href: "/services/custom-ai"
            },
            {
              id: "ai-3d",
              name: "AI & 3D Web/Apps",
              starting: "$450",
              desc: "Interactive Three.js, WebGL, and mobile applications with embedded intelligent conversational layers.",
              activeCount: "8 Solutions",
              href: "/services/ai-3d"
            }
          ].map((cat) => (
            <div key={cat.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <span className="text-xs font-bold text-indigo-600 font-mono">From {cat.starting}</span>
              </div>
              <p className="text-xs text-slate-500">{cat.desc}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{cat.activeCount}</span>
                <Link
                  href={cat.href}
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open Dedicated CMS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK EDIT / ADD SERVICE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Quick Edit Service" : "Add New AI Service"}
        subtitle="Configure catalog title, starting price, delivery days, and homepage visibility."
        maxWidth="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveServiceForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 rounded-xl cursor-pointer shadow-2xs"
            >
              {editingService ? "Save Changes" : "Create Service"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Service Title" required>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. AI Customer Care Chatbot"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </FormField>

            <FormField label="Service Slug (URL)">
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="ai-chatbot"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Category">
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="AI Chatbot">AI Chatbot</option>
                <option value="AI SaaS">AI SaaS</option>
                <option value="Custom AI Assistant">Custom AI Assistant</option>
                <option value="AI & 3D Web/Apps">AI &amp; 3D Web/Apps</option>
              </select>
            </FormField>

            <FormField label="Starting Price ($)" required>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </FormField>

            <FormField label="Delivery Time (Days)">
              <input
                type="number"
                value={formDays}
                onChange={(e) => setFormDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Badge / Tag">
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                placeholder="Popular / Hot"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </FormField>

            <FormField label="Publish Status">
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>
          </div>

          <FormField label="Short Description">
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief summary shown on homepage and services card grid."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white text-slate-900"
            />
          </FormField>

          <FormField label="Features / Deliverables (One per line)">
            <textarea
              rows={3}
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
              placeholder="Instant 24/7 Support&#10;RAG Pipeline Training&#10;Human Handoff"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:border-blue-600 bg-white text-slate-900"
            />
          </FormField>

          <FormField label="Image URL / Thumbnail">
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-600 bg-white text-slate-900"
            />
          </FormField>

          <div className="flex items-center gap-2 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="isFeaturedCheck"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isFeaturedCheck" className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
              Feature this service on live homepage preview grid
            </label>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteService}
        title="Delete Service Offering"
        message="Are you sure you want to delete this service? It will no longer appear on the public catalog or homepage."
        confirmLabel="Delete Service"
        isDestructive={true}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
