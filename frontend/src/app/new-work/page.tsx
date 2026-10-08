"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePortfolios, useCmsContent } from "@/hooks/useApi";
import ConversionCTA from "@/components/ConversionCTA";
import ClientLogos from "@/components/ClientLogos";

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  statusColor?: string;
  shortDesc: string;
  client: string;
  year: string;
  techStack: string[];
  metrics: string;
  challenge: string;
  solution: string;
  results: string;
  image: string;
}

export default function NewWorkPage() {
  const { data: portfolios = [] } = usePortfolios();
  const { data: cmsMetrics = null } = useCmsContent<any>("newWorkMetrics");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    (portfolios || []).forEach((p: any) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    const list = Array.from(set);
    return list.length > 0 ? ["All", ...list] : ["All", "Event & Conference", "AI & Taxation", "Crypto & FinTech"];
  }, [portfolios]);

  const portfolioItems: PortfolioItem[] = (portfolios || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: p.featured ? "Featured" : "Live Platform",
    shortDesc: p.description || "",
    client: p.client || "Client Showcase",
    year: new Date(p.createdAt || Date.now()).getFullYear().toString(),
    techStack: Array.isArray(p.tags) ? p.tags : [],
    metrics: "Production Ready",
    challenge: p.description || "",
    solution: p.description || "",
    results: "Validated",
    image: p.thumbnail || p.coverImage || p.image || "",
  }));

  const filteredWorks = selectedCategory === "All"
    ? portfolioItems
    : portfolioItems.filter((item) => 
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(item.category.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#ebe8fd] dark:bg-[#090d16] font-sans flex flex-col justify-between relative overflow-hidden pt-36 md:pt-40 transition-colors duration-200">
      {/* Background ambient radial blur orbs */}
      <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] bg-[#b57be4]/20 dark:bg-purple-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[700px] h-[700px] bg-[#e464a4]/15 dark:bg-pink-900/15 rounded-full blur-[170px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-[#ff7e5f]/8 dark:bg-orange-950/20 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <section className="flex-grow py-12 md:py-20 px-4 sm:px-6 relative z-10">
        {/* Header Title Section */}
        <div className="max-w-[1200px] mx-auto text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 dark:bg-white/10 border border-purple-200/50 dark:border-white/10 text-[#a05fd3] dark:text-purple-300 text-[11px] font-bold rounded-full uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] rounded-full animate-pulse"></span>
            Innovative Portfolio
          </div>
          <h1 className="text-[40px] sm:text-[54px] md:text-[68px] font-black text-[#1a1a1a] dark:text-white tracking-tight leading-[1.05] max-w-[850px] mx-auto">
            Powering Ideas <br className="sm:hidden" /> with{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
              AI &amp; Software
            </span>
          </h1>
          <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base max-w-[650px] mx-auto font-semibold leading-relaxed">
            We build state-of-the-art platforms, bespoke systems, and AI assistants designed to automate workflows and scale operations.
          </p>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="max-w-[800px] mx-auto grid grid-cols-3 gap-4 md:gap-8 mb-16 px-4">
          {(Array.isArray(cmsMetrics?.metrics) ? cmsMetrics.metrics : []).map((m: any, i: number) => (
            <div
              key={i}
              className="bg-white/65 dark:bg-[#121927] backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/70 dark:border-slate-800 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_12px_30px_rgba(181,123,228,0.1)] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={i === 1
                  ? "text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]"
                  : i === 2
                    ? "text-2xl md:text-4xl font-extrabold text-[#a05fd3] dark:text-purple-400"
                    : "text-2xl md:text-4xl font-extrabold text-[#b57be4] dark:text-indigo-400"
                }>
                  {m.value}
              </div>
              <div className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Filters & Cards */}
        <div className="max-w-[1200px] mx-auto pb-24 space-y-12">
          {/* Category Filter Tabs */}
          <div className="w-full flex justify-center">
            <div className="flex items-center overflow-x-auto md:overflow-x-visible md:justify-center md:flex-wrap gap-2.5 max-w-full px-4 py-2 select-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-sm border whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white border-transparent scale-105 shadow-md shadow-blue-500/25"
                        : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-gray-600 dark:text-slate-300 border-purple-100/50 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-102"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid - Each linking directly to dedicated dynamic page /new-work/[slug] */}
          {filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6">
              {filteredWorks.map((item) => (
                <Link
                  key={item.id}
                  href={`/new-work/${item.slug}`}
                  className="group flex flex-col bg-white/70 dark:bg-[#121927] backdrop-blur-lg rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(181,123,228,0.03)] dark:shadow-none border border-white/80 dark:border-slate-800 hover:border-purple-200 dark:hover:border-slate-700 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative text-left"
                >
                  <span className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/95 dark:bg-slate-900/90 text-[#e464a4] border border-[#e464a4]/20 shadow-md">
                    <span className="w-1.5 h-1.5 bg-[#e464a4] rounded-full animate-ping"></span>
                    Featured
                  </span>

                  <div className="relative w-full h-[210px] sm:h-[230px] md:h-[250px] bg-[#fdfcff] dark:bg-slate-900 overflow-hidden border-b border-purple-50/50 dark:border-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/15 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between min-h-[190px] flex-grow bg-white/40 dark:bg-[#121927] backdrop-blur-sm relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-50 dark:bg-purple-950/60 text-[#b57be4] dark:text-purple-300 border border-purple-100/40 dark:border-purple-800/60">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="text-gray-900 dark:text-white text-[18px] sm:text-[20px] font-black leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff7e5f] group-hover:to-[#e464a4] transition-all duration-300">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5 mt-6 border-t border-purple-100/30 dark:border-slate-800">
                      <span className="text-[11px] font-black text-[#b57be4] dark:text-purple-400 group-hover:text-[#e464a4] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                        View Case Study
                      </span>
                      <span className="text-lg font-bold text-gray-400 dark:text-slate-500 group-hover:text-[#e464a4] group-hover:translate-x-2 transition-all duration-500 ease-out">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 backdrop-blur-md rounded-3xl border border-white/80 p-8 max-w-[600px] mx-auto">
              <h3 className="text-lg font-bold text-gray-900">No portfolio projects found</h3>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new case studies and showcases.</p>
            </div>
          )}
        </div>
      </section>

      {/* Client Logos Marquee Strip */}
      <ClientLogos className="bg-white/60 backdrop-blur-md border-y border-purple-100/60 my-4" />

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
