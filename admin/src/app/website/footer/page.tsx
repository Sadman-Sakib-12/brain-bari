"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Shield,
  Share2,
  MoveUp,
  MoveDown,
  Info
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { adminApi } from "@/lib/adminApi";
import { adminStore } from "@/lib/store";
import { toast } from "sonner";

interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
}

export default function FooterCmsPage() {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState<"branding" | "legal" | "social">("branding");

  // Footer Branding & Info
  const [headline, setHeadline] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [copyright, setCopyright] = useState("");
  const [footerLinks, setFooterLinks] = useState<FooterLinkItem[]>([]);

  // Legal / Privacy
  const [termsText, setTermsText] = useState("");
  const [privacyText, setPrivacyText] = useState("");

  // Social Links
  const [socials, setSocials] = useState<any>({});

  const loadData = async () => {
    try {
      const freshSettings = await adminApi.getSettings();
      const current = freshSettings || adminStore.getSettings() || {};
      setSettings(current);

      if (current.footer) {
        if (current.footer.headline) setHeadline(current.footer.headline);
        if (current.footer.aboutText) setAboutText(current.footer.aboutText);
        if (current.footer.copyright) setCopyright(current.footer.copyright);
        if (current.footer.termsText) setTermsText(current.footer.termsText);
        if (current.footer.privacyText) setPrivacyText(current.footer.privacyText);
        if (Array.isArray(current.footer.links) && current.footer.links.length > 0) {
          setFooterLinks(current.footer.links);
        }
      }

      if (current.socials || current.socialLinks) {
        setSocials(current.socials || current.socialLinks || {});
      }
    } catch (err) {
      console.warn("Failed to load footer settings:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleAddLink = () => {
    const newId = `fl-${Date.now()}`;
    setFooterLinks((prev) => [
      ...prev,
      { id: newId, label: "New Link", href: "/page" },
    ]);
  };

  const handleUpdateLink = (id: string, field: "label" | "href", val: string) => {
    setFooterLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteLink = (id: string) => {
    if (footerLinks.length <= 1) {
      toast.error("You must keep at least one footer link.");
      return;
    }
    setFooterLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= footerLinks.length) return;
    const updated = [...footerLinks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setFooterLinks(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedFooter = {
        headline,
        aboutText,
        copyright,
        termsText,
        privacyText,
        links: footerLinks,
      };

      const newSettings = {
        ...settings,
        footer: updatedFooter,
        socials,
        socialLinks: socials,
      };

      await adminApi.updateSettings(newSettings);
      adminStore.setSettings(newSettings);
      setSettings(newSettings);

      toast.success("Footer & Privacy CMS updated successfully!", {
        description: "Public footer links, legal policies and branding are synchronized.",
      });
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save Footer settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Brain Bari CMS"
        title="Footer CMS"
        description="Manage footer 'Let's talk' headline, company description, footer links, copyright notice, and social channels."
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save & Publish"}</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Branding & Info */}
          <div className="space-y-6">
            <Card header={<h3 className="text-sm font-bold text-slate-900">Let&apos;s Talk Section &amp; Copyright</h3>}>
              <div className="space-y-4 text-xs">
                <FormField label="Footer Section Headline">
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                    placeholder="Let's talk"
                  />
                </FormField>

                <FormField label="About Summary (Displayed under headline)">
                  <textarea
                    rows={4}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                    placeholder="Short summary about Brain Bari in the footer..."
                  />
                </FormField>

                <FormField label="Copyright Notice">
                  <input
                    type="text"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                    placeholder="© 2026 Brain Bari. All rights reserved."
                  />
                </FormField>
              </div>
            </Card>
          </div>

          {/* Right: Navigation Links */}
          <div className="space-y-6">
            <Card
              header={
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-bold text-slate-900">
                    Footer Navigation Links ({footerLinks.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-2.5">
                {footerLinks.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center gap-2.5 shadow-2xs transition-all"
                  >
                    <div className="flex flex-col gap-0.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === footerLinks.length - 1}
                        className="p-1 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Label</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateLink(item.id, "label", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Link URL</span>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => handleUpdateLink(item.id, "href", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      {/* Centralized CMS Cross-links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Legal Policies &amp; Compliance</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Privacy Policy, Terms of Service, and NDA disclosures are managed in the central Privacy Policy CMS.
            </p>
          </div>
          <Link
            href="/website/privacy"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors shadow-2xs w-fit"
          >
            <span>Open Privacy Policy CMS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
              <Share2 className="w-4 h-4 text-slate-700" />
              <span>Social Media Profiles</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              LinkedIn, X/Twitter, Upwork, and Facebook URLs are centrally managed under Website Settings.
            </p>
          </div>
          <Link
            href="/settings?tab=social"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs w-fit"
          >
            <span>Open Social Media Settings</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
