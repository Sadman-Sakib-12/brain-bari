"use client";

import React, { useRef, useState } from "react";
import { Upload, UploadCloud, Loader2, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUploading: boolean;
  selectedFile: File | null;
  filePreview: string | null;
  uploadCategory: string;
  setUploadCategory: (c: string) => void;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
}

export default function MediaUploadModal({
  isOpen,
  onClose,
  isUploading,
  selectedFile,
  filePreview,
  uploadCategory,
  setUploadCategory,
  onFileSelect,
  onUpload
}: MediaUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isUploading && onClose()}
      title="Upload Asset to Cloudinary CDN"
      subtitle="Select or drop any image or document from your computer to store on Cloudinary."
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading || !selectedFile}
            onClick={onUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading to Cloudinary...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload &amp; Save</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* File Picker / Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onFileSelect(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          {filePreview ? (
            <div className="space-y-2">
              <img
                src={filePreview}
                alt="Preview"
                className="max-h-36 mx-auto rounded-xl object-contain shadow-xs border border-slate-200"
              />
              <p className="text-xs font-bold text-slate-800">{selectedFile?.name}</p>
              <p className="text-[11px] text-slate-400">
                {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ""} · Click to choose different file
              </p>
            </div>
          ) : selectedFile ? (
            <div className="space-y-1.5">
              <FileText className="w-10 h-10 text-indigo-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-400">{Math.round(selectedFile.size / 1024)} KB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">Click to choose a file</span>
                <span className="text-slate-500"> or drag and drop here</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WebP, SVG, and PDF documents (up to 10MB)
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="General Assets">General Assets</option>
              <option value="Client Logos">Client Logos</option>
              <option value="Services">Services</option>
              <option value="Products">Products</option>
              <option value="Team & Avatars">Team &amp; Avatars</option>
              <option value="Hero & Banners">Hero &amp; Banners</option>
              <option value="Brand Graphics">Brand Graphics</option>
              <option value="Documents">Legal &amp; Compliance PDFs</option>
            </select>
          </FormField>

          <FormField label="Target Cloudinary Folder">
            <input
              type="text"
              value="brain-bari"
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-mono text-[11px]"
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
