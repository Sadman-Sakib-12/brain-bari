"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Star,
  Tag,
  Sparkles,
  Layers
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialProducts from "@/data/products.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type ProductsTab = "all" | "categories" | "featured";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as ProductsTab) || "all";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<ProductsTab>(initialTab);
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("AI SaaS Tool");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [status, setStatus] = useState("Production Ready");
  const [demoUrl, setDemoUrl] = useState("https://");
  const [isFeatured, setIsFeatured] = useState(false);
  const [logoIcon, setLogoIcon] = useState("sparkles");
  const [logoColor, setLogoColor] = useState("bg-violet-600");
  const [logoBadge, setLogoBadge] = useState("BrainSuite");
  const [logoSubtitle, setLogoSubtitle] = useState("AI Automation Platform");

  const loadData = () => {
    try {
      const stored = adminStore.getProducts();
      if (stored && stored.length > 0) setProducts(stored);
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
    const tab = searchParams.get("tab") as ProductsTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAddProduct();
    } else if (tab && ["all", "categories", "featured"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = () => {
    adminStore.setProducts(products);
    setSaved(true);
    toast.success("Products catalog saved successfully!", {
      description: "Frontend /product catalog updated live."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setTitle("");
    setTagline("");
    setCategory("HealthTech");
    setDescription("");
    setFeaturesText("Real-Time API Sync\nAutomated Analytics Dashboard\nZero-Setup Webhooks");
    setStatus("Production Ready");
    setDemoUrl("https://health.brainbari.com/");
    setIsFeatured(false);
    setLogoIcon("sparkles");
    setLogoColor("bg-violet-600");
    setLogoBadge("BrainSuite");
    setLogoSubtitle("AI Automation Platform");
    setIsModalOpen(true);
  };

  const openEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setTitle(prod.title || "");
    setTagline(prod.tagline || "");
    setCategory(prod.category || "HealthTech");
    setDescription(prod.description || "");
    setFeaturesText(Array.isArray(prod.features) ? prod.features.join("\n") : (prod.features || ""));
    setStatus(prod.status || "Production Ready");
    setDemoUrl(prod.demoUrl || "https://");
    setIsFeatured(!!prod.isFeatured);
    setLogoIcon(prod.logo?.icon || "sparkles");
    setLogoColor(prod.logo?.color || "bg-violet-600");
    setLogoBadge(prod.logo?.badge || prod.title?.split(" ")[0] || "Product");
    setLogoSubtitle(prod.logo?.subtitle || prod.category || "AI Platform");
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!title.trim()) {
      toast.error("Product title is required");
      return;
    }

    const feats = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const logoObj = {
      icon: logoIcon,
      color: logoColor,
      badge: logoBadge.trim() || title.split(" ")[0] || "Product",
      subtitle: logoSubtitle.trim() || category
    };

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title,
            tagline,
            category,
            description,
            features: feats,
            status,
            demoUrl,
            isFeatured,
            logo: logoObj
          };
        }
        return p;
      });
      setProducts(updated);
      adminStore.setProducts(updated);
      toast.success(`Product "${title}" updated.`);
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        title,
        tagline,
        category,
        description,
        features: feats,
        status,
        demoUrl,
        isFeatured,
        logo: logoObj
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      adminStore.setProducts(updated);
      toast.success(`Product "${title}" created.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = products.filter((p) => p.id !== deleteConfirmId);
    setProducts(updated);
    adminStore.setProducts(updated);
    toast.success("Product deleted.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = (prodId: string) => {
    const updated = products.map((p) => {
      if (p.id === prodId) return { ...p, isFeatured: !p.isFeatured };
      return p;
    });
    setProducts(updated);
    adminStore.setProducts(updated);
    toast.info("Product featured status updated.");
  };

  const displayedProducts = activeTab === "featured" ? products.filter((p) => p.isFeatured) : products;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Products"
        title="Products Catalog Manager"
        description="Manage proprietary standalone software platforms, AI automation tools, and SaaS packages developed by Brain Bari."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
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
            { id: "all", label: "All Products", icon: Package, count: products.length },
            { id: "featured", label: "Featured Products", icon: Star, count: products.filter((p) => p.isFeatured).length },
            { id: "categories", label: "Categories", icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as ProductsTab);
                  router.push(tab.id === "all" ? "/products" : `/products?tab=${tab.id}`);
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

      {/* PRODUCTS CARDS GRID */}
      {activeTab !== "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(prod.id)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        prod.isFeatured
                          ? "bg-amber-50 text-amber-500 border-amber-200"
                          : "bg-white text-slate-300 hover:text-slate-400 border-slate-200"
                      }`}
                      title={prod.isFeatured ? "Featured" : "Click to feature"}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <StatusBadge status={prod.status || "Ready"} size="sm" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{prod.title}</h3>
                  {prod.tagline && (
                    <p className="text-xs font-medium text-indigo-600 mt-0.5">{prod.tagline}</p>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                {prod.features && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {(Array.isArray(prod.features) ? prod.features.slice(0, 3) : []).map(
                      (feat: string, i: number) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {prod.demoUrl ? (
                  <a
                    href={prod.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo Link</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Internal Tool</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditProduct(prod)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(prod.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "AI Chatbots Platform", desc: "Embeddable conversational agents with multichannel integrations.", count: "2 Products" },
            { name: "AI SaaS Automation Suite", desc: "Turnkey platforms for billing, scheduling, and customer data management.", count: "2 Products" },
            { name: "AI Health Awareness", desc: "Clinical pre-triage and diagnostic workflow assistants.", count: "1 Product" },
            { name: "Botbari Ballot", desc: "Secure digital voting and survey validation platform.", count: "1 Product" }
          ].map((cat, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                  {cat.count}
                </span>
              </div>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        subtitle="Manage product specifications and client showcase details."
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
              onClick={handleSaveForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Botbari AI Assistant Suite"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Product Tagline">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Next-Gen Enterprise Automation Engine"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="AI Chatbots Platform">AI Chatbots Platform</option>
                <option value="AI SaaS Automation Suite">AI SaaS Automation Suite</option>
                <option value="Custom AI Development Tools">Custom AI Development Tools</option>
                <option value="AI Health Info System">AI Health Info System</option>
              </select>
            </FormField>

            <FormField label="Release Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="Production Ready">Production Ready</option>
                <option value="Beta Live">Beta Live</option>
                <option value="Under Development">Under Development</option>
              </select>
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this product do for businesses?"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Key Features (One per line)">
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <FormField label="Live Demo URL">
            <input
              type="text"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          {/* Product Logo & Identity */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Product Logo &amp; Identity Badge</span>
            </h4>

            {/* Live Visual Preview */}
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3 w-max">
              <div className={`w-9 h-9 rounded-full ${logoColor} text-white flex items-center justify-center shrink-0 font-bold text-xs uppercase shadow-xs`}>
                {logoIcon.slice(0, 2)}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">{logoBadge || "Badge"}</span>
                <span className="text-[10px] text-slate-500 block">{logoSubtitle || "Subtitle"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Logo Icon">
                <select
                  value={logoIcon}
                  onChange={(e) => setLogoIcon(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
                >
                  <option value="heart">Heart (Healthcare / Wellness)</option>
                  <option value="eye">Eye (Ballot / Verification / Vision)</option>
                  <option value="message">Message (Legal / Chat / Counsel)</option>
                  <option value="book">Book (EduBari / Learning / Academy)</option>
                  <option value="sparkles">Sparkles (AI Suite / Innovation)</option>
                  <option value="shield">Shield (Security / Compliance)</option>
                </select>
              </FormField>

              <FormField label="Logo Color Style">
                <select
                  value={logoColor}
                  onChange={(e) => setLogoColor(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
                >
                  <option value="bg-rose-500">Rose Red (bg-rose-500)</option>
                  <option value="bg-blue-600">Blue (bg-blue-600)</option>
                  <option value="bg-indigo-600">Indigo (bg-indigo-600)</option>
                  <option value="bg-emerald-600">Emerald Green (bg-emerald-600)</option>
                  <option value="bg-violet-600">Violet Purple (bg-violet-600)</option>
                  <option value="bg-amber-500">Amber (bg-amber-500)</option>
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Logo Badge Label">
                <input
                  type="text"
                  value={logoBadge}
                  onChange={(e) => setLogoBadge(e.target.value)}
                  placeholder="e.g. HealthBari, BallotEye, LawBari"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </FormField>

              <FormField label="Logo Subtitle">
                <input
                  type="text"
                  value={logoSubtitle}
                  onChange={(e) => setLogoSubtitle(e.target.value)}
                  placeholder="e.g. AI Health Platform"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="prodFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="prodFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Mark as Featured Product
            </label>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be removed from the catalog."
        confirmLabel="Delete Product"
        isDestructive={true}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
