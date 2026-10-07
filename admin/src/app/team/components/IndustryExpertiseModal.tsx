"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";

interface IndustryExpertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpIdx: number | null;
  expTitle: string;
  setExpTitle: (v: string) => void;
  expBg: string;
  setExpBg: (v: string) => void;
  expPath: string;
  setExpPath: (v: string) => void;
  onSave: () => void;
}

export default function IndustryExpertiseModal({
  isOpen,
  onClose,
  editingExpIdx,
  expTitle,
  setExpTitle,
  expBg,
  setExpBg,
  expPath,
  setExpPath,
  onSave
}: IndustryExpertiseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpIdx !== null ? "Edit Industry Capability Card" : "Add Industry Capability Card"}
      subtitle="Manage the pastel capability cards rendered under 'Our Industry Expertises' on the frontend Team page."
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
            {editingExpIdx !== null ? "Save Changes" : "Create Card"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Real-time preview */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
          <div
            style={{ backgroundColor: expBg || "#faf3e0" }}
            className="flex flex-col items-center justify-center text-center w-[145px] h-[95px] shadow-xs border border-gray-100/60 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px]"
          >
            <div className="mb-2 text-gray-700">
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={expPath || "M12 4v16m8-8H4"} />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-gray-700 px-2 leading-tight">
              {expTitle || "Industry Title"}
            </span>
          </div>
        </div>

        <FormField label="Industry Title / Sector Name" required>
          <input
            type="text"
            value={expTitle}
            onChange={(e) => setExpTitle(e.target.value)}
            placeholder="e.g. Finance & Banking, E-commerce, Telecom"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
          />
        </FormField>

        <FormField label="Card Background Color (Pastel Hex)">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={expBg}
                onChange={(e) => setExpBg(e.target.value)}
                className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer bg-white"
              />
              <input
                type="text"
                value={expBg}
                onChange={(e) => setExpBg(e.target.value)}
                placeholder="#faf3e0"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 font-semibold mr-1">Palettes:</span>
              {[
                "#faf3e0", "#e3f2fd", "#fffde7", "#ffebe6",
                "#f5f5f5", "#fcf8e3", "#e8f5e9", "#fff3e0",
                "#eceff1", "#e0f7fa", "#fbe9e7", "#e0f2f1"
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setExpBg(color)}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                    expBg.toLowerCase() === color.toLowerCase() ? "border-slate-900 scale-110 shadow-xs" : "border-slate-300 hover:scale-105"
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </FormField>

        <FormField label="SVG Icon Path (d attribute)" hint="SVG path used with 24x24 viewBox stroke.">
          <textarea
            rows={3}
            value={expPath}
            onChange={(e) => setExpPath(e.target.value)}
            placeholder="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
          />
        </FormField>
      </div>
    </Modal>
  );
}
