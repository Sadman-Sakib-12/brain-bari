"use client";

import React from "react";
import { Star, ExternalLink, Edit2, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { PARTNER_CATEGORIES } from "./PartnerModal";

interface PartnersListTabProps {
  partners: any[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  toggleFeatured: (id: string) => void;
  openEdit: (p: any) => void;
  setDeleteConfirmId: (id: string) => void;
}

export default function PartnersListTab({
  partners,
  selectedCategory,
  setSelectedCategory,
  toggleFeatured,
  openEdit,
  setDeleteConfirmId,
}: PartnersListTabProps) {
  const filteredPartners = partners.filter((p) => {
    if (selectedCategory === "All") return true;
    return (p.type || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
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
                ? "bg-blue-600 text-white border-blue-600"
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
                {p.logoUrl ? (
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm border border-slate-800 tracking-wider">
                    {p.logoInitials || p.name?.slice(0, 2)?.toUpperCase() || "PT"}
                  </div>
                )}

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
  );
}
