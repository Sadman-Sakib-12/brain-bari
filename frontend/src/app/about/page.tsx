import React from "react";
import Link from "next/link";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us – Brain Bari",
  description: "Brain Bari is an AI & Software Solutions company in Bangladesh specializing in precision AI, custom software, and digital transformation.",
};

async function getAboutData() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/cms/content/about`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
}

async function getSiteSettings() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/cms/settings`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
}

export default async function AboutPage() {
  const [data, settings] = await Promise.all([getAboutData(), getSiteSettings()]);
  const milestones = data?.journey?.milestones || [];
  const brandName = settings?.siteName || "Brain Bari";
  const tagline = settings?.tagline || "AI & Software Solutions";
  const logoUrl = settings?.logoUrl || settings?.logo;

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] font-sans text-gray-800 dark:text-gray-200 pt-20 transition-colors duration-300">
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/70 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-start sticky top-[80px] z-30"
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-bold max-w-[200px] truncate" aria-current="page">
              About Us
            </span>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="bg-[#ebe8fd] dark:bg-[#121626] py-24 md:py-32 px-6 mt-2 transition-colors">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="pt-2">
            <h1 className="text-[32px] md:text-[36px] font-bold text-black dark:text-white leading-snug mb-10 tracking-tight">
              {data?.hero?.headline || "Precision AI for Smarter, Scalable Business Growth"}
            </h1>
            <div className="bg-[#f8f8f8] dark:bg-[#182136] rounded-tl-[16px] rounded-br-[16px] rounded-tr-[100px] rounded-bl-[100px] flex items-center justify-center relative aspect-[1.1/1] w-full max-w-[480px] mx-auto lg:mx-0 overflow-hidden shadow-sm border border-purple-100 dark:border-white/10 p-8">
              <div className="flex flex-col items-center justify-center text-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="max-h-24 max-w-[220px] object-contain mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4">
                    <span className="text-3xl font-black tracking-tight font-sans">
                      {brandName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{brandName}</h3>
                <span className="text-xs tracking-widest text-blue-600 dark:text-blue-400 font-bold uppercase mt-1">{tagline}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="italic font-bold text-[13px] leading-relaxed mb-8 text-black dark:text-white">
              {data?.hero?.intro}
            </p>
            <h2 className="text-[26px] md:text-[28px] font-[400] text-black dark:text-white mb-6 tracking-tight leading-tight">
              {data?.hero?.subHeadline}
            </h2>
            <p className="text-[13.5px] font-[300] mb-6 leading-relaxed text-[#222] dark:text-gray-300">
              {data?.hero?.body}
            </p>
            <h3 className="font-bold text-[14px] mb-3 text-black dark:text-white">{data?.hero?.workAreasTitle}</h3>
            <ul className="list-disc pl-5 mb-8 text-[13.5px] font-[300] space-y-[2px] text-[#222] dark:text-gray-300">
              {(data?.hero?.workAreas || []).map((area: string, i: number) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
            <p className="text-[13.5px] font-[300] leading-relaxed text-[#222] dark:text-gray-300">
              {data?.hero?.closingText}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Professional Journey Timeline */}
      <section className="py-16 px-6 bg-[#fafafa] dark:bg-[#0c101d] overflow-hidden transition-colors">
        <div className="max-w-[1200px] mx-auto text-center mb-12">
          <h2 className="text-[32px] font-[400] text-black dark:text-white tracking-tight inline-block relative">
            {data?.journey?.heading || "Professional Journey"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-[14px] font-[300]">
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
                  <div className="bg-white dark:bg-[#151c2d] rounded-[16px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/60 dark:border-white/10 transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] cursor-default">
                    <h3 className="font-bold text-[17.5px] text-[#111] dark:text-white mb-1.5 tracking-tight">
                      {m.title}
                    </h3>
                    <p className="text-[#666] dark:text-gray-400 text-[13px] font-medium mb-3">
                      {m.subtitle}
                    </p>
                    <p className="text-[#444] dark:text-gray-300 text-[13.5px] font-[300] leading-[1.6]">
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
      <section className="py-24 px-6 bg-[#abcbf7] dark:bg-[#14233c] transition-colors">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[32px] md:text-[34px] font-[400] text-[#111] dark:text-white mb-12 tracking-tight relative inline-block">
            {data?.services?.heading || "Full Cycle Development Services"}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-[1.5px] bg-[#1f59d4]"></div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 max-w-[1100px] mx-auto">
            {(data?.services?.items || []).map((svc: any, i: number) => (
              <div key={svc.id || i} className="flex flex-col items-center text-center px-2">
                <div className="w-[50px] h-[40px] mx-auto mb-2 bg-[#4b4f58] dark:bg-slate-700 rounded-[4px] flex items-center justify-center text-white font-black text-[11px] tracking-wider leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-[400] text-[15.5px] text-[#222] dark:text-white mb-1.5 tracking-wide">{svc.title}</h3>
                <p className="text-[#333] dark:text-gray-300 text-[14.5px] font-[300] leading-[1.6] max-w-[280px]">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation CTA Section */}
      <section className="py-20 bg-[#ebe8fd] dark:bg-[#121626] text-center border-b border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[34px] font-bold font-sans text-[#111111] dark:text-white mb-4 tracking-tight">
            {data?.cta?.heading || "Ready to transform your Business"}
          </h2>
          <p className="text-[#333333] dark:text-gray-300 text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
            {data?.cta?.desc || "Schedule a 60-minute strategy call with our AI engineers to discuss your product roadmap and technical architecture."}
          </p>
          <Link
            href={data?.cta?.buttonLink || settings?.navbar?.ctaLink || "/schedule"}
            className="inline-block px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-[14px] transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35"
          >
            {data?.cta?.buttonText || settings?.navbar?.ctaText || "Schedule A Consultation"}
          </Link>
        </div>
      </section>
    </div>
  );
}
