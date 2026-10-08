"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Globe, Zap } from "lucide-react";

export default function SystemConnectivityBar() {
  const telemetry = [
    {
      title: "Core System Engine",
      value: "100% Operational",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/60",
      statusDot: "bg-emerald-500",
      pulse: true,
    },
    {
      title: "PostgreSQL Database",
      value: "NeonDB Serverless",
      icon: ShieldCheck,
      iconColor: "text-cyan-600 dark:text-cyan-400",
      iconBg: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-800/60",
      statusDot: "bg-emerald-500",
      pulse: false,
    },
    {
      title: "Public Endpoint",
      value: "localhost:3000",
      icon: Globe,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800/60",
      statusDot: "bg-emerald-500",
      pulse: false,
    },
    {
      title: "Real-time Sync",
      value: "Instant CMS Bridge",
      icon: Zap,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800/60",
      statusDot: "bg-emerald-500",
      pulse: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {telemetry.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs hover:shadow-sm transition-all group"
          >
            <div
              className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {item.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.statusDot} ${
                    item.pulse ? "animate-pulse" : ""
                  }`}
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
