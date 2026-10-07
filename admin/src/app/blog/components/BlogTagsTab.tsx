"use client";

import React from "react";

interface BlogTagsTabProps {
  tags: string[];
}

export default function BlogTagsTab({ tags }: BlogTagsTabProps) {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
      <h3 className="text-sm font-bold text-slate-900">Active Keyword Tags</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((t, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
