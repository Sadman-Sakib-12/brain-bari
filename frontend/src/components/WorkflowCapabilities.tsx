"use client";

import React from "react";
import siteSettings from "@/data/siteSettings.json";

export default function WorkflowCapabilities() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu"];

  const workflow = siteSettings.workflow || {
    card1Title: "Website Assistant Chatbot",
    card1Progress: "50%",
    card1Subtitle: "WP Content Write",
    card1Desc: "Corporate restructuring and automated workflows that streamline client response.",
    card2Title: "Schedule",
    card2Subtitle: "AI Chatbot Setup",
    card2Desc: "Configure system prompts and integrate custom knowledge base files.",
    card3Title: "Generate Unique Content",
    card3Desc: "Autonomous content generation tailored to your company documentation, guaranteeing contextual accuracy and instant responses."
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Website Assistant Chatbot */}
          <div className="bg-[#050505] border border-[#1a3822] rounded-2xl p-8 flex flex-col justify-center">
            <h3 className="text-[#3ef06e] font-bold text-[20px] mb-6 text-center tracking-wide">
              {workflow.card1Title}
            </h3>
            <div className="w-full">
              <p className="text-gray-400 text-[11px] text-left mb-1.5 font-medium">
                {workflow.card1Progress}
              </p>
              <div className="w-full bg-[#163321] rounded-full h-2 mb-10">
                <div 
                  style={{ width: workflow.card1Progress }}
                  className="bg-[#3ef06e] h-full rounded-full shadow-[0_0_8px_rgba(62,240,110,0.4)]" 
                />
              </div>
            </div>
            <p className="text-white font-bold text-[17px] mb-3 text-center">
              {workflow.card1Subtitle}
            </p>
            <p className="text-gray-300 text-[13px] text-center leading-relaxed px-2">
              {workflow.card1Desc}
            </p>
          </div>

          {/* Card 2: Schedule */}
          <div className="bg-[#050505] border border-[#1a3822] rounded-2xl p-8 flex flex-col justify-between items-center">
            <div className="w-full text-center mb-6">
              <h3 className="text-[#3ef06e] font-bold text-[22px] mb-2 tracking-wide">
                {workflow.card2Title}
              </h3>
              <div className="min-h-[64px] flex flex-col justify-center">
                <p className="text-white text-[14px] font-semibold mb-1 transition-all duration-300">
                  {workflow.card2Subtitle}
                </p>
                <p className="text-gray-400 text-[12px] leading-relaxed transition-all duration-300 max-w-[280px] mx-auto">
                  {workflow.card2Desc}
                </p>
              </div>
            </div>

            {/* Green Calendar Schedule Ribbon */}
            <div className="w-full bg-[#3ef06e] rounded-[14px] grid grid-cols-5 justify-items-center items-center px-2 py-5 relative overflow-visible min-h-[116px]">
              {days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[11px] font-black text-black uppercase tracking-wider">
                    {day}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${
                    idx === 2 ? "bg-black text-[#3ef06e]" : "bg-black/15 text-black"
                  }`}>
                    {18 + idx}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Generate Unique Content */}
          <div className="bg-[#050505] border border-[#1a3822] rounded-2xl p-8 flex flex-col justify-center text-left">
            <h3 className="text-[#3ef06e] font-bold text-[21px] mb-4 tracking-wide leading-tight">
              {workflow.card3Title}
            </h3>
            <p className="text-white text-[14px] leading-relaxed">
              {workflow.card3Desc}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
