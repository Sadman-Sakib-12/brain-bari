"use client";

import React from "react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface SeoSettingsTabProps {
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDesc: string;
  setSeoDesc: (v: string) => void;
  seoKeywords: string;
  setSeoKeywords: (v: string) => void;
}

export default function SeoSettingsTab({
  seoTitle,
  setSeoTitle,
  seoDesc,
  setSeoDesc,
  seoKeywords,
  setSeoKeywords
}: SeoSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card header={<h3 className="text-sm font-bold text-slate-900">Metadata &amp; Search Visibility</h3>}>
        <div className="space-y-4 text-xs">
          <FormField label="Global Meta Title" required>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
            />
          </FormField>

          <FormField label="Meta Description">
            <textarea
              rows={3}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
            />
          </FormField>

          <FormField label="Keywords (Comma separated)">
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Google SERP Preview</span>
            <h4 className="text-sm font-semibold text-indigo-700 hover:underline cursor-pointer">
              {seoTitle}
            </h4>
            <p className="text-[11px] text-emerald-700 font-mono">https://brainbari.com</p>
            <p className="text-xs text-slate-600">{seoDesc}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
