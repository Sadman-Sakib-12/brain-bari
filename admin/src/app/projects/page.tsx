"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FolderGit2,
  Plus,
  Save,
  Tag,
  BarChart3,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { FRONTEND_URL } from "@/lib/axios";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import ProjectModal from "./components/ProjectModal";
import ProjectsGridTab from "./components/ProjectsGridTab";
import ProjectCategoriesTab from "./components/ProjectCategoriesTab";

type ProjectsTab = "all" | "metrics" | "categories";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as ProjectsTab) || "all";

  const [activeTab, setActiveTab] = useState<ProjectsTab>(initialTab);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [saved, setSaved] = useState(false);

  // Top Metrics (for /new-work page top 3 stat cards)
  const [metricsList, setMetricsList] = useState<any[]>([
    { number: "30+", label: "PROJECTS", color: "purple" },
    { number: "10+", label: "AI SYSTEMS", color: "pink" },
    { number: "99.9%", label: "SATISFACTION", color: "purple" },
  ]);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);

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
  const [testimonial, setTestimonial] = useState<{
    quote: string;
    author: string;
    role: string;
    company?: string;
  }>({
    quote: "",
    author: "",
    role: "",
    company: "",
  });

  const loadData = () => {
    adminApi
      .getPortfolios()
      .then((res) => {
        setProjects(res || []);
      })
      .catch(() => {
        setProjects([]);
      });

    adminApi
      .getContent("newWorkMetrics")
      .then((res) => {
        if (res && Array.isArray(res.metrics) && res.metrics.length > 0) {
          setMetricsList(res.metrics);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMetrics = async () => {
    setIsSavingMetrics(true);
    try {
      await adminApi.saveContent("newWorkMetrics", { metrics: metricsList });
      toast.success("Work page top 3 metric cards updated successfully!");
    } catch {
      toast.error("Failed to save metrics.");
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const openAddProject = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory("Enterprise AI");
    setClient("");
    setYear(new Date().getFullYear().toString());
    setTimeline("");
    setStatus("Live Platform");
    setStatusColor("emerald");
    setShortDesc("");
    setOverview("");
    setMetrics("");
    setChallenge("");
    setSolution("");
    setResults("");
    setImage("");
    setIsFeatured(false);
    setLiveUrl("");
    setTechStack([]);
    setTechInput("");
    setKeyFeatures([]);
    setFeatureInput("");
    setTestimonial({ quote: "", author: "", role: "", company: "" });
    setIsModalOpen(true);
  };

  const openEditProject = (proj: any) => {
    setEditingProject(proj);
    setTitle(proj.title || "");
    setSlug(proj.slug || "");
    setCategory(proj.category || "AI & Automation");
    setClient(proj.client || "");
    setYear(proj.year || "2026");
    setTimeline(proj.timeline || "");
    setStatus(proj.status || "Live Platform");
    setStatusColor(proj.statusColor || "emerald");
    setShortDesc(proj.shortDesc || proj.description || "");
    setOverview(proj.overview || proj.description || "");
    setMetrics(proj.metrics || "");
    setChallenge(proj.challenge || "");
    setSolution(proj.solution || "");
    setResults(proj.results || "");
    setImage(proj.image || proj.thumbnail || "");
    setIsFeatured(!!proj.isFeatured || !!proj.featured);
    setLiveUrl(proj.liveUrl || "");
    setTechStack(Array.isArray(proj.techStack) ? proj.techStack : proj.tags || []);
    setTechInput("");
    setKeyFeatures(Array.isArray(proj.keyFeatures) ? proj.keyFeatures : []);
    setFeatureInput("");
    setTestimonial(
      proj.testimonial || { quote: "", author: "", role: "", company: "" }
    );
    setIsModalOpen(true);
  };

  const handleSaveProjectForm = async () => {
    if (!title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    const projectSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const validTechStack = techStack.filter((t) => t.trim().length > 0);
    const validKeyFeatures = keyFeatures.filter((f) => f.trim().length > 0);
    const validTestimonial = testimonial.quote.trim() ? testimonial : undefined;

    const payload = {
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
      ...(validTestimonial ? { testimonial: validTestimonial } : {}),
    };

    try {
      if (editingProject) {
        await adminApi.updatePortfolio(editingProject.id, payload);
        const updated = projects.map((p) => {
          if (p.id === editingProject.id || p.slug === editingProject.slug) {
            return { ...p, ...payload };
          }
          return p;
        });
        setProjects(updated);
        toast.success(`Project "${title}" updated.`);
      } else {
        const created = await adminApi.createPortfolio(payload);
        if (created) {
          setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
        } else {
          const newProj = {
            id: `proj-${Date.now()}`,
            ...payload,
          };
          setProjects((prev) => [newProj, ...prev]);
        }
        toast.success(`Project "${title}" added to portfolio.`);
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save project. Please check backend connection.");
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.deletePortfolio(deleteConfirmId);
      const updated = projects.filter(
        (p) => p.id !== deleteConfirmId && p.slug !== deleteConfirmId
      );
      setProjects(updated);
      toast.success("Project removed from portfolio.");
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const toggleFeatured = async (projId: string) => {
    const target = projects.find((p) => p.id === projId || p.slug === projId);
    if (!target) return;
    const nextState = !target.isFeatured;
    try {
      await adminApi.updatePortfolio(target.id, { isFeatured: nextState, featured: nextState });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projId || p.slug === projId
            ? { ...p, isFeatured: nextState, featured: nextState }
            : p
        )
      );
      toast.info(
        nextState
          ? `"${target.title}" is now Featured.`
          : `"${target.title}" is unfeatured.`
      );
    } catch {
      toast.error("Failed to toggle featured status.");
    }
  };

  const categories = Array.from(
    new Set([
      "All",
      ...projects.map((p) => p.category).filter(Boolean),
      "3D Web Development",
      "Enterprise Bot",
      "Fintech & SaaS",
      "Healthcare AI",
      "3D Web",
      "E-Commerce",
      "AI Voice",
      "AI & Software",
      "Enterprise AI",
      "Crypto & FinTech",
      "AI & Taxation",
      "Event & Conference",
    ])
  );

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "All") return true;
    return (p.category || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        badge="Our Work & Portfolio Management"
        title="Our Work (Portfolio Projects)"
        description="Manage client projects, case studies, categories, and top metric cards displayed on the public /work (Our Work) page."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`${FRONTEND_URL}/new-work`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview Live /work Page</span>
            </a>

            <button
              type="button"
              onClick={openAddProject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </button>
          </div>
        }
      >
        {/* SUB-TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            {
              id: "all",
              label: "All Projects (Work Showcase)",
              icon: FolderGit2,
              count: projects.length,
            },
            {
              id: "metrics",
              label: "Top Stats & Metrics (3 Cards)",
              icon: BarChart3,
            },
            { id: "categories", label: "Categories", icon: Tag },
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

      {/* TAB 1: ALL PROJECTS */}
      {activeTab === "all" && (
        <ProjectsGridTab
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          filteredProjects={filteredProjects}
          onToggleFeatured={toggleFeatured}
          onEdit={openEditProject}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* TAB 2: TOP STATS & METRICS (3 CARDS ON /new-work) */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-950 leading-relaxed">
              <strong className="font-bold block text-sm mb-0.5">
                Top 3 Metric Cards on &ldquo;Our Work&rdquo; Page
              </strong>
              These 3 numbers are displayed prominently right under the hero title at{" "}
              <code>/work</code> (e.g. <code>30+ PROJECTS</code>, <code>10+ AI SYSTEMS</code>,{" "}
              <code>99.9% SATISFACTION</code>). You can edit their numbers and titles below and
              click Save.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {metricsList.map((m: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Metric Card #{idx + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    Live on /work
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Stat Number / Value
                    </label>
                    <input
                      type="text"
                      value={m.number || ""}
                      onChange={(e) => {
                        const updated = [...metricsList];
                        updated[idx] = { ...updated[idx], number: e.target.value };
                        setMetricsList(updated);
                      }}
                      placeholder="e.g. 30+"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-extrabold text-purple-700 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Metric Label / Title
                    </label>
                    <input
                      type="text"
                      value={m.label || ""}
                      onChange={(e) => {
                        const updated = [...metricsList];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setMetricsList(updated);
                      }}
                      placeholder="e.g. PROJECTS"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveMetrics}
              disabled={isSavingMetrics}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingMetrics ? "Saving Metrics..." : "Save 3 Metric Cards"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && <ProjectCategoriesTab />}

      {/* ADD / EDIT PROJECT MODAL */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        category={category}
        setCategory={setCategory}
        client={client}
        setClient={setClient}
        year={year}
        setYear={setYear}
        timeline={timeline}
        setTimeline={setTimeline}
        statusColor={statusColor}
        setStatusColor={setStatusColor}
        shortDesc={shortDesc}
        setShortDesc={setShortDesc}
        overview={overview}
        setOverview={setOverview}
        metrics={metrics}
        setMetrics={setMetrics}
        challenge={challenge}
        setChallenge={setChallenge}
        solution={solution}
        setSolution={setSolution}
        results={results}
        setResults={setResults}
        image={image}
        setImage={setImage}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        liveUrl={liveUrl}
        setLiveUrl={setLiveUrl}
        techStack={techStack}
        setTechStack={setTechStack}
        techInput={techInput}
        setTechInput={setTechInput}
        keyFeatures={keyFeatures}
        setKeyFeatures={setKeyFeatures}
        featureInput={featureInput}
        setFeatureInput={setFeatureInput}
        testimonial={testimonial}
        setTestimonial={setTestimonial}
        onSave={handleSaveProjectForm}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteProject}
        title="Delete Portfolio Project"
        message="Are you sure you want to remove this project? It will no longer appear on your live /work page."
        confirmLabel="Delete Project"
        isDestructive={true}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">Loading Portfolio...</div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
