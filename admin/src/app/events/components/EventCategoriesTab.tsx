"use client";

import React from "react";

interface EventCategory {
  id: string;
  label: string;
  desc: string;
}

interface EventCategoriesTabProps {
  categories: EventCategory[];
  events: any[];
}

export default function EventCategoriesTab({ categories, events }: EventCategoriesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
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
  );
}
