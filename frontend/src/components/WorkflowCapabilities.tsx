"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useApi";

export default function WorkflowCapabilities() {
  const { data: siteSettings } = useSiteSettings();
  const workflow = (siteSettings as any)?.workflow;

  const scheduleDays = Array.isArray(workflow?.scheduleDays) ? workflow.scheduleDays : [];

  // Interactive selected day state
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Sync initial selection from whichever item is marked active in scheduleDays
  useEffect(() => {
    if (scheduleDays.length > 0) {
      const activeIdx = scheduleDays.findIndex((d: any) => d.active);
      if (activeIdx !== -1) {
        setSelectedIndex(activeIdx);
      }
    }
  }, [scheduleDays]);

  if (!workflow) {
    return null;
  }

  const currentDay = scheduleDays[selectedIndex] || scheduleDays[0] || {};
  const currentSubtitle = currentDay.subtitle || workflow.card2Subtitle || "AI Chatbot Setup";
  const currentDesc = currentDay.desc || workflow.card2Desc || "Configure system prompts and integrate custom knowledge base files.";

  return (
    <section className="py-20 bg-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card 1: Website Assistant Chatbot */}
          <Link
            href="/services"
            className="group bg-[#050505] border border-[#1a3822] hover:border-[#3ef06e]/50 rounded-2xl p-8 flex flex-col justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(62,240,110,0.12)] cursor-pointer"
          >
            {workflow.card1Title && (
              <h3 className="text-[#3ef06e] font-bold text-[20px] mb-6 text-center tracking-wide group-hover:scale-105 transition-transform">
                {workflow.card1Title}
              </h3>
            )}
            <div className="w-full">
              {workflow.card1Progress && (
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-gray-400 text-[11px] font-medium">
                    {workflow.card1Progress}
                  </p>
                  <span className="text-[10px] text-[#3ef06e] opacity-0 group-hover:opacity-100 transition-opacity">
                    In Progress
                  </span>
                </div>
              )}
              <div className="w-full bg-[#163321] rounded-full h-2 mb-10 overflow-hidden">
                <div
                  style={{ width: workflow.card1Progress || "50%" }}
                  className="bg-[#3ef06e] h-full rounded-full shadow-[0_0_8px_rgba(62,240,110,0.4)] group-hover:brightness-110 transition-all duration-500"
                />
              </div>
            </div>
            {workflow.card1Subtitle && (
              <p className="text-white font-bold text-[17px] mb-3 text-center">
                {workflow.card1Subtitle}
              </p>
            )}
            {workflow.card1Desc && (
              <p className="text-gray-300 text-[13px] text-center leading-relaxed px-2">
                {workflow.card1Desc}
              </p>
            )}
          </Link>

          {/* Card 2: Schedule & Interactive Calendar */}
          <div className="bg-[#050505] border border-[#1a3822] hover:border-[#3ef06e]/40 rounded-2xl p-8 flex flex-col justify-between items-center transition-all duration-300 shadow-sm">
            <div className="w-full text-center mb-6">
              {workflow.card2Title && (
                <Link
                  href="/schedule"
                  className="inline-block text-[#3ef06e] font-bold text-[22px] mb-2 tracking-wide hover:underline cursor-pointer"
                >
                  {workflow.card2Title}
                </Link>
              )}
              <div className="min-h-[68px] flex flex-col justify-center transition-all duration-300">
                <p className="text-white text-[14px] font-semibold mb-1 transition-all duration-300">
                  {currentSubtitle}
                </p>
                <p className="text-gray-400 text-[12px] leading-relaxed transition-all duration-300 max-w-[280px] mx-auto">
                  {currentDesc}
                </p>
              </div>
            </div>

            {/* Green Calendar Schedule Ribbon with Interactive Click Handlers */}
            {scheduleDays.length > 0 && (
              <div className="w-full bg-[#3ef06e] rounded-2xl flex items-center justify-between p-3.5 px-4 min-h-[96px] shadow-[0_0_20px_rgba(62,240,110,0.15)]">
                {scheduleDays.map((item: any, idx: number) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      title={`Click to view ${item.day} ${item.date} schedule`}
                      className={`cursor-pointer transition-all duration-200 outline-none focus:outline-none ${
                        isSelected
                          ? "bg-[#0a160d] text-white rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-lg min-w-[52px] scale-105 ring-2 ring-black"
                          : "flex flex-col items-center justify-center px-2 py-1 text-black min-w-[38px] hover:scale-110 active:scale-95 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span className={`text-[18px] font-black leading-none ${isSelected ? "text-white" : "text-black"}`}>
                        {item.date}
                      </span>
                      <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${isSelected ? "text-gray-200" : "text-black/85"}`}>
                        {item.day}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Direct Booking Link */}
            <Link
              href="/schedule"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3ef06e] hover:text-[#5aff89] transition-colors cursor-pointer group"
            >
              <span>Book Discovery Call</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Card 3: Generate Unique Content */}
          <Link
            href="/services"
            className="group bg-[#050505] border border-[#1a3822] hover:border-[#3ef06e]/50 rounded-2xl p-8 flex flex-col justify-center text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(62,240,110,0.12)] cursor-pointer"
          >
            {workflow.card3Title && (
              <h3 className="text-[#3ef06e] font-bold text-[21px] mb-4 tracking-wide leading-tight group-hover:scale-102 transition-transform">
                {workflow.card3Title}
              </h3>
            )}
            {workflow.card3Desc && (
              <p className="text-gray-300 text-[13px] leading-relaxed group-hover:text-white transition-colors">
                {workflow.card3Desc}
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#3ef06e] group-hover:text-[#5aff89] transition-colors">
              <span>Explore Custom AI Models</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
