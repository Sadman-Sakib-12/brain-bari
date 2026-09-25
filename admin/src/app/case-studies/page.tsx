"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminStore } from "@/lib/store";
import initialCaseStudies from "@/data/caseStudies.json";
import initialCaseStudiesPage from "@/data/caseStudiesPage.json";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Table,
  LayoutGrid,
  TrendingUp,
  X,
  Layers,
  Code,
  Smartphone,
  Globe,
  Building2,
  Rocket,
  UserCheck,
  HelpCircle,
  Bot,
  Brain,
  Cpu,
  Sparkles,
  Palette,
  Star,
  MessageSquareQuote,
  Type,
  Search,
  Check,
  ExternalLink
} from "lucide-react";

// --- Enterprise SaaS Data Contracts ---
interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metrics: string;
  technologies: string[];
  featured: boolean;
  slug?: string;
}

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  text: string;
  rating: number;
}

interface CaseStudiesHero {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const AVAILABLE_ICONS = [
  { value: "Code", label: "Code (Engineering / Custom Dev)" },
  { value: "Smartphone", label: "Smartphone (Mobile Dev)" },
  { value: "Globe", label: "Globe (Web Apps)" },
  { value: "Building2", label: "Building2 (Enterprise Systems)" },
  { value: "Rocket", label: "Rocket (MVP / Startups)" },
  { value: "UserCheck", label: "UserCheck (CTO as a Service)" },
  { value: "HelpCircle", label: "HelpCircle (IT Consulting)" },
  { value: "Layers", label: "Layers (SaaS / Cloud)" },
  { value: "Bot", label: "Bot (Conversational AI)" },
  { value: "Brain", label: "Brain (NLP / Semantic Search)" },
  { value: "Cpu", label: "Cpu (Machine Learning)" },
  { value: "Sparkles", label: "Sparkles (Generative AI)" },
  { value: "Palette", label: "Palette (UI/UX Design)" }
];

const renderCapIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case "Code": return <Code className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Globe": return <Globe className={className} />;
    case "Building2": return <Building2 className={className} />;
    case "Rocket": return <Rocket className={className} />;
    case "UserCheck": return <UserCheck className={className} />;
    case "HelpCircle": return <HelpCircle className={className} />;
    case "Layers": return <Layers className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Brain": return <Brain className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Palette": return <Palette className={className} />;
    default: return <Code className={className} />;
  }
};

type ActiveTab = "studies" | "capabilities" | "testimonials" | "hero";

