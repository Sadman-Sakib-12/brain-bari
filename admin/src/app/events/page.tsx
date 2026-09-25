"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  Tag,
  Users,
  ExternalLink
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialEvents from "@/data/events.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type EventsTab = "events" | "categories";

const EVENT_CATEGORIES = [
  { id: "nearest", label: "Nearest Events", desc: "Upcoming meetups, keynotes, and scheduled AI sessions." },
  { id: "latest", label: "Latest Event", desc: "Most recently organized official gatherings and recaps." }
];

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as EventsTab) || "events";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<EventsTab>(initialTab);
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("nearest");
  const [date, setDate] = useState("2026-10-15");
  const [time, setTime] = useState("05:00 PM - 08:30 PM (BST)");
  const [location, setLocation] = useState("Mirpur-10, Dhaka");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("120 Attendees");
  const [status, setStatus] = useState("Upcoming");
  const [image, setImage] = useState("");
  const [agenda, setAgenda] = useState<string[]>([]);
  const [agendaInput, setAgendaInput] = useState("");

  const loadData = () => {
    try {
      const stored = adminStore.getEvents();
      if (stored && stored.length > 0) setEvents(stored);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as EventsTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["events", "categories"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = () => {
    adminStore.setEvents(events);
    setSaved(true);
    toast.success("Events saved successfully!", {
      description: "Frontend /resources/event page updated live."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddAgenda = () => {
    if (agendaInput.trim()) {
      setAgenda([...agenda, agendaInput.trim()]);
      setAgendaInput("");
    }
  };

  const handleRemoveAgenda = (idx: number) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
  };

  const openAdd = () => {
    setEditingEvent(null);
    setTitle("");
    setCategory("nearest");
    setDate("2026-10-15");
    setTime("05:00 PM - 08:30 PM (BST)");
    setLocation("Mirpur-10, Dhaka");
    setDescription("");
    setAttendees("80 Attendees");
    setStatus("Upcoming");
    setImage("https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80");
    setAgenda([
      "Welcome Address & Fellowship",
      "Interactive AI Keynote & Roadmap",
      "Networking & Open Discussion"
    ]);
    setAgendaInput("");
    setIsModalOpen(true);
  };

  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setTitle(ev.title || "");
    setCategory(ev.category || "nearest");
    setDate(ev.date || "2026-10-15");
    setTime(ev.time || "");
    setLocation(ev.location || "");
    setDescription(ev.description || "");
    setAttendees(ev.attendees || "80 Attendees");
    setStatus(ev.status || "Upcoming");
    setImage(ev.image || "");
    setAgenda(Array.isArray(ev.agenda) ? ev.agenda : []);
    setAgendaInput("");
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!title.trim()) {
      toast.error("Event title is required");
      return;
    }

    const payload = {
      title,
      category,
      date,
      time,
      location,
      description,
      attendees,
      status,
      image,
      agenda: agenda.filter(Boolean)
    };

    if (editingEvent) {
      const updated = events.map((ev) => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            ...payload
          };
        }
        return ev;
      });
      setEvents(updated);
      adminStore.setEvents(updated);
      toast.success(`Event "${title}" updated.`);
    } else {
      const newEvent = {
        id: `ev-${Date.now()}`,
        ...payload
      };
      const updated = [newEvent, ...events];
      setEvents(updated);
      adminStore.setEvents(updated);
      toast.success(`Event "${title}" created.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = events.filter((ev) => ev.id !== deleteConfirmId);
    setEvents(updated);
    adminStore.setEvents(updated);
    toast.success("Event removed.");
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Events"
        title="Events &amp; Webinars"
        description="Manage company seminars, founder talks, community networking sessions, and technical AI webinars."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>{saved ? "Saved!" : "Save All"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "events", label: "All Events", icon: Calendar, count: events.length },
            { id: "categories", label: "Event Categories", icon: Tag, count: EVENT_CATEGORIES.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as EventsTab);
                  router.push(tab.id === "events" ? "/events" : `/events?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: ALL EVENTS (CARDS & GRID PATTERN) */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              {/* Event Image */}
              {ev.image && (
                <div className="h-40 bg-slate-100 overflow-hidden relative">
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs uppercase tracking-wider">
                      {ev.category === "latest" ? "Latest" : ev.category === "nearest" ? "Nearest" : ev.category || "Event"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={ev.status || "Upcoming"} size="sm" />
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1 font-mono text-indigo-600 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {ev.date}
                    </span>
                    {ev.time && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ev.time}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {ev.description || "Networking and knowledge exchange session."}
                </p>

                {/* Agenda badge */}
                {Array.isArray(ev.agenda) && ev.agenda.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{ev.agenda.length} agenda topics configured</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </span>
                  {ev.attendees && (
                    <span className="font-semibold text-slate-700 shrink-0">{ev.attendees}</span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(ev)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  title="Edit Event"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(ev.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EVENT_CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.label}</h3>
                  <code className="text-[11px] text-indigo-600 font-mono">category: "{cat.id}"</code>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  {events.filter((e) => (e.category || "").toLowerCase() === cat.id.toLowerCase()).length} Events
                </span>
              </div>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        subtitle="Manage event schedule, location, agenda highlights, and registration status."
        maxWidth="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
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
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
                {!EVENT_CATEGORIES.some((c) => c.id === category) && (
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

          <FormField label="Banner Image URL">
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
            />
          </FormField>

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

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to remove this event from the calendar?"
        confirmLabel="Delete Event"
        isDestructive={true}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
