"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface AboutContentTabProps {
  about: any;
  setAbout: (val: any) => void;
}

export default function AboutContentTab({ about, setAbout }: AboutContentTabProps) {
  const [newWorkArea, setNewWorkArea] = useState("");

  const addWorkArea = () => {
    if (!newWorkArea.trim()) return;
    setAbout({
      ...about,
      hero: {
        ...about.hero,
        workAreas: [...(about.hero?.workAreas || []), newWorkArea.trim()]
      }
    });
    setNewWorkArea("");
  };

  const removeWorkArea = (idx: number) => {
    const updated = [...(about.hero?.workAreas || [])];
    updated.splice(idx, 1);
    setAbout({
      ...about,
      hero: {
        ...about.hero,
        workAreas: updated
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card header={<h3 className="text-sm font-bold text-slate-900">Company Introduction &amp; Hero Story</h3>}>
        <div className="space-y-4 text-xs">
          <FormField label="Headline Intro" required>
            <textarea
              rows={2}
              value={about.hero?.intro || ""}
              onChange={(e) =>
                setAbout({
                  ...about,
                  hero: { ...about.hero, intro: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Sub-Headline">
            <input
              type="text"
              value={about.hero?.subHeadline || ""}
              onChange={(e) =>
                setAbout({
                  ...about,
                  hero: { ...about.hero, subHeadline: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Delivering Intelligent Solutions Across Industries"
            />
          </FormField>

          <FormField label="Full Company Description">
            <textarea
              rows={4}
              value={about.hero?.body || ""}
              onChange={(e) =>
                setAbout({
                  ...about,
                  hero: { ...about.hero, body: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Closing Summary Text">
            <textarea
              rows={2}
              value={about.hero?.closingText || ""}
              onChange={(e) =>
                setAbout({
                  ...about,
                  hero: { ...about.hero, closingText: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="We work with startups, SMEs, and enterprises across multiple industries..."
            />
          </FormField>
        </div>
      </Card>

      {/* Work Areas */}
      <Card header={<h3 className="text-sm font-bold text-slate-900">Our Work Areas</h3>}>
        <div className="space-y-4 text-xs">
          <FormField label="Work Areas Section Title">
            <input
              type="text"
              value={about.hero?.workAreasTitle || "Our Work Areas Include:"}
              onChange={(e) =>
                setAbout({
                  ...about,
                  hero: { ...about.hero, workAreasTitle: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="Our Work Areas Include:"
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newWorkArea}
              onChange={(e) => setNewWorkArea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWorkArea()}
              placeholder="e.g. Multilingual LLM Fine-Tuning"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
            <button
              type="button"
              onClick={addWorkArea}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Add Area
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {about.hero?.workAreas?.map((area: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => removeWorkArea(idx)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
