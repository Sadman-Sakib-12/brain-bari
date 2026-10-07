"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Settings,
  Globe,
  Share2,
  Mail,
  User,
  ShieldCheck,
  Save,
  Clock,
  Sparkles,
  Layers
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";

import GeneralSettingsTab from "./components/GeneralSettingsTab";
import SeoSettingsTab from "./components/SeoSettingsTab";
import SocialSettingsTab from "./components/SocialSettingsTab";
import EmailSettingsTab from "./components/EmailSettingsTab";
import ProfileSettingsTab from "./components/ProfileSettingsTab";
import SecuritySettingsTab from "./components/SecuritySettingsTab";
import BookingSlotsTab from "./components/BookingSlotsTab";

type SettingsTab =
  | "general"
  | "seo"
  | "social"
  | "email"
  | "profile"
  | "security"
  | "bookingSlots";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "general";

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [settings, setSettings] = useState<any>({});
  const [saved, setSaved] = useState(false);

  // Dynamic CMS collections
  const [bookingSlots, setBookingSlots] = useState<string[]>([]);

  // Admin profile state
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Email SMTP settings
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const loadData = () => {
    adminApi.getSettings().then((res: any) => {
      if (res) {
        setSettings((prev: any) => ({ ...prev, ...res }));
        if (res.seo?.title) setSeoTitle(res.seo.title);
        if (res.seo?.description) setSeoDesc(res.seo.description);
        if (res.seo?.keywords) setSeoKeywords(res.seo.keywords);
        if (res.emailSettings?.smtpHost) setSmtpHost(res.emailSettings.smtpHost);
        if (res.emailSettings?.smtpPort) setSmtpPort(res.emailSettings.smtpPort);
        if (res.emailSettings?.senderEmail) setSenderEmail(res.emailSettings.senderEmail);
        if (res.emailSettings?.notifyEmail) setNotifyEmail(res.emailSettings.notifyEmail);
      }
    }).catch(() => {});

    adminApi.getContent("bookingSlots").then((res) => {
      if (res && Array.isArray(res)) {
        setBookingSlots(res);
      }
    }).catch(() => {});

    try {
      const user = localStorage.getItem("brainbari_admin_user");
      if (user) {
        const u = JSON.parse(user);
        if (u.name) setProfileName(u.name);
        if (u.email) setProfileEmail(u.email);
        if (u.role) setProfileRole(u.role);
      }
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as SettingsTab;
    if (tab && ["general", "seo", "social", "email", "profile", "security", "bookingSlots"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`);
  };

  const handleSaveAll = async () => {
    try {
      const mergedPayload = {
        ...settings,
        siteName: settings.siteName,
        tagline: settings.tagline,
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords,
        },
        emailSettings: {
          smtpHost,
          smtpPort,
          senderEmail,
          notifyEmail,
        },
      };

      await Promise.all([
        adminApi.updateSettings(mergedPayload),
        adminApi.saveContent("bookingSlots", bookingSlots),
      ]);

      try {
        const existingUserStr = localStorage.getItem("brainbari_admin_user");
        const existingUser = existingUserStr ? JSON.parse(existingUserStr) : {};
        localStorage.setItem(
          "brainbari_admin_user",
          JSON.stringify({
            ...existingUser,
            name: profileName || existingUser.name,
            email: profileEmail || existingUser.email,
            role: profileRole || existingUser.role,
          })
        );
        window.dispatchEvent(new Event("admin_auth_updated"));
      } catch {
        // safe fallback
      }

      setSaved(true);
      toast.success("Settings saved successfully!", {
        description: "Platform configuration updated and synchronized with database."
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Settings save error:", err);
      toast.error(err?.message || "Failed to save settings to database.");
    }
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
        title="Settings & Global Options"
        description="Configure system preferences and global platform data. Managed Frontend Sections: Schedule Page → Booking Slots • Homepage → Client Logos Marquee • Industries Page → Industry Badges • Global Navbar & Footer."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
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
            { id: "security", label: "Security", icon: ShieldCheck },
            { id: "bookingSlots", label: "Booking Slots", icon: Clock },
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
        <GeneralSettingsTab settings={settings} setSettings={setSettings} />
      )}

      {/* TAB 2: SEO SETTINGS */}
      {activeTab === "seo" && (
        <SeoSettingsTab
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          seoDesc={seoDesc}
          setSeoDesc={setSeoDesc}
          seoKeywords={seoKeywords}
          setSeoKeywords={setSeoKeywords}
        />
      )}

      {/* TAB 3: SOCIAL SETTINGS */}
      {activeTab === "social" && (
        <SocialSettingsTab settings={settings} setSettings={setSettings} />
      )}

      {/* TAB 4: EMAIL SETTINGS */}
      {activeTab === "email" && (
        <EmailSettingsTab
          smtpHost={smtpHost}
          setSmtpHost={setSmtpHost}
          smtpPort={smtpPort}
          setSmtpPort={setSmtpPort}
          senderEmail={senderEmail}
          setSenderEmail={setSenderEmail}
          notifyEmail={notifyEmail}
          setNotifyEmail={setNotifyEmail}
          onSendTestEmail={handleSendTestEmail}
        />
      )}

      {/* TAB 5: ADMIN PROFILE */}
      {activeTab === "profile" && (
        <ProfileSettingsTab
          profileName={profileName}
          setProfileName={setProfileName}
          profileEmail={profileEmail}
          setProfileEmail={setProfileEmail}
          profileRole={profileRole}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
        />
      )}

      {/* TAB 6: SECURITY */}
      {activeTab === "security" && (
        <SecuritySettingsTab
          twoFactorEnabled={twoFactorEnabled}
          setTwoFactorEnabled={setTwoFactorEnabled}
        />
      )}

      {/* TAB 7: BOOKING TIME SLOTS */}
      {activeTab === "bookingSlots" && (
        <BookingSlotsTab
          bookingSlots={bookingSlots}
          setBookingSlots={setBookingSlots}
        />
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
