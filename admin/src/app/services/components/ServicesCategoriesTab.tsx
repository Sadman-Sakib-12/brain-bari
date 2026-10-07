"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Layers, Cpu, Box, Info } from "lucide-react";

export default function ServicesCategoriesTab() {
  const categories = [
    {
      id: "ai-chatbot",
      name: "AI Chatbot Landing Page",
      icon: Bot,
      starting: "$259",
      desc: "Conversational agents trained on custom docs, FAQs, and APIs for customer care and auto-ordering.",
      activeCount: "Dedicated CMS",
      href: "/services/ai-chatbot",
    },
    {
      id: "ai-saas",
      name: "AI SaaS Landing Page",
      icon: Layers,
      starting: "$450",
      desc: "Multi-tenant cloud architectures with AI APIs, billing integrations, and analytics dashboards.",
      activeCount: "Dedicated CMS",
      href: "/services/ai-saas",
    },
    {
      id: "custom-ai",
      name: "Custom AI Assistant Landing Page",
      icon: Cpu,
      starting: "$650",
      desc: "Specialized enterprise copilot assistants for healthcare, financial triage, and legal workflows.",
      activeCount: "Dedicated CMS",
      href: "/services/custom-ai",
    },
    {
      id: "ai-3d",
      name: "AI & 3D Web/Apps Landing Page",
      icon: Box,
      starting: "$450",
      desc: "Interactive Three.js, WebGL, and mobile applications with embedded intelligent conversational layers.",
      activeCount: "Dedicated CMS",
      href: "/services/ai-3d",
    },
  ];

  return (
    <div className="space-y-4">
      {/* EXPLANATORY BANNER */}
      <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong className="font-bold block text-sm mb-0.5">
            Dedicated Service Landing Pages
          </strong>
          Each service category has its own rich, dedicated landing page with customizable hero
          headlines, workflow steps, tech stack badges, and deliverable tiers. Click on any category
          below to edit its dedicated landing page.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-blue-600 font-mono">
                    From {cat.starting}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{cat.activeCount}</span>
                <Link
                  href={cat.href}
                  className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>Edit Landing Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
