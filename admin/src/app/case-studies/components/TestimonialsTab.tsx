"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  X,
  MessageSquareQuote
} from "lucide-react";
import { toast } from "sonner";
import { TestimonialItem } from "../types";

interface TestimonialsTabProps {
  testimonials: TestimonialItem[];
  onUpdate: (updated: TestimonialItem[]) => void;
}

export default function TestimonialsTab({ testimonials, onUpdate }: TestimonialsTabProps) {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState<number | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<TestimonialItem>({
    id: "",
    name: "",
    company: "",
    text: "",
    rating: 5
  });

  const openAddTestimonialModal = () => {
    setEditingTestimonialIdx(null);
    setTestimonialFormData({
      id: `test-${Date.now()}`,
      name: "",
      company: "",
      text: "",
      rating: 5
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (t: TestimonialItem, idx: number) => {
    setEditingTestimonialIdx(idx);
    setTestimonialFormData({
      id: t.id || `test-${idx + 1}`,
      name: t.name || "",
      company: t.company || "",
      text: t.text || "",
      rating: t.rating || 5
    });
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormData.name.trim()) {
      toast.error("Please enter client name");
      return;
    }

    let updated: TestimonialItem[];
    if (editingTestimonialIdx !== null) {
      updated = [...testimonials];
      updated[editingTestimonialIdx] = testimonialFormData;
      toast.success(`Updated review from ${testimonialFormData.name}`);
    } else {
      updated = [...testimonials, testimonialFormData];
      toast.success(`Added review from ${testimonialFormData.name}`);
    }

    onUpdate(updated);
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (idx: number, name: string) => {
    if (confirm(`Remove testimonial from "${name}"?`)) {
      const updated = testimonials.filter((_, i) => i !== idx);
      onUpdate(updated);
      toast.success("Testimonial removed");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Client Reviews &amp; Testimonials</h2>
          <p className="text-xs text-slate-500">
            Showcased on the Resources page and dynamically reflected on the main homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddTestimonialModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((item, idx) => (
          <article
            key={item.id || `test-${idx}`}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic mb-3">
                &ldquo;{item.text}&rdquo;
              </p>
            </div>

            <footer className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                <p className="text-[11px] text-slate-500">{item.company}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditTestimonialModal(item, idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(idx, item.name)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete testimonial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </footer>
          </article>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No testimonials found. Click &quot;Add Testimonial&quot; to create one.
          </div>
        )}
      </div>

      {/* Modal: Testimonial */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingTestimonialIdx !== null ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTestimonialModalSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialFormData.name}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                    placeholder="e.g. Mizanur Rahman"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={testimonialFormData.company}
                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, company: e.target.value })}
                    placeholder="e.g. London Oxford Tax"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={testimonialFormData.rating}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Client Review / Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialFormData.text}
                  onChange={(e) => setTestimonialFormData({ ...testimonialFormData, text: e.target.value })}
                  placeholder="Brain Bari delivered our system with flawless precision..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer"
                >
                  {editingTestimonialIdx !== null ? "Update Testimonial" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
