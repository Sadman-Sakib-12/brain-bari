"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

interface BlogPreviewModalProps {
  previewBlog: any | null;
  onClose: () => void;
}

export default function BlogPreviewModal({ previewBlog, onClose }: BlogPreviewModalProps) {
  if (!previewBlog) return null;

  return (
    <Modal
      isOpen={!!previewBlog}
      onClose={onClose}
      title="Article Preview"
      subtitle={`By ${previewBlog.author} · ${previewBlog.readTime || "5 min read"}`}
      maxWidth="2xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs rounded-xl cursor-pointer"
        >
          Close Preview
        </button>
      }
    >
      <div className="space-y-4 text-xs">
        {previewBlog.image && (
          <img
            src={previewBlog.image}
            alt={previewBlog.title}
            className="w-full h-48 object-cover rounded-xl border border-slate-200"
          />
        )}
        <h2 className="text-lg font-bold text-slate-900">{previewBlog.title}</h2>
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <span>{previewBlog.category}</span>
          <span>·</span>
          <span>{previewBlog.date || previewBlog.publishedDate || "2026-09-15"}</span>
        </div>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {previewBlog.content || previewBlog.excerpt}
        </p>
      </div>
    </Modal>
  );
}
