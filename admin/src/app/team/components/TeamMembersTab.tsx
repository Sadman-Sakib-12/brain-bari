"use client";

import React from "react";
import { Mail, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);

interface TeamMembersTabProps {
  departments: string[];
  selectedDept: string;
  onSelectDept: (dept: string) => void;
  filteredTeam: any[];
  onEdit: (member: any) => void;
  onDelete: (id: string) => void;
}

export default function TeamMembersTab({
  departments,
  selectedDept,
  onSelectDept,
  filteredTeam,
  onEdit,
  onDelete
}: TeamMembersTabProps) {
  return (
    <div className="space-y-5">
      {/* Department Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {["All", ...departments].map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => onSelectDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              selectedDept === dept
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Member Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeam.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="p-5 space-y-4">
              {/* Header: Avatar, Name, Dept */}
              <div className="flex items-start gap-3.5">
                {m.avatar ? (
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold shrink-0">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{m.name}</h3>
                    <StatusBadge status={m.status || "Active"} size="sm" />
                  </div>
                  <p className="text-xs text-indigo-600 font-medium truncate">{m.role || m.position}</p>
                  <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                    {m.department}
                  </span>
                </div>
              </div>

              {/* Bio Preview */}
              {m.bio && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {m.bio}
                </p>
              )}

              {/* Skills Pills */}
              {Array.isArray(m.skills) && m.skills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {m.skills.slice(0, 3).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium truncate max-w-[120px]"
                    >
                      {skill}
                    </span>
                  ))}
                  {m.skills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-medium">
                      +{m.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* FullBio Indicator */}
              {m.fullBio && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">Full biography configured</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                {m.email && (
                  <a href={`mailto:${m.email}`} title={m.email} className="hover:text-slate-600">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-slate-600">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {m.github && (
                  <a href={m.github} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-slate-600">
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(m)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Edit Member"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(m.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Delete Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
