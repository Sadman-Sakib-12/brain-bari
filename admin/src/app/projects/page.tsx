"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  Layers,
  Building,
  Calendar,
  Sparkles,
  Tag,
  Briefcase,
  Quote
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialPortfolio from "@/data/portfolio.json";
import initialCaseStudies from "@/data/caseStudies.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type ProjectsTab = "all" | "categories" | "case-studies";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as ProjectsTab) || "all";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<ProjectsTab>(initialTab);
  const [projects, setProjects] = useState<any[]>(initialPortfolio);
  const [caseStudies, setCaseStudies] = useState<any[]>(initialCaseStudies);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("AI & Automation");
  const [client, setClient] = useState("");
  const [year, setYear] = useState("2026");
  const [timeline, setTimeline] = useState("3 Weeks");
  const [status, setStatus] = useState("Live Platform");
  const [statusColor, setStatusColor] = useState("emerald");
  const [shortDesc, setShortDesc] = useState("");
  const [overview, setOverview] = useState("");
  const [metrics, setMetrics] = useState("30% Faster Resolution");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [liveUrl, setLiveUrl] = useState("https://");
  const [techStack, setTechStack] = useState<string[]>(["Next.js", "AI"]);
  const [techInput, setTechInput] = useState("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [testimonial, setTestimonial] = useState<{ quote: string; author: string; role: string; company?: string }>({
    quote: "",
    author: "",
    role: "",
    company: ""
  });

  const loadData = () => {
    try {
      const stored = adminStore.getPortfolio();
      if (stored && stored.length > 0) setProjects(stored);
      const storedCases = adminStore.getCaseStudies();
      if (storedCases && storedCases.length > 0) setCaseStudies(storedCases);
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
    const tab = searchParams.get("tab") as ProjectsTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAddProject();
    } else if (tab && ["all", "categories", "case-studies"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = () => {
    adminStore.setPortfolio(projects);
    adminStore.setCaseStudies(caseStudies);
    setSaved(true);
    toast.success("Projects and case studies saved!", {
      description: "Frontend portfolio and showcase updated live."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const openAddProject = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory("Enterprise AI");
    setClient("");
    setYear("2026");
    setTimeline("3 Weeks");
    setStatus("Live Platform");
    setStatusColor("emerald");
    setShortDesc("Comprehensive enterprise automation system built with Brain Bari AI technology.");
    setOverview("Engineered scalable edge-first architecture to automate core business operations.");
    setMetrics("75% Cost Reduction");
    setChallenge("Manual client workload and slow triage response times.");
    setSolution("Engineered domain-tuned AI workflow with automated data pipelines.");
    setResults("Reduced customer wait times by 75% and automated 10,000+ monthly queries.");
    setImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80");
    setIsFeatured(true);
    setLiveUrl("https://botbari.com");
    setTechStack(["Next.js", "Tailwind CSS", "TypeScript", "AI Engine"]);
    setTechInput("");
    setKeyFeatures([
      "Automated Real-Time AI Decision Pipeline",
      "Interactive Real-Time Telemetry Dashboard",
      "Bank-Grade Security & Encrypted User Sessions"
    ]);
    setFeatureInput("");
    setTestimonial({
      quote: "Brain Bari delivered beyond expectations with exceptional speed and technical precision.",
      author: "Enterprise Partner",
      role: "Chief Technology Officer",
      company: "Global Tech"
    });
    setIsModalOpen(true);
  };

  const openEditProject = (proj: any) => {
    setEditingProject(proj);
    setTitle(proj.title || "");
    setSlug(proj.slug || "");
    setCategory(proj.category || "Enterprise AI");
    setClient(proj.client || "");
    setYear(proj.year || "2026");
    setTimeline(proj.timeline || "3 Weeks");
    setStatus(proj.status || "Live Platform");
    setStatusColor(proj.statusColor || "emerald");
    setShortDesc(proj.shortDesc || "");
    setOverview(proj.overview || "");
    setMetrics(proj.metrics || "");
    setChallenge(proj.challenge || "");
    setSolution(proj.solution || "");
    setResults(proj.results || "");
    setImage(proj.image || "");
    setIsFeatured(!!proj.isFeatured);
    setLiveUrl(proj.liveUrl || "https://");
    const stack = Array.isArray(proj.techStack)
      ? proj.techStack
      : typeof proj.techStack === "string"
      ? [proj.techStack]
      : ["Next.js", "AI"];
    setTechStack(stack);
    setTechInput("");
    setKeyFeatures(Array.isArray(proj.keyFeatures) ? proj.keyFeatures : []);
    setFeatureInput("");
    setTestimonial({
      quote: proj.testimonial?.quote || "",
      author: proj.testimonial?.author || "",
      role: proj.testimonial?.role || "",
      company: proj.testimonial?.company || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveProjectForm = () => {
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const projectSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const validTechStack = Array.isArray(techStack) && techStack.length > 0 ? techStack : ["Next.js", "AI"];
    const validKeyFeatures = Array.isArray(keyFeatures) ? keyFeatures.filter(Boolean) : [];
    const validTestimonial = testimonial.quote.trim() ? testimonial : undefined;

    if (editingProject) {
      const updated = projects.map((p) => {
        if (p.id === editingProject.id || p.slug === editingProject.slug) {
          return {
            ...p,
            title,
            slug: projectSlug,
            category,
            client,
            year,
            timeline,
            status,
            statusColor,
            shortDesc,
            overview,
            metrics,
            challenge,
            solution,
            results,
            image,
            isFeatured,
            liveUrl,
            techStack: validTechStack,
            keyFeatures: validKeyFeatures,
            ...(validTestimonial ? { testimonial: validTestimonial } : {})
          };
        }
        return p;
      });
      setProjects(updated);
      adminStore.setPortfolio(updated);
      toast.success(`Project "${title}" updated.`);
    } else {
      const newProj = {
        id: `proj-${Date.now()}`,
        title,
        slug: projectSlug,
        category,
        client,
        year,
        timeline,
        status,
        statusColor,
        shortDesc,
        overview,
        metrics,
        challenge,
        solution,
        results,
        image,
        isFeatured,
        liveUrl,
        techStack: validTechStack,
        keyFeatures: validKeyFeatures,
        ...(validTestimonial ? { testimonial: validTestimonial } : {})
      };
      const updated = [newProj, ...projects];
      setProjects(updated);
      adminStore.setPortfolio(updated);
      toast.success(`Project "${title}" added to portfolio.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProject = () => {
    if (!deleteConfirmId) return;
    const updated = projects.filter((p) => p.id !== deleteConfirmId && p.slug !== deleteConfirmId);
    setProjects(updated);
    adminStore.setPortfolio(updated);
    toast.success("Project deleted from portfolio.");
    setDeleteConfirmId(null);
  };

  const toggleFeatured = (projId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projId || p.slug === projId) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    });
    setProjects(updated);
    adminStore.setPortfolio(updated);
    toast.info("Featured status updated.");
  };

  const categories = ["All", "AI & Automation", "SaaS Platform", "Web Applications", "Enterprise Systems"];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "All") return true;
    return (p.category || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Projects"
        title="Projects &amp; Case Studies"
        description="Manage the public portfolio, case studies, verified client metrics, and live project demonstrations."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
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
        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Projects", icon: FolderGit2, count: projects.length },
            { id: "categories", label: "Categories", icon: Tag },
            { id: "case-studies", label: "Case Studies", icon: Briefcase, count: caseStudies.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as ProjectsTab);
                  router.push(tab.id === "all" ? "/projects" : `/projects?tab=${tab.id}`);
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

      {/* TAB 1: ALL PROJECTS (PROJECT CARDS / GRID PATTERN) */}
      {activeTab === "all" && (
        <div className="space-y-5">
          {/* Categories Pill Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
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

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id || proj.slug}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors group"
              >
                {/* Thumbnail Header */}
                <div className="relative h-44 bg-slate-100 border-b border-slate-100 overflow-hidden">
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FolderGit2 className="w-8 h-8" />
                    </div>
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                      {proj.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(proj.id || proj.slug)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors backdrop-blur-xs ${
                        proj.isFeatured
                          ? "bg-amber-500/90 text-white border-amber-400"
                          : "bg-slate-950/60 text-slate-300 hover:text-white border-slate-700"
                      }`}
                      title={proj.isFeatured ? "Featured" : "Click to feature"}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3 flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-medium">
                      <span>{proj.client || "Enterprise Client"}</span>
                      <span>{proj.year || "2026"}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">
                      {proj.title}
                    </h3>
                  </div>

                  {proj.metrics && (
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      🎯 {proj.metrics}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {proj.results || proj.solution || proj.challenge || "No description."}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {proj.status || "Live"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                        title="Open Live URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditProject(proj)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(proj.id || proj.slug)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                      title="Delete Project"
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
          {[
            { name: "AI & Automation", count: "4 Projects", desc: "Autonomous bots, RAG assistants, and process workflow engines." },
            { name: "SaaS Platform", count: "3 Projects", desc: "Multi-tenant cloud architectures, billing systems, and analytics." },
            { name: "Web Applications", count: "3 Projects", desc: "Modern full-stack web platforms and interactive user portals." },
            { name: "Enterprise Systems", count: "2 Projects", desc: "Custom internal tooling, security pipelines, and compliance suites." }
          ].map((cat, i) => (
            <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                  {cat.count}
                </span>
              </div>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CASE STUDIES */}
      {activeTab === "case-studies" && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">In-Depth Case Studies</h3>
              <p className="text-xs text-slate-500">Detailed technical analysis and client testimonial reports.</p>
            </div>
            <button
              type="button"
              onClick={openAddProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Case Study</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudies.map((cs) => (
              <div key={cs.id || cs.title} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {cs.industry || "Client Case"}
                  </span>
                  <span className="text-xs text-slate-400">{cs.year || "2026"}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{cs.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {cs.description || cs.summary || cs.results}
                </p>

                {cs.quote && (
                  <blockquote className="p-2.5 bg-slate-50 border-l-2 border-indigo-600 rounded-r-lg text-[11px] text-slate-600 italic">
                    "{cs.quote}"
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project Details" : "Add New Project"}
        subtitle="Manage client name, key performance metrics, and case study narrative."
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
              onClick={handleSaveProjectForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingProject ? "Save Changes" : "Create Project"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TaxBot AI Platform"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Slug (URL identifier)">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="taxbot-ai-platform"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Client / Partner">
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="CarePoint Hospital"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="AI & Automation">AI &amp; Automation</option>
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="Web Applications">Web Applications</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
              </select>
            </FormField>

            <FormField label="Year">
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <FormField label="Short Card Summary (shortDesc)" required>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Comprehensive enterprise automation system built with Brain Bari AI technology."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Detailed Case Study Overview">
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Detailed description of the problem space, client scale, and technical scope..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project Timeline / Turnaround">
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 4 Weeks (Concept to Deployment)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Status Badge Color">
              <select
                value={statusColor}
                onChange={(e) => setStatusColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="emerald">Emerald (Active / Live Platform)</option>
                <option value="amber">Amber (AI Agent Active)</option>
                <option value="cyan">Cyan (Market Sync Live)</option>
                <option value="purple">Purple (Enterprise Deployment)</option>
                <option value="blue">Blue (Production Beta)</option>
              </select>
            </FormField>
          </div>

          <FormField label="Key Result / Metric Highlight">
            <input
              type="text"
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="e.g. 75% Faster Resolution & 10k Monthly Queries"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-emerald-700"
            />
          </FormField>

          <FormField label="Problem / Challenge">
            <textarea
              rows={2}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="What obstacle did the client face?"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Brain Bari Engineered Solution">
            <textarea
              rows={2}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="How did our AI team resolve it?"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Measurable Proven Results">
            <textarea
              rows={2}
              value={results}
              onChange={(e) => setResults(e.target.value)}
              placeholder="Specific quantifiable business outcome..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          {/* Tech Stack Repeater */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Technology Stack ({techStack.length})</span>
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => setTechStack(techStack.filter((_, i) => i !== tIdx))}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && techInput.trim()) {
                    e.preventDefault();
                    if (!techStack.includes(techInput.trim())) {
                      setTechStack([...techStack, techInput.trim()]);
                    }
                    setTechInput("");
                  }
                }}
                placeholder="Type technology (e.g. Next.js, Python FastAPI, PostgreSQL) and press Add"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (techInput.trim() && !techStack.includes(techInput.trim())) {
                    setTechStack([...techStack, techInput.trim()]);
                    setTechInput("");
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
              >
                Add Tech
              </button>
            </div>
          </div>

          {/* Key Deliverables / Features Repeater */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Key Deliverables &amp; Technical Capabilities ({keyFeatures.length})</span>
              </h4>
            </div>

            <div className="space-y-1.5">
              {keyFeatures.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const updated = [...keyFeatures];
                      updated[fIdx] = e.target.value;
                      setKeyFeatures(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setKeyFeatures(keyFeatures.filter((_, i) => i !== fIdx))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && featureInput.trim()) {
                    e.preventDefault();
                    setKeyFeatures([...keyFeatures, featureInput.trim()]);
                    setFeatureInput("");
                  }
                }}
                placeholder="e.g. Automated PDF Processing & Abstract Evaluation Engine"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (featureInput.trim()) {
                    setKeyFeatures([...keyFeatures, featureInput.trim()]);
                    setFeatureInput("");
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
              >
                Add Feature
              </button>
            </div>
          </div>

          {/* Client Testimonial Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-purple-600" />
              <span>Client Testimonial (Optional)</span>
            </h4>
            <FormField label="Client Quote">
              <textarea
                rows={2}
                value={testimonial.quote}
                onChange={(e) => setTestimonial({ ...testimonial, quote: e.target.value })}
                placeholder="What did the client say about Brain Bari's delivery?"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <FormField label="Author Name">
                <input
                  type="text"
                  value={testimonial.author}
                  onChange={(e) => setTestimonial({ ...testimonial, author: e.target.value })}
                  placeholder="Dr. Sarah Johnson"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </FormField>
              <FormField label="Author Role">
                <input
                  type="text"
                  value={testimonial.role}
                  onChange={(e) => setTestimonial({ ...testimonial, role: e.target.value })}
                  placeholder="Program Director"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </FormField>
              <FormField label="Company Name">
                <input
                  type="text"
                  value={testimonial.company || ""}
                  onChange={(e) => setTestimonial({ ...testimonial, company: e.target.value })}
                  placeholder="Global Bioethics Forum"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project Thumbnail Image URL">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
              />
            </FormField>

            <FormField label="Live Production URL">
              <input
                type="text"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px] font-mono"
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeaturedProj"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isFeaturedProj" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Feature this project on the homepage showcase
            </label>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteProject}
        title="Delete Portfolio Project"
        message="Are you sure you want to remove this project from your portfolio? This action cannot be undone."
        confirmLabel="Delete Project"
        isDestructive={true}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
