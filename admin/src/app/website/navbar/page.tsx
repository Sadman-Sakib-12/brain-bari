"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Megaphone,
  CheckCircle2,
  MoveUp,
  MoveDown,
  Briefcase,
  Handshake,
  Calendar,
  UserCheck,
  BookOpen,
  Layers,
  Cpu,
  ShieldCheck,
  Globe,
  FileText,
  Users,
  Award,
  Star,
  Zap,
  Search,
  ArrowRight,
  Check,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";
import { adminApi } from "@/lib/adminApi";
import { adminStore } from "@/lib/store";
import { toast } from "sonner";

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  highlight?: boolean;
}

export const RESOURCE_ICON_OPTIONS = [
  "Briefcase",
  "Handshake",
  "Calendar",
  "UserCheck",
  "BookOpen",
  "Layers",
  "Cpu",
  "ShieldCheck",
  "Globe",
  "FileText",
  "Users",
  "Award",
  "Star",
  "Zap",
  "Search",
  "Sparkles",
];

export const RESOURCE_ICON_COMPONENTS: Record<string, React.ElementType> = {
  Briefcase,
  Handshake,
  Calendar,
  UserCheck,
  BookOpen,
  Layers,
  Cpu,
  ShieldCheck,
  Globe,
  FileText,
  Users,
  Award,
  Star,
  Zap,
  Search,
  Sparkles,
};

