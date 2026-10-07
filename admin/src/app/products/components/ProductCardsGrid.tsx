"use client";

import React from "react";
import { Package, Star, CheckCircle2, ExternalLink, Edit2, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface ProductCardsGridProps {
  products: any[];
  onToggleFeatured: (id: string) => void;
  onEdit: (prod: any) => void;
  onDelete: (id: string) => void;
}

export default function ProductCardsGrid({
  products,
  onToggleFeatured,
  onEdit,
  onDelete
}: ProductCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((prod) => (
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
                  onClick={() => onToggleFeatured(prod.id)}
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
                onClick={() => onEdit(prod)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Edit Product"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(prod.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Delete Product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
