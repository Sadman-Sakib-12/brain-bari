"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Table,
  LayoutGrid,
  TrendingUp,
  Search,
  X,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { CaseStudy } from "../types";

interface CaseStudiesTabProps {
  caseStudies: CaseStudy[];
  onUpdate: (updated: CaseStudy[]) => void;
}

export default function CaseStudiesTab({ caseStudies, onUpdate }: CaseStudiesTabProps) {
  const [csSearch, setCsSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
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

    onUpdate(updated);
    setIsCsModalOpen(false);
  };

  const handleDeleteCs = (idx: number, title: string) => {
    if (confirm(`Remove case study "${title}"?`)) {
      const updated = caseStudies.filter((_, i) => i !== idx);
      onUpdate(updated);
      toast.success("Case study removed");
    }
  };

  return (
    <section className="space-y-4">
      {/* Search and view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shrink-0"
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
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCsModal(cs, idx)}
                          className="p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCs(idx, cs.title)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
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

      {/* Add / Edit Case Study Modal */}
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingCsIdx !== null ? "Update Case Study" : "Add Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
