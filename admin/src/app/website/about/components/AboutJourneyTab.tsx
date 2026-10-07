"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface AboutJourneyTabProps {
  about: any;
  setAbout: (val: any) => void;
}

export default function AboutJourneyTab({ about, setAbout }: AboutJourneyTabProps) {
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Company Milestones &amp; Timeline</h3>
            <p className="text-xs text-slate-500">Historical achievements displayed on the About page</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMilestone({
                id: `m-${Date.now()}`,
                title: "",
                subtitle: "2026",
                desc: "",
                tag: "Milestone",
                alignRight: false
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      }
    >
      {/* Inline Milestone Editor Form */}
      {editingMilestone && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="text-xs font-bold text-slate-900">
              {about.journey?.milestones?.some((x: any) => x.id === editingMilestone.id && x.title)
                ? "Edit Milestone"
                : "Add New Milestone"}
            </h4>
            <button
              type="button"
              onClick={() => setEditingMilestone(null)}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Title" required>
              <input
                type="text"
                value={editingMilestone?.title || ""}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl"
                placeholder="e.g. AI Product & Solution Development"
              />
            </FormField>

            <FormField label="Subtitle / Year">
              <input
                type="text"
                value={editingMilestone?.subtitle || ""}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, subtitle: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl"
                placeholder="e.g. Company Establishment · 2024"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Tag / Badge">
              <input
                type="text"
                value={editingMilestone?.tag || ""}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, tag: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl"
                placeholder="e.g. Growth"
              />
            </FormField>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="milestone-align"
                checked={!!editingMilestone?.alignRight}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, alignRight: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
              />
              <label htmlFor="milestone-align" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Align to right side of timeline (<code>alignRight</code>)
              </label>
            </div>
          </div>

          <FormField label="Description">
            <textarea
              rows={2}
              value={editingMilestone?.desc || ""}
              onChange={(e) => setEditingMilestone({ ...editingMilestone, desc: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-xl"
              placeholder="Detail the key achievement..."
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingMilestone(null)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const milestones = [...(about.journey?.milestones || [])];
                const existingIdx = milestones.findIndex((x) => x.id === editingMilestone.id);
                if (existingIdx >= 0) {
                  milestones[existingIdx] = editingMilestone;
                } else {
                  milestones.push(editingMilestone);
                }
                setAbout({ ...about, journey: { ...about.journey, milestones } });
                setEditingMilestone(null);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
            >
              Save Milestone
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-200 text-xs">
        {about.journey?.milestones?.map((m: any, idx: number) => (
          <div key={m.id || idx} className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-800 shrink-0">
                0{idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{m.title}</span>
                  <span className="text-[11px] text-slate-500 font-medium">({m.subtitle})</span>
                  {m.tag && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {m.tag}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                    m.alignRight 
                      ? "bg-purple-50 text-purple-700 border-purple-200" 
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {m.alignRight ? "Timeline Right" : "Timeline Left"}
                  </span>
                </div>
                <p className="text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingMilestone({
                    alignRight: false,
                    ...m
                  });
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = about.journey.milestones.filter((item: any) => item.id !== m.id);
                  setAbout({ ...about, journey: { ...about.journey, milestones: updated } });
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
