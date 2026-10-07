"use client";

import React from "react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface AboutMissionTabProps {
  about: any;
  setAbout: (val: any) => void;
}

export default function AboutMissionTab({ about, setAbout }: AboutMissionTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card header={<h3 className="text-sm font-bold text-slate-900">Corporate Mission Statement</h3>}>
        <div className="space-y-3 text-xs">
          <FormField label="Mission Headline">
            <input
              type="text"
              value={about.mission?.headline || "Democratizing Enterprise AI Across Emerging Markets"}
              onChange={(e) =>
                setAbout({
                  ...about,
                  mission: { ...about.mission, headline: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
          <FormField label="Mission Description">
            <textarea
              rows={4}
              value={
                about.mission?.description ||
                "To bridge the divide between cutting-edge conversational artificial intelligence and daily business operations, delivering quantifiable productivity growth."
              }
              onChange={(e) =>
                setAbout({
                  ...about,
                  mission: { ...about.mission, description: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>
      </Card>

      <Card header={<h3 className="text-sm font-bold text-slate-900">Future Vision &amp; Strategy</h3>}>
        <div className="space-y-3 text-xs">
          <FormField label="Vision Statement">
            <input
              type="text"
              value={about.vision?.headline || "Precision AI Engineering Built for Real ROI"}
              onChange={(e) =>
                setAbout({
                  ...about,
                  vision: { ...about.vision, headline: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
          <FormField label="Vision Details">
            <textarea
              rows={4}
              value={
                about.vision?.description ||
                "Becoming Bangladesh's foremost enterprise AI solutions powerhouse by pioneering intelligent autonomous agents, multi-tenant SaaS, and 3D web technologies."
              }
              onChange={(e) =>
                setAbout({
                  ...about,
                  vision: { ...about.vision, description: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>
      </Card>
    </div>
  );
}
