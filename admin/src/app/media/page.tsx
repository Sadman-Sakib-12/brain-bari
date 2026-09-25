"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  FileText,
  Upload,
  Copy,
  Check,
  Eye,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Search,
  Filter,
  ExternalLink,
  Download,
  FolderOpen
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialMedia from "@/data/media.json";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type MediaTab = "all" | "images" | "documents";

function MediaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as MediaTab) || "all";

  const [activeTab, setActiveTab] = useState<MediaTab>(initialTab);
  const [mediaList, setMediaList] = useState<any[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal & Preview modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Upload form fields
  const [uploadName, setUploadName] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"image" | "document">("image");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadCategory, setUploadCategory] = useState("General Assets");
  const [uploadSize, setUploadSize] = useState("320 KB");
  const [uploadDimensions, setUploadDimensions] = useState("1200 x 800");

  const loadData = () => {
    try {
      const stored = adminStore.getMedia();
      if (stored && stored.length > 0) setMediaList(stored);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as MediaTab;
    if (tab && ["all", "images", "documents"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: MediaTab) => {
    setActiveTab(tab);
    router.push(tab === "all" ? "/media" : `/media?tab=${tab}`);
  };

  const handleCopyUrl = (item: any) => {
    try {
      navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      toast.success(`Copied asset URL to clipboard: ${item.name}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.info(`Asset URL: ${item.url}`);
    }
  };

  const handleSaveUpload = () => {
    if (!uploadName.trim() || !uploadUrl.trim()) {
      toast.error("File name and URL are required.");
      return;
    }

    const newItem = {
      id: `med-${Date.now()}`,
      name: uploadName,
      title: uploadTitle || uploadName,
      type: uploadType,
      format: uploadType === "image" ? "JPG" : "PDF",
      size: uploadSize,
      dimensions: uploadType === "image" ? uploadDimensions : "Document",
      url: uploadUrl,
      category: uploadCategory,
      uploadedAt: new Date().toISOString()
    };

    const updated = [newItem, ...mediaList];
    setMediaList(updated);
    adminStore.setMedia(updated);
    toast.success(`Asset "${uploadName}" uploaded and saved to library.`);
    setIsUploadModalOpen(false);

    // Reset
    setUploadName("");
    setUploadTitle("");
    setUploadUrl("");
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = mediaList.filter((m) => m.id !== deleteConfirmId);
    setMediaList(updated);
    adminStore.setMedia(updated);
    toast.success("Media asset deleted.");
    setDeleteConfirmId(null);
  };

  const imagesCount = mediaList.filter((m) => m.type === "image").length;
  const docsCount = mediaList.filter((m) => m.type === "document").length;

  const filteredMedia = mediaList.filter((m) => {
    const matchType =
      activeTab === "all" ||
      (activeTab === "images" && m.type === "image") ||
      (activeTab === "documents" && m.type === "document");

    const matchSearch =
      (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Media Library"
        title="Media &amp; Assets Manager"
        description="Centralized library for high-resolution graphics, product mockups, client vector logos, and legal compliance PDF documents."
        actions={
          <button
            type="button"
            onClick={() => {
              setUploadName("");
              setUploadTitle("");
              setUploadUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80");
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Asset</span>
          </button>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Media Library", icon: FolderOpen, count: mediaList.length },
            { id: "images", label: "Images & Banners", icon: ImageIcon, count: imagesCount },
            { id: "documents", label: "Documents & PDFs", icon: FileText, count: docsCount }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as MediaTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* SEARCH AND CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by asset name, category, or title..."
          className="w-full sm:w-80"
        />

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredMedia.length} assets
        </div>
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors group"
          >
            {/* Asset Preview Frame */}
            <div className="relative h-36 bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                  <FileText className="w-10 h-10 text-indigo-600" />
                  <span className="text-[11px] font-bold text-slate-700 uppercase font-mono">{item.format || "PDF"}</span>
                </div>
              )}

              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                  {item.category || "Asset"}
                </span>
              </div>
            </div>

            {/* Asset Metadata */}
            <div className="p-3.5 space-y-1.5 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
                {item.title || item.name}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 truncate" title={item.name}>
                {item.name}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span>{item.size || "150 KB"}</span>
                <span>{item.dimensions || ""}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-3.5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyUrl(item)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                  copiedId === item.id
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-slate-700 hover:text-slate-900 border-slate-200"
                }`}
                title="Copy asset URL"
              >
                {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewMedia(item)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD SIMULATOR MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Media Asset"
        subtitle="Add a graphic or document to the centralized CDN media store."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveUpload}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              Add to Library
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Asset Type">
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                <option value="image">Image (JPG / PNG / WebP / SVG)</option>
                <option value="document">Document (PDF / DOC)</option>
              </select>
            </FormField>

            <FormField label="Category">
              <input
                type="text"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                placeholder="Hero / Services / Projects"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <FormField label="Display Title" required>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Hero Robot AI Simulation Banner"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="File Name (with extension)" required>
            <input
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="e.g. hero_robot_ai.jpg"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <FormField label="Asset URL or Path" required>
            <input
              type="text"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or /images/..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="File Size Estimate">
              <input
                type="text"
                value={uploadSize}
                onChange={(e) => setUploadSize(e.target.value)}
                placeholder="250 KB"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Dimensions / Pages">
              <input
                type="text"
                value={uploadDimensions}
                onChange={(e) => setUploadDimensions(e.target.value)}
                placeholder="1200 x 800"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* PREVIEW MODAL */}
      {previewMedia && (
        <Modal
          isOpen={!!previewMedia}
          onClose={() => setPreviewMedia(null)}
          title={previewMedia.title || previewMedia.name}
          subtitle={`${previewMedia.format} · ${previewMedia.size} · ${previewMedia.dimensions || ""}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewMedia)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            {previewMedia.type === "image" ? (
              <img
                src={previewMedia.url}
                alt={previewMedia.title}
                className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-200 bg-slate-50"
              />
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">{previewMedia.name}</h4>
                <p className="text-slate-500">Document available in official records.</p>
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open / Download Document</span>
                </a>
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 break-all select-all">
              {previewMedia.url}
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        message="Are you sure you want to remove this asset from the library?"
        confirmLabel="Delete Asset"
        isDestructive={true}
      />
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Media...</div>}>
      <MediaContent />
    </Suspense>
  );
}
