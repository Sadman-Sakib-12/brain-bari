"use client";

import React from "react";
import { Megaphone, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface CtaTabProps {
  settings: any;
  setSettings: (val: any) => void;
  onSave: () => void;
}

export default function CtaTab({
  settings,
  setSettings,
  onSave
}: CtaTabProps) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conversion CTA Banner Configuration</h3>
              <p className="text-xs text-slate-500">
                Manage the global bottom conversion banner headline, description, button label, and target link.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Banner</span>
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Displayed at the bottom of the public homepage directly above the footer.</span>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Banner</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        <FormField label="CTA Heading" required hint="Bold invitation headline for consultation">
          <input
            type="text"
            value={settings.conversionCta?.heading || settings.ctaBanner?.headline || "Ready to transfer your Business"}
            onChange={(e) =>
              setSettings({
                ...settings,
                conversionCta: {
                  ...(settings.conversionCta || {}),
                  heading: e.target.value
                },
                ctaBanner: {
                  ...(settings.ctaBanner || {}),
                  headline: e.target.value
                }
              })
            }
            className="w-full px-3 py-2 border rounded-xl"
          />
        </FormField>

        <FormField label="CTA Description">
          <textarea
            rows={3}
            value={
              settings.conversionCta?.description ||
              settings.ctaBanner?.subheadline ||
              "Developing and maintaining web applications using React.js, Next.js, and other related technologies."
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                conversionCta: {
                  ...(settings.conversionCta || {}),
                  description: e.target.value
                },
                ctaBanner: {
                  ...(settings.ctaBanner || {}),
                  subheadline: e.target.value
                }
              })
            }
            className="w-full px-3 py-2 border rounded-xl"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Button Label Text">
            <input
              type="text"
              value={settings.conversionCta?.buttonText || settings.ctaBanner?.buttonText || "Schedule A Consultation"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  conversionCta: {
                    ...(settings.conversionCta || {}),
                    buttonText: e.target.value
                  },
                  ctaBanner: {
                    ...(settings.ctaBanner || {}),
                    buttonText: e.target.value
                  }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
            />
          </FormField>

          <FormField label="Target Destination Link (URL)">
            <input
              type="text"
              value={settings.conversionCta?.buttonLink || settings.ctaBanner?.buttonLink || "/schedule"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  conversionCta: {
                    ...(settings.conversionCta || {}),
                    buttonLink: e.target.value
                  },
                  ctaBanner: {
                    ...(settings.ctaBanner || {}),
                    buttonLink: e.target.value
                  }
                })
              }
              className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
            />
          </FormField>
        </div>
      </div>
    </Card>
  );
}
