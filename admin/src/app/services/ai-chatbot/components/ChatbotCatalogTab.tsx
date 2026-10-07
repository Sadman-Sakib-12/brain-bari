"use client";

import React from "react";
import { Plus, Trash2, Check } from "lucide-react";

interface ChatbotCatalogTabProps {
  catalogCard: any;
  setCatalogCard: (val: any) => void;
  handleAddCatalogFeature: () => void;
  handleUpdateCatalogFeature: (idx: number, val: string) => void;
  handleRemoveCatalogFeature: (idx: number) => void;
}

export default function ChatbotCatalogTab({
  catalogCard,
  setCatalogCard,
  handleAddCatalogFeature,
  handleUpdateCatalogFeature,
  handleRemoveCatalogFeature
}: ChatbotCatalogTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Catalog Card Settings (/services)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage how this AI Chatbots service card appears on the main services directory page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
            <input
              type="text"
              value={catalogCard.title || ""}
              onChange={(e) => setCatalogCard({ ...catalogCard, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ribbon Badge</label>
            <input
              type="text"
              value={catalogCard.badge || ""}
              onChange={(e) => setCatalogCard({ ...catalogCard, badge: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Starting Price ($)</label>
            <input
              type="number"
              value={catalogCard.startingPrice || 0}
              onChange={(e) => setCatalogCard({ ...catalogCard, startingPrice: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Delivery Days</label>
            <input
              type="number"
              value={catalogCard.deliveryDays || 1}
              onChange={(e) => setCatalogCard({ ...catalogCard, deliveryDays: Number(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={catalogCard.shortDesc || ""}
              onChange={(e) => setCatalogCard({ ...catalogCard, shortDesc: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>
        </div>

        {/* Feature bullets */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Checklist Features</label>
            <button
              type="button"
              onClick={handleAddCatalogFeature}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="space-y-2">
            {(catalogCard.features || []).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleUpdateCatalogFeature(i, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCatalogFeature(i)}
                  className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
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
