"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Layers,
  Bot,
  Box,
  Cpu,
  Sparkles,
  ExternalLink,
  Clock,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
  Check,
  PackageCheck,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { FRONTEND_URL } from "@/lib/axios";

const serviceIcons: Record<string, React.ElementType> = {
  "ai-chatbot": Bot,
  "ai-saas": Layers,
  "custom-ai": Cpu,
  "ai-3d": Box,
};

interface ServicesAllTabProps {
  services: any[];
  filteredServices: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  statusFilter: "All" | "Active" | "Draft";
  setStatusFilter: (val: "All" | "Active" | "Draft") => void;
  viewMode: "grid" | "table";
  onViewChange: (mode: "grid" | "table") => void;
  categories: string[];
  isAnyFilterActive: boolean;
  onOpenAdd: () => void;
  onOpenEdit: (srv: any) => void;
  onDeleteConfirm: (id: string) => void;
  onToggleActive: (srv: any) => void;
  getDedicatedPageHref: (slug: string) => string;
  packagesData?: any;
  onManagePackages?: (slug: string) => void;
}

export default function ServicesAllTab({
  services,
  filteredServices,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  viewMode,
  onViewChange,
  categories,
  isAnyFilterActive,
  onOpenAdd,
  onOpenEdit,
  onDeleteConfirm,
  onToggleActive,
  getDedicatedPageHref,
  packagesData,
  onManagePackages,
}: ServicesAllTabProps) {
  return (
    <div className="space-y-5">
      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3.5 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by title, description, category, or features..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 transition-all outline-none"
            />
          </div>

          {/* STATUS FILTER & VIEW SWITCHER */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("All")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === "All"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Active")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === "Active"
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Draft")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === "Draft"
                    ? "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Draft
              </button>
            </div>

            <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onViewChange("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewChange("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {isAnyFilterActive && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setStatusFilter("All");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY PILLS BAR */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1 shrink-0">Category:</span>
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? services.length
                : services.filter(
                    (s) => (s.category || "").toLowerCase() === cat.toLowerCase()
                  ).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800"
                }`}
              >
                <span>{cat === "All" ? "All Categories" : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-blue-200/60 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200" : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredServices.length}</strong> of{" "}
          {services.length} services
        </span>
      </div>

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === "grid" && (
        <>
          {filteredServices.length === 0 ? (
            <EmptyState
              icon={Code2}
              title="No services found"
              description={
                isAnyFilterActive
                  ? "No services match your active search or category filters. Try clearing your search."
                  : "No services configured yet. Click below to add your first core service."
              }
              action={
                isAnyFilterActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setStatusFilter("All");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Clear Search & Filters</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Service</span>
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredServices.map((srv) => {
                const Icon = serviceIcons[srv.slug] || Bot;
                const dedicatedHref = getDedicatedPageHref(srv.slug);
                const isActive =
                  srv.isActive !== undefined
                    ? srv.isActive
                    : srv.active !== undefined
                    ? srv.active
                    : srv.status === "Active";

                return (
                  <div
                    key={srv.id || srv.slug}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* CARD THUMBNAIL / BANNER */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      {srv.image ? (
                        <img
                          src={srv.image}
                          alt={srv.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-400 p-4">
                          <Icon className="w-10 h-10 text-indigo-400/80 mb-1" />
                          <span className="text-[11px] font-mono text-slate-400">/{srv.slug}</span>
                        </div>
                      )}

                      {/* DARK GRADIENT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

                      {/* TOP BADGES */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        {/* CATEGORY TAG */}
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 capitalize tracking-wide">
                          {srv.category || "AI Service"}
                        </span>

                        {/* STATUS TOGGLE */}
                        <button
                          type="button"
                          onClick={() => onToggleActive(srv)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md cursor-pointer transition-all ${
                            isActive
                              ? "bg-emerald-500/90 text-white hover:bg-emerald-600 shadow-xs"
                              : "bg-amber-500/90 text-white hover:bg-amber-600 shadow-xs"
                          }`}
                          title={isActive ? "Click to set as Draft" : "Click to set as Active"}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-white animate-pulse" : "bg-white/80"
                            }`}
                          />
                          <span>{isActive ? "Live / Active" : "Draft"}</span>
                        </button>
                      </div>

                      {/* BADGE (POPULAR / HOT) */}
                      {srv.badge && (
                        <div className="absolute bottom-2.5 right-3 z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {srv.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CARD BODY CONTENT */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <h3
                          className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                          title={srv.title}
                        >
                          {srv.title}
                        </h3>

                        {/* PRICE & DELIVERY SLA BOX */}
                        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                              Starting
                            </span>
                            <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                              ${srv.price || srv.startingPrice || 250}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                              Delivery SLA
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {srv.deliveryDays || 7} Days
                            </span>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {srv.shortDesc || srv.description || "No description provided."}
                        </p>

                        {/* FEATURES LIST */}
                        {srv.features && Array.isArray(srv.features) && srv.features.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                            {srv.features.slice(0, 2).map((feat: string, i: number) => (
                              <div
                                key={i}
                                className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CARD FOOTER ACTIONS */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(srv)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-300 dark:text-blue-100" />
                          <span>Edit</span>
                        </button>

                        {onManagePackages && (
                          <button
                            type="button"
                            onClick={() => onManagePackages(srv.slug)}
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 transition-colors cursor-pointer"
                            title="Manage Packages / Sub-services for this service"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Packages ({packagesData && packagesData[srv.slug]?.packages?.length ? packagesData[srv.slug].packages.length : 0})</span>
                          </button>
                        )}

                        <a
                          href={`${FRONTEND_URL}/services/${srv.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                          title="Preview on Live Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => onDeleteConfirm(srv.id || srv.slug)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Service</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Starting Price</th>
                  <th className="py-3.5 px-5">Delivery SLA</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredServices.map((srv) => {
                  const Icon = serviceIcons[srv.slug] || Bot;
                  const isActive =
                    srv.isActive !== undefined
                      ? srv.isActive
                      : srv.active !== undefined
                      ? srv.active
                      : srv.status === "Active";

                  return (
                    <tr
                      key={srv.id || srv.slug}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            {srv.image ? (
                              <img
                                src={srv.image}
                                alt={srv.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[240px]">
                              {srv.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                              /{srv.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300 font-medium capitalize">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          {srv.category || "AI"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs">
                        <span className="font-bold text-blue-600 dark:text-blue-400 block">
                          ${srv.price || srv.startingPrice || 250}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {srv.deliveryDays || 7} Days
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => onToggleActive(srv)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span>{isActive ? "Active" : "Draft"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEdit(srv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            <span>Edit</span>
                          </button>
                          {onManagePackages && (
                            <button
                              type="button"
                              onClick={() => onManagePackages(srv.slug)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg border border-purple-200 dark:border-purple-800/60 transition-colors"
                              title="Manage Packages"
                            >
                              <PackageCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span>Packages ({packagesData && packagesData[srv.slug]?.packages?.length ? packagesData[srv.slug].packages.length : 0})</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteConfirm(srv.id || srv.slug)}
                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
