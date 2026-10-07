"use client";

import React from "react";
import { Upload, UploadCloud, FileText, Check, Copy, Eye, Trash2 } from "lucide-react";

interface MediaGridProps {
  filteredMedia: any[];
  copiedId: string | null;
  onCopyUrl: (item: any) => void;
  onPreview: (item: any) => void;
  onDelete: (id: string) => void;
  onOpenUpload: () => void;
}

export default function MediaGrid({
  filteredMedia,
  copiedId,
  onCopyUrl,
  onPreview,
  onDelete,
  onOpenUpload
}: MediaGridProps) {
  if (filteredMedia.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
        <UploadCloud className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No media assets found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Upload images or documents directly to your Cloudinary storage using the button above.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload First Asset</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredMedia.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs hover:shadow group"
        >
          {/* Asset Preview Frame */}
          <div className="relative h-40 bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://res.cloudinary.com/lndolcud/image/upload/v1791406629/brain-bari/service_ai_chatbot.jpg";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                <FileText className="w-10 h-10 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  {item.format || "PDF"}
                </span>
              </div>
            )}

            <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                {item.category || "Asset"}
              </span>
            </div>

            <div className="absolute top-2.5 right-2.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/90 text-white">
                Cloudinary
              </span>
            </div>
          </div>

          {/* Asset Metadata */}
          <div className="p-3.5 space-y-1.5 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
              {item.title || item.name}
            </h4>
            <p className="text-[11px] font-mono text-slate-400 truncate" title={item.name}>
              {item.name}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
              <span>{item.size || "Optimized"}</span>
              <span className="font-mono text-[10px] truncate max-w-[120px]">{item.format || "JPG"}</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-3.5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onCopyUrl(item)}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                copiedId === item.id
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white text-slate-700 hover:text-slate-900 border-slate-200"
              }`}
              title="Copy Cloudinary asset URL"
            >
              {copiedId === item.id ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
              <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPreview(item)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 cursor-pointer"
                title="Delete"
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
