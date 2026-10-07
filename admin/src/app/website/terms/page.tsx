"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  Lock,
  Eye,
  ExternalLink,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  ShieldCheck,
  CreditCard,
  Code2,
  Search,
  Maximize2,
  Minimize2
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { adminApi } from "@/lib/adminApi";
import { adminStore } from "@/lib/store";
import { toast } from "sonner";
import { FRONTEND_URL } from "@/lib/axios";

export interface LegalSectionItem {
  id: string;
  title: string;
  content: string;
}

export default function TermsCmsPage() {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState<"sections" | "header" | "covenants">("sections");

  // Search & Accordion State
  const [clauseSearch, setClauseSearch] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  // Terms & Conditions fields from Backend Database
  const [termsBadge, setTermsBadge] = useState("");
  const [termsTitle, setTermsTitle] = useState("");
  const [termsSubtitle, setTermsSubtitle] = useState("");
  const [termsIpBadge, setTermsIpBadge] = useState("");
  const [termsTocTitle, setTermsTocTitle] = useState("");
  const [termsCrossNote, setTermsCrossNote] = useState("");
  const [termsCrossText, setTermsCrossText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [termsContactHeading, setTermsContactHeading] = useState("");
  const [termsContactDescription, setTermsContactDescription] = useState("");
  const [termsContactButton, setTermsContactButton] = useState("");
  const [termsContactEmail, setTermsContactEmail] = useState("");
  const [termsSections, setTermsSections] = useState<LegalSectionItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadData = async () => {
    try {
      const freshSettings = await adminApi.getSettings();
      const current = freshSettings || adminStore.getSettings() || {};
      setSettings(current);

      const p = current.privacy || {};

      setTermsBadge(p.termsBadge || "");
      setTermsTitle(p.termsTitle || "");
      setTermsSubtitle(p.termsSubtitle || "");
      setTermsIpBadge(p.termsIpBadge || "");
      setTermsTocTitle(p.termsTocTitle || "");
      setTermsCrossNote(p.termsCrossNote || "");
      setTermsCrossText(p.termsCrossText || "");
      setTermsText(p.termsText || current.footer?.termsText || "");
      setPaymentTerms(p.paymentTerms || "");
      setTermsContactHeading(p.termsContactHeading || "");
      setTermsContactDescription(p.termsContactDescription || "");
      setTermsContactButton(p.termsContactButton || "");
      setTermsContactEmail(p.termsContactEmail || "");
      if (Array.isArray(p.termsSections)) {
        setTermsSections(p.termsSections);
        if (p.termsSections.length > 0) {
          setExpandedSection(p.termsSections[0].id);
        }
      }
      setLastUpdated(p.lastUpdated || "");
    } catch (err) {
      console.warn("Failed to load terms settings:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedFooter = {
        ...(settings.footer || {}),
        termsText,
      };

      const updatedPrivacy = {
        ...(settings.privacy || {}),
        termsBadge,
        termsTitle,
        termsSubtitle,
        termsIpBadge,
        termsTocTitle,
        termsCrossNote,
        termsCrossText,
        termsText,
        paymentTerms,
        termsContactHeading,
        termsContactDescription,
        termsContactButton,
        termsContactEmail,
        termsSections,
        lastUpdated,
      };

      const payload = {
        footer: updatedFooter,
        privacy: updatedPrivacy,
      };

      await adminApi.updateSettings(payload);
      setSettings((prev: any) => ({ ...prev, ...payload }));
      toast.success("Terms & Conditions saved to Database successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save terms settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = (index: number, field: "title" | "content", value: string) => {
    setTermsSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddSection = () => {
    const id = `clause-${Date.now()}`;
    const newSection: LegalSectionItem = {
      id,
      title: `${termsSections.length + 1}. New Clause / Legal Provision`,
      content: "Enter detailed clause terms, conditions, scope, and warranties here.",
    };
    setTermsSections((prev) => [...prev, newSection]);
    setExpandedSection(id);
    toast.info("Added new clause. Fill in the details and click Save Changes.");
  };

  const handleDeleteSection = (index: number) => {
    if (termsSections.length <= 1) {
      toast.error("At least one clause is required.");
      return;
    }
    const targetTitle = termsSections[index]?.title || "Clause";
    setTermsSections((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed "${targetTitle}"`);
  };

  // Filter clauses by search query
  const filteredSections = termsSections.filter((sec) => {
    if (!clauseSearch.trim()) return true;
    const q = clauseSearch.toLowerCase();
    return sec.title.toLowerCase().includes(q) || sec.content.toLowerCase().includes(q);
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Page Header */}
      <PageHeader
        title="Terms & Conditions (Dedicated CMS)"
        description="Manage the Master Services Agreement, numbered legal clauses, client IP guarantees, and contracting advisory for /terms."
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={`${FRONTEND_URL}/terms`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Live /terms</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reload DB</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving to Database..." : "Save Terms Changes"}</span>
            </button>
          </div>
        }
      />

      {/* Scope & Quick Switch Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            You are editing <strong>Terms &amp; Conditions</strong> (/terms). All <strong>{termsSections.length} clauses</strong> and settings load dynamically from NeonDB.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-semibold text-[11px]">
          <Link
            href="/website/privacy"
            className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-950 underline underline-offset-2"
          >
            <span>Switch to Privacy Policy CMS</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <span className="text-indigo-300">•</span>
          <Link
            href="/website/footer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
          >
            <span>Footer settings</span>
          </Link>
        </div>
      </div>

      {/* Modern, Intuitive Tab Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "sections"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>Clauses &amp; Legal Text</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-mono">
            {termsSections.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("header")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "header"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Header, Meta &amp; TOC Index</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("covenants")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "covenants"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>IP Guarantee &amp; Contact</span>
        </button>
      </div>

      {/* TAB 1: CLAUSES & LEGAL PROVISIONS */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <Card
            title="Terms Clauses & Provisions"
            subtitle="These are the continuous numbered legal sections displayed in the main body and sticky Table of Contents of /terms."
            headerAction={
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Clause</span>
              </button>
            }
          >
            {/* Toolbar: Search & Expand/Collapse */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={clauseSearch}
                  onChange={(e) => setClauseSearch(e.target.value)}
                  placeholder="Filter clauses by title or keyword..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    setAllExpanded(!allExpanded);
                    setExpandedSection(allExpanded ? null : "all");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                >
                  {allExpanded ? (
                    <>
                      <Minimize2 className="w-3 h-3" />
                      <span>Collapse All</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3 h-3" />
                      <span>Expand All</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-medium text-slate-400">
                  Showing {filteredSections.length} of {termsSections.length}
                </span>
              </div>
            </div>

            {/* Clauses List */}
            <div className="space-y-3 pt-2">
              {filteredSections.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No clauses match "{clauseSearch}". Try a different search term.
                </div>
              ) : (
                filteredSections.map((sec, idx) => {
                  const actualIndex = termsSections.findIndex((s) => s.id === sec.id);
                  const isExpanded = allExpanded || expandedSection === sec.id;
                  const snippet = String(sec.content || "").slice(0, 100).replace(/\n/g, " ");

                  return (
                    <div
                      key={sec.id || idx}
                      className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                    >
                      {/* Clause Row Header */}
                      <div
                        onClick={() => {
                          if (allExpanded) setAllExpanded(false);
                          setExpandedSection(expandedSection === sec.id ? null : sec.id);
                        }}
                        className="flex items-center justify-between p-3.5 bg-slate-50/60 hover:bg-slate-50 cursor-pointer select-none border-b border-slate-100"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                            {actualIndex + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {sec.title}
                            </div>
                            {!isExpanded && snippet && (
                              <div className="text-[11px] text-slate-400 truncate font-normal mt-0.5">
                                {snippet}...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSection(actualIndex);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete this clause"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="p-1 text-slate-400 hover:text-slate-700">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Clause Expanded Editor */}
                      {isExpanded && (
                        <div className="p-4 space-y-4 bg-white">
                          <FormField
                            label="Clause Heading / Title"
                            hint="Appears as the numbered heading on /terms and in the left Table of Contents."
                          >
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => handleUpdateSection(actualIndex, "title", e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                              placeholder="e.g. 1. Master Services Agreement & Scope"
                            />
                          </FormField>

                          <FormField
                            label="Clause Content & Detailed Legal Text"
                            hint="Supports multiple paragraphs (double Enter) and bullet points starting with •"
                          >
                            <textarea
                              rows={6}
                              value={sec.content}
                              onChange={(e) => handleUpdateSection(actualIndex, "content", e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-500 font-sans"
                              placeholder="Enter the full legal clauses, covenants, and conditions..."
                            />
                          </FormField>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: HEADER, META & TABLE OF CONTENTS */}
      {activeTab === "header" && (
        <div className="space-y-6">
          {/* Card 1: Top Hero & Titles */}
          <Card
            title="Page Header & Document Titles"
            subtitle="Configure the top title, subtitle, and badges shown at the beginning of /terms."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Page Main Title"
                  hint="The primary legal document heading (H1) on /terms."
                >
                  <input
                    type="text"
                    value={termsTitle}
                    onChange={(e) => setTermsTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Terms & Conditions"
                  />
                </FormField>

                <FormField
                  label="Hero Top Pill Badge"
                  hint="Small uppercase tag displayed above the page title."
                >
                  <input
                    type="text"
                    value={termsBadge}
                    onChange={(e) => setTermsBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Master Services Agreement & Client Terms"
                  />
                </FormField>
              </div>

              <FormField
                label="Document Subtitle / Summary"
                hint="Introductory statement displayed directly beneath the H1 title."
              >
                <textarea
                  rows={2}
                  value={termsSubtitle}
                  onChange={(e) => setTermsSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="e.g. These Master Services Terms govern the design, engineering, and artificial intelligence development engagements..."
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <FormField
                  label="Effective / Revision Date"
                  hint="Shows when the legal policy was last updated."
                >
                  <input
                    type="text"
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. October 2026"
                  />
                </FormField>

                <FormField
                  label="Client IP Guarantee Pill Badge"
                  hint="Emerald pill tag displayed in the metadata row."
                >
                  <input
                    type="text"
                    value={termsIpBadge}
                    onChange={(e) => setTermsIpBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 100% Client IP Ownership"
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* Card 2: Table of Contents & Cross Links */}
          <Card
            title="Sidebar Table of Contents & Navigation"
            subtitle="Configure the desktop left sticky index and cross-link pointing to Privacy Policy."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  label="Sidebar Index Title"
                  hint="Heading above the clause links."
                >
                  <input
                    type="text"
                    value={termsTocTitle}
                    onChange={(e) => setTermsTocTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Table of Contents"
                  />
                </FormField>

                <FormField
                  label="Cross-Link Note"
                  hint="Help text under the sidebar index."
                >
                  <input
                    type="text"
                    value={termsCrossNote}
                    onChange={(e) => setTermsCrossNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Need enterprise confidentiality details?"
                  />
                </FormField>

                <FormField
                  label="Cross-Link Button Text"
                  hint="Link button pointing to /privacy."
                >
                  <input
                    type="text"
                    value={termsCrossText}
                    onChange={(e) => setTermsCrossText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Read Privacy Policy & NDA"
                  />
                </FormField>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: KEY COVENANTS & CONTACT */}
      {activeTab === "covenants" && (
        <div className="space-y-6">
          {/* Card 1: IP Ownership & Payment Highlights */}
          <Card
            title="Client IP Ownership Guarantee & Payment Governance"
            subtitle="Special legal covenants highlighted on /terms for enterprise prospect assurance."
          >
            <div className="space-y-4">
              <FormField
                label="100% Client Code Ownership Guarantee Statement"
                hint="Displayed as an emerald left-border callout box under the IP Ownership clause."
              >
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. All source code, Figma artifacts, algorithms, and AI agent prompt architectures created for the client are 100% client proprietary property upon milestone sign-off."
                  />
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Live Preview:</strong> This text appears inside a dedicated green assurance callout under the IP clause on /terms.
                    </span>
                  </div>
                </div>
              </FormField>

              <FormField
                label="Payment & Escrow Terms Statement"
                hint="Summary note for milestone and escrow protection guarantees."
              >
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. All milestone payments are held in escrow and released only upon client sprint acceptance sign-off."
                />
              </FormField>
            </div>
          </Card>

          {/* Card 2: Contact Advisory */}
          <Card
            title="Contracting & Legal Inquiries (Page Sign-off)"
            subtitle="Contact block displayed at the bottom of /terms for enterprise contract discussions."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Contact Section Heading"
                  hint="Heading at the end of the legal document."
                >
                  <input
                    type="text"
                    value={termsContactHeading}
                    onChange={(e) => setTermsContactHeading(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Legal & Contracting Inquiries"
                  />
                </FormField>

                <FormField
                  label="Contact Button Text"
                  hint="Text on the email contact button."
                >
                  <input
                    type="text"
                    value={termsContactButton}
                    onChange={(e) => setTermsContactButton(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Contact Contracting Team"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Legal Operations Email"
                  hint="Official email destination for legal and MSA questions."
                >
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={termsContactEmail}
                      onChange={(e) => setTermsContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. legal@brainbari.com"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Contact Description Note"
                  hint="Short explanatory text for prospective clients."
                >
                  <input
                    type="text"
                    value={termsContactDescription}
                    onChange={(e) => setTermsContactDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. For enterprise custom MSAs, purchase order routing, or billing compliance questions..."
                  />
                </FormField>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
