"use client";

import React from "react";
import { Sparkles, DollarSign, Clock, Tag, Layers, Image as ImageIcon, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService: any | null;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formSlug: string;
  setFormSlug: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formPrice: number;
  setFormPrice: (val: number) => void;
  formDays: number;
  setFormDays: (val: number) => void;
  formBadge: string;
  setFormBadge: (val: string) => void;
  formDesc: string;
  setFormDesc: (val: string) => void;
  formFeatures: string;
  setFormFeatures: (val: string) => void;
  formStatus: string;
  setFormStatus: (val: string) => void;
  formFeatured?: boolean;
  setFormFeatured?: (val: boolean) => void;
  formImage: string;
  setFormImage: (val: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function ServiceEditModal({
  isOpen,
  onClose,
  editingService,
  formTitle,
  setFormTitle,
  formSlug,
  setFormSlug,
  formCategory,
  setFormCategory,
  formPrice,
  setFormPrice,
  formDays,
  setFormDays,
  formBadge,
  setFormBadge,
  formDesc,
  setFormDesc,
  formFeatures,
  setFormFeatures,
  formStatus,
  setFormStatus,
  formImage,
  setFormImage,
  onSave,
  isSaving = false,
}: ServiceEditModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingService ? `Edit Service: ${formTitle || "Service Details"}` : "Add New Core Service"}
      subtitle="Configure title, pricing, SLA delivery time, card thumbnail, and key features."
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{editingService ? "Save Service Changes" : "Create Service"}</span>
          </button>
        </>
      }
    >
      <div className="space-y-5 text-xs">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Service Overview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Service Title" required>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. AI Customer Care Chatbot"
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-medium transition-all"
              />
            </FormField>

            <FormField label="Slug (URL identifier)">
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. ai-chatbot"
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:bg-white focus:border-blue-600 text-slate-900 transition-all"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Category" required>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600 cursor-pointer transition-all"
              >
                <option value="AI Chatbot">AI Chatbot</option>
                <option value="AI SaaS">AI SaaS</option>
                <option value="Custom AI Assistant">Custom AI Assistant</option>
                <option value="AI & 3D Web/Apps">AI &amp; 3D Web/Apps</option>
              </select>
            </FormField>

            <FormField label="Badge / Highlight Tag">
              <div className="relative">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. Popular, Hot, Enterprise"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-medium transition-all"
                />
              </div>
            </FormField>
          </div>
        </div>

        {/* SECTION 2: PRICING & SLA DELIVERY */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Pricing &amp; SLA Delivery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <FormField label="Starting Price ($)" required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-mono text-xs font-bold text-blue-600 outline-none focus:bg-white focus:border-blue-600 transition-all"
                />
              </div>
            </FormField>

            <FormField label="Delivery Time (Days)">
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={1}
                  value={formDays}
                  onChange={(e) => setFormDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
                />
              </div>
            </FormField>

            <FormField label="Publish Status">
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600 cursor-pointer transition-all"
              >
                <option value="Active">Active (Live on Website)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* SECTION 3: VISUAL & THUMBNAIL */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>Card Graphic / Thumbnail</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <ImageUpload
              label="Upload Thumbnail Image"
              category="Services"
              value={formImage}
              onChange={setFormImage}
              helpText="Select an image file or enter direct URL below."
            />

            <div>
              <FormField label="Direct Image URL">
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-[11px] font-mono outline-none focus:bg-white focus:border-blue-600 text-slate-800 transition-all"
                />
              </FormField>

              {/* LIVE THUMBNAIL PREVIEW */}
              <div className="mt-2.5">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Card Preview
                </span>
                <div className="h-28 rounded-xl bg-slate-900 overflow-hidden border border-slate-200 relative flex items-center justify-center">
                  {formImage ? (
                    <img
                      src={formImage}
                      alt="Service preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-500 text-[11px] font-medium">
                      No image selected yet
                    </span>
                  )}
                  {formBadge && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                      {formBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: DESCRIPTION & DELIVERABLES */}
        <div className="space-y-3.5 pt-2">
          <FormField label="Short Description" hint="Shown on website service cards">
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief summary of what this core service provides..."
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-medium transition-all"
            />
          </FormField>

          <FormField
            label="Key Deliverables / Features"
            hint="One per line"
          >
            <textarea
              rows={3}
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
              placeholder="Custom AI Training on Business Docs&#10;24/7 Real-Time Customer Support&#10;Human Handoff &amp; CRM Sync"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:bg-white focus:border-blue-600 text-slate-900 transition-all leading-relaxed"
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
