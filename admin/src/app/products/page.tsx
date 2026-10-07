"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Save,
  Star,
  Tag,
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import ProductModal from "./components/ProductModal";
import HeroSolutionsTab from "./components/HeroSolutionsTab";
import ProductCardsGrid from "./components/ProductCardsGrid";
import ProductCategoriesTab from "./components/ProductCategoriesTab";

type ProductsTab = "all" | "categories" | "featured" | "hero-solutions";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as ProductsTab) || "all";

  const [activeTab, setActiveTab] = useState<ProductsTab>(initialTab);
  const [products, setProducts] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  // Hero Solutions Showcase Cards (Loaded dynamically from database)
  const [heroCards, setHeroCards] = useState<any[]>([]);
  const [savingHeroCards, setSavingHeroCards] = useState(false);
  const [whyChooseTitle, setWhyChooseTitle] = useState("");
  const [whyChooseHighlight, setWhyChooseHighlight] = useState("");
  const [whyChooseFeatures, setWhyChooseFeatures] = useState<any[]>([]);

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
    adminApi.getProducts().then((res) => {
      setProducts(res || []);
    }).catch(() => {
      setProducts([]);
    });

    adminApi.getContent("productHeroSolutions").then((res) => {
      if (res) {
        if (Array.isArray(res.cards) && res.cards.length === 3) {
          setHeroCards(res.cards);
        }
        if (res.whyChooseTitle) setWhyChooseTitle(res.whyChooseTitle);
        if (res.whyChooseHighlight) setWhyChooseHighlight(res.whyChooseHighlight);
        if (Array.isArray(res.whyChooseFeatures)) setWhyChooseFeatures(res.whyChooseFeatures);
      }
    }).catch(() => { });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddProduct = () => {
    setEditingProduct(null);
    setTitle("");
    setTagline("");
    setCategory("AI Chatbots Platform");
    setDescription("");
    setFeaturesText("");
    setStatus("Production Ready");
    setDemoUrl("https://");
    setIsFeatured(false);
    setLogoIcon("sparkles");
    setLogoColor("bg-violet-600");
    setLogoBadge("BrainSuite");
    setLogoSubtitle("AI Automation Platform");
    setIsModalOpen(true);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as ProductsTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAddProduct();
    } else if (tab && ["all", "categories", "featured", "hero-solutions"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveHeroCards = async () => {
    setSavingHeroCards(true);
    try {
      const existing = (await adminApi.getContent("productHeroSolutions")) || {};
      await adminApi.saveContent("productHeroSolutions", {
        ...existing,
        cards: heroCards,
        whyChooseTitle,
        whyChooseHighlight,
        whyChooseFeatures: whyChooseFeatures.length > 0 ? whyChooseFeatures : existing.whyChooseFeatures,
      });
      toast.success("Hero Solutions Showcase saved successfully!", {
        description: "The 3 solution cards and why choose features on /product have been updated in NeonDB."
      });
    } catch (err: any) {
      toast.error("Failed to save hero solutions: " + (err.message || "Unknown error"));
    } finally {
      setSavingHeroCards(false);
    }
  };

  const updateHeroCard = (index: number, field: string, value: any) => {
    setHeroCards((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveAll = async () => {
    try {
      await adminApi.saveContent("products", products);
      setSaved(true);
      toast.success("Products catalog saved successfully to database!");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save products to database.");
    }
  };

  const openEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setTitle(prod.title || "");
    setTagline(prod.tagline || "");
    setCategory(prod.category || "AI Chatbots Platform");
    setDescription(prod.description || "");
    setFeaturesText(Array.isArray(prod.features) ? prod.features.join("\n") : "");
    setStatus(prod.status || "Production Ready");
    setDemoUrl(prod.demoUrl || "https://");
    setIsFeatured(!!prod.isFeatured);
    setLogoIcon(prod.logo?.icon || "sparkles");
    setLogoColor(prod.logo?.color || "bg-violet-600");
    setLogoBadge(prod.logo?.badge || prod.title || "BrainSuite");
    setLogoSubtitle(prod.logo?.subtitle || prod.tagline || "AI Platform");
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!title.trim()) {
      toast.error("Product title is required");
      return;
    }

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const logo = {
      icon: logoIcon,
      color: logoColor,
      badge: logoBadge || title,
      subtitle: logoSubtitle || tagline
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
            features,
            status,
            demoUrl,
            isFeatured,
            logo
          };
        }
        return p;
      });

      adminApi.updateProduct(editingProduct.id, {
        title,
        tagline,
        category,
        description,
        features,
        status,
        demoUrl,
        isFeatured,
        logo
      }).catch((err) => console.warn(err));

      setProducts(updated);
      toast.success(`Product "${title}" updated.`);
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        title,
        tagline,
        category,
        description,
        features,
        status,
        demoUrl,
        isFeatured,
        logo
      };

      adminApi.createProduct(newProd).catch((err) => console.warn(err));

      const updated = [newProd, ...products];
      setProducts(updated);
      toast.success(`Product "${title}" created.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    adminApi.deleteProduct(deleteConfirmId).catch((err) => console.warn(err));
    const updated = products.filter((p) => p.id !== deleteConfirmId);
    setProducts(updated);
    toast.success("Product deleted from catalog.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = (prodId: string) => {
    const updated = products.map((p) => {
      if (p.id === prodId) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    });
    setProducts(updated);
    toast.info("Featured status updated.");
  };

  const displayedProducts =
    activeTab === "featured"
      ? products.filter((p) => p.isFeatured)
      : products;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Products"
        title="Products Catalog Manager"
        description="Manage proprietary standalone software platforms. Managed Frontend Section: Products Page (/product & /products)."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
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
            { id: "hero-solutions", label: "Hero AI Solutions (3 Cards)", icon: Sparkles, count: 3 },
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
      {activeTab !== "categories" && activeTab !== "hero-solutions" && (
        <ProductCardsGrid
          products={displayedProducts}
          onToggleFeatured={toggleFeatured}
          onEdit={openEditProduct}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* CATEGORIES TAB */}
      {activeTab === "categories" && <ProductCategoriesTab />}

      {/* HERO SOLUTIONS SHOWCASE TAB */}
      {activeTab === "hero-solutions" && (
        <HeroSolutionsTab
          heroCards={heroCards}
          savingHeroCards={savingHeroCards}
          onSaveHeroCards={handleSaveHeroCards}
          onUpdateHeroCard={updateHeroCard}
          whyChooseTitle={whyChooseTitle}
          setWhyChooseTitle={setWhyChooseTitle}
          whyChooseHighlight={whyChooseHighlight}
          setWhyChooseHighlight={setWhyChooseHighlight}
          whyChooseFeatures={whyChooseFeatures}
          setWhyChooseFeatures={setWhyChooseFeatures}
        />
      )}

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        title={title}
        setTitle={setTitle}
        tagline={tagline}
        setTagline={setTagline}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        description={description}
        setDescription={setDescription}
        featuresText={featuresText}
        setFeaturesText={setFeaturesText}
        demoUrl={demoUrl}
        setDemoUrl={setDemoUrl}
        logoIcon={logoIcon}
        setLogoIcon={setLogoIcon}
        logoColor={logoColor}
        setLogoColor={setLogoColor}
        logoBadge={logoBadge}
        setLogoBadge={setLogoBadge}
        logoSubtitle={logoSubtitle}
        setLogoSubtitle={setLogoSubtitle}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        onSave={handleSaveForm}
      />

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
