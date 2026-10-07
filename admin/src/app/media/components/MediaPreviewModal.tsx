"use client";

import React from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface MediaPreviewModalProps {
  previewMedia: any | null;
  onClose: () => void;
  onCopyUrl: (item: any) => void;
}

export default function MediaPreviewModal({
  previewMedia,
  onClose,
  onCopyUrl
}: MediaPreviewModalProps) {
  if (!previewMedia) return null;

  return (
    <Modal
      isOpen={!!previewMedia}
      onClose={onClose}
      title={previewMedia.title || previewMedia.name}
      subtitle={`${previewMedia.format} · ${previewMedia.size} · Cloudinary CDN`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyUrl(previewMedia)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Copy Cloudinary URL
          </button>
          <a
            href={previewMedia.url}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Cloudinary</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-3 text-xs">
        {previewMedia.type === "image" ? (
          <img
            src={previewMedia.url}
            alt={previewMedia.title}
            className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-200 bg-slate-50"
          />
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">{previewMedia.name}</h4>
            <p className="text-slate-500">Document hosted on Cloudinary CDN.</p>
            <a
              href={previewMedia.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open / Download Document</span>
            </a>
          </div>
        )}

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 break-all select-all">
          {previewMedia.url}
        </div>
      </div>
    </Modal>
  );
}
