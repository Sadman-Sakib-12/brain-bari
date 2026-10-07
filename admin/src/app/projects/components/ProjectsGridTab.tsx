"use client";

import React from "react";
import { FolderGit2, Star, ExternalLink, Edit2, Trash2 } from "lucide-react";

interface ProjectsGridTabProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  filteredProjects: any[];
  onToggleFeatured: (id: string) => void;
  onEdit: (proj: any) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsGridTab({
  categories,
  selectedCategory,
  onSelectCategory,
  filteredProjects,
  onToggleFeatured,
  onEdit,
  onDelete
}: ProjectsGridTabProps) {
  return (
    <div className="space-y-5">
      {/* Categories Pill Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
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
                  onClick={() => onToggleFeatured(proj.id || proj.slug)}
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
                  onClick={() => onEdit(proj)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(proj.id || proj.slug)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
  );
}
