"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";

export const PARTNER_CATEGORIES = [
  "Strategic Integration",
  "Technology Infrastructure",
  "Financial Systems",
  "Academic & Research",
  "Enterprise Client",
  "Healthcare Consortium",
  "Agency & Reseller Partner",
];

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPartner: any | null;
  name: string;
  setName: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  logoInitials: string;
  setLogoInitials: (v: string) => void;
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  onSave: () => void;
}

export default function PartnerModal({
  isOpen,
  onClose,
  editingPartner,
  name,
  setName,
  type,
  setType,
  status,
  setStatus,
  website,
  setWebsite,
  logoInitials,
  setLogoInitials,
  logoUrl,
  setLogoUrl,
  description,
  setDescription,
  isFeatured,
  setIsFeatured,
  onSave,
}: PartnerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPartner ? "Edit Partner Details" : "Add New Partner"}
      subtitle="Manage company name, logo image, partnership tier, and external links."
      maxWidth="lg"
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
            {editingPartner ? "Save Changes" : "Create Partner"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <FormField label="Company / Institute Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. State University of Bangladesh"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category / Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              {PARTNER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="Active Partner">Active Partner</option>
              <option value="Strategic Alliance">Strategic Alliance</option>
              <option value="Prospective Partner">Prospective Partner</option>
              <option value="Inactive">Inactive</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Logo Image URL (Optional)">
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </FormField>

          <FormField label="Fallback Initials (2-3 Letters)">
            <input
              type="text"
              maxLength={4}
              value={logoInitials}
              onChange={(e) => setLogoInitials(e.target.value.toUpperCase())}
              placeholder="SUB"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
            />
          </FormField>
        </div>

        <FormField label="Website URL">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
          />
        </FormField>

        <FormField label="Partnership Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Scope of collaboration, technical integration details, or research initiatives."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
          />
        </FormField>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="partnerFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="partnerFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Featured Partner (Highlight with top priority)
          </label>
        </div>
      </div>
    </Modal>
  );
}
