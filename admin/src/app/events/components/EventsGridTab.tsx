"use client";

import React from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface EventsGridTabProps {
  events: any[];
  onEdit: (ev: any) => void;
  onDelete: (id: string) => void;
}

export default function EventsGridTab({ events, onEdit, onDelete }: EventsGridTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs group"
        >
          {ev.image && (
            <div className="relative h-44 bg-slate-100 border-b border-slate-100 overflow-hidden">
              <img
                src={ev.image}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs uppercase font-mono">
                  {ev.category || "Nearest"}
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
              onClick={() => onEdit(ev)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Edit Event"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(ev.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Delete Event"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
