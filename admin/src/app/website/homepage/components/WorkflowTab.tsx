"use client";

import React from "react";
import { Layers, Save, Calendar, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface WorkflowTabProps {
  settings: any;
  setSettings: (val: any) => void;
  onSave: () => void;
}

const DEFAULT_SCHEDULE_DAYS = [
  { day: "WED", date: "7", active: true },
  { day: "THU", date: "8", active: false },
  { day: "FRI", date: "9", active: false },
  { day: "SAT", date: "10", active: false },
  { day: "SUN", date: "11", active: false },
];

export default function WorkflowTab({
  settings,
  setSettings,
  onSave
}: WorkflowTabProps) {
  const currentScheduleDays =
    Array.isArray(settings.workflow?.scheduleDays) && settings.workflow.scheduleDays.length > 0
      ? settings.workflow.scheduleDays
      : DEFAULT_SCHEDULE_DAYS;

  const updateScheduleDays = (newDays: any[]) => {
    setSettings({
      ...settings,
      workflow: {
        ...(settings.workflow || {}),
        scheduleDays: newDays,
      },
    });
  };

  const handleDayChange = (idx: number, field: "date" | "day" | "subtitle" | "desc", value: string) => {
    const updated = currentScheduleDays.map((d: any, i: number) =>
      i === idx ? { ...d, [field]: value } : d
    );
    updateScheduleDays(updated);
  };

  const handleSetActiveDay = (idx: number) => {
    const updated = currentScheduleDays.map((d: any, i: number) => ({
      ...d,
      active: i === idx,
    }));
    updateScheduleDays(updated);
  };

  const handleAddDay = () => {
    const lastDay = currentScheduleDays[currentScheduleDays.length - 1];
    const newDate = lastDay ? String(Number(lastDay.date || 0) + 1) : "1";
    const updated = [...currentScheduleDays, { day: "DAY", date: newDate, active: false }];
    updateScheduleDays(updated);
  };

  const handleRemoveDay = (idx: number) => {
    if (currentScheduleDays.length <= 1) return;
    const updated = currentScheduleDays.filter((_: any, i: number) => i !== idx);
    if (!updated.some((d: any) => d.active)) {
      updated[0] = { ...updated[0], active: true };
    }
    updateScheduleDays(updated);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Workflow Capabilities Configuration</h3>
              <p className="text-xs text-slate-500">
                Manage the 3 automated execution cards: Website Assistant, Schedule (with custom days), and Autonomous Content.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workflow</span>
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Workflow cards illustrate the client delivery pipeline.</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Card 1: Website Assistant</h4>
              <span className="text-[10px] font-semibold text-blue-600">Step 1</span>
            </div>

            <FormField label="Card 1 Title">
              <input
                type="text"
                value={settings.workflow?.card1Title ?? ""}
                placeholder="e.g. Website Assistant Chatbot"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card1Title: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl font-semibold bg-white"
              />
            </FormField>

            <FormField label="Progress Indicator (e.g. 50%)">
              <input
                type="text"
                value={settings.workflow?.card1Progress ?? ""}
                placeholder="e.g. 50%"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card1Progress: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>

            <FormField label="Card 1 Subtitle">
              <input
                type="text"
                value={settings.workflow?.card1Subtitle ?? ""}
                placeholder="e.g. WP Content Write"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card1Subtitle: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>

            <FormField label="Card 1 Description">
              <textarea
                rows={4}
                value={settings.workflow?.card1Desc ?? ""}
                placeholder="Enter description..."
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card1Desc: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Card 2: Schedule &amp; Setup</h4>
              <span className="text-[10px] font-semibold text-cyan-700">Step 2</span>
            </div>

            <FormField label="Card 2 Title">
              <input
                type="text"
                value={settings.workflow?.card2Title ?? ""}
                placeholder="e.g. Schedule"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card2Title: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl font-semibold bg-white"
              />
            </FormField>

            <FormField label="Card 2 Subtitle">
              <input
                type="text"
                value={settings.workflow?.card2Subtitle ?? ""}
                placeholder="e.g. AI Chatbot Setup"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card2Subtitle: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>

            <FormField label="Card 2 Description">
              <textarea
                rows={3}
                value={settings.workflow?.card2Desc ?? ""}
                placeholder="Enter description..."
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card2Desc: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>

            {/* Schedule Days Config */}
            <div className="pt-3 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                  <label className="text-[11px] font-bold text-slate-800">
                    Schedule Calendar Days
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-700 hover:text-cyan-800 bg-cyan-100/70 hover:bg-cyan-100 px-2 py-0.5 rounded-lg border border-cyan-300 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Day</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Click &quot;Active&quot; to set which day is highlighted in the dark pill badge on the website.
              </p>

              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {currentScheduleDays.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-1.5 px-2 rounded-xl border text-xs transition-colors ${
                      item.active ? "bg-cyan-50 border-cyan-300" : "bg-white border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      title={item.active ? "Currently highlighted as Active" : "Click to highlight as Active"}
                      onClick={() => handleSetActiveDay(idx)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        item.active
                          ? "bg-slate-900 text-[#3ef06e] shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.active && <CheckCircle2 className="w-2.5 h-2.5 text-[#3ef06e]" />}
                      <span>{item.active ? "Active" : "Set Active"}</span>
                    </button>
                    <div className="flex-1 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-medium">Date</span>
                          <input
                            type="text"
                            value={item.date}
                            placeholder="e.g. 7"
                            onChange={(e) => handleDayChange(idx, "date", e.target.value)}
                            className="w-full px-2 py-0.5 text-xs border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-medium">Day Name</span>
                          <input
                            type="text"
                            value={item.day}
                            placeholder="e.g. WED"
                            onChange={(e) => handleDayChange(idx, "day", e.target.value)}
                            className="w-full px-2 py-0.5 text-xs border rounded-lg bg-white uppercase font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Event Title (on click)</span>
                        <input
                          type="text"
                          value={item.subtitle ?? ""}
                          placeholder="e.g. AI Chatbot Setup"
                          onChange={(e) => handleDayChange(idx, "subtitle", e.target.value)}
                          className="w-full px-2 py-0.5 text-xs border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Event Description (on click)</span>
                        <input
                          type="text"
                          value={item.desc ?? ""}
                          placeholder="e.g. Configure system prompts..."
                          onChange={(e) => handleDayChange(idx, "desc", e.target.value)}
                          className="w-full px-2 py-0.5 text-xs border rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    {currentScheduleDays.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Delete this day slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Live Mini Preview of the Ribbon */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Live Ribbon Preview
                </span>
                <div className="w-full bg-[#3ef06e] rounded-xl flex items-center justify-between p-2 px-2.5 min-h-[50px] shadow-2xs">
                  {currentScheduleDays.map((item: any, idx: number) => (
                    item.active ? (
                      <div
                        key={idx}
                        className="bg-[#0a160d] text-white rounded-lg px-2 py-1 flex flex-col items-center justify-center min-w-[34px] shadow-xs"
                      >
                        <span className="text-[12px] font-black leading-none">{item.date}</span>
                        <span className="text-[8px] font-bold tracking-wider uppercase mt-0.5 text-gray-200">{item.day}</span>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center px-1 text-black min-w-[28px]"
                      >
                        <span className="text-[12px] font-black leading-none">{item.date}</span>
                        <span className="text-[8px] font-extrabold tracking-wider uppercase mt-0.5 text-black/85">{item.day}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Card 3: Content Generation</h4>
              <span className="text-[10px] font-semibold text-indigo-600">Step 3</span>
            </div>

            <FormField label="Card 3 Title">
              <input
                type="text"
                value={settings.workflow?.card3Title ?? ""}
                placeholder="e.g. Generate Unique Content"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card3Title: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl font-semibold bg-white"
              />
            </FormField>

            <FormField label="Card 3 Description">
              <textarea
                rows={9}
                value={settings.workflow?.card3Desc ?? ""}
                placeholder="Enter description..."
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workflow: { ...settings.workflow, card3Desc: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 border rounded-xl bg-white"
              />
            </FormField>
          </div>
        </div>
      </div>
    </Card>
  );
}
