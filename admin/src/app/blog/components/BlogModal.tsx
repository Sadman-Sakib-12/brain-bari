"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBlog: any | null;
  form: {
    title: string;
    category: string;
    excerpt: string;
    previewHeading: string;
    points: string[];
    content: string;
    readTime: string;
    author: string;
    image: string;
    published: boolean;
    publishedDate: string;
  };
  setForm: (f: any) => void;
  categories: string[];
  onSave: () => void;
}

export default function BlogModal({
  isOpen,
  onClose,
  editingBlog,
  form,
  setForm,
  categories,
  onSave
}: BlogModalProps) {
  const [pointInput, setPointInput] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBlog ? "Edit Blog Article" : "Draft New Article"}
      subtitle="Write editorial content, choose publication date, and set cover imagery."
      maxWidth="3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer"
          >
            {editingBlog ? "Save Changes" : "Publish Article"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <FormField label="Article Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. How AI Is Changing Skill Development in Bangladesh"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Author">
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Publication Date">
            <input
              type="date"
              value={form.publishedDate}
              onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>
        </div>

        <FormField label="Short Summary / Excerpt">
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Summary shown on article cards and search results."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Card Preview Subheading (previewHeading)">
          <input
            type="text"
            value={form.previewHeading}
            onChange={(e) => setForm({ ...form, previewHeading: e.target.value })}
            placeholder="e.g. Key Takeaways & Industry Overview"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
          />
        </FormField>

        {/* Points List Repeater */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs">
            <span>Frontend Bullet Points (points[]) ({form.points?.length || 0})</span>
          </h4>

          <div className="space-y-1.5">
            {form.points?.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pt}
                  onChange={(e) => {
                    const updated = [...form.points];
                    updated[pIdx] = e.target.value;
                    setForm({ ...form, points: updated });
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.points.filter((_, i) => i !== pIdx);
                    setForm({ ...form, points: updated });
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={pointInput}
              onChange={(e) => setPointInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pointInput.trim()) {
                  e.preventDefault();
                  setForm({ ...form, points: [...(form.points || []), pointInput.trim()] });
                  setPointInput("");
                }
              }}
              placeholder="Type bullet point and click Add Point"
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (pointInput.trim()) {
                  setForm({ ...form, points: [...(form.points || []), pointInput.trim()] });
                  setPointInput("");
                }
              }}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
            >
              Add Point
            </button>
          </div>
        </div>

        <FormField label="Full Article Body Content">
          <textarea
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Full text or markdown content..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload
            label="Cover Image (Cloudinary CDN)"
            category="Brand Graphics"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            helpText="Upload directly to Cloudinary CDN."
            compact={true}
          />

          <FormField label="Read Time">
            <input
              type="text"
              value={form.readTime}
              onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              placeholder="5 min read"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="publishedCheck"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="publishedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Visible as Published on Public Blog
          </label>
        </div>
      </div>
    </Modal>
  );
}
