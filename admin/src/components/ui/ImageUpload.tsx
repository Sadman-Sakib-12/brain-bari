"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Copy,
  Check,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  category?: string;
  placeholder?: string;
  compact?: boolean;
  required?: boolean;
  helpText?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  category = "General Assets",
  compact = false,
  required = false,
  helpText,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setManualUrl(value || "");
  }, [value]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      toast.error("Please upload a valid image (PNG, JPG, WebP, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${file.name}"...`);

    try {
      const result = await adminApi.uploadMedia(file, category);
      if (result && result.url) {
        onChange(result.url);
        setManualUrl(result.url);
        toast.success(`Image uploaded successfully!`, { id: toastId });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err?.response?.data?.message || "Failed to upload image.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Image URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.info(`URL: ${value}`);
    }
  };

  const handleSaveManualUrl = () => {
    onChange(manualUrl.trim());
    setIsManualEdit(false);
    toast.success("Image URL updated.");
  };

  const handleClear = () => {
    onChange("");
    setManualUrl("");
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsManualEdit(!isManualEdit)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{isManualEdit ? "Close URL" : "Paste URL"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Manual URL Input dropdown / toggle */}
      {isManualEdit && (
        <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste image URL..."
            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
          />
          <button
            type="button"
            onClick={handleSaveManualUrl}
            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs rounded-lg cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Active Image Preview & Controls */}
      {value ? (
        <div
          className={`relative border border-slate-200 bg-white rounded-xl overflow-hidden p-2.5 flex items-center gap-3 transition-colors ${
            compact ? "h-16" : "h-24"
          }`}
        >
          {/* Thumbnail preview */}
          <div className="relative h-full aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
            {value.endsWith(".pdf") ? (
              <span className="text-xs font-bold font-mono text-indigo-600 uppercase">PDF</span>
            ) : (
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://res.cloudinary.com/lndolcud/image/upload/v1791406629/brain-bari/service_ai_chatbot.jpg";
                }}
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimized
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5" title={value}>
              {value}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Copy Image URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Open full size"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Replace</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
              : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
          } ${compact ? "p-3 py-4" : "p-5"}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-indigo-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <UploadCloud className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xs font-semibold text-slate-700">
                <span>Click to upload image</span>{" "}
                <span className="text-slate-400 font-normal">or drag &amp; drop</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                PNG, JPG, WebP, SVG up to 10MB · Instant cloud upload
              </div>
            </div>
          )}
        </div>
      )}

      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}
    </div>
  );
}
