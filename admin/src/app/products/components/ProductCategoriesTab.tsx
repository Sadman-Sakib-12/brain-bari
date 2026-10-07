"use client";

import React from "react";

export default function ProductCategoriesTab() {
  const categories = [
    { name: "AI Chatbots Platform", desc: "Embeddable conversational agents with multichannel integrations.", count: "2 Products" },
    { name: "AI SaaS Automation Suite", desc: "Turnkey platforms for billing, scheduling, and customer data management.", count: "2 Products" },
    { name: "AI Health Awareness", desc: "Clinical pre-triage and diagnostic workflow assistants.", count: "1 Product" },
    { name: "Brain Bari Ballot", desc: "Secure digital voting and survey validation platform.", count: "1 Product" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat, idx) => (
        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              {cat.count}
            </span>
          </div>
          <p className="text-xs text-slate-500">{cat.desc}</p>
        </div>
      ))}
    </div>
  );
}
