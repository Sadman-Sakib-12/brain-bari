"use client";

import React from "react";
import { Plus, Trash2, Check } from "lucide-react";

interface ServiceCatalogCardEditorProps {
  catalogService: any;
  updateCatalogField: (field: string, value: any) => void;
  addCatalogFeature: () => void;
  updateCatalogFeature: (fIdx: number, value: string) => void;
  removeCatalogFeature: (fIdx: number) => void;
}

export default function ServiceCatalogCardEditor({
  catalogService,
  updateCatalogField,
  addCatalogFeature,
  updateCatalogFeature,
  removeCatalogFeature
}: ServiceCatalogCardEditorProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            /services Directory Card Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Parameters shown for this service in the 4-column catalog grid on the /services page and homepage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Service Card Title</label>
            <input
              type="text"
              value={catalogService.title || ""}
              onChange={(e) => updateCatalogField("title", e.target.value)}
              className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#602b0c] mb-1.5">Catalog Badge</label>
            <input
              type="text"
              value={catalogService.badge || ""}
              onChange={(e) => updateCatalogField("badge", e.target.value)}
              className="w-full text-xs font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1.5">From Price ($)</label>
              <input
                type="number"
                value={catalogService.startingPrice || 650}
                onChange={(e) => updateCatalogField("startingPrice", Number(e.target.value))}
                className="w-full text-sm font-bold text-emerald-700 bg-white px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1.5">Days</label>
              <input
                type="number"
                value={catalogService.deliveryDays || 21}
                onChange={(e) => updateCatalogField("deliveryDays", Number(e.target.value))}
                className="w-full text-sm font-bold text-amber-700 bg-white px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Excerpt / Description</label>
          <textarea
            rows={2}
            value={catalogService.shortDesc || ""}
            onChange={(e) => updateCatalogField("shortDesc", e.target.value)}
            className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Catalog Bullet Points Repeater */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Catalog Feature Checklist Points
            </label>
            <button
              type="button"
              onClick={addCatalogFeature}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Point</span>
            </button>
          </div>

          <div className="space-y-2">
            {(catalogService.features || []).map((feat: string, fIdx: number) => (
              <div
                key={fIdx}
                className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs"
              >
                <Check className="w-4 h-4 text-purple-600 ml-3 shrink-0" />
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => updateCatalogFeature(fIdx, e.target.value)}
                  className="flex-1 text-xs text-slate-800 bg-transparent border-0 py-2 px-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeCatalogFeature(fIdx)}
                  className="p-1.5 mr-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
