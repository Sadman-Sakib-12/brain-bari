"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface ChatbotPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailData: any;
  coverImage: string;
}

export default function ChatbotPreviewModal({
  isOpen,
  onClose,
  detailData,
  coverImage
}: ChatbotPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-300">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-purple-300">Preview:</span>
            <span className="font-bold">/services/ai-chatbot</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-10 bg-[#fcfbfe] space-y-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img src={detailData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {detailData.heroTitlePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                  {detailData.heroTitleGradient}
                </span>{" "}
                {detailData.heroTitleSuffix}
              </h1>
              {(detailData.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
              ))}
              <div className="flex gap-3 pt-2">
                <span className="px-6 py-2.5 bg-[#602b0c] text-white text-xs font-medium rounded-xl">Read More</span>
                <span className="px-6 py-2.5 bg-[#b57be4] text-white text-xs font-medium rounded-xl">Work Prove</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(detailData.packages || []).map((pkg: any, idx: number) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{pkg.title}</h3>
                  <span className="text-sm font-bold text-purple-600 font-mono">{pkg.price}</span>
                </div>
                <p className="text-xs text-gray-500">{pkg.meta}</p>
                <p className="text-xs text-gray-600">{pkg.description}</p>
                <div className="space-y-1 pt-2 border-t border-gray-100">
                  {(pkg.features || []).map((f: string, fi: number) => (
                    <div key={fi} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
