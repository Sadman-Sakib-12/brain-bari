"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  PackageCheck,
  Clock,
  DollarSign,
  Layers,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Loader2,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";

interface ServicesPackagesTabProps {
  services: any[];
  packagesData: any;
  setPackagesData: React.Dispatch<React.SetStateAction<any>>;
  selectedSlug?: string;
  setSelectedSlug?: (slug: string) => void;
}

export default function ServicesPackagesTab({
  services,
  packagesData,
  setPackagesData,
  selectedSlug: controlledSelectedSlug,
  setSelectedSlug: controlledSetSelectedSlug,
}: ServicesPackagesTabProps) {
  // Currently selected service slug to manage packages for
  const defaultSlug = services[0]?.slug || "ai-chatbot";
  const [internalSelectedSlug, setInternalSelectedSlug] = useState<string>(defaultSlug);

  const selectedSlug =
    controlledSelectedSlug !== undefined ? controlledSelectedSlug : internalSelectedSlug;
  const setSelectedSlug =
    controlledSetSelectedSlug !== undefined
      ? controlledSetSelectedSlug
      : setInternalSelectedSlug;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [pkgTitle, setPkgTitle] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgTurnaround, setPkgTurnaround] = useState("");
  const [pkgImage, setPkgImage] = useState("");
  const [pkgDesc, setPkgDesc] = useState("");
  const [pkgFeatures, setPkgFeatures] = useState("");

  const currentService =
    services.find((s) => s.slug === selectedSlug) ||
    services[0] || {
      title: "Service",
      slug: selectedSlug,
    };

  const serviceEntry = packagesData[selectedSlug] || {};
  const packagesList: any[] = Array.isArray(serviceEntry.packages)
    ? serviceEntry.packages
    : [];

  const openAddModal = () => {
    setEditingPkg(null);
    setPkgTitle("");
    setPkgPrice(currentService.price ? `$${currentService.price}` : "$499");
    setPkgTurnaround(
      currentService.deliveryDays
        ? `${currentService.deliveryDays} Days Turnaround`
        : "7 Days Turnaround"
    );
    setPkgImage(currentService.image || "");
    setPkgDesc("");
    setPkgFeatures(
      Array.isArray(currentService.features) ? currentService.features.join("\n") : ""
    );
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: any) => {
    setEditingPkg(pkg);
    setPkgTitle(pkg.title || "");
    setPkgPrice(pkg.price || "");
    setPkgTurnaround(
      pkg.meta
        ? pkg.meta.replace(/^Starting at \$?[0-9,]+\s*•\s*/i, "")
        : "7 Days Turnaround"
    );
    setPkgImage(pkg.image || "");
    setPkgDesc(pkg.description || "");
    setPkgFeatures(
      Array.isArray(pkg.features)
        ? pkg.features.join("\n")
        : typeof pkg.features === "string"
        ? pkg.features
        : ""
    );
    setIsModalOpen(true);
  };

  const handleSavePackage = async () => {
    if (!pkgTitle.trim()) {
      toast.error("Please enter a package title.");
      return;
    }

    const featureArr = pkgFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const priceText = pkgPrice.trim() || "$499";
    const turnaroundText = pkgTurnaround.trim() || "7 Days Turnaround";
    const metaString = `Starting at ${priceText} • ${turnaroundText}`;

    const newPackageObj = {
      id: editingPkg ? editingPkg.id : `pkg-${Date.now()}`,
      title: pkgTitle.trim(),
      price: priceText,
      meta: metaString,
      image:
        pkgImage.trim() ||
        currentService.image ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      description: pkgDesc.trim(),
      features: featureArr,
      link: `/order?service=${encodeURIComponent(pkgTitle.trim())}`,
    };

    let updatedPackages: any[];
    if (editingPkg) {
      updatedPackages = packagesList.map((p) =>
        p.id === editingPkg.id ? newPackageObj : p
      );
    } else {
      updatedPackages = [...packagesList, newPackageObj];
    }

    const updatedPackagesData = {
      ...packagesData,
      [selectedSlug]: {
        ...serviceEntry,
        image: serviceEntry.image || currentService.image,
        heroTitleGradient: serviceEntry.heroTitleGradient || currentService.title,
        packages: updatedPackages,
      },
    };

    setIsSaving(true);
    try {
      await adminApi.saveContent("servicePackages", updatedPackagesData);
      setPackagesData(updatedPackagesData);
      toast.success(
        editingPkg
          ? `Package "${pkgTitle}" updated successfully!`
          : `New package "${pkgTitle}" added!`
      );
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save package. Please check backend connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!deleteConfirmId) return;

    const updatedPackages = packagesList.filter((p) => p.id !== deleteConfirmId);
    const updatedPackagesData = {
      ...packagesData,
      [selectedSlug]: {
        ...serviceEntry,
        packages: updatedPackages,
      },
    };

    try {
      await adminApi.saveContent("servicePackages", updatedPackagesData);
      setPackagesData(updatedPackagesData);
      toast.success("Package removed.");
    } catch {
      toast.error("Failed to delete package.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* EXPLANATORY BANNER */}
      <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-950 leading-relaxed">
          <strong className="font-bold block text-sm mb-0.5">
            Service Package Offerings Manager
          </strong>
          These are the horizontal cards displayed below the hero section on each service&apos;s
          live page (e.g. at <code>/services/{selectedSlug}</code>). You can add new package cards
          with custom images, prices, and features, or edit existing ones directly from here.
        </div>
      </div>

      {/* SERVICE SELECTOR TABS / PILLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Select Service to Manage its Packages:</span>
          </span>

          <a
            href={`${FRONTEND_URL}/services/${selectedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Preview Live Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {services.map((srv) => {
            const isSelected = selectedSlug === srv.slug;
            const srvPkgs = packagesData[srv.slug]?.packages || [];

            return (
              <button
                key={srv.slug}
                type="button"
                onClick={() => setSelectedSlug(srv.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                }`}
              >
                <span>{srv.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {srvPkgs.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SERVICE PACKAGES HEADER & ADD BUTTON */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
            Managing Packages for:
          </span>
          <h3 className="text-base font-bold text-slate-900">{currentService.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {packagesList.length} package card{packagesList.length !== 1 ? "s" : ""} active on{" "}
            <code className="text-slate-700 font-mono text-[11px]">
              /services/{selectedSlug}
            </code>
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* PACKAGES LIST */}
      {packagesList.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-3">
          <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            No Packages Configured for this Service Yet
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click &ldquo;Add New Package&rdquo; above to create deliverable package cards with custom
            images, pricing, and turnaround SLA.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Package</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {packagesList.map((pkg, idx) => (
            <div
              key={pkg.id || idx}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs transition-all flex flex-col md:flex-row items-center gap-5 justify-between group"
            >
              {/* LEFT: THUMBNAIL IMAGE */}
              <div className="w-full md:w-[220px] aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-100 shrink-0 relative">
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              {/* CENTER: DETAILS */}
              <div className="flex-1 space-y-2 text-center md:text-left min-w-0">
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <h4 className="text-base font-bold text-slate-900">{pkg.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold font-mono">
                    {pkg.price || "Start $499"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-semibold">{pkg.meta}</p>

                {pkg.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                )}

                {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {pkg.features.slice(0, 3).map((f: string, fIdx: number) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: EDIT & DELETE ACTIONS */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => openEditModal(pkg)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Package</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(pkg.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PACKAGE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingPkg
            ? `Edit Package: ${pkgTitle || "Details"}`
            : `Add Package for: ${currentService.title}`
        }
        subtitle="This package will be rendered as a card with an image on the live website."
        maxWidth="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePackage}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingPkg ? "Save Package Changes" : "Create Package"}</span>
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <FormField label="Package Title" required>
            <input
              type="text"
              value={pkgTitle}
              onChange={(e) => setPkgTitle(e.target.value)}
              placeholder="e.g. Smart Website AI Chatbot"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-semibold"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Price Label" required>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(e.target.value)}
                  placeholder="e.g. Start $499 or $799"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-mono text-xs font-bold"
                />
              </div>
            </FormField>

            <FormField label="Delivery Turnaround" required>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={pkgTurnaround}
                  onChange={(e) => setPkgTurnaround(e.target.value)}
                  placeholder="e.g. 5 Days Turnaround"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>
            </FormField>
          </div>

          {/* PACKAGE IMAGE WITH LIVE PREVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
            <ImageUpload
              label="Package Image / Visual"
              category="Services"
              value={pkgImage}
              onChange={setPkgImage}
              helpText="Upload an image for this package card."
            />

            <div>
              <FormField label="Direct Image URL">
                <input
                  type="text"
                  value={pkgImage}
                  onChange={(e) => setPkgImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono outline-none focus:bg-white focus:border-blue-600 text-slate-800"
                />
              </FormField>

              {/* LIVE CARD PREVIEW */}
              <div className="mt-2.5">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Card Thumbnail Preview
                </span>
                <div className="h-28 rounded-xl bg-slate-900 overflow-hidden border border-slate-200 relative flex items-center justify-center">
                  {pkgImage ? (
                    <img
                      src={pkgImage}
                      alt="Package preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-500 text-[11px] font-medium">
                      No image selected yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <FormField label="Package Description">
            <textarea
              rows={2}
              value={pkgDesc}
              onChange={(e) => setPkgDesc(e.target.value)}
              placeholder="Brief summary of what is included in this package..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 text-slate-900 font-medium"
            />
          </FormField>

          <FormField label="Key Features / Deliverables" hint="One per line">
            <textarea
              rows={3}
              value={pkgFeatures}
              onChange={(e) => setPkgFeatures(e.target.value)}
              placeholder="Custom RAG Training&#10;WhatsApp Cloud API&#10;Live Agent Escalation"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:bg-white focus:border-blue-600 text-slate-900"
            />
          </FormField>
        </div>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeletePackage}
        title="Delete Package"
        message="Are you sure you want to remove this package? It will immediately disappear from the live website service page."
        confirmLabel="Delete Package"
        isDestructive={true}
      />
    </div>
  );
}
