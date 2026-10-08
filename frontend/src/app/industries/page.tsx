"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  ShoppingBag,
  Landmark,
  Building,
  Scale,
  GraduationCap,
  Truck,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Bot,
  Zap,
  ExternalLink,
  ChevronRight,
  Search,
  ShoppingCart,
  Smartphone,
  Home,
  Monitor,
  Heart,
  Camera,
  Infinity,
  Users,
  Building2,
  Fingerprint,
  Gamepad2,
  Globe,
  Flame,
  Sprout,
  Package,
} from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";
import ConversionCTA from "@/components/ConversionCTA";
import IndustryFaqSection from "./components/IndustryFaqSection";

const iconMap: Record<string, any> = {
  HeartPulse,
  ShoppingBag,
  Landmark,
  Building,
  Scale,
  GraduationCap,
  Truck,
  Layers,
  ShoppingCart,
  Smartphone,
  Home,
  Monitor,
  Heart,
  Camera,
  Infinity,
  Users,
  Building2,
  Fingerprint,
  Gamepad2,
  Globe,
  Flame,
  Sprout,
  Package,
  Zap,
};

export default function IndustriesPage() {
  const { data: cmsIndustries = [] } = useCmsContent<any[]>("industries");
  const { data: rawBadges = [] } = useCmsContent<any[]>("industryBadges");
  const { data: pageCms } = useCmsContent<any>("industriesPage");
  const industriesData = Array.isArray(cmsIndustries) ? cmsIndustries : [];
  const industryBadges = Array.isArray(rawBadges) ? rawBadges : [];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const handleBadgeClick = (badge: any) => {
    if (activeBadge === badge.id) {
      setActiveBadge(null);
      setSelectedCategory("all");
      setSearchQuery("");
    } else {
      setActiveBadge(badge.id);
      if (badge.targetId) {
        setSelectedCategory(badge.targetId);
        setSearchQuery("");
        const elem = document.getElementById(badge.targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (badge.searchQuery) {
        setSelectedCategory("all");
        setSearchQuery(badge.searchQuery);
      }
    }
  };

  const filteredIndustries = industriesData.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.id === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const roiCardStyles = [
    { bg: "bg-orange-100", text: "text-orange-700", defaultIcon: Cpu },
    { bg: "bg-emerald-100", text: "text-emerald-700", defaultIcon: ShieldCheck },
    { bg: "bg-blue-100", text: "text-blue-700", defaultIcon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] font-sans text-gray-800 dark:text-slate-100 pt-20 transition-colors duration-200">
      
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-start sticky top-[72px] sm:top-[80px] z-30 shadow-xs"
      >
        <div className="max-w-[1240px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#8a421a] dark:hover:text-amber-400 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-gray-300 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-bold max-w-[200px] truncate" aria-current="page">
              Industries
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#ebe8fd] via-[#f4f2fe] to-white dark:from-[#0f172a] dark:via-[#090d16] dark:to-[#090d16] py-16 sm:py-24 px-6 border-b border-[#c8c2eb]/40 dark:border-white/10 transition-colors">
        <div className="max-w-[1240px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-[#c8c2eb] dark:border-white/15 text-[#8a421a] dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{pageCms?.hero?.badge || "Domain-Specific AI Architecture"}</span>
          </div>
          <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-black text-gray-950 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            {pageCms?.hero?.title || "Engineering AI & Software Across"}{" "}
            <span className="bg-gradient-to-r from-[#8a421a] via-[#602b0c] to-indigo-800 dark:from-amber-400 dark:via-orange-300 dark:to-indigo-400 bg-clip-text text-transparent">
              {pageCms?.hero?.titleHighlight || "High-Impact Industries"}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            {pageCms?.hero?.description || "We don't build one-size-fits-all software. We architect specialized conversational chatbots, intelligent automation pipelines, and enterprise web solutions tailored directly to your industry's regulatory and customer realities."}
          </p>

          {/* Quick Search & Filter Tabs */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search industries, AI solutions, or challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111827] rounded-full border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-[#8a421a] dark:focus:border-amber-400 focus:ring-2 focus:ring-[#8a421a]/20 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Organic Leaf/Petal Industry Badges Showcase */}
          {industryBadges.length > 0 && (
            <div className="max-w-[1180px] mx-auto mt-6 mb-4">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-4.5">
                {industryBadges.map((badge) => {
                  const Icon = (typeof badge.icon === "string" ? iconMap[badge.icon] : badge.icon) || Sparkles;
                  const isActive =
                    activeBadge === badge.id ||
                    (badge.targetId && selectedCategory === badge.targetId);

                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => handleBadgeClick(badge)}
                      style={{
                        backgroundColor: badge.bg,
                        borderRadius: "38px 12px 38px 12px",
                      }}
                      className={`industry-petal-btn w-[124px] sm:w-[136px] md:w-[144px] h-[92px] sm:h-[100px] flex flex-col items-center justify-center p-2.5 transition-all duration-200 cursor-pointer select-none group border border-black/[0.04] dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                        isActive
                          ? "ring-2 ring-[#8a421a] dark:ring-amber-400 shadow-md scale-105"
                          : "hover:-translate-y-1 hover:shadow-md"
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-slate-100 stroke-[1.6] group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-[11px] sm:text-[12px] font-medium text-gray-800 dark:text-slate-100 text-center leading-tight mt-1.5 px-1 line-clamp-2">
                        {badge.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeBadge && (
                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBadge(null);
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-[#c8c2eb] dark:border-slate-700 text-[#8a421a] dark:text-amber-400 hover:bg-[#8a421a] hover:text-white dark:hover:bg-amber-500 dark:hover:text-slate-950 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>✕ Clear Selection &amp; View All Industries</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Why Industry Specific AI Matters */}
      <section className="py-16 px-6 bg-white dark:bg-[#0b0f19] border-b border-gray-100 dark:border-white/10 transition-colors">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white tracking-tight mb-3">
              {pageCms?.roiSection?.heading || "Why Domain Expertise Drives Superior AI ROI"}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
              {pageCms?.roiSection?.subheading || "Generic LLM wrappers fail when confronted with real-world jargon, strict compliance protocols, and nuanced customer inquiries. Here is how Brain Bari designs for measurable outcomes:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Array.isArray(pageCms?.roiCards) ? pageCms.roiCards : []).map((card: any, idx: number) => {
              const style = roiCardStyles[idx % roiCardStyles.length];
              const IconComp = (card.icon && iconMap[card.icon]) || (card.icon === "ShieldCheck" ? ShieldCheck : card.icon === "TrendingUp" ? TrendingUp : Cpu);
              return (
                <div key={card.id || idx} className="p-6 rounded-2xl bg-[#fbfaff] dark:bg-[#121927] border border-[#c8c2eb]/60 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
                  <div>
                    <div className={`w-10 h-10 rounded-xl ${style.bg} dark:bg-opacity-20 ${style.text} flex items-center justify-center mb-4`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-950 dark:text-white mb-2">{card.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-100 dark:border-slate-800 text-xs font-semibold text-[#8a421a] dark:text-amber-400 flex items-center gap-1">
                    <span>{card.badge}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Industries Showcase */}
      <section className="py-16 sm:py-24 px-6 bg-[#fcfbfe] dark:bg-[#090d16] transition-colors">
        <div className="max-w-[1240px] mx-auto space-y-16">
          {filteredIndustries.map((ind, index) => {
            const IconComponent = iconMap[ind.icon] || Bot;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-28 bg-white dark:bg-[#121927] rounded-3xl p-6 sm:p-10 border border-gray-200/80 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-gray-300 dark:hover:border-slate-700 transition-all"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  
                  {/* Left Info Column */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${ind.colorGradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#8a421a] dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-800/40">
                          {ind.badge}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight mt-1">
                          {ind.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-snug">
                      {ind.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-normal">
                      {ind.description}
                    </p>

                    {/* Challenges Solved */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Core Industry Friction We Solve</span>
                      </h4>
                      <ul className="space-y-2">
                        {ind.challenges.map((chal, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-slate-300">
                            <div className="w-4 h-4 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold">✕</span>
                            </div>
                            <span>{chal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Architecture &amp; Frameworks
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {ind.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href="/schedule"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                      >
                        <span>Consult for {ind.shortTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {ind.featuredProduct && (
                        <Link
                          href={ind.featuredProduct.link}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-xs font-semibold transition-all border border-gray-200 dark:border-slate-700"
                        >
                          <span>Explore {ind.featuredProduct.name}</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 dark:text-slate-400" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Solutions & Metrics Column */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* ROI Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#ebe8fd]/60 dark:bg-[#1a2035]/60 border border-[#c8c2eb] dark:border-slate-800">
                      {ind.keyMetrics.map((met, mIdx) => (
                        <div key={mIdx} className="text-center">
                          <div className="text-lg sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                            {met.value}
                          </div>
                          <div className="text-[10.5px] font-medium text-gray-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {met.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Solutions List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Engineered AI Capabilities
                      </h4>
                      {ind.solutions.map((sol, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-white dark:bg-[#0b0f19] border border-gray-100 dark:border-slate-800 shadow-xs hover:border-[#c8c2eb] dark:hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <h5 className="text-sm font-bold text-gray-950 dark:text-white">
                              {sol.title}
                            </h5>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-slate-400 pl-6 leading-relaxed">
                            {sol.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Featured Product Banner if applicable */}
                    {ind.featuredProduct && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/80 dark:border-orange-800/40 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider">
                            Featured Live Product
                          </div>
                          <div className="text-sm font-bold text-gray-950 dark:text-white">
                            {ind.featuredProduct.name} &mdash; <span className="text-gray-600 dark:text-slate-400 font-normal">{ind.featuredProduct.tag}</span>
                          </div>
                        </div>
                        <Link
                          href={ind.featuredProduct.link}
                          className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-orange-900 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-slate-700 hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-xs"
                        >
                          View Details
                        </Link>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industry Solutions FAQ */}
      <IndustryFaqSection faqs={pageCms?.faqs} />

      {/* Conversion CTA */}
      <ConversionCTA />

    </div>
  );
}
