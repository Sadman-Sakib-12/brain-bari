"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePortfolios, useSiteSettings } from "@/hooks/useApi";

export default function PortfolioSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: portfolios = [] } = usePortfolios();
  const { data: siteSettings } = useSiteSettings();

  const portfolioCfg = (siteSettings as any)?.portfolioSection || {};

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const projectItems = (portfolios || []).map((item: any, idx: number) => ({
    id: String(idx + 1).padStart(2, "0"),
    category: item.category || "AI & Software",
    statusBadge: item.featured ? "Featured" : "Live Platform",
    dotColor: "bg-purple-500",
    title: item.title,
    description: item.description || item.shortDesc || "",
    image: item.thumbnail || item.image || "",
    href: item.slug ? `/new-work/${item.slug}` : `/new-work`
  }));

  return (
    <section className="py-14 md:py-20 bg-[#ebe8fd] overflow-hidden relative">
      {/* Background Blurs */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-[#b57be4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-[#e464a4]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-40">
            {portfolioCfg.badge && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/60 border border-purple-200/50 text-[#a05fd3] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#b57be4] rounded-full animate-pulse" />
                {portfolioCfg.badge}
              </div>
            )}

            <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-black text-gray-900 leading-[1.05] tracking-tight font-sans">
              {portfolioCfg.heading} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                {portfolioCfg.headingGradient}
              </span>
            </h2>

            <p className="text-gray-600 text-base sm:text-[17px] leading-relaxed font-semibold max-w-[360px]">
              {portfolioCfg.description}
            </p>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full border-2 border-[#b57be4]/60 bg-white hover:bg-gradient-to-r hover:from-[#ff7e5f] hover:to-[#e464a4] text-gray-700 hover:text-white flex items-center justify-center shadow-md hover:shadow-purple-500/20 hover:border-transparent transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={scrollRight}
                className="w-12 h-12 rounded-full border-2 border-[#b57be4]/60 bg-white hover:bg-gradient-to-r hover:from-[#ff7e5f] hover:to-[#e464a4] text-gray-700 hover:text-white flex items-center justify-center shadow-md hover:shadow-purple-500/20 hover:border-transparent transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Carousel Track */}
          <div className="lg:col-span-8 space-y-8 relative">
            {projectItems.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-gray-500 font-medium font-sans">
                No portfolio projects currently available.
              </div>
            ) : (
              <div 
                ref={scrollRef}
                className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-1 no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {projectItems.map((item) => (
                <div 
                  key={item.id} 
                  className="snap-start shrink-0 w-[290px] sm:w-[360px] md:w-[380px]"
                >
                  <Link
                    href={item.href}
                    className="group flex flex-col h-full bg-white/70 backdrop-blur-lg rounded-3xl border border-white/80 hover:border-purple-200/50 shadow-[0_8px_30px_rgba(181,123,228,0.03)] hover:shadow-[0_20px_50px_rgba(181,123,228,0.12)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden relative"
                  >
                    {/* Background Number Watermark */}
                    <div className="absolute right-6 bottom-4 text-7xl sm:text-8xl font-black text-purple-100/35 font-mono select-none pointer-events-none transition-all duration-500 group-hover:text-purple-200/50 group-hover:scale-105 z-0">
                      {item.id}
                    </div>

                    {/* Image Header */}
                    <div className="relative w-full h-[180px] sm:h-[220px] bg-[#fcfbff] border-b border-purple-50/50 overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/15 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow min-h-[190px] bg-white/40 backdrop-blur-sm z-10">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-50 text-[#b57be4] border border-purple-100/40">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-white/80 border border-purple-100/20 px-2.5 py-0.5 rounded-full">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} animate-pulse`} />
                            {item.statusBadge}
                          </span>
                        </div>

                        <h3 className="text-gray-900 text-[16px] sm:text-[18px] font-black leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff7e5f] group-hover:to-[#e464a4] transition-all duration-300">
                          {item.title}
                        </h3>

                        <p className="text-gray-500 text-[12px] sm:text-[13px] leading-relaxed font-medium pt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-5 mt-6 border-t border-purple-100/20 relative z-10">
                        <span className="text-[10px] sm:text-[11px] font-black text-[#b57be4] group-hover:text-[#e464a4] transition-colors uppercase tracking-widest">
                          View Case Study
                        </span>
                        <div className="w-8 h-8 rounded-full bg-purple-50/50 group-hover:bg-gradient-to-r group-hover:from-[#ff7e5f] group-hover:to-[#e464a4] group-hover:text-white flex items-center justify-center text-gray-400 transition-all duration-500 shadow-sm">
                          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </Link>
                </div>
              ))}
            </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
