"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Layers,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { CapabilityItem, AVAILABLE_ICONS, renderCapIcon } from "../types";

interface CapabilitiesTabProps {
  capabilities: CapabilityItem[];
  onUpdate: (updated: CapabilityItem[]) => void;
}

export default function CapabilitiesTab({ capabilities, onUpdate }: CapabilitiesTabProps) {
  const [capSearch, setCapSearch] = useState("");
  const [capCategoryFilter, setCapCategoryFilter] = useState("ALL");
  const [isCapModalOpen, setIsCapModalOpen] = useState(false);
  const [editingCapIdx, setEditingCapIdx] = useState<number | null>(null);
  const [capFormData, setCapFormData] = useState<CapabilityItem>({
    id: "",
    title: "",
    description: "",
    icon: "Code",
    category: "Engineering"
  });

  const uniqueCategories = useMemo(() => {
    const cats = new Set(capabilities.map((c) => c.category));
    return ["ALL", ...Array.from(cats)];
  }, [capabilities]);

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

    onUpdate(updated);
    setIsCapModalOpen(false);
  };

  const handleDeleteCap = (idx: number, title: string) => {
    if (confirm(`Remove capability card "${title}"?`)) {
      const updated = capabilities.filter((_, i) => i !== idx);
      onUpdate(updated);
      toast.success("Capability card removed");
    }
  };

  return (
    <section className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={capSearch}
              onChange={(e) => setCapSearch(e.target.value)}
              placeholder="Search capabilities..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>

          <select
            value={capCategoryFilter}
            onChange={(e) => setCapCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-800"
          >
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openAddCapModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Capability Card</span>
        </button>
      </div>

      {/* Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCapabilities.map((cap, idx) => (
          <article
            key={cap.id || `cap-${idx}`}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-100">
                  {renderCapIcon(cap.icon, "w-4 h-4 text-purple-800")}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {cap.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{cap.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {cap.description}
              </p>
            </div>

            <footer className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
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
            No capabilities matched the filter.
          </div>
        )}
      </div>

      {/* Modal: Capability */}
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingCapIdx !== null ? "Update Capability" : "Add Capability"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
