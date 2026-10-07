"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import ServicesAllTab from "./components/ServicesAllTab";
import ServicesPackagesTab from "./components/ServicesPackagesTab";
import ServicesCategoriesTab from "./components/ServicesCategoriesTab";
import ServiceEditModal from "./components/ServiceEditModal";
import ServicesHeaderNav, { ServicesTab } from "./components/ServicesHeaderNav";

type ViewMode = "grid" | "table";

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get("tab") as ServicesTab) || "all";
  const initialAction = searchParams.get("action");
  const initialView = (searchParams.get("view") as ViewMode) || "grid";

  const [activeTab, setActiveTab] = useState<ServicesTab>(
    initialAction === "add" ? "all" : initialTab
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialView === "table" ? "table" : "grid"
  );
  const [services, setServices] = useState<any[]>([]);
  const [packagesData, setPackagesData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft">("All");

  // Edit / Add Modal
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("AI Chatbot");
  const [formPrice, setFormPrice] = useState(250);
  const [formDays, setFormDays] = useState(7);
  const [formBadge, setFormBadge] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formImage, setFormImage] = useState("");
  const [selectedPackageServiceSlug, setSelectedPackageServiceSlug] =
    useState<string>("ai-chatbot");

  const handleManagePackages = (slug: string) => {
    setSelectedPackageServiceSlug(slug);
    setActiveTab("packages");
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resServices, resPackages] = await Promise.all([
        adminApi.getServices().catch(() => []),
        adminApi.getContent("servicePackages").catch(() => null),
      ]);
      setServices(resServices || []);
      if (resPackages) setPackagesData(resPackages);
    } catch {
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as ServicesTab;
    const action = searchParams.get("action");
    const view = searchParams.get("view") as ViewMode;

    if (action === "add") {
      openAddService();
    } else if (tab && ["all", "categories", "packages"].includes(tab)) {
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

  const openAddService = () => {
    setEditingService(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("AI Chatbot");
    setFormPrice(250);
    setFormDays(7);
    setFormBadge("");
    setFormDesc("");
    setFormFeatures("");
    setFormStatus("Active");
    setFormImage("");
    setIsModalOpen(true);
  };

  const openEditService = (srv: any) => {
    setEditingService(srv);
    setFormTitle(srv.title || "");
    setFormSlug(srv.slug || "");
    setFormCategory(srv.category || "AI Chatbot");
    setFormPrice(srv.price || srv.startingPrice || 250);
    setFormDays(srv.deliveryDays || 7);
    setFormBadge(srv.badge || "");
    setFormDesc(srv.shortDesc || srv.description || srv.shortDescription || "");
    setFormFeatures(
      Array.isArray(srv.features)
        ? srv.features.join("\n")
        : typeof srv.features === "string"
        ? srv.features
        : ""
    );
    setFormStatus(
      srv.isActive !== undefined
        ? srv.isActive
          ? "Active"
          : "Draft"
        : srv.active !== undefined
        ? srv.active
          ? "Active"
          : "Draft"
        : srv.status || "Active"
    );
    setFormImage(srv.image || "");
    setIsModalOpen(true);
  };

  const handleSaveServiceForm = async () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a service title.");
      return;
    }

    const featureList = formFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const slug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload = {
      title: formTitle.trim(),
      slug,
      category: formCategory,
      price: Number(formPrice) || 0,
      deliveryDays: Number(formDays) || 7,
      badge: formBadge.trim() || undefined,
      shortDesc: formDesc.trim(),
      fullDesc: formDesc.trim(),
      features: featureList,
      isActive: formStatus === "Active",
      image: formImage.trim() || undefined,
    };

    setIsSaving(true);
    try {
      if (editingService) {
        await adminApi.updateService(editingService.id, payload);

        setServices((prev) =>
          prev.map((s) => {
            if (s.id === editingService.id || s.slug === editingService.slug) {
              return {
                ...s,
                ...payload,
                active: payload.isActive,
                status: payload.isActive ? "Active" : "Draft",
              };
            }
            return s;
          })
        );
        toast.success(`Service "${formTitle}" updated successfully!`);
      } else {
        const created = await adminApi.createService(payload);
        if (created) {
          setServices((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
        } else {
          const fallback = {
            id: `srv-${Date.now()}`,
            ...payload,
            active: payload.isActive,
            status: payload.isActive ? "Active" : "Draft",
          };
          setServices((prev) => [fallback, ...prev]);
        }
        toast.success(`New service "${formTitle}" created!`);
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save service. Please check backend connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (srv: any) => {
    const currentActive =
      srv.isActive !== undefined
        ? srv.isActive
        : srv.active !== undefined
        ? srv.active
        : srv.status === "Active";
    const nextActive = !currentActive;

    try {
      await adminApi.updateService(srv.id, { isActive: nextActive });
      setServices((prev) =>
        prev.map((s) =>
          s.id === srv.id
            ? {
                ...s,
                isActive: nextActive,
                active: nextActive,
                status: nextActive ? "Active" : "Draft",
              }
            : s
        )
      );
      toast.success(
        `"${srv.title}" is now ${nextActive ? "Active (Live on Website)" : "Draft (Hidden)"}.`
      );
    } catch {
      toast.error("Failed to update service status.");
    }
  };

  const handleDeleteService = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.deleteService(deleteConfirmId);
      setServices((prev) =>
        prev.filter((s) => s.id !== deleteConfirmId && s.slug !== deleteConfirmId)
      );
      toast.success("Service removed from catalog.");
    } catch {
      toast.error("Failed to delete service.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSavePackages = async () => {
    try {
      await adminApi.saveContent("servicePackages", packagesData);
      toast.success("Deliverable packages saved successfully!");
    } catch {
      toast.error("Failed to save packages.");
    }
  };

  const getDedicatedPageHref = (slug: string) => {
    const normalized = (slug || "").toLowerCase().trim();
    if (normalized.includes("chatbot")) return "/services/ai-chatbot";
    if (normalized.includes("saas")) return "/services/ai-saas";
    if (normalized.includes("custom")) return "/services/custom-ai";
    if (normalized.includes("3d")) return "/services/ai-3d";
    return `/services/${slug}`;
  };

  const categories = ["All", "AI Chatbot", "AI SaaS", "Custom AI Assistant", "AI & 3D Web/Apps"];

  const filteredServices = services.filter((s) => {
    if (
      selectedCategory !== "All" &&
      (s.category || "").toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }
    const isActive =
      s.isActive !== undefined
        ? s.isActive
        : s.active !== undefined
        ? s.active
        : s.status === "Active";

    if (statusFilter === "Active" && !isActive) return false;
    if (statusFilter === "Draft" && isActive) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (s.title || "").toLowerCase().includes(q);
      const matchDesc = (s.shortDesc || s.description || "").toLowerCase().includes(q);
      const matchCat = (s.category || "").toLowerCase().includes(q);
      const matchFeats =
        Array.isArray(s.features) &&
        s.features.some((f: string) => f.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchFeats) return false;
    }
    return true;
  });

  const activeCount = services.filter((s) =>
    s.isActive !== undefined
      ? s.isActive
      : s.active !== undefined
      ? s.active
      : s.status === "Active"
  ).length;

  const isAnyFilterActive =
    searchQuery.trim() !== "" || selectedCategory !== "All" || statusFilter !== "All";

  return (
    <div className="space-y-6 pb-20">
      <ServicesHeaderNav
        onOpenAddService={openAddService}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        servicesCount={services.length}
        activeCount={activeCount}
      />

      {/* TAB PANELS */}
      {activeTab === "all" && (
        <>
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500 font-medium">
              Loading Core Services...
            </div>
          ) : (
            <ServicesAllTab
              services={services}
              filteredServices={filteredServices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              viewMode={viewMode}
              onViewChange={handleViewChange}
              categories={categories}
              isAnyFilterActive={isAnyFilterActive}
              onOpenAdd={openAddService}
              onOpenEdit={openEditService}
              onDeleteConfirm={(id) => setDeleteConfirmId(id)}
              onToggleActive={handleToggleActive}
              getDedicatedPageHref={getDedicatedPageHref}
              packagesData={packagesData}
              onManagePackages={handleManagePackages}
            />
          )}
        </>
      )}

      {activeTab === "categories" && <ServicesCategoriesTab />}

      {activeTab === "packages" && (
        <ServicesPackagesTab
          services={services}
          packagesData={packagesData}
          setPackagesData={setPackagesData}
          selectedSlug={selectedPackageServiceSlug}
          setSelectedSlug={setSelectedPackageServiceSlug}
        />
      )}

      {/* MODAL & DIALOG */}
      <ServiceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingService={editingService}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formSlug={formSlug}
        setFormSlug={setFormSlug}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formPrice={formPrice}
        setFormPrice={setFormPrice}
        formDays={formDays}
        setFormDays={setFormDays}
        formBadge={formBadge}
        setFormBadge={setFormBadge}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formFeatures={formFeatures}
        setFormFeatures={setFormFeatures}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        formImage={formImage}
        setFormImage={setFormImage}
        onSave={handleSaveServiceForm}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteService}
        title="Delete Core Service"
        message="Are you sure you want to remove this service? It will no longer appear on your public website catalog or homepage."
        confirmLabel="Delete Service"
        isDestructive={true}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Services...</div>}
    >
      <ServicesContent />
    </Suspense>
  );
}
