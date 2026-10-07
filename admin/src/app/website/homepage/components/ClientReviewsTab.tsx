"use client";

import React, { useState } from "react";
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  Save,
  MessageSquareQuote,
  CheckCircle2,
  Sparkles,
  Quote,
} from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface ClientReviewsTabProps {
  reviewsSettings: any;
  setReviewsSettings: (s: any) => void;
  reviews: any[];
  setReviews: (r: any[]) => void;
  onSaveAll?: () => void;
}

export default function ClientReviewsTab({
  reviewsSettings,
  setReviewsSettings,
  reviews,
  setReviews,
  onSaveAll,
}: ClientReviewsTabProps) {
  const [saving, setSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [service, setService] = useState("AI Chatbot");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [avatar, setAvatar] = useState("");

  const header = reviewsSettings || {
    badge: "",
    title: "",
    titleHighlight: "",
    description: "",
    ratingText: "",
  };

  const updateHeader = (field: string, val: string) => {
    setReviewsSettings({
      ...header,
      [field]: val,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        adminApi.saveContent("reviewsSettings", header),
        adminApi.saveContent("reviews", reviews),
      ]);
      toast.success("Client Reviews & Testimonials saved to NeonDB!", {
        description: "Homepage client reviews and rating showcase updated live.",
      });
      if (onSaveAll) onSaveAll();
    } catch (err: any) {
      toast.error("Failed to save reviews: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditingReview(null);
    setClientName("");
    setRole("VP of Product at ScaleFlow");
    setService("AI Chatbot");
    setRating(5);
    setReviewText("");
    setAvatar(
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    );
    setIsModalOpen(true);
  };

  const openEdit = (rev: any) => {
    setEditingReview(rev);
    setClientName(rev.clientName || rev.name || "");
    setRole(rev.role || rev.company || "");
    setService(rev.service || "AI Chatbot");
    setRating(Number(rev.rating) || 5);
    setReviewText(rev.review || rev.comment || rev.text || "");
    setAvatar(rev.avatar || "");
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!clientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Review testimonial text is required");
      return;
    }

    const payload = {
      clientName,
      role,
      service,
      rating: Number(rating),
      review: reviewText,
      avatar,
    };

    let updated: any[];
    if (editingReview) {
      updated = reviews.map((r) =>
        r.id === editingReview.id ? { ...r, ...payload } : r
      );
      toast.success(`Updated review from "${clientName}".`);
    } else {
      const newRev = {
        id: `rev-${Date.now()}`,
        ...payload,
      };
      updated = [...reviews, newRev];
      toast.success(`Added new review from "${clientName}".`);
    }

    setReviews(updated);
    await adminApi.saveContent("reviews", updated).catch(() => {});
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const updated = reviews.filter((r) => r.id !== deleteConfirmId);
    setReviews(updated);
    await adminApi.saveContent("reviews", updated).catch(() => {});
    toast.success("Review testimonial removed.");
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Star className="w-4 h-4 fill-white" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Client Testimonials &amp; Rating Carousel
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Controls the <strong>&ldquo;What Our Clients Say About Us&rdquo;</strong> section on the live Homepage (<code className="bg-indigo-100/70 text-indigo-900 px-1 py-0.5 rounded">/</code>). Manage the headline, rating score, and client review cards.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving to NeonDB..." : "Save Testimonials"}</span>
          </button>
        </div>
      </div>

      {/* Header & Rating Settings */}
      <Card header={<h3 className="text-sm font-bold text-slate-900">Section Header &amp; Rating Summary</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="Section Badge Pill">
            <input
              type="text"
              value={header.badge || ""}
              onChange={(e) => updateHeader("badge", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="⭐ Client Testimonials"
            />
          </FormField>

          <FormField label="Rating Summary Text (Top Right)">
            <input
              type="text"
              value={header.ratingText || ""}
              onChange={(e) => updateHeader("ratingText", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="4.9 / 5.0 (120+ reviews)"
            />
          </FormField>

          <FormField label="Headline First Line">
            <input
              type="text"
              value={header.title || ""}
              onChange={(e) => updateHeader("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="What Our Clients"
            />
          </FormField>

          <FormField label="Headline Highlight (Gradient Text)">
            <input
              type="text"
              value={header.titleHighlight || ""}
              onChange={(e) => updateHeader("titleHighlight", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-indigo-700"
              placeholder="Say About Us"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Description Paragraph">
              <textarea
                rows={2}
                value={header.description || ""}
                onChange={(e) => updateHeader("description", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                placeholder="Discover how our conversational AI chatbots, enterprise SaaS products..."
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* Reviews Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Client Review Cards ({reviews.length} Active)
            </h4>
            <p className="text-[11px] text-slate-500">
              Displayed in the interactive horizontal swipe carousel on the homepage.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(Math.min(Math.max(Number(rev.rating) || 5, 1), 5))].map(
                      (_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      )
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {rev.service || "AI Chatbot"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-4">
                  &ldquo;{rev.review || rev.comment || rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {rev.avatar ? (
                    <img
                      src={rev.avatar}
                      alt={rev.clientName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {(rev.clientName || "C").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {rev.clientName || rev.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">
                      {rev.role || rev.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(rev)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(rev.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              No client reviews currently published. Click &ldquo;Add Review&rdquo; to create one.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving to NeonDB..." : "Save Testimonials & Rating to NeonDB"}</span>
        </button>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
                <span>{editingReview ? "Edit Client Review" : "Add New Client Review"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Client Name" required>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </FormField>

                <FormField label="Role & Organization">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VP of Product at ScaleFlow"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Service Offering Tag">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. AI Chatbot, 3D Web App"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>

                <FormField label="Star Rating">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value={5}>5 Stars (Outstanding)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Review Testimonial Text" required>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Enter the full quote or feedback from the client..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none leading-relaxed"
                />
              </FormField>

              <ImageUpload
                label="Client Avatar Photo"
                category="General"
                value={avatar}
                onChange={(url) => setAvatar(url)}
                helpText="Square portrait photo of the client (150x150 recommended)."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs rounded-xl shadow-xs"
              >
                {editingReview ? "Update Review" : "Publish Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to remove this client review from the homepage?"
        confirmLabel="Delete Review"
        isDestructive={true}
      />
    </div>
  );
}
