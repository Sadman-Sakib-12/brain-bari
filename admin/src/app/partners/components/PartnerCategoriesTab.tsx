"use client";

import React from "react";
import { PARTNER_CATEGORIES } from "./PartnerModal";

interface PartnerCategoriesTabProps {
  partners: any[];
}

export default function PartnerCategoriesTab({ partners }: PartnerCategoriesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PARTNER_CATEGORIES.map((cat, idx) => (
        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
            <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              {partners.filter((p) => (p.type || "").toLowerCase() === cat.toLowerCase()).length} Partners
            </span>
          </div>
          <p className="text-xs text-slate-500">Official classification for strategic relationships.</p>
        </div>
      ))}
    </div>
  );
}
