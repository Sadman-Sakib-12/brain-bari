"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { FRONTEND_URL } from "@/lib/axios";

export default function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#1e1b4b] text-white p-6 sm:p-8 border border-white/10 shadow-xl shadow-slate-950/20">
      {/* Dynamic ambient mesh glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] text-cyan-300 border border-cyan-400/20 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-xs shadow-cyan-400" />
            <span className="tracking-wide">AI Agency Mission Control • 2026 Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Brain Bari Executive Command Center
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl">
            Real-time management for client inquiries, AI chatbot packages, live CMS content, and automated service quote pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={FRONTEND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md shadow-white/10 group cursor-pointer"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <Link
            href="/services?action=add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border border-indigo-400/30 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service Package</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
