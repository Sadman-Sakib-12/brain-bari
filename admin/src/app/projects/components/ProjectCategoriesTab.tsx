"use client";

import React from "react";

export default function ProjectCategoriesTab() {
  const categories = [
    { name: "AI & Automation", count: "4 Projects", desc: "Autonomous bots, RAG assistants, and process workflow engines." },
    { name: "SaaS Platform", count: "3 Projects", desc: "Multi-tenant cloud architectures, billing systems, and analytics." },
    { name: "Web Applications", count: "3 Projects", desc: "Modern full-stack web platforms and interactive user portals." },
    { name: "Enterprise Systems", count: "2 Projects", desc: "Custom internal tooling, security pipelines, and compliance suites." }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat, i) => (
        <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              {cat.count}
            </span>
          </div>
          <p className="text-xs text-slate-500">{cat.desc}</p>
        </div>
      ))}
    </div>
  );
}
