"use client";

import React from "react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface SocialSettingsTabProps {
  settings: any;
  setSettings: (s: any) => void;
}

export default function SocialSettingsTab({ settings, setSettings }: SocialSettingsTabProps) {
  return (
    <Card header={<h3 className="text-sm font-bold text-slate-900">Social Media &amp; Profiles</h3>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <FormField label="X / Twitter (New X Handle)">
          <input
            type="text"
            value={settings.socials?.twitter || "https://x.com/brainbari"}
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
            value={settings.socials?.linkedin || "https://linkedin.com/company/brainbari"}
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
            value={settings.socials?.upwork || "https://upwork.com/ag/brainbari"}
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
            value={settings.socials?.facebook || "https://facebook.com/brainbari"}
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
            value={settings.socials?.instagram || "https://instagram.com/brainbari"}
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
            value={settings.socials?.youtube || "https://youtube.com/@brainbari"}
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
  );
}
