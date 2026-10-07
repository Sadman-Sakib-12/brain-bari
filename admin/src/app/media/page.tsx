"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  FileText,
  Upload,
  FolderOpen,
  RefreshCw
} from "lucide-react";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import MediaUploadModal from "./components/MediaUploadModal";
import MediaPreviewModal from "./components/MediaPreviewModal";
import MediaGrid from "./components/MediaGrid";

type MediaTab = "all" | "images" | "documents";

function MediaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as MediaTab) || "all";

  const [activeTab, setActiveTab] = useState<MediaTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Upload modal & Preview modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("General Assets");
  const [isUploading, setIsUploading] = useState(false);

  const loadData = async () => {
    try {
      const stored = adminStore.getMedia();
      if (stored && stored.length > 0) setMediaList(stored);

      const fresh = await adminApi.getMediaList();
      if (fresh && fresh.length > 0) {
        setMediaList(fresh);
        adminStore.setMedia(fresh);
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast.success("Media library refreshed from Cloudinary & NeonDB.");
  };

  useEffect(() => {
    setMounted(true);
    loadData();
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
      toast.success(`Copied Cloudinary URL to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.info(`Asset URL: ${item.url}`);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleSaveUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${selectedFile.name}" directly to Cloudinary...`);

    try {
      const result = await adminApi.uploadMedia(selectedFile, uploadCategory);
      if (result && result.url) {
        toast.success(`Uploaded successfully to Cloudinary!`, { id: toastId });
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setFilePreview(null);
        await loadData();
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || "Failed to upload to Cloudinary.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const toastId = toast.loading("Deleting media asset...");
    try {
      await adminApi.deleteMediaAsset(deleteConfirmId);
      const updated = mediaList.filter((m) => m.id !== deleteConfirmId);
      setMediaList(updated);
      adminStore.setMedia(updated);
      toast.success("Media asset deleted from Cloudinary & database.", { id: toastId });
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete media asset.", { id: toastId });
    } finally {
      setDeleteConfirmId(null);
    }
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
      (m.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.url || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchSearch;
  });

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Cloudinary CDN"
        title="Media & Assets Manager"
        description="Centralized Cloudinary media library for website graphics, product mockups, client vector logos, robot illustrations, and legal compliance PDF documents stored securely on Cloudinary CDN and NeonDB PostgreSQL."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
              title="Refresh Media List"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setFilePreview(null);
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload to Cloudinary</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Media Library", icon: FolderOpen, count: mediaList.length },
            { id: "images", label: "Images & Banners", icon: ImageIcon, count: imagesCount },
            { id: "documents", label: "Documents & PDFs", icon: FileText, count: docsCount },
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
          placeholder="Search by asset name, category, or Cloudinary URL..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Cloudinary CDN Enabled
          </span>
          <span>Showing {filteredMedia.length} assets</span>
        </div>
      </div>

      {/* MEDIA GRID */}
      <MediaGrid
        filteredMedia={filteredMedia}
        copiedId={copiedId}
        onCopyUrl={handleCopyUrl}
        onPreview={(item) => setPreviewMedia(item)}
        onDelete={(id) => setDeleteConfirmId(id)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* CLOUDINARY UPLOAD MODAL */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        isUploading={isUploading}
        selectedFile={selectedFile}
        filePreview={filePreview}
        uploadCategory={uploadCategory}
        setUploadCategory={setUploadCategory}
        onFileSelect={handleFileSelect}
        onUpload={handleSaveUpload}
      />

      {/* PREVIEW MODAL */}
      <MediaPreviewModal
        previewMedia={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onCopyUrl={handleCopyUrl}
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        message="Are you sure you want to permanently remove this asset from Cloudinary and NeonDB?"
        confirmLabel="Delete from Cloudinary"
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
