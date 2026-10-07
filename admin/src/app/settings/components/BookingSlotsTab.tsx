"use client";

import React, { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface BookingSlotsTabProps {
  bookingSlots: string[];
  setBookingSlots: (s: string[]) => void;
}

export default function BookingSlotsTab({ bookingSlots, setBookingSlots }: BookingSlotsTabProps) {
  const [newSlot, setNewSlot] = useState("");
  const [settings, setSettings] = useState({
    companyName: "Brain Bari Technologies",
    consultationTitle: "60 Minute Consultation",
    duration: "1 Hour Duration",
    detailsNote: "Web conferencing details provided upon booking confirmation.",
    copyrightText: "© Brain Bari 2026",
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    adminApi.getContent("bookingSettings").then((res) => {
      if (res) {
        setSettings((prev) => ({ ...prev, ...res }));
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        adminApi.saveContent("bookingSlots", bookingSlots),
        adminApi.saveContent("bookingSettings", settings),
      ]);
      toast.success("Booking time slots & consultation settings saved to database!");
    } catch {
      toast.error("Failed to save booking settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Consultation Info Settings */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consultation Session Details</h3>
              <p className="text-xs text-slate-500">Frontend Section: Schedule Page (/schedule) → Left Details Column</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save All Settings"}</span>
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Brain Bari Technologies"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Consultation Title</label>
            <input
              type="text"
              value={settings.consultationTitle}
              onChange={(e) => setSettings({ ...settings, consultationTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="60 Minute Consultation"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Duration Label</label>
            <input
              type="text"
              value={settings.duration}
              onChange={(e) => setSettings({ ...settings, duration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="1 Hour Duration"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Footer Copyright</label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
              placeholder="© Brain Bari 2026"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Details & Meeting Notice</label>
            <textarea
              rows={2}
              value={settings.detailsNote}
              onChange={(e) => setSettings({ ...settings, detailsNote: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Web conferencing details provided upon booking confirmation."
            />
          </div>
        </div>
      </Card>

      {/* Available Time Slots Card */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consultation Booking Time Slots</h3>
              <p className="text-xs text-slate-500">Frontend Section: Schedule Page (/schedule) → Available Booking Time Slots</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Time Slots"}</span>
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {bookingSlots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl">
                <span className="font-semibold text-slate-800">{slot}</span>
                <button
                  type="button"
                  onClick={() => setBookingSlots(bookingSlots.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 max-w-sm">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="e.g. 07:00 PM"
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl"
            />
            <button
              type="button"
              onClick={() => {
                if (!newSlot.trim()) return;
                setBookingSlots([...bookingSlots, newSlot.trim()]);
                setNewSlot("");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
