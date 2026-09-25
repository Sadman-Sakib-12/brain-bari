"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Globe,
  Share2,
  Mail,
  User,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Layers,
  Key
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialSettings from "@/data/siteSettings.json";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type SettingsTab = "general" | "seo" | "social" | "email" | "profile" | "security";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "general";

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [settings, setSettings] = useState<any>(initialSettings);
  const [saved, setSaved] = useState(false);

  // Admin profile state
  const [profileName, setProfileName] = useState("Lead Admin");
  const [profileEmail, setProfileEmail] = useState("admin@botbari.com");
  const [profileRole, setProfileRole] = useState("Super Administrator");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Email SMTP settings
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [senderEmail, setSenderEmail] = useState("no-reply@botbari.com");
  const [notifyEmail, setNotifyEmail] = useState("admin@botbari.com");

  // SEO
  const [seoTitle, setSeoTitle] = useState("Botbari – Next-Gen AI & Software Solutions Agency");
  const [seoDesc, setSeoDesc] = useState("Premier AI agency specializing in conversational AI chatbots, AI SaaS platforms, and interactive 3D web applications.");
  const [seoKeywords, setSeoKeywords] = useState("AI Chatbots, AI SaaS, Custom AI Assistant, Botbari, Dhaka, Bangladesh, Enterprise Software");

  const loadData = () => {
    try {
      const stored = adminStore.getSettings();
      if (stored && stored.siteName) setSettings(stored);

      const user = localStorage.getItem("brainbari_admin_user");
      if (user) {
        const u = JSON.parse(user);
        if (u.name) setProfileName(u.name);
        if (u.email) setProfileEmail(u.email);
        if (u.role) setProfileRole(u.role);
      }
    } catch {
      setSettings(initialSettings);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as SettingsTab;
    if (tab && ["general", "seo", "social", "email", "profile", "security"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`);
  };

  const handleSaveAll = () => {
    adminStore.setSettings(settings);
    try {
      localStorage.setItem(
        "brainbari_admin_user",
        JSON.stringify({
          name: profileName,
          email: profileEmail,
          role: profileRole
        })
      );
      window.dispatchEvent(new Event("admin_auth_updated"));
    } catch {
      // safe fallback
    }

    setSaved(true);
    toast.success("Settings saved successfully!", {
      description: "Platform configuration updated and synchronized."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendTestEmail = () => {
    toast.info(`Sending test dispatch to ${notifyEmail}...`);
    setTimeout(() => {
      toast.success(`Test email successfully delivered to ${notifyEmail}!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise Console / Configuration"
        title="Settings &amp; Global Options"
        description="Configure system preferences, search engine optimization, email delivery, admin authorization, and platform security."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save All Settings"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "general", label: "General Settings", icon: Settings },
            { id: "seo", label: "SEO Settings", icon: Globe },
            { id: "social", label: "Social Settings", icon: Share2 },
            { id: "email", label: "Email Settings", icon: Mail },
            { id: "profile", label: "Admin Profile", icon: User },
            { id: "security", label: "Security", icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Platform Identity &amp; Branding</h3>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <FormField label="Platform Name" required>
                <input
                  type="text"
                  value={settings.siteName || "Brain Bari"}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </FormField>

              <FormField label="Company Tagline">
                <input
                  type="text"
                  value={settings.tagline || "AI & Software Solutions Agency"}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Base Currency">
                <input
                  type="text"
                  defaultValue="USD ($)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono"
                  readOnly
                />
              </FormField>

              <FormField label="Server Timezone">
                <input
                  type="text"
                  defaultValue="Asia/Dhaka (GMT+6)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  readOnly
                />
              </FormField>
            </div>
          </Card>

          <Card header={<h3 className="text-sm font-bold text-slate-900">Global Navbar Announcement Bar</h3>}>
            <div className="space-y-3 text-xs">
              <FormField label="Announcement Message">
                <input
                  type="text"
                  value={settings.navbar?.announcement || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      navbar: { ...settings.navbar, announcement: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="showAnnounce"
                  checked={settings.navbar?.showAnnouncement !== false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      navbar: { ...settings.navbar, showAnnouncement: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="showAnnounce" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Display announcement bar at top of public website
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SEO SETTINGS */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Metadata &amp; Search Visibility</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Global Meta Title" required>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                />
              </FormField>

              <FormField label="Meta Description">
                <textarea
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                />
              </FormField>

              <FormField label="Keywords (Comma separated)">
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </FormField>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Google SERP Preview</span>
                <h4 className="text-sm font-semibold text-indigo-700 hover:underline cursor-pointer">
                  {seoTitle}
                </h4>
                <p className="text-[11px] text-emerald-700 font-mono">https://botbari.com</p>
                <p className="text-xs text-slate-600">{seoDesc}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SOCIAL SETTINGS */}
      {activeTab === "social" && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">Social Media &amp; Profiles</h3>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <FormField label="X / Twitter (New X Handle)">
              <input
                type="text"
                value={settings.socials?.twitter || "https://x.com/botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, twitter: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="LinkedIn Page">
              <input
                type="text"
                value={settings.socials?.linkedin || "https://linkedin.com/company/botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, linkedin: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Upwork Agency Link">
              <input
                type="text"
                value={settings.socials?.upwork || "https://upwork.com/ag/botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, upwork: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Facebook Official Page">
              <input
                type="text"
                value={settings.socials?.facebook || "https://facebook.com/botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Instagram Link">
              <input
                type="text"
                value={settings.socials?.instagram || "https://instagram.com/botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="YouTube Official Channel">
              <input
                type="text"
                value={settings.socials?.youtube || "https://youtube.com/@botbari"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, youtube: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>
        </Card>
      )}

      {/* TAB 4: EMAIL SETTINGS */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-bold text-slate-900">SMTP &amp; Inbound Dispatch</h3>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Send Test Email
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <FormField label="SMTP Host Server">
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </FormField>

              <FormField label="SMTP Port">
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </FormField>

              <FormField label="System Sender Email">
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </FormField>

              <FormField label="Admin Notification Recipient">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </FormField>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: ADMIN PROFILE */}
      {activeTab === "profile" && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>}>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Admin Email" required>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </FormField>
            </div>

            <FormField label="Role / Authorization Level">
              <input
                type="text"
                value={profileRole}
                readOnly
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700"
              />
            </FormField>

            <div className="pt-3 border-t border-slate-100">
              <FormField label="Change Administrator Password (Optional)">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password to update..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </FormField>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: SECURITY */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Authentication &amp; Access Controls</h3>}>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Require an authenticator code when signing into admin console.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    toast.info(`2FA ${!twoFactorEnabled ? "enabled" : "disabled"}.`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    twoFactorEnabled
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  {twoFactorEnabled ? "Active" : "Disabled"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-900">Reset Local Storage &amp; Sync Disk Cache</h4>
                  <p className="text-[11px] text-slate-500">
                    Clears cached data in your browser and forces a reload from the data directory.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    adminStore.clearCache();
                    toast.success("Cache cleared! Reloading...");
                    setTimeout(() => window.location.reload(), 1000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
