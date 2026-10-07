"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface ServiceDetailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  serviceDetail: any;
  activePkg: any;
}

export default function ServiceDetailPreviewModal({
  isOpen,
  onClose,
  slug,
  serviceDetail,
  activePkg
}: ServiceDetailPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-300">
        {/* Modal Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-purple-300">Preview:</span>
            <span className="font-bold">/services/{slug}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Exact Frontend Render */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-[#fcfbfe] space-y-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img src={serviceDetail?.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {serviceDetail?.heroTitlePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {serviceDetail?.heroTitleGradient}
                </span>{" "}
                {serviceDetail?.heroTitleSuffix}
              </h1>
              {(serviceDetail?.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
              ))}
              <div className="flex gap-3 pt-2">
                <span className="px-6 py-2.5 bg-[#602b0c] text-white text-xs font-medium rounded-xl">Read More</span>
                <span className="px-6 py-2.5 bg-[#b57be4] text-white text-xs font-medium rounded-xl">Work Prove</span>
              </div>
            </div>
          </div>

          {/* Package Offering Preview */}
          {activePkg && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-[280px] aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img src={activePkg.image} alt="Pkg" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{activePkg.title}</h3>
                <p className="text-xs font-semibold text-gray-500">{activePkg.meta}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{activePkg.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                  {(activePkg.features || []).map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex gap-3">
                  <span className="px-6 py-2 border border-[#602b0c] text-[#602b0c] rounded-xl text-xs font-semibold">Learn More</span>
                  <span className="px-6 py-2 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white rounded-xl text-xs font-bold">Order Now</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
