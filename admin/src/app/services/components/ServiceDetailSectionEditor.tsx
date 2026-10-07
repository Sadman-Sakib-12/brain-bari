"use client";

import React from "react";
import {
  Sparkles,
  LayoutTemplate,
  ImageIcon,
  Plus,
  Trash2,
  ShieldCheck
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface ServiceDetailSectionEditorProps {
  serviceDetail: any;
  activePkg: any;
  updateDetailField: (field: string, value: any) => void;
  updatePackage: (pkgIdx: number, field: string, value: any) => void;
  addPackageFeature: (pkgIdx: number) => void;
  updatePackageFeature: (pkgIdx: number, featIdx: number, value: string) => void;
  removePackageFeature: (pkgIdx: number, featIdx: number) => void;
}

export default function ServiceDetailSectionEditor({
  serviceDetail,
  activePkg,
  updateDetailField,
  updatePackage,
  addPackageFeature,
  updatePackageFeature,
  removePackageFeature
}: ServiceDetailSectionEditorProps) {
  return (
    <div className="space-y-6">
      {/* Card 1: Service Headers & Accent */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Service Headers &amp; Accent</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Main title headline, gradient highlight, and subtitle on the dedicated landing page.
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
                  value={serviceDetail.heroTitlePrefix || ""}
                  onChange={(e) => updateDetailField("heroTitlePrefix", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                  placeholder="e.g. Enterprise"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-purple-600 block mb-1">Gradient Accent</span>
                <input
                  type="text"
                  value={serviceDetail.heroTitleGradient || ""}
                  onChange={(e) => updateDetailField("heroTitleGradient", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-purple-900 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none bg-purple-50/30"
                  placeholder="e.g. Custom AI"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Title Suffix</span>
                <input
                  type="text"
                  value={serviceDetail.heroTitleSuffix || ""}
                  onChange={(e) => updateDetailField("heroTitleSuffix", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none bg-slate-50/40"
                  placeholder="e.g. Solutions"
                />
              </div>
            </div>

            {/* Live rendered title preview badge */}
            <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Preview:</span>
              <span className="font-extrabold text-slate-900">
                {serviceDetail.heroTitlePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {serviceDetail.heroTitleGradient}
                </span>{" "}
                {serviceDetail.heroTitleSuffix}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Hero Cover / Banner Image</h3>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Background 4:3 illustration for the service page header.
          </p>

          <ImageUpload
            label="Hero Banner Image"
            category="Services"
            value={serviceDetail.image || ""}
            onChange={(url) => updateDetailField("image", url)}
            helpText="Optimized for instant page loading."
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Main Offering Featured Image</h3>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Large photo displayed inside the package card list.
          </p>

          <ImageUpload
            label="Offering Featured Graphic"
            category="Services"
            value={activePkg.image || ""}
            onChange={(url) => updatePackage(0, "image", url)}
            helpText="Featured package photo."
          />
        </div>
      </div>

      {/* Card 3: Full Article Paragraphs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Full Article &amp; Service Content</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete multiline text displayed under the hero title on the dedicated details page.
          </p>
        </div>

        <div className="space-y-3">
          {(serviceDetail.paragraphs || []).map((para: string, pIdx: number) => (
            <div key={pIdx}>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Paragraph {pIdx + 1}
              </label>
              <textarea
                rows={2}
                value={para}
                onChange={(e) => {
                  const updated = [...(serviceDetail.paragraphs || [])];
                  updated[pIdx] = e.target.value;
                  updateDetailField("paragraphs", updated);
                }}
                className="w-full text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none leading-relaxed transition-all shadow-2xs"
              />
            </div>
          ))}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                const updated = [...(serviceDetail.paragraphs || []), "New informative capability paragraph."];
                updateDetailField("paragraphs", updated);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Paragraph</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 4: Package Offering Details */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Package Offering Card Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Title, subtitle meta, and description for the main package offering card.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Package Offering Title</label>
            <input
              type="text"
              value={activePkg.title || ""}
              onChange={(e) => updatePackage(0, "title", e.target.value)}
              className="w-full text-sm font-bold text-slate-900 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Price Tag Label</label>
            <input
              type="text"
              value={activePkg.price || ""}
              onChange={(e) => updatePackage(0, "price", e.target.value)}
              placeholder="e.g. Start $450"
              className="w-full text-sm font-bold text-emerald-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-700 mb-1.5">Category Subtitle / Meta Tagline</label>
          <input
            type="text"
            value={activePkg.meta || ""}
            onChange={(e) => updatePackage(0, "meta", e.target.value)}
            className="w-full text-xs font-semibold text-purple-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Offering Summary</label>
          <textarea
            rows={2}
            value={activePkg.description || ""}
            onChange={(e) => updatePackage(0, "description", e.target.value)}
            className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none leading-relaxed transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Card 5: Key Highlights Repeater */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Highlights &amp; Guarantees</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bullet points shown in the highlight list on the package details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => addPackageFeature(0)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Point</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {(activePkg.features || []).map((feat: string, fIdx: number) => (
            <div
              key={fIdx}
              className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs focus-within:border-indigo-500 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 ml-3 shrink-0" />
              <input
                type="text"
                value={feat}
                onChange={(e) => updatePackageFeature(0, fIdx, e.target.value)}
                className="flex-1 text-sm text-slate-800 bg-transparent border-0 py-2 px-1 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removePackageFeature(0, fIdx)}
                className="p-1.5 mr-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                title="Delete Point"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card 6: Consultation Call to Action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Consultation Call To Action Banner</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bottom banner encouraging visitors to schedule a strategy consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Headline</label>
            <input
              type="text"
              defaultValue="Ready to transfer your Business"
              className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Button Text</label>
            <input
              type="text"
              defaultValue="Schedule A Consultation"
              className="w-full text-sm font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
