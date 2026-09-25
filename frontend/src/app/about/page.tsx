import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import aboutData from "@/data/about.json";

export const metadata: Metadata = {
  title: "About Us – Brain Bari",
  description: "Brain Bari is an AI & Software Solutions company in Bangladesh specializing in precision AI, custom software, and digital transformation.",
};

export default function AboutPage() {
  const data = aboutData as any;
  const milestones = data?.journey?.milestones || [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pt-20">
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-start sticky top-[80px] z-30"
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#78350f] transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-bold max-w-[200px] truncate" aria-current="page">
              About Us
            </span>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="bg-[#ebe8fd] py-24 md:py-32 px-6 mt-2">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="pt-2">
            <h1 className="text-[32px] md:text-[36px] font-bold text-black leading-snug mb-10 tracking-tight">
              {data?.hero?.headline || "Precision AI for Smarter, Scalable Business Growth"}
            </h1>
            <div className="bg-[#f8f8f8] rounded-tl-[16px] rounded-br-[16px] rounded-tr-[100px] rounded-bl-[100px] flex items-center justify-center relative aspect-[1.1/1] w-full max-w-[480px] mx-auto lg:mx-0 overflow-hidden shadow-sm border border-purple-100">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-3xl bg-[#602b0c] text-white flex items-center justify-center shadow-xl mb-4">
                  <span className="text-3xl font-black tracking-tight font-sans">BB</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Brain Bari</h3>
                <span className="text-xs tracking-widest text-[#8a421a] font-bold uppercase mt-1">AI &amp; Software Solutions</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="italic font-bold text-[13px] leading-relaxed mb-8 text-black">
              {data?.hero?.intro}
            </p>
            <h2 className="text-[26px] md:text-[28px] font-[400] text-black mb-6 tracking-tight leading-tight">
              {data?.hero?.subHeadline}
            </h2>
            <p className="text-[13.5px] font-[300] mb-6 leading-relaxed text-[#222]">
              {data?.hero?.body}
            </p>
            <h3 className="font-bold text-[14px] mb-3 text-black">{data?.hero?.workAreasTitle}</h3>
            <ul className="list-disc pl-5 mb-8 text-[13.5px] font-[300] space-y-[2px] text-[#222]">
              {(data?.hero?.workAreas || []).map((area: string, i: number) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
            <p className="text-[13.5px] font-[300] leading-relaxed text-[#222]">
              {data?.hero?.closingText}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Professional Journey Timeline */}
      <section className="py-16 px-6 bg-[#fafafa] overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center mb-12">
          <h2 className="text-[32px] font-[400] text-black tracking-tight inline-block relative">
            {data?.journey?.heading || "Professional Journey"}
          </h2>
          <p className="text-gray-500 mt-4 text-[14px] font-[300]">
            {data?.journey?.subheading}
          </p>
        </div>

        <div className="relative max-w-[960px] mx-auto pb-4">
          <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-[#e5e7eb] -translate-x-1/2 hidden md:block z-0"></div>

          <div className="flex flex-col space-y-10 md:space-y-14 relative z-10">
            {milestones.map((m: any, idx: number) => (
              <div
                key={m.id || idx}
                className={`relative flex flex-col md:flex-row items-center justify-between ${
                  m.alignRight ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className={`w-full md:w-[48%] text-left ${m.alignRight ? "md:pl-5" : "md:pr-5"}`}>
                  <div className="bg-white rounded-[16px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/60 transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] cursor-default">
                    <h3 className="font-bold text-[17.5px] text-[#111] mb-1.5 tracking-tight">
                      {m.title}
                    </h3>
                    <p className="text-[#666] text-[13px] font-medium mb-3">
                      {m.subtitle}
                    </p>
                    <p className="text-[#444] text-[13.5px] font-[300] leading-[1.6]">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {m.tag && (
                  <>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center z-20">
                      <div className="bg-[#1f59d4] text-white text-[11.5px] font-[500] px-4 py-[6px] rounded-full shadow-sm whitespace-nowrap tracking-wide transition-transform duration-300 hover:scale-105 cursor-default">
                        {m.tag}
                      </div>
                    </div>
                    <div className="md:hidden mt-4 mb-2">
                      <div className="bg-[#1f59d4] text-white text-[11.5px] font-[500] px-4 py-[6px] rounded-full shadow-sm inline-block tracking-wide transition-transform duration-300 hover:scale-105">
                        {m.tag}
                      </div>
                    </div>
                  </>
                )}

                <div className="hidden md:block w-[48%]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Full Cycle Development Services */}
      <section className="py-24 px-6 bg-[#abcbf7]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[32px] md:text-[34px] font-[400] text-[#111] mb-12 tracking-tight relative inline-block">
            {data?.services?.heading || "Full Cycle Development Services"}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-[1.5px] bg-[#1f59d4]"></div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 max-w-[1100px] mx-auto">
            {(data?.services?.items || []).map((svc: any, i: number) => (
              <div key={svc.id || i} className="flex flex-col items-center text-center px-2">
                <div className="w-[50px] h-[40px] mx-auto mb-2 bg-[#4b4f58] rounded-[4px] flex items-center justify-center text-white font-black text-[11px] tracking-wider leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-[400] text-[15.5px] text-[#222] mb-1.5 tracking-wide">{svc.title}</h3>
                <p className="text-[#333] text-[14.5px] font-[300] leading-[1.6] max-w-[280px]">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation CTA Section */}
      <section className="py-20 bg-[#ebe8fd] text-center border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[34px] font-bold font-sans text-[#111111] mb-4 tracking-tight">
            {data?.cta?.heading || "Ready to transfer your Business"}
          </h2>
          <p className="text-[#333333] text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
            {data?.cta?.desc}
          </p>
          <Link
            href={data?.cta?.buttonLink || "/schedule/"}
            className="inline-block px-10 py-3.5 bg-[#602b0c] hover:bg-[#4a2008] text-white rounded-[3px] font-medium text-[14px] transition-colors duration-normal"
          >
            {data?.cta?.buttonText || "Schedule A Consultation"}
          </Link>
        </div>
      </section>
    </div>
  );
}
