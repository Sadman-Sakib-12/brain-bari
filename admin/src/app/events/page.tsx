"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Plus,
  Save,
  Tag,
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import EventModal from "./components/EventModal";
import EventsGridTab from "./components/EventsGridTab";
import EventCategoriesTab from "./components/EventCategoriesTab";
import EventHeroTab from "./components/EventHeroTab";

type EventsTab = "events" | "hero" | "categories";

const EVENT_CATEGORIES = [
  { id: "nearest", label: "Nearest Events", desc: "Upcoming meetups, keynotes, and scheduled AI sessions." },
  { id: "latest", label: "Latest Event", desc: "Most recently organized official gatherings and recaps." }
];

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as EventsTab) || "events";

  const [activeTab, setActiveTab] = useState<EventsTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [pageCms, setPageCms] = useState<any>(null);
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

  const loadData = async () => {
    try {
      const fresh = await adminApi.getContent("events");
      if (fresh && Array.isArray(fresh)) {
        setEvents(fresh);
      }

      const freshPage = await adminApi.getContent("eventsPage");
      if (freshPage) {
        setPageCms(freshPage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

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
    setIsModalOpen(true);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as EventsTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["events", "hero", "categories"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = async () => {
    try {
      await adminApi.saveContent("events", events);
      setSaved(true);
      toast.success("Events saved successfully to database!", {
        description: "Frontend /resources/event page updated live."
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save events to database.");
    }
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
    setIsModalOpen(true);
  };

  const handleSaveForm = async () => {
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
      agenda
    };

    let updated: any[];
    if (editingEvent) {
      updated = events.map((e) => {
        if (e.id === editingEvent.id) {
          return {
            ...e,
            ...payload
          };
        }
        return e;
      });
      toast.success(`Event "${title}" updated.`);
    } else {
      const newEvent = {
        id: `ev-${Date.now()}`,
        ...payload
      };
      updated = [newEvent, ...events];
      toast.success(`Event "${title}" published.`);
    }

    setEvents(updated);
    await adminApi.saveContent("events", updated).catch(() => {});
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const updated = events.filter((e) => e.id !== deleteConfirmId);
    setEvents(updated);
    await adminApi.saveContent("events", updated).catch(() => {});
    toast.success("Event removed from calendar.");
    setDeleteConfirmId(null);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Events &amp; Meetups"
        title="Events &amp; Conference Calendar"
        description="Organize in-person summits, technical keynotes, and scheduled AI workshops. Managed Frontend Section: Events Page (/resources/event &amp; /event)."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
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
            { id: "events", label: "Scheduled Events", icon: Calendar, count: events.length },
            { id: "hero", label: "Hero Banner", icon: Sparkles },
            { id: "categories", label: "Categories", icon: Tag, count: EVENT_CATEGORIES.length }
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

      {/* TAB 1: SCHEDULED EVENTS */}
      {activeTab === "events" && (
        <EventsGridTab
          events={events}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* TAB 2: HERO BANNER */}
      {activeTab === "hero" && (
        <EventHeroTab
          pageCms={pageCms}
          setPageCms={setPageCms}
        />
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && (
        <EventCategoriesTab
          categories={EVENT_CATEGORIES}
          events={events}
        />
      )}

      {/* ADD / EDIT MODAL */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingEvent={editingEvent}
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        attendees={attendees}
        setAttendees={setAttendees}
        location={location}
        setLocation={setLocation}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        agenda={agenda}
        setAgenda={setAgenda}
        categories={EVENT_CATEGORIES}
        onSave={handleSaveForm}
      />

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
