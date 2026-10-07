"use client";

import React from "react";

interface DepartmentsTabProps {
  departments: string[];
  team: any[];
}

export default function DepartmentsTab({ departments, team }: DepartmentsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {departments.map((dept, idx) => (
        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{dept}</h3>
            <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              {team.filter((m) => (m.department || "").toLowerCase() === dept.toLowerCase()).length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Core organizational unit responsible for architecture, deliverable milestones, and production releases.
          </p>
        </div>
      ))}
    </div>
  );
}
