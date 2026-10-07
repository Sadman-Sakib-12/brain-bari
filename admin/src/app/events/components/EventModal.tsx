"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface EventCategory {
  id: string;
  label: string;
  desc: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent: any | null;
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  attendees: string;
  setAttendees: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  image: string;
  setImage: (v: string) => void;
  agenda: string[];
  setAgenda: (v: string[]) => void;
  categories: EventCategory[];
  onSave: () => void;
}

export default function EventModal({
  isOpen,
  onClose,
  editingEvent,
  title,
  setTitle,
  category,
  setCategory,
  status,
  setStatus,
  date,
  setDate,
  time,
  setTime,
  attendees,
  setAttendees,
  location,
  setLocation,
  description,
  setDescription,
  image,
  setImage,
  agenda,
  setAgenda,
  categories,
  onSave
}: EventModalProps) {
  const [agendaInput, setAgendaInput] = useState("");

  const handleAddAgenda = () => {
    if (agendaInput.trim()) {
      setAgenda([...agenda, agendaInput.trim()]);
      setAgendaInput("");
    }
  };

  const handleRemoveAgenda = (idx: number) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEvent ? "Edit Event" : "Create New Event"}
      subtitle="Manage event schedule, location, agenda highlights, and registration status."
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer"
          >
            {editingEvent ? "Save Changes" : "Publish Event"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <FormField label="Event Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Founder's Talk: AI Roadmap 2027"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category (Matches Frontend Filter: nearest / latest)">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.id})
                </option>
              ))}
              {!categories.some((c) => c.id === category) && (
                <option value={category}>{category} (Legacy)</option>
              )}
            </select>
          </FormField>

          <FormField label="Event Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Active">Active Registration</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Date (e.g. 15-04-2026 or 2026-10-15)">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="15-04-2026"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>

          <FormField label="Time Slot">
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="04:00 PM - 06:00 PM"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Estimated Attendees">
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="100 Attendees"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <FormField label="Location / Meeting Venue">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Brain Bari Innovation Hub & Virtual"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will attendees learn or discuss?"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <ImageUpload
          label="Banner Graphic (Cloudinary CDN)"
          category="Hero & Banners"
          value={image}
          onChange={setImage}
          helpText="Directly uploaded to Cloudinary CDN."
          compact={true}
        />

        {/* AGENDA HIGHLIGHTS REPEATER */}
        <FormField label="Agenda Highlights (Frontend Agenda List)" hint="Add key milestones or presentation points. Rendered as checkmark items on frontend.">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={agendaInput}
                onChange={(e) => setAgendaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAgenda();
                  }
                }}
                placeholder="e.g. 2026-2027 Technology Roadmap Reveal"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {agenda.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">No agenda items added yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {agenda.map((ag, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate text-slate-700">{ag}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAgenda(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>
      </div>
    </Modal>
  );
}
