"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Handshake,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Building2,
  Globe,
  Tag,
  Star
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialPartners from "@/data/partners.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type PartnersTab = "partners" | "categories";

const PARTNER_CATEGORIES = [
  "Strategic Integration",
  "Technology Infrastructure",
  "Financial Systems",
  "Academic & Research",
  "Enterprise Client"
];

function PartnersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as PartnersTab) || "partners";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<PartnersTab>(initialTab);
  const [partners, setPartners] = useState<any[]>(initialPartners);
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
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  const loadData = () => {
    try {
      const stored = adminStore.getPartners();
      if (stored && stored.length > 0) setPartners(stored);
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
    const tab = searchParams.get("tab") as PartnersTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["partners", "categories"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = () => {
    adminStore.setPartners(partners);
    setSaved(true);
    toast.success("Partners network saved successfully!", {
      description: "Frontend /resources/partners page updated live."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const openAdd = () => {
    setEditingPartner(null);
    setName("");
    setType("Strategic Integration");
    setStatus("Active Partner");
    setWebsite("https://");
    setLogoInitials("TB");
    setDescription("");
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingPartner(p);
    setName(p.name || "");
    setType(p.type || "Strategic Integration");
    setStatus(p.status || "Active Partner");
    setWebsite(p.website || "https://");
    setLogoInitials(p.logoInitials || p.name?.slice(0, 2)?.toUpperCase() || "BB");
    setDescription(p.description || "");
    setIsFeatured(!!p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (editingPartner) {
      const updated = partners.map((p) => {
        if (p.id === editingPartner.id) {
          return {
            ...p,
            name,
            type,
            status,
            website,
            logoInitials,
            description,
            isFeatured
          };
        }
        return p;
      });
      setPartners(updated);
      adminStore.setPartners(updated);
      toast.success(`Partner "${name}" updated.`);
    } else {
      const newPartner = {
        id: `pt-${Date.now()}`,
        name,
        type,
        status,
        website,
        logoInitials: logoInitials || name.slice(0, 2).toUpperCase(),
        joinedDate: new Date().toISOString().split("T")[0],
        description,
        isFeatured
      };
      const updated = [newPartner, ...partners];
      setPartners(updated);
      adminStore.setPartners(updated);
      toast.success(`Partner "${name}" added.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = partners.filter((p) => p.id !== deleteConfirmId);
    setPartners(updated);
    adminStore.setPartners(updated);
    toast.success("Partner removed.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = (ptId: string) => {
    const updated = partners.map((p) => {
      if (p.id === ptId) return { ...p, isFeatured: !p.isFeatured };
      return p;
    });
    setPartners(updated);
    adminStore.setPartners(updated);
    toast.info("Partner featured status updated.");
  };

  const filteredPartners = partners.filter((p) => {
    if (selectedCategory === "All") return true;
    return (p.type || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Partners"
        title="Partners &amp; Collaborators"
        description="Manage technology alliances, institutional partnerships, and integration ecosystems displayed across the platform."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
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
            { id: "categories", label: "Partner Categories", icon: Tag, count: PARTNER_CATEGORIES.length }
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

      {/* TAB 1: ALL PARTNERS (LOGO CARDS / GRID PATTERN) */}
      {activeTab === "partners" && (
        <div className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", ...PARTNER_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0f172a] text-white border-slate-800"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Logo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPartners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    {/* Logo / Initials Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm border border-slate-800 tracking-wider">
                      {p.logoInitials || p.name?.slice(0, 2)?.toUpperCase() || "PT"}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                          p.isFeatured
                            ? "bg-amber-50 text-amber-500 border-amber-200"
                            : "bg-white text-slate-300 hover:text-slate-400 border-slate-200"
                        }`}
                        title={p.isFeatured ? "Featured Partner" : "Click to feature"}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      <StatusBadge status={p.status || "Active Partner"} size="sm" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {p.type || "Strategic Integration"}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || "Partner collaboration in advanced AI systems."}
                  </p>

                  {p.joinedDate && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      Partner since: {p.joinedDate}
                    </div>
                  )}
                </div>

                {/* Footer with Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Website</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No URL</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Edit Partner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                      title="Delete Partner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNER_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
                <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                  {partners.filter((p) => (p.type || "").toLowerCase() === cat.toLowerCase()).length} Partners
                </span>
              </div>
              <p className="text-xs text-slate-500">Official classification for strategic relationships.</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPartner ? "Edit Partner Details" : "Add New Partner"}
        subtitle="Manage company name, partnership tier, and external links."
        maxWidth="lg"
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
              onClick={handleSaveForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingPartner ? "Save Changes" : "Create Partner"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <FormField label="Company Name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Financial Labs"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category / Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                {PARTNER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="Active Partner">Active Partner</option>
                <option value="Prospective Partner">Prospective Partner</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Logo Badge Initials (2 Letters)">
              <input
                type="text"
                maxLength={3}
                value={logoInitials}
                onChange={(e) => setLogoInitials(e.target.value.toUpperCase())}
                placeholder="TB"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </FormField>

            <FormField label="Website URL">
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </FormField>
          </div>

          <FormField label="Partnership Description">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of collaboration or strategic integration details."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="partnerFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="partnerFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Feature logo on homepage partners ticker
            </label>
          </div>
        </div>
      </Modal>

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
