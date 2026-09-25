"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Share2,
  Building,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  FileText
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialSettings from "@/data/siteSettings.json";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type ContactTab = "info" | "social" | "office";

export default function WebsiteContactPage() {
  const [activeTab, setActiveTab] = useState<ContactTab>("info");
  const [settings, setSettings] = useState<any>(initialSettings);
  const [saved, setSaved] = useState(false);

  const loadData = () => {
    try {
      const st = adminStore.getSettings();
      if (st && st.contact) setSettings(st);
    } catch {
      setSettings(initialSettings);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  const handleSave = () => {
    adminStore.setSettings(settings);
    setSaved(true);
    toast.success("Contact information saved successfully!", {
      description: "Frontend contact channels and footer details updated."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset contact settings back to defaults?")) {
      setSettings(initialSettings);
      adminStore.setSettings(initialSettings);
      toast.info("Reset to default contact details.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Website CMS / Contact & Office"
        title="Contact & Office Manager"
        description="Manage direct communication channels, phone numbers, WhatsApp links, social profiles, and registered office details."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        }
      >
        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "info", label: "Contact Information", icon: Phone },
            { id: "social", label: "Social Links", icon: Share2 },
            { id: "office", label: "Office & Compliance", icon: Building }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ContactTab)}
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

      {/* TAB 1: CONTACT INFORMATION */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Direct Inbound Channels</h3>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <FormField label="Official Phone Number (Calling)" required>
                <input
                  type="text"
                  value={settings.contact?.phone || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="+8801754-958008"
                />
              </FormField>

              <FormField label="Primary Support & Business Email" required>
                <input
                  type="email"
                  value={settings.contact?.email || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="contact@botbari.com"
                />
              </FormField>

              <FormField label="WhatsApp Number (Digits Only)">
                <input
                  type="text"
                  value={settings.contact?.whatsapp || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, whatsapp: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="8801754958008"
                />
              </FormField>

              <FormField label="WhatsApp Direct Chat Action URL">
                <input
                  type="text"
                  value={settings.contact?.whatsappUrl || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, whatsappUrl: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://wa.me/8801754958008?text=Hello"
                />
              </FormField>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SOCIAL LINKS */}
      {activeTab === "social" && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">Official Social Media Profiles</h3>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <FormField label="LinkedIn Company Page">
              <input
                type="text"
                value={settings.socials?.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, linkedin: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://www.linkedin.com/company/botbari"
              />
            </FormField>

            <FormField label="X / Twitter (New X Logo)">
              <input
                type="text"
                value={settings.socials?.twitter || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, twitter: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://x.com/botbari"
              />
            </FormField>

            <FormField label="Upwork Agency Profile">
              <input
                type="text"
                value={settings.socials?.upwork || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, upwork: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://www.upwork.com/ag/botbari"
              />
            </FormField>

            <FormField label="Facebook Official Page">
              <input
                type="text"
                value={settings.socials?.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://www.facebook.com/botbari"
              />
            </FormField>

            <FormField label="Instagram Account">
              <input
                type="text"
                value={settings.socials?.instagram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://www.instagram.com/botbari/"
              />
            </FormField>

            <FormField label="YouTube Channel">
              <input
                type="text"
                value={settings.socials?.youtube || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, youtube: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="https://www.youtube.com/@botbari"
              />
            </FormField>
          </div>
        </Card>
      )}

      {/* TAB 3: OFFICE INFORMATION & COMPLIANCE */}
      {activeTab === "office" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Headquarters &amp; Physical Address</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Physical Office Location">
                <input
                  type="text"
                  value={settings.contact?.address || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, address: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Mirpur-10, Dhaka 1216, Bangladesh"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Operating Hours">
                  <input
                    type="text"
                    defaultValue="Sunday – Thursday: 09:00 AM – 07:00 PM (BST)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </FormField>

                <FormField label="Timezone">
                  <input
                    type="text"
                    defaultValue="Asia/Dhaka (GMT+6)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </FormField>
              </div>
            </div>
          </Card>

          <Card header={<h3 className="text-sm font-bold text-slate-900">Legal Compliance &amp; Certifications</h3>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Government Trade License</span>
                </div>
                <p className="text-[11px] text-slate-500">Registered with Dhaka North City Corporation under Mirpur Zone.</p>
                <div className="text-[11px] font-mono text-slate-700 font-semibold">TRAD/DNCC/029182/2024</div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>RJSC Joint Stock Incorporation</span>
                </div>
                <p className="text-[11px] text-slate-500">Registered with Registrar of Joint Stock Companies and Firms.</p>
                <div className="text-[11px] font-mono text-slate-700 font-semibold">C-184920/2024</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
