"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface GeneralSettingsTabProps {
  settings: any;
  setSettings: (s: any) => void;
}

export default function GeneralSettingsTab({ settings, setSettings }: GeneralSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card header={<h3 className="text-sm font-bold text-slate-900">Platform Identity &amp; Branding</h3>}>
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Website Brand Logo &amp; Navbar Configuration</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                To upload the website brand logo, customize navbar links, or edit CTAs, use the dedicated Navbar CMS page.
              </p>
            </div>
            <Link
              href="/website/navbar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Go to Navbar CMS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </Card>
    </div>
  );
}
