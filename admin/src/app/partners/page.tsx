"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Handshake, Plus, Save, Tag, Sparkles, ExternalLink } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import PartnerModal, { PARTNER_CATEGORIES } from "./components/PartnerModal";
import PartnersListTab from "./components/PartnersListTab";
import PartnerCategoriesTab from "./components/PartnerCategoriesTab";
import PartnerHeroTab from "./components/PartnerHeroTab";

type PartnersTab = "partners" | "hero" | "categories";

function PartnersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as PartnersTab) || "partners";

  const [activeTab, setActiveTab] = useState<PartnersTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [pageCms, setPageCms] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [type, setType] = useState("Strategic Integration");
  const [status, setStatus] = useState("Active Partner");
  const [website, setWebsite] = useState("https://");
  const [logoInitials, setLogoInitials] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  const loadData = async () => {
    try {
      const fresh = await adminApi.getContent("partners");
      if (fresh && Array.isArray(fresh)) {
        setPartners(fresh);
      }

      const freshPage = await adminApi.getContent("partnersPage");
      if (freshPage) {
        setPageCms(freshPage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const openAdd = () => {
    setEditingPartner(null);
    setName("");
    setType("Strategic Integration");
    setStatus("Active Partner");
    setWebsite("https://");
    setLogoInitials("TB");
    setLogoUrl("");
    setDescription("");
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as PartnersTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["partners", "hero", "categories"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = async () => {
    try {
      await adminApi.saveContent("partners", partners);
      setSaved(true);
      toast.success("Partners network saved successfully to database!", {
        description: "Frontend /resources/partners page updated live.",
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save partners to database.");
    }
  };

  const openEdit = (p: any) => {
    setEditingPartner(p);
    setName(p.name || "");
    setType(p.type || "Strategic Integration");
    setStatus(p.status || "Active Partner");
    setWebsite(p.website || "https://");
    setLogoInitials(p.logoInitials || p.name?.slice(0, 2)?.toUpperCase() || "BB");
    setLogoUrl(p.logoUrl || "");
    setDescription(p.description || "");
    setIsFeatured(!!p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveForm = async () => {
    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }

    let updated: any[];
    if (editingPartner) {
      updated = partners.map((p) => {
        if (p.id === editingPartner.id) {
          return {
            ...p,
            name,
            type,
            status,
            website,
            logoInitials,
            logoUrl,
            description,
            isFeatured,
          };
        }
        return p;
      });
      toast.success(`Partner "${name}" updated.`);
    } else {
      const newPartner = {
        id: `pt-${Date.now()}`,
        name,
        type,
        status,
        website,
        logoInitials: logoInitials || name.slice(0, 2).toUpperCase(),
        logoUrl,
        joinedDate: new Date().toISOString().split("T")[0],
        description,
        isFeatured,
      };
      updated = [newPartner, ...partners];
      toast.success(`Partner "${name}" added.`);
    }

    setPartners(updated);
    await adminApi.saveContent("partners", updated).catch(() => {});
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const updated = partners.filter((p) => p.id !== deleteConfirmId);
    setPartners(updated);
    await adminApi.saveContent("partners", updated).catch(() => {});
    toast.success("Partner removed.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = async (ptId: string) => {
    const updated = partners.map((p) => {
      if (p.id === ptId) return { ...p, isFeatured: !p.isFeatured };
      return p;
    });
    setPartners(updated);
    await adminApi.saveContent("partners", updated).catch(() => {});
    toast.info("Partner featured status updated.");
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
        badge="Enterprise CMS / Partners"
        title="Partners &amp; Collaborators"
        description="Manage technology alliances and partner networks. Managed Frontend Section: Resources → Partners Page (/resources/partners)."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="http://localhost:3000/resources/partners"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview Live /partners Page</span>
            </a>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>{saved ? "Saved!" : "Save All"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "partners", label: "All Partners", icon: Handshake, count: partners.length },
            { id: "hero", label: "Hero & Value Cards", icon: Sparkles },
            { id: "categories", label: "Partner Categories", icon: Tag, count: PARTNER_CATEGORIES.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as PartnersTab);
                  router.push(tab.id === "partners" ? "/partners" : `/partners?tab=${tab.id}`);
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

      {/* TAB 1: ALL PARTNERS */}
      {activeTab === "partners" && (
        <PartnersListTab
          partners={partners}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          toggleFeatured={toggleFeatured}
          openEdit={openEdit}
          setDeleteConfirmId={setDeleteConfirmId}
        />
      )}

      {/* TAB 2: HERO & VALUE PILLARS */}
      {activeTab === "hero" && (
        <PartnerHeroTab
          pageCms={pageCms}
          setPageCms={setPageCms}
        />
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && <PartnerCategoriesTab partners={partners} />}

      {/* ADD / EDIT MODAL */}
      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingPartner={editingPartner}
        name={name}
        setName={setName}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
        website={website}
        setWebsite={setWebsite}
        logoInitials={logoInitials}
        setLogoInitials={setLogoInitials}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        description={description}
        setDescription={setDescription}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        onSave={handleSaveForm}
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Partner"
        message="Are you sure you want to remove this partner from the directory?"
        confirmLabel="Delete Partner"
        isDestructive={true}
      />
    </div>
  );
}

export default function PartnersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Partners...</div>}>
      <PartnersContent />
    </Suspense>
  );
}