export default function CaseStudiesCmsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("studies");

  // Core Datasets
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies as CaseStudy[]);
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>(
    (initialCaseStudiesPage.capabilities || []) as CapabilityItem[]
  );
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    (initialCaseStudiesPage.testimonials || []) as TestimonialItem[]
  );
  const [hero, setHero] = useState<CaseStudiesHero>(
    initialCaseStudiesPage.hero || {
      badge: "Solutions & Capabilities",
      title: "What product do you want to",
      titleHighlight: "build?",
      description: "Delivering value with tailored software solutions. Brain Bari is your trusted software and AI development partner.",
      buttonText: "Start Your Solution",
      buttonLink: "/order"
    }
  );

  // Search & Filter States
  const [csSearch, setCsSearch] = useState("");
  const [capSearch, setCapSearch] = useState("");
  const [capCategoryFilter, setCapCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Feedback State
  const [saved, setSaved] = useState(false);

  // Modal State: Case Studies
  const [isCsModalOpen, setIsCsModalOpen] = useState(false);
  const [editingCsIdx, setEditingCsIdx] = useState<number | null>(null);
  const [csFormData, setCsFormData] = useState<CaseStudy>({
    id: "",
    title: "",
    client: "",
    category: "AI SaaS & Automation",
    metrics: "",
    description: "",
    technologies: [],
    featured: false
  });
  const [techInput, setTechInput] = useState("");

  // Modal State: Capabilities
  const [isCapModalOpen, setIsCapModalOpen] = useState(false);
  const [editingCapIdx, setEditingCapIdx] = useState<number | null>(null);
  const [capFormData, setCapFormData] = useState<CapabilityItem>({
    id: "",
    title: "",
    description: "",
    icon: "Code",
    category: "Engineering"
  });

  // Modal State: Testimonials
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState<number | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<TestimonialItem>({
    id: "",
    name: "",
    company: "",
    text: "",
    rating: 5
  });

  const loadData = useCallback(() => {
    try {
      const storedStudies = adminStore.getCaseStudies();
      if (storedStudies && Array.isArray(storedStudies)) {
        setCaseStudies(storedStudies as CaseStudy[]);
      }

      const storedPage = adminStore.getCaseStudiesPage();
      if (storedPage) {
        if (storedPage.capabilities) setCapabilities(storedPage.capabilities as CapabilityItem[]);
        if (storedPage.testimonials) setTestimonials(storedPage.testimonials as TestimonialItem[]);
        if (storedPage.hero) setHero(storedPage.hero as CaseStudiesHero);
      }
    } catch (e) {
      console.error("Error loading case studies data:", e);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, [loadData]);

  const handleSaveAll = () => {
    adminStore.setCaseStudies(caseStudies as any);
    adminStore.setCaseStudiesPage({
      hero,
      capabilities,
      testimonials
    } as any);

    setSaved(true);
    toast.success("Case Studies CMS updated successfully!", {
      description: "Live synchronization across Frontend and Admin is active."
    });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetAll = () => {
    if (confirm("Reset all Case Studies, Capabilities, and Testimonials back to initial defaults?")) {
      setCaseStudies(initialCaseStudies as CaseStudy[]);
      setCapabilities((initialCaseStudiesPage.capabilities || []) as CapabilityItem[]);
      setTestimonials((initialCaseStudiesPage.testimonials || []) as TestimonialItem[]);
      setHero(initialCaseStudiesPage.hero);

      adminStore.setCaseStudies(initialCaseStudies);
      adminStore.setCaseStudiesPage(initialCaseStudiesPage as any);
      toast.info("Content reset to initial defaults.");
    }
  };

  // Filtered Capabilities
  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((cap) => {
      const matchesSearch =
        cap.title.toLowerCase().includes(capSearch.toLowerCase()) ||
        cap.description.toLowerCase().includes(capSearch.toLowerCase()) ||
        cap.category.toLowerCase().includes(capSearch.toLowerCase());
      const matchesCategory =
        capCategoryFilter === "ALL" ||
        cap.category.toLowerCase() === capCategoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [capabilities, capSearch, capCategoryFilter]);

  // Unique categories for filtering
  const uniqueCategories = useMemo(() => {
    const cats = new Set(capabilities.map((c) => c.category));
    return ["ALL", ...Array.from(cats)];
  }, [capabilities]);

  // Filtered Case Studies
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      return (
        cs.title.toLowerCase().includes(csSearch.toLowerCase()) ||
        (cs.client && cs.client.toLowerCase().includes(csSearch.toLowerCase())) ||
        cs.category.toLowerCase().includes(csSearch.toLowerCase()) ||
        (cs.technologies && cs.technologies.some((t) => t.toLowerCase().includes(csSearch.toLowerCase())))
      );
    });
  }, [caseStudies, csSearch]);

  // --- Case Studies Actions ---
  const openAddCsModal = () => {
    setEditingCsIdx(null);
    setCsFormData({
      id: `cs-${Date.now()}`,
      title: "",
      client: "",
      category: "Enterprise AI",
      metrics: "",
      description: "",
      technologies: [],
      featured: false
    });
    setTechInput("");
    setIsCsModalOpen(true);
  };

  const openEditCsModal = (cs: CaseStudy, idx: number) => {
    setEditingCsIdx(idx);
    setCsFormData({
      id: cs.id || `cs-${Date.now()}`,
      title: cs.title || "",
      client: cs.client || "",
      category: cs.category || "Enterprise AI",
      metrics: cs.metrics || "",
      description: cs.description || "",
      technologies: cs.technologies || [],
      featured: !!cs.featured
    });
    setTechInput((cs.technologies || []).join(", "));
    setIsCsModalOpen(true);
  };

  const handleCsModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csFormData.title.trim()) {
      toast.error("Please enter a case study title");
      return;
    }

    const payload: CaseStudy = {
      ...csFormData,
      technologies: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    };

    let updated: CaseStudy[];
    if (editingCsIdx !== null) {
      updated = [...caseStudies];
      updated[editingCsIdx] = payload;
      toast.success(`Updated "${payload.title}"`);
    } else {
      updated = [payload, ...caseStudies];
      toast.success(`Added "${payload.title}"`);
    }

    setCaseStudies(updated);
    adminStore.setCaseStudies(updated as any);
    setIsCsModalOpen(false);
  };

  const handleDeleteCs = (idx: number, title: string) => {
    if (confirm(`Remove case study "${title}"?`)) {
      const updated = caseStudies.filter((_, i) => i !== idx);
      setCaseStudies(updated);
      adminStore.setCaseStudies(updated as any);
      toast.success("Case study removed");
    }
  };

  // --- Capabilities Actions ---
  const openAddCapModal = () => {
    setEditingCapIdx(null);
    setCapFormData({
      id: `cap-${Date.now()}`,
      title: "",
      description: "",
      icon: "Code",
      category: "Engineering"
    });
    setIsCapModalOpen(true);
  };

  const openEditCapModal = (cap: CapabilityItem, idx: number) => {
    setEditingCapIdx(idx);
    setCapFormData({
      id: cap.id || `cap-${idx + 1}`,
      title: cap.title || "",
      description: cap.description || "",
      icon: cap.icon || "Code",
      category: cap.category || "Engineering"
    });
    setIsCapModalOpen(true);
  };

  const handleCapModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capFormData.title.trim()) {
      toast.error("Please enter a capability title");
      return;
    }

    let updated: CapabilityItem[];
    if (editingCapIdx !== null) {
      updated = [...capabilities];
      updated[editingCapIdx] = capFormData;
      toast.success(`Updated capability "${capFormData.title}"`);
    } else {
      updated = [...capabilities, capFormData];
      toast.success(`Added capability "${capFormData.title}"`);
    }

    setCapabilities(updated);
    adminStore.setCaseStudiesPage({
      hero,
      capabilities: updated,
      testimonials
    } as any);
    setIsCapModalOpen(false);
  };

  const handleDeleteCap = (idx: number, title: string) => {
    if (confirm(`Remove capability card "${title}"?`)) {
      const updated = capabilities.filter((_, i) => i !== idx);
      setCapabilities(updated);
      adminStore.setCaseStudiesPage({
        hero,
        capabilities: updated,
        testimonials
      } as any);
      toast.success("Capability card removed");
    }
  };

  // --- Testimonials Actions ---
  const openAddTestimonialModal = () => {
    setEditingTestimonialIdx(null);
    setTestimonialFormData({
      id: `test-${Date.now()}`,
      name: "",
      company: "",
      text: "",
      rating: 5
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (t: TestimonialItem, idx: number) => {
    setEditingTestimonialIdx(idx);
    setTestimonialFormData({
      id: t.id || `test-${idx + 1}`,
      name: t.name || "",
      company: t.company || "",
      text: t.text || "",
      rating: t.rating || 5
    });
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormData.name.trim()) {
      toast.error("Please enter client name");
      return;
    }

    let updated: TestimonialItem[];
    if (editingTestimonialIdx !== null) {
      updated = [...testimonials];
      updated[editingTestimonialIdx] = testimonialFormData;
      toast.success(`Updated review from ${testimonialFormData.name}`);
    } else {
      updated = [...testimonials, testimonialFormData];
      toast.success(`Added review from ${testimonialFormData.name}`);
    }

    setTestimonials(updated);
    adminStore.setCaseStudiesPage({
      hero,
      capabilities,
      testimonials: updated
    } as any);
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (idx: number, name: string) => {
    if (confirm(`Remove testimonial from "${name}"?`)) {
      const updated = testimonials.filter((_, i) => i !== idx);
      setTestimonials(updated);
      adminStore.setCaseStudiesPage({
        hero,
        capabilities,
        testimonials: updated
      } as any);
      toast.success("Testimonial removed");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* SaaS Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Resources</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Case Studies CMS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Briefcase className="w-6 h-6 text-slate-800" />
            <span>Case Studies &amp; Capabilities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise content management for public frontend /resources/case-studies page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="http://localhost:3000/resources/case-studies"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Page</span>
          </a>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
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

          <button
            type="button"
            onClick={handleResetAll}
            title="Reset to defaults"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* KPI Overview Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Case Studies
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {caseStudies.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Deliverables Catalog</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Capabilities
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {capabilities.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Development Offerings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-100">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Client Reviews
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {testimonials.length}
            </span>
            <span className="text-[10px] text-amber-600 font-medium inline-flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current" /> 5.0 Star Rating
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Sync Engine
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-900">Active</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Disk &amp; Frontend Live</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Check className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav aria-label="CMS Tabs" className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("studies")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "studies"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Featured Case Studies</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "studies" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {caseStudies.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("capabilities")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "capabilities"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Development Capabilities</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "capabilities" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {capabilities.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "testimonials"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Client Testimonials</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "testimonials" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {testimonials.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "hero"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Hero &amp; Header</span>
        </button>
      </nav>

      {/* ================= TAB 1: FEATURED CASE STUDIES ================= */}
      {activeTab === "studies" && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={csSearch}
                onChange={(e) => setCsSearch(e.target.value)}
                placeholder="Search case studies, clients, tech..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 border border-slate-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 border border-slate-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>

              <button
                type="button"
                onClick={openAddCsModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Case Study</span>
              </button>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCaseStudies.map((cs, idx) => (
                <article
                  key={cs.id || `cs-${idx}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {cs.category || "AI Solution"}
                      </span>
                      {cs.metrics && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span>{cs.metrics}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {cs.title}
                      </h3>
                      {cs.client && (
                        <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                          Client: <strong className="text-slate-700">{cs.client}</strong>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {cs.description}
                    </p>

                    {cs.technologies && cs.technologies.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {cs.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-medium border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <footer className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {cs.id}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditCsModal(cs, idx)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCs(idx, cs.title)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete case study"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </footer>
                </article>
              ))}

              {filteredCaseStudies.length === 0 && (
                <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
                  No case studies matched your search query.
                </div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-5">Title</th>
                      <th className="py-3 px-5">Client</th>
                      <th className="py-3 px-5">Category</th>
                      <th className="py-3 px-5">Metrics</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCaseStudies.map((cs, idx) => (
                      <tr key={cs.id || `table-cs-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-5 font-bold text-slate-900">{cs.title}</td>
                        <td className="py-3 px-5 text-slate-700 font-medium">{cs.client || "—"}</td>
                        <td className="py-3 px-5">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                            {cs.category}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-emerald-700 font-medium">
                          {cs.metrics || "—"}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditCsModal(cs, idx)}
                              className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCs(idx, cs.title)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= TAB 2: DEVELOPMENT CAPABILITIES ================= */}
      {activeTab === "capabilities" && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={capSearch}
                onChange={(e) => setCapSearch(e.target.value)}
                placeholder="Search capabilities by name, description..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCapCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                    capCategoryFilter === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                type="button"
                onClick={openAddCapModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer active:scale-95 ml-auto md:ml-2 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Capability</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCapabilities.map((cap, idx) => (
              <article
                key={cap.id || `cap-${idx}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 flex items-center justify-center">
                      {renderCapIcon(cap.icon)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                      {cap.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {cap.description}
                  </p>
                </div>

                <footer className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Icon: {cap.icon}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditCapModal(cap, idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCap(idx, cap.title)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete capability"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </footer>
              </article>
            ))}

            {filteredCapabilities.length === 0 && (
              <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
                No capabilities matched your filter or search criteria.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= TAB 3: CLIENT TESTIMONIALS ================= */}
      {activeTab === "testimonials" && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Client Testimonials &amp; Reviews ({testimonials.length})
              </h2>
              <p className="text-xs text-slate-500">
                Shown in the 3-column &quot;What our clients say about our work&quot; section on the frontend.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddTestimonialModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((item, idx) => (
              <article
                key={item.id || `test-${idx}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic mb-3">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <footer className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.company}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditTestimonialModal(item, idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(idx, item.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= TAB 4: HERO & HEADER ================= */}
      {activeTab === "hero" && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hero Section Content</h2>
              <p className="text-xs text-slate-500">
                Customize the headline, gradient highlight, description, and action button on the case studies page.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={hero.badge}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                  placeholder="Solutions & Capabilities"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    placeholder="What product do you want to"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Title Highlight (Gradient Word)
                  </label>
                  <input
                    type="text"
                    value={hero.titleHighlight}
                    onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                    placeholder="build?"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  placeholder="Delivering value with tailored software solutions..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={hero.buttonText}
                    onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                    placeholder="Start Your Solution"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={hero.buttonLink}
                    onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
                    placeholder="/order"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Hero Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#ebe8fd] border border-purple-200/80 rounded-2xl p-6 flex flex-col justify-between text-center shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2.5 py-1 rounded-full inline-block mb-4">
                {hero.badge || "Solutions & Capabilities"}
              </span>

              <h3 className="text-xl font-black text-gray-950 tracking-tight leading-snug mb-2">
                {hero.title || "What product do you want to"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {hero.titleHighlight || "build?"}
                </span>
              </h3>

              <p className="text-xs text-gray-700 leading-relaxed mb-6">
                {hero.description}
              </p>
            </div>

            <div>
              <div className="inline-block px-6 py-2.5 bg-[#602b0c] text-white rounded-full font-bold text-xs shadow-xs">
                {hero.buttonText || "Start Your Solution"}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Live Preview matching frontend</p>
            </div>
          </div>
        </section>
      )}

      {/* ================= MODAL: CASE STUDY ================= */}
      {isCsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingCsIdx !== null ? "Edit Case Study" : "Add New Case Study"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCsModalSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={csFormData.title}
                  onChange={(e) => setCsFormData({ ...csFormData, title: e.target.value })}
                  placeholder="e.g. Enterprise Multilingual Support Automation"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Client Name / Industry
                  </label>
                  <input
                    type="text"
                    value={csFormData.client}
                    onChange={(e) => setCsFormData({ ...csFormData, client: e.target.value })}
                    placeholder="e.g. Apex Global Bank"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={csFormData.category}
                    onChange={(e) => setCsFormData({ ...csFormData, category: e.target.value })}
                    placeholder="e.g. AI Automation"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Measurable Impact / Metrics
                </label>
                <input
                  type="text"
                  value={csFormData.metrics}
                  onChange={(e) => setCsFormData({ ...csFormData, metrics: e.target.value })}
                  placeholder="e.g. 74% Response Time Reduction, 99.8% Accuracy"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Deliverables &amp; Impact Description
                </label>
                <textarea
                  rows={3}
                  value={csFormData.description}
                  onChange={(e) => setCsFormData({ ...csFormData, description: e.target.value })}
                  placeholder="Detailed breakdown of how the solution was delivered and key business results..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Technologies Used (Comma Separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Next.js, Python FastAPI, LangChain, GPT-4o, PostgreSQL"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingCsIdx !== null ? "Update Case Study" : "Add Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CAPABILITY ================= */}
      {isCapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingCapIdx !== null ? "Edit Capability" : "Add New Capability"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCapModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCapModalSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Capability Title *
                </label>
                <input
                  type="text"
                  required
                  value={capFormData.title}
                  onChange={(e) => setCapFormData({ ...capFormData, title: e.target.value })}
                  placeholder="e.g. Custom software development"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={capFormData.category}
                    onChange={(e) => setCapFormData({ ...capFormData, category: e.target.value })}
                    placeholder="e.g. Engineering"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Display Icon
                  </label>
                  <select
                    value={capFormData.icon}
                    onChange={(e) => setCapFormData({ ...capFormData, icon: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={capFormData.description}
                  onChange={(e) => setCapFormData({ ...capFormData, description: e.target.value })}
                  placeholder="Describe this development capability and what value it delivers..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCapModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingCapIdx !== null ? "Update Capability" : "Add Capability"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TESTIMONIAL ================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingTestimonialIdx !== null ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTestimonialModalSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialFormData.name}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                    placeholder="e.g. Mizanur Rahman"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={testimonialFormData.company}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, company: e.target.value })}
                    placeholder="e.g. London Oxford Tax"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={testimonialFormData.rating}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Client Review / Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialFormData.text}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, text: e.target.value })}
                  placeholder="Brain Bari delivered our system with flawless precision..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingTestimonialIdx !== null ? "Update Testimonial" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