export default function NavbarCmsPage() {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});

  // Brand and Logo state
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Navbar specific states
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [primaryCtaText, setPrimaryCtaText] = useState("");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([]);

  // Services Spotlight Card State
  const [spotlightTitle, setSpotlightTitle] = useState("");
  const [spotlightDesc, setSpotlightDesc] = useState("");
  const [spotlightLinkText, setSpotlightLinkText] = useState("");
  const [spotlightLinkUrl, setSpotlightLinkUrl] = useState("");
  const [spotlightFeatures, setSpotlightFeatures] = useState<string[]>([]);

  // Resources MegaMenu ("Our Resources") State
  const [resHeaderTitle, setResHeaderTitle] = useState("Our Resources");
  const [resLinks, setResLinks] = useState<any[]>([]);
  const [resSpotlightTitle, setResSpotlightTitle] = useState("Knowledge & Insights");
  const [resSpotlightDesc, setResSpotlightDesc] = useState("Explore technical articles, playbooks, and research publications written by our engineering team.");
  const [resSpotlightLinkText, setResSpotlightLinkText] = useState("Explore Blog & Insights");
  const [resSpotlightLinkUrl, setResSpotlightLinkUrl] = useState("/blog");
  const [resSpotlightFeatures, setResSpotlightFeatures] = useState<string[]>([
    "Enterprise AI Case Studies",
    "Generative AI Architectures",
    "SOC2 Data Isolation Playbooks",
    "High-Performance Cloud SaaS",
  ]);

  const loadData = async () => {
    try {
      const freshSettings = await adminApi.getSettings();
      const current = freshSettings || adminStore.getSettings() || {};
      setSettings(current);

      if (current.siteName) setBrandName(current.siteName);
      if (current.logoUrl || current.logo || current.navbar?.logoUrl) {
        setLogoUrl(current.logoUrl || current.logo || current.navbar?.logoUrl || "");
      }

      if (current.navbar) {
        setShowAnnouncement(current.navbar.showAnnouncement !== false);
        if (current.navbar.announcement !== undefined) {
          setAnnouncement(current.navbar.announcement);
        }
        if (current.navbar.ctaText) setPrimaryCtaText(current.navbar.ctaText);
        if (current.navbar.ctaLink) setPrimaryCtaLink(current.navbar.ctaLink);
        if (current.navbar.secondaryCtaText) setSecondaryCtaText(current.navbar.secondaryCtaText);
        if (current.navbar.secondaryCtaLink) setSecondaryCtaLink(current.navbar.secondaryCtaLink);
        if (Array.isArray(current.navbar.links) && current.navbar.links.length > 0) {
          setNavLinks(current.navbar.links);
        }
      }

      // Load MegaMenu Spotlight & Resources MegaMenu
      const [spotlightData, resLinksData, resSpotlightData] = await Promise.all([
        adminApi.getContent("navbarSpotlight"),
        adminApi.getContent("resourcesLinks"),
        adminApi.getContent("resourcesSpotlight"),
      ]);

      if (spotlightData) {
        if (spotlightData.title) setSpotlightTitle(spotlightData.title);
        if (spotlightData.description) setSpotlightDesc(spotlightData.description);
        if (spotlightData.linkText) setSpotlightLinkText(spotlightData.linkText);
        if (spotlightData.linkUrl) setSpotlightLinkUrl(spotlightData.linkUrl);
        if (Array.isArray(spotlightData.features)) setSpotlightFeatures(spotlightData.features);
      }

      if (Array.isArray(resLinksData) && resLinksData.length > 0) {
        setResLinks(resLinksData);
      } else {
        setResLinks([
          { id: "case-studies", title: "Case Studies & ROI", description: "Real-world AI deployment results, metrics, and technical architecture breakdowns.", href: "/resources/case-studies", icon: "Briefcase" },
          { id: "partners", title: "Strategic Partners", description: "Collaborate, integrate, and scale with our certified AI and agency partner network.", href: "/resources/partners", icon: "Handshake" },
          { id: "event", title: "Events & Community", description: "Discover upcoming hackathons, AI symposiums, and technical roadmaps.", href: "/resources/event", icon: "Calendar" },
          { id: "team", title: "Leadership & Team", description: "Meet the specialized software engineers, ML researchers, and architects behind Brain Bari.", href: "/resources/team", icon: "UserCheck" },
        ]);
      }

      if (resSpotlightData) {
        if (resSpotlightData.headerTitle) setResHeaderTitle(resSpotlightData.headerTitle);
        if (resSpotlightData.title) setResSpotlightTitle(resSpotlightData.title);
        if (resSpotlightData.description) setResSpotlightDesc(resSpotlightData.description);
        if (resSpotlightData.linkText) setResSpotlightLinkText(resSpotlightData.linkText);
        if (resSpotlightData.linkUrl) setResSpotlightLinkUrl(resSpotlightData.linkUrl);
        if (Array.isArray(resSpotlightData.features) && resSpotlightData.features.length > 0) {
          setResSpotlightFeatures(resSpotlightData.features);
        }
      }
    } catch (err) {
      console.warn("Failed to load settings:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleAddLink = () => {
    const newId = `nav-${Date.now()}`;
    setNavLinks((prev) => [
      ...prev,
      { id: newId, label: "New Page", href: "/page" },
    ]);
  };

  const handleUpdateLink = (id: string, field: "label" | "href", val: string) => {
    setNavLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteLink = (id: string) => {
    if (navLinks.length <= 1) {
      toast.error("You must have at least one navigation link.");
      return;
    }
    setNavLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navLinks.length) return;
    const updated = [...navLinks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setNavLinks(updated);
  };

  // Resources MegaMenu handlers
  const handleAddResLink = () => {
    const newId = `res-${Date.now()}`;
    setResLinks((prev) => [
      ...prev,
      {
        id: newId,
        title: "New Resource",
        description: "Access specialized guides, documents, and technical assets.",
        href: "/resources/new",
        icon: "Briefcase",
      },
    ]);
  };

  const handleUpdateResLink = (id: string, field: string, val: string) => {
    setResLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteResLink = (id: string) => {
    if (resLinks.length <= 1) {
      toast.error("You should keep at least one resource link.");
      return;
    }
    setResLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveResLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= resLinks.length) return;
    const updated = [...resLinks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setResLinks(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedNavbar = {
        showAnnouncement,
        announcement,
        logoUrl: logoUrl.trim(),
        ctaText: primaryCtaText,
        ctaLink: primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        links: navLinks,
      };

      const newSettings = {
        ...settings,
        siteName: brandName.trim() || "Brain Bari",
        logoUrl: logoUrl.trim(),
        logo: logoUrl.trim(),
        navbar: updatedNavbar,
      };

      await Promise.all([
        adminApi.updateSettings(newSettings),
        adminApi.saveContent("navbarSpotlight", {
          title: spotlightTitle,
          description: spotlightDesc,
          linkText: spotlightLinkText,
          linkUrl: spotlightLinkUrl,
          features: spotlightFeatures,
        }),
        adminApi.saveContent("resourcesLinks", resLinks),
        adminApi.saveContent("resourcesSpotlight", {
          headerTitle: resHeaderTitle,
          title: resSpotlightTitle,
          description: resSpotlightDesc,
          linkText: resSpotlightLinkText,
          linkUrl: resSpotlightLinkUrl,
          features: resSpotlightFeatures,
        }),
      ]);

      adminStore.setSettings(newSettings);
      setSettings(newSettings);

      toast.success("Navbar & Resources CMS updated successfully!", {
        description: "Public website header, links, and 'Our Resources' dropdown are now saved to database.",
      });
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save Navbar settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    loadData();
    toast.info("Refreshed navbar configuration from database.");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Brain Bari CMS"
        title="Navbar & Header CMS"
        description="Configure top announcement notice, public navigation links, and call-to-action buttons in real-time."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>
        }
      />

      {/* Live Preview Bar */}
      <Card header={<h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /> Real-time Header Preview</h3>}>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-inner">
          {showAnnouncement && (
            <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 rounded-xl text-center font-medium truncate flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{announcement || "Announcement message..."}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2.5 font-black text-slate-900 text-lg tracking-tight">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="h-8 w-auto max-w-[120px] object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {brandName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span>{brandName}</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
              {navLinks.map((item) => (
                <span key={item.id} className="hover:text-indigo-600 cursor-pointer transition-colors">
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full">
                {primaryCtaText}
              </span>
              <span className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                {secondaryCtaText}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Brand, Announcement & CTAs */}
        <div className="space-y-6">
          {/* Brand Identity & Logo */}
          <Card header={<h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /> Brand Identity &amp; Logo</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Brand / Company Name" required hint="Changes the company name displayed on public Navbar & throughout the website">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  placeholder="Brain Bari"
                />
              </FormField>

              <ImageUpload
                label="Custom Brand Logo Image (PNG / SVG)"
                category="Branding"
                value={logoUrl}
                onChange={(url) => setLogoUrl(url)}
                helpText="Upload a logo image or enter URL. If left empty, default robot emblem and company name text will be displayed."
              />
            </div>
          </Card>

          {/* Top Announcement Bar */}
          <Card header={<h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Megaphone className="w-4 h-4 text-cyan-600" /> Announcement Banner</h3>}>
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  Display announcement banner at top of header
                </span>
              </label>

              <FormField label="Banner Message Text">
                <input
                  type="text"
                  value={announcement}
                  disabled={!showAnnouncement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="e.g. 🚀 Deploy custom AI chatbots in 48 hours..."
                />
              </FormField>
            </div>
          </Card>

          {/* Action Buttons (CTAs) */}
          <Card header={<h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Compass className="w-4 h-4 text-indigo-600" /> Header Call-To-Action Buttons</h3>}>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-indigo-600">
                  Primary Action (Outline / Pill)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Button Label">
                    <input
                      type="text"
                      value={primaryCtaText}
                      onChange={(e) => setPrimaryCtaText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      placeholder="e.g. Book Consultation"
                    />
                  </FormField>
                  <FormField label="Target Link">
                    <input
                      type="text"
                      value={primaryCtaLink}
                      onChange={(e) => setPrimaryCtaLink(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                      placeholder="e.g. /schedule"
                    />
                  </FormField>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-cyan-600">
                  Secondary Action (Solid / WhatsApp)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Button Label">
                    <input
                      type="text"
                      value={secondaryCtaText}
                      onChange={(e) => setSecondaryCtaText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      placeholder="e.g. Get a Quote"
                    />
                  </FormField>
                  <FormField label="Target Link">
                    <input
                      type="text"
                      value={secondaryCtaLink}
                      onChange={(e) => setSecondaryCtaLink(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                      placeholder="e.g. https://wa.me/..."
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </Card>

          {/* MegaMenu Spotlight Card */}
          <Card header={<h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-600" /> MegaMenu Spotlight Card</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Card Title">
                <input
                  type="text"
                  value={spotlightTitle}
                  onChange={(e) => setSpotlightTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="e.g. Custom Software Solutions"
                />
              </FormField>

              <FormField label="Card Description">
                <textarea
                  rows={2}
                  value={spotlightDesc}
                  onChange={(e) => setSpotlightDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="e.g. Complete technology & security solutions..."
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Button Text">
                  <input
                    type="text"
                    value={spotlightLinkText}
                    onChange={(e) => setSpotlightLinkText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. Explore Custom Software"
                  />
                </FormField>
                <FormField label="Button Link">
                  <input
                    type="text"
                    value={spotlightLinkUrl}
                    onChange={(e) => setSpotlightLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                    placeholder="e.g. /services"
                  />
                </FormField>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                  Highlight Bullet Points ({spotlightFeatures.length})
                </label>
                <div className="space-y-2">
                  {spotlightFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...spotlightFeatures];
                          updated[fIdx] = e.target.value;
                          setSpotlightFeatures(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSpotlightFeatures(spotlightFeatures.filter((_, i) => i !== fIdx));
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Remove Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSpotlightFeatures([...spotlightFeatures, "New Feature Highlight"])}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Navigation Links Manager */}
        <div className="space-y-6">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-bold text-slate-900">
                  Navigation Menu Links ({navLinks.length})
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
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Order and customize the links visible on desktop and mobile drawer:
              </p>

              <div className="space-y-2.5">
                {navLinks.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center gap-2.5 shadow-2xs transition-all group"
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
                        disabled={idx === navLinks.length - 1}
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Path / URL</span>
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
            </div>
          </Card>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RESOURCES MEGAMENU ("Our Resources") DROPDOWN MANAGER */}
      {/* ======================================================== */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Resources MegaMenu Dropdown ("Our Resources")</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the 4 resource cards, icons, descriptions, and the right-hand Knowledge &amp; Insights spotlight card.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddResLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Resource Item</span>
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header Title Field */}
          <div className="max-w-md">
            <FormField label="MegaMenu Header Title" hint="Heading text displayed inside the top of the dropdown">
              <input
                type="text"
                value={resHeaderTitle}
                onChange={(e) => setResHeaderTitle(e.target.value)}
                placeholder="Our Resources"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Resource List Items (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Resource Links ({resLinks.length})
                </label>
                <span className="text-[11px] text-slate-400">
                  Left single-column list in mega menu
                </span>
              </div>

              <div className="space-y-3">
                {resLinks.map((item, idx) => {
                  const CurrentIcon = RESOURCE_ICON_COMPONENTS[item.icon] || Briefcase;
                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 bg-slate-50 border border-slate-200/90 hover:border-purple-300 rounded-2xl space-y-3 shadow-2xs transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                            <CurrentIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            #{idx + 1} {item.title || "Untitled Resource"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => handleMoveResLink(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveResLink(idx, "down")}
                            disabled={idx === resLinks.length - 1}
                            className="p-1 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResLink(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer ml-1"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                        <div className="sm:col-span-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Icon
                          </span>
                          <select
                            value={item.icon || "Briefcase"}
                            onChange={(e) => handleUpdateResLink(item.id, "icon", e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-white"
                          >
                            {RESOURCE_ICON_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-8">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Title / Label
                          </span>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => handleUpdateResLink(item.id, "title", e.target.value)}
                            placeholder="e.g. Case Studies & ROI"
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                          />
                        </div>

                        <div className="sm:col-span-12">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Description
                          </span>
                          <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => handleUpdateResLink(item.id, "description", e.target.value)}
                            placeholder="e.g. Real-world AI deployment results, metrics, and..."
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-600"
                          />
                        </div>

                        <div className="sm:col-span-12">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Target Path / URL
                          </span>
                          <input
                            type="text"
                            value={item.href || ""}
                            onChange={(e) => handleUpdateResLink(item.id, "href", e.target.value)}
                            placeholder="e.g. /resources/case-studies"
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Spotlight Card Editor (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Right Spotlight Card</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Knowledge &amp; Insights
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3.5 text-xs">
                <FormField label="Spotlight Title">
                  <input
                    type="text"
                    value={resSpotlightTitle}
                    onChange={(e) => setResSpotlightTitle(e.target.value)}
                    placeholder="Knowledge & Insights"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white"
                  />
                </FormField>

                <FormField label="Spotlight Description">
                  <textarea
                    rows={2}
                    value={resSpotlightDesc}
                    onChange={(e) => setResSpotlightDesc(e.target.value)}
                    placeholder="Explore technical articles, playbooks, and research publications..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white resize-none"
                  />
                </FormField>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Checkmark Features ({resSpotlightFeatures.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setResSpotlightFeatures([...resSpotlightFeatures, "New Feature Highlight"])}
                      className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Feature</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {resSpotlightFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[3]" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const updated = [...resSpotlightFeatures];
                            updated[fIdx] = e.target.value;
                            setResSpotlightFeatures(updated);
                          }}
                          className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setResSpotlightFeatures(resSpotlightFeatures.filter((_, i) => i !== fIdx))}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Remove Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <FormField label="CTA Button Text">
                    <input
                      type="text"
                      value={resSpotlightLinkText}
                      onChange={(e) => setResSpotlightLinkText(e.target.value)}
                      placeholder="Explore Blog & Insights"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold"
                    />
                  </FormField>
                  <FormField label="CTA Button URL">
                    <input
                      type="text"
                      value={resSpotlightLinkUrl}
                      onChange={(e) => setResSpotlightLinkUrl(e.target.value)}
                      placeholder="/blog"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-mono"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Preview of Resources MegaMenu */}
          <div className="pt-4 border-t border-slate-200/80">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Live MegaMenu Preview (As seen on public site)</span>
            </label>

            <div className="bg-[#f4f2ff] rounded-[24px] p-5 sm:p-6 border border-purple-200/70 shadow-xs max-w-4xl mx-auto">
              {/* Preview Header */}
              <div className="mb-4 pb-2.5 border-b border-purple-200/50">
                <h4 className="text-[17px] font-extrabold text-slate-950 tracking-tight">
                  {resHeaderTitle || "Our Resources"}
                </h4>
                <div className="w-10 h-[3px] bg-[#9a3412] rounded-full mt-1.5" />
              </div>

              {/* Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Left Links List */}
                <div className="md:col-span-7 flex flex-col justify-between gap-2">
                  {resLinks.map((res, index) => {
                    const PreviewIcon = RESOURCE_ICON_COMPONENTS[res.icon] || Briefcase;
                    return (
                      <div
                        key={res.id || index}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-purple-100/70 shadow-2xs"
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-50 text-[#8b4ec9] flex items-center justify-center shrink-0 border border-purple-100">
                          <PreviewIcon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-bold text-slate-950 leading-tight mb-0.5 truncate">
                            {res.title || "Resource Title"}
                          </div>
                          <p className="text-[11px] text-slate-500 font-normal leading-snug line-clamp-1">
                            {res.description || "Resource description..."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Spotlight Card */}
                <div className="md:col-span-5 bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8b4ec9] to-[#ec4899] text-white flex items-center justify-center shadow-xs shrink-0">
                        <BookOpen className="w-4 h-4 stroke-[2]" />
                      </div>
                      <h5 className="text-[14px] font-bold text-slate-950 leading-tight">
                        {resSpotlightTitle || "Knowledge & Insights"}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {resSpotlightDesc || "Description..."}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {resSpotlightFeatures.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                          <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#8b4ec9]">
                      <span>{resSpotlightLinkText || "Explore Blog & Insights"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
