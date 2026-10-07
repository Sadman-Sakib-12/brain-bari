"use client";

import React from "react";
import { ShieldCheck, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface WhyChooseUsTabProps {
  whyChooseUs: any;
  setWhyChooseUs: (val: any) => void;
  settings: any;
  setSettings: (val: any) => void;
  onSave: () => void;
}

export default function WhyChooseUsTab({
  whyChooseUs,
  setWhyChooseUs,
  settings,
  setSettings,
  onSave
}: WhyChooseUsTabProps) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Why Choose Us Section Configuration</h3>
              <p className="text-xs text-slate-500">
                Manage headings, subheadings, CTA links, and the 3 strategic pillar cards with custom icons.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Pillars</span>
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Synchronized with frontend /about and homepage why choose us cards.</span>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Section Heading" required>
            <input
              type="text"
              value={whyChooseUs.heading || "Why choose us?"}
              onChange={(e) => setWhyChooseUs({ ...whyChooseUs, heading: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </FormField>

          <FormField label="Section Subheading">
            <input
              type="text"
              value={whyChooseUs.subheading || ""}
              onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subheading: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
              placeholder="Empowering businesses with AI precision..."
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Button Text">
            <input
              type="text"
              value={whyChooseUs.buttonText || settings.whyChooseUs?.buttonText || "Learn more"}
              onChange={(e) => {
                setWhyChooseUs({ ...whyChooseUs, buttonText: e.target.value });
                setSettings({
                  ...settings,
                  whyChooseUs: { ...(settings.whyChooseUs || {}), buttonText: e.target.value }
                });
              }}
              className="w-full px-3 py-2 border rounded-xl"
              placeholder="Learn more"
            />
          </FormField>

          <FormField label="Button Destination Link">
            <input
              type="text"
              value={whyChooseUs.buttonLink || settings.whyChooseUs?.buttonLink || "/about"}
              onChange={(e) => {
                setWhyChooseUs({ ...whyChooseUs, buttonLink: e.target.value });
                setSettings({
                  ...settings,
                  whyChooseUs: { ...(settings.whyChooseUs || {}), buttonLink: e.target.value }
                });
              }}
              className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
              placeholder="/about"
            />
          </FormField>
        </div>

        {/* 3 Pillars */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-slate-900 text-xs">3 Core Strategic Pillars:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {whyChooseUs.items?.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600">Pillar 0{i + 1}</span>
                </div>

                <FormField label="Pillar Title">
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const updated = [...whyChooseUs.items];
                      updated[i].title = e.target.value;
                      setWhyChooseUs({ ...whyChooseUs, items: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-xl font-semibold"
                  />
                </FormField>

                <FormField label="Pillar Icon">
                  <select
                    value={item.icon || "Sparkles"}
                    onChange={(e) => {
                      const updated = [...whyChooseUs.items];
                      updated[i].icon = e.target.value;
                      setWhyChooseUs({ ...whyChooseUs, items: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-xl font-medium text-xs"
                  >
                    <option value="Sparkles">Sparkles (Creative Thinking)</option>
                    <option value="Compass">Compass (Career Planning / Roadmap)</option>
                    <option value="MessageSquare">MessageSquare (Public Speaking / Chatbots)</option>
                  </select>
                </FormField>

                <FormField label="Description">
                  <textarea
                    rows={3}
                    value={item.description || ""}
                    onChange={(e) => {
                      const updated = [...whyChooseUs.items];
                      updated[i].description = e.target.value;
                      setWhyChooseUs({ ...whyChooseUs, items: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-xl"
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
