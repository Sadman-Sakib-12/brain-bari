"use client";

import React from "react";
import {
  Sparkles,
  LayoutTemplate,
  ImageIcon,
  FileText,
  Plus,
  Trash2,
  Check,
  ShieldCheck
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface ChatbotDetailTabProps {
  detailData: any;
  setDetailData: (val: any) => void;
  coverImage: string;
  setCoverImage: (val: string) => void;
  subtitle: string;
  setSubtitle: (val: string) => void;
  catalogCard: any;
  setCatalogCard: (val: any) => void;
  highlights: string[];
  setHighlights: (val: string[]) => void;
  ctaHeadline: string;
  setCtaHeadline: (val: string) => void;
  ctaDesc: string;
  setCtaDesc: (val: string) => void;
  ctaButtonText: string;
  setCtaButtonText: (val: string) => void;
  handleAddPackageTier: () => void;
  handleRemovePackageTier: (idx: number) => void;
  handleUpdatePackage: (pkgIdx: number, field: string, value: any) => void;
  handleAddFeatureToPackage: (pkgIdx: number) => void;
  handleRemovePackageFeature: (pkgIdx: number, featIdx: number) => void;
  handleUpdatePackageFeature: (pkgIdx: number, featIdx: number, value: string) => void;
  handleAddHighlight: () => void;
  handleUpdateHighlight: (idx: number, val: string) => void;
  handleRemoveHighlight: (idx: number) => void;
}

export default function ChatbotDetailTab({
  detailData,
  setDetailData,
  coverImage,
  setCoverImage,
  subtitle,
  setSubtitle,
  catalogCard,
  setCatalogCard,
  highlights,
  setHighlights,
  ctaHeadline,
  setCtaHeadline,
  ctaDesc,
  setCtaDesc,
  ctaButtonText,
  setCtaButtonText,
  handleAddPackageTier,
  handleRemovePackageTier,
  handleUpdatePackage,
  handleAddFeatureToPackage,
  handleRemovePackageFeature,
  handleUpdatePackageFeature,
  handleAddHighlight,
  handleUpdateHighlight,
  handleRemoveHighlight
}: ChatbotDetailTabProps) {
  return (
    <div className="space-y-6">
      {/* Card 1: Service Headers & Excerpt */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Service Headers &amp; Excerpt</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Main title, tagline, and intro excerpt shown at the top of the details page and summary card.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Headline Structure (Prefix + Gradient Accent + Suffix)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Title Prefix</span>
                <input
                  type="text"
                  value={detailData.heroTitlePrefix || ""}
                  onChange={(e) => setDetailData({ ...detailData, heroTitlePrefix: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                  placeholder="e.g. Intelligent Conversational"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-purple-600 block mb-1">Gradient Accent (Highlighted)</span>
                <input
                  type="text"
                  value={detailData.heroTitleGradient || ""}
                  onChange={(e) => setDetailData({ ...detailData, heroTitleGradient: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold text-purple-900 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none bg-purple-50/30"
                  placeholder="e.g. AI Chatbots"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Title Suffix</span>
                <input
                  type="text"
                  value={detailData.heroTitleSuffix || ""}
                  onChange={(e) => setDetailData({ ...detailData, heroTitleSuffix: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                  placeholder="e.g. for Enterprise"
                />
              </div>
            </div>

            <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Preview:</span>
              <span className="font-extrabold text-slate-900">
                {detailData.heroTitlePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {detailData.heroTitleGradient}
                </span>{" "}
                {detailData.heroTitleSuffix}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
              placeholder="Your Trusted Solution for Conversational AI..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Homepage Preview Excerpt (Short description on catalog &amp; meta preview)
            </label>
            <textarea
              rows={2}
              value={catalogCard.shortDesc || ""}
              onChange={(e) => setCatalogCard({ ...catalogCard, shortDesc: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40 resize-y"
              placeholder="Short description under title on homepage..."
            />
          </div>
        </div>
      </div>

      {/* Cards 2 & 3: Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <LayoutTemplate className="w-4 h-4 text-purple-700" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Hero Cover Banner Image</h3>
                <p className="text-[11px] text-slate-500">Background banner for detail page header</p>
              </div>
            </div>

            <div className="mt-3">
              <ImageUpload
                label="Cover Banner Graphic"
                category="Services"
                value={coverImage}
                onChange={(url) => setCoverImage(url)}
                helpText="Background banner for service header."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-purple-700" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Main Story Featured Image</h3>
                <p className="text-[11px] text-slate-500">Large photo displayed at the top of the service body</p>
              </div>
            </div>

            <div className="mt-3">
              <ImageUpload
                label="Featured Story Graphic"
                category="Services"
                value={detailData.image}
                onChange={(url) => setDetailData({ ...detailData, image: url })}
                helpText="Featured photo for service content."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Full Article Paragraphs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Full Article &amp; Story Content</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete multiline text displayed on the dedicated details page (/services/ai-chatbot).
            </p>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>

        <div className="space-y-3">
          {(detailData.paragraphs || []).map((para: string, pIdx: number) => (
            <div key={pIdx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Paragraph {pIdx + 1}</span>
                {detailData.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = detailData.paragraphs.filter((_: any, i: number) => i !== pIdx);
                      setDetailData({ ...detailData, paragraphs: updated });
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={para}
                onChange={(e) => {
                  const updated = [...detailData.paragraphs];
                  updated[pIdx] = e.target.value;
                  setDetailData({ ...detailData, paragraphs: updated });
                }}
                className="w-full px-3.5 py-2.5 text-xs leading-relaxed rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40 resize-y"
                placeholder="Write detailed paragraph content..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setDetailData({
                ...detailData,
                paragraphs: [...(detailData.paragraphs || []), "New informative paragraph about this AI chatbot capability."]
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Paragraph</span>
          </button>
        </div>
      </div>

      {/* Card 5: Service Packages */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Package Offerings &amp; Deliverables</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured pricing tiers, meta tags, and feature lists rendered in the packages grid.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddPackageTier}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-purple-700" />
            <span>Add Package Tier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(detailData.packages || []).map((pkg: any, pkgIdx: number) => (
            <div
              key={pkg.id || pkgIdx}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  Tier #{pkgIdx + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => handleUpdatePackage(pkgIdx, "price", e.target.value)}
                    className="w-24 text-xs font-black text-right px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Start $259"
                  />
                  {(detailData.packages || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePackageTier(pkgIdx)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Delete package tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Package Title</label>
                <input
                  type="text"
                  value={pkg.title}
                  onChange={(e) => handleUpdatePackage(pkgIdx, "title", e.target.value)}
                  className="w-full text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Meta Tagline</label>
                <input
                  type="text"
                  value={pkg.meta}
                  onChange={(e) => handleUpdatePackage(pkgIdx, "meta", e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={pkg.description}
                  onChange={(e) => handleUpdatePackage(pkgIdx, "description", e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Features Checklist</label>
                  <button
                    type="button"
                    onClick={() => handleAddFeatureToPackage(pkgIdx)}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {(pkg.features || []).map((feat: string, featIdx: number) => (
                  <div key={featIdx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleUpdatePackageFeature(pkgIdx, featIdx, e.target.value)}
                      className="flex-1 text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePackageFeature(pkgIdx, featIdx)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 6: Key Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Highlights &amp; Guarantees</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bullet points shown in the highlight card on the details page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddHighlight}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-purple-600" />
            <span>Add Point</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {highlights.map((point, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <input
                type="text"
                value={point}
                onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                placeholder="Enter highlight feature or guarantee..."
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlight(idx)}
                className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                title="Delete highlight"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card 7: Consultation CTA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Bottom CTA Banner</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion banner displayed at the bottom of the details page.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              value={ctaHeadline}
              onChange={(e) => setCtaHeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={ctaDesc}
              onChange={(e) => setCtaDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Button Label</label>
            <input
              type="text"
              value={ctaButtonText}
              onChange={(e) => setCtaButtonText(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
