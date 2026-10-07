"use client";

import React, { useState } from "react";
import { Sparkles, Save, Calendar } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Card from "@/components/ui/Card";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface EventHeroTabProps {
  pageCms: any;
  setPageCms: (data: any) => void;
}

export default function EventHeroTab({ pageCms, setPageCms }: EventHeroTabProps) {
  const [saving, setSaving] = useState(false);

  const hero = pageCms?.hero || {
    badge: "",
    title: "",
    titleHighlight: "",
    description: "",
  };

  const updateHero = (field: string, val: string) => {
    setPageCms({
      ...pageCms,
      hero: {
        ...hero,
        [field]: val,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.saveContent("eventsPage", { hero });
      toast.success("Events page hero saved to NeonDB!", {
        description: "Frontend /resources/event page hero headline & descriptions updated.",
      });
    } catch (err: any) {
      toast.error("Failed to save: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Events &amp; Workshops Hero Banner</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Controls the headline and introductory paragraph at the top of the frontend Events &amp; Workshops page (<code className="bg-purple-100/70 text-purple-900 px-1 py-0.5 rounded">/resources/event</code>).
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving to Database..." : "Save Hero Content"}</span>
        </button>
      </div>

      <Card header={<h3 className="text-sm font-bold text-slate-900">Hero Section Information</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="Hero Badge Text">
            <input
              type="text"
              value={hero.badge || ""}
              onChange={(e) => updateHero("badge", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Community & Culture"
            />
          </FormField>

          <FormField label="Hero Headline First Line">
            <input
              type="text"
              value={hero.title || ""}
              onChange={(e) => updateHero("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="Grow Your Network & Skills"
            />
          </FormField>

          <FormField label="Hero Headline Highlight (Second Line)">
            <input
              type="text"
              value={hero.titleHighlight || ""}
              onChange={(e) => updateHero("titleHighlight", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="with Our Events"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Hero Description Paragraph">
              <textarea
                rows={3}
                value={hero.description || ""}
                onChange={(e) => updateHero("description", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                placeholder="Discover community gatherings, hackathons, executive roadmaps..."
              />
            </FormField>
          </div>
        </div>
      </Card>
    </div>
  );
}
