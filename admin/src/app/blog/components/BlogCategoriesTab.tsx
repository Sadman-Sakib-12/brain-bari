"use client";

import React from "react";

interface BlogCategoriesTabProps {
  categories: string[];
  blogs: any[];
}

export default function BlogCategoriesTab({ categories, blogs }: BlogCategoriesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((cat, idx) => (
        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
            <span className="text-xs text-slate-400 font-mono">
              {blogs.filter((b) => (b.category || "").toLowerCase() === cat.toLowerCase()).length} posts
            </span>
          </div>
          <p className="text-xs text-slate-500">Editorial series on {cat} across local and international sectors.</p>
        </div>
      ))}
    </div>
  );
}
