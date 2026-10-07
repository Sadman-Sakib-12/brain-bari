"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: any | null;
  title: string;
  setTitle: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  featuresText: string;
  setFeaturesText: (v: string) => void;
  demoUrl: string;
  setDemoUrl: (v: string) => void;
  logoIcon: string;
  setLogoIcon: (v: string) => void;
  logoColor: string;
  setLogoColor: (v: string) => void;
  logoBadge: string;
  setLogoBadge: (v: string) => void;
  logoSubtitle: string;
  setLogoSubtitle: (v: string) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  onSave: () => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  title,
  setTitle,
  tagline,
  setTagline,
  category,
  setCategory,
  status,
  setStatus,
  description,
  setDescription,
  featuresText,
  setFeaturesText,
  demoUrl,
  setDemoUrl,
  logoIcon,
  setLogoIcon,
  logoColor,
  setLogoColor,
  logoBadge,
  setLogoBadge,
  logoSubtitle,
  setLogoSubtitle,
  isFeatured,
  setIsFeatured,
  onSave
}: ProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? "Edit Product" : "Add New Product"}
      subtitle="Manage product specifications and client showcase details."
      maxWidth="2xl"
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
            {editingProduct ? "Save Changes" : "Create Product"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Product Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brain Bari AI Assistant Suite"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Product Tagline">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Next-Gen Enterprise Automation Engine"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="AI Chatbots Platform">AI Chatbots Platform</option>
              <option value="AI SaaS Automation Suite">AI SaaS Automation Suite</option>
              <option value="Custom AI Development Tools">Custom AI Development Tools</option>
              <option value="AI Health Info System">AI Health Info System</option>
            </select>
          </FormField>

          <FormField label="Release Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="Production Ready">Production Ready</option>
              <option value="Beta Live">Beta Live</option>
              <option value="Under Development">Under Development</option>
            </select>
          </FormField>
        </div>

        <FormField label="Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this product do for businesses?"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Key Features (One per line)">
          <textarea
            rows={3}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
          />
        </FormField>

        <FormField label="Live Demo URL">
          <input
            type="text"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
          />
        </FormField>

        {/* Product Logo & Identity */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Product Logo &amp; Identity Badge</span>
          </h4>

          {/* Live Visual Preview */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3 w-max">
            <div className={`w-9 h-9 rounded-full ${logoColor} text-white flex items-center justify-center shrink-0 font-bold text-xs uppercase shadow-xs`}>
              {logoIcon.slice(0, 2)}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">{logoBadge || "Badge"}</span>
              <span className="text-[10px] text-slate-500 block">{logoSubtitle || "Subtitle"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Logo Icon">
              <select
                value={logoIcon}
                onChange={(e) => setLogoIcon(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="heart">Heart (Healthcare / Wellness)</option>
                <option value="eye">Eye (Ballot / Verification / Vision)</option>
                <option value="message">Message (Legal / Chat / Counsel)</option>
                <option value="book">Book (EduBari / Learning / Academy)</option>
                <option value="sparkles">Sparkles (AI Suite / Innovation)</option>
                <option value="shield">Shield (Security / Compliance)</option>
              </select>
            </FormField>

            <FormField label="Logo Color Style">
              <select
                value={logoColor}
                onChange={(e) => setLogoColor(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="bg-rose-500">Rose Red (bg-rose-500)</option>
                <option value="bg-blue-600">Blue (bg-blue-600)</option>
                <option value="bg-indigo-600">Indigo (bg-indigo-600)</option>
                <option value="bg-emerald-600">Emerald Green (bg-emerald-600)</option>
                <option value="bg-violet-600">Violet Purple (bg-violet-600)</option>
                <option value="bg-amber-500">Amber (bg-amber-500)</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Logo Badge Label">
              <input
                type="text"
                value={logoBadge}
                onChange={(e) => setLogoBadge(e.target.value)}
                placeholder="e.g. HealthBari, BallotEye, LawBari"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
              />
            </FormField>

            <FormField label="Logo Subtitle">
              <input
                type="text"
                value={logoSubtitle}
                onChange={(e) => setLogoSubtitle(e.target.value)}
                placeholder="e.g. AI Health Platform"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
              />
            </FormField>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="prodFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="prodFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Mark as Featured Product
          </label>
        </div>
      </div>
    </Modal>
  );
}
