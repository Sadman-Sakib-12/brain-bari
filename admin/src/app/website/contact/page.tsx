"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
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
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type ContactTab = "info" | "office";

export default function WebsiteContactPage() {
  const [activeTab, setActiveTab] = useState<ContactTab>("info");
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [saved, setSaved] = useState(false);

  const loadData = async () => {
    try {
      const fresh = await adminApi.getSettings();
      if (fresh) {
        setSettings(fresh);
        adminStore.setSettings(fresh);
        return;
      }
      const st = adminStore.getSettings();
      if (st && Object.keys(st).length > 0) {
        setSettings(st);
      }
    } catch {
      const st = adminStore.getSettings();
      if (st && Object.keys(st).length > 0) {
        setSettings(st);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSave = async () => {
    adminStore.setSettings(settings);
    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      toast.success("Contact information saved successfully!", {
        description: "Frontend contact channels and footer details updated."
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save contact settings to database.");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset contact settings back to database state?")) {
      try {
        const fresh = await adminApi.getSettings();
        if (fresh) {
          setSettings(fresh);
          adminStore.setSettings(fresh);
          toast.info("Refreshed contact details from database.");
        }
      } catch {
        toast.error("Failed to refresh from database.");
      }
    }
  };

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
        badge="Website CMS / Contact & Office"
        title="Contact & Office Manager"
        description="Manage direct communication channels and company details. Managed Frontend Sections: Global Footer (Contact info, emails, phones, social links) • Contact Page (/contact)."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
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
                  placeholder="contact@brainbari.com"
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

      {/* TAB 2: OFFICE INFORMATION & COMPLIANCE */}
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
                    value={settings.contact?.hours || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, hours: e.target.value }
                      })
                    }
                    placeholder="Sunday – Thursday: 09:00 AM – 07:00 PM (BST)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>

                <FormField label="Timezone">
                  <input
                    type="text"
                    value={settings.contact?.timezone || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, timezone: e.target.value }
                      })
                    }
                    placeholder="Asia/Dhaka (GMT+6)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </FormField>
              </div>

              <FormField label="Google Maps Embed URL (Iframe src)">
                <input
                  type="text"
                  value={settings.contact?.mapEmbedUrl || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, mapEmbedUrl: e.target.value }
                    })
                  }
                  placeholder="https://maps.google.com/maps?q=Mirpur-10+Dhaka&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </FormField>
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
