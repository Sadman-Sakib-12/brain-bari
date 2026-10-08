"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Bot, 
  Layers, 
  Cpu,
  Cpu as CpuIcon, 
  Heart, 
  Eye, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  TrendingUp, 
  ShieldCheck, 
  X,
  ExternalLink,
} from "lucide-react";
import { useProducts, useServices, useCmsContent } from "@/hooks/useApi";
import ConversionCTA from "@/components/ConversionCTA";

interface ProductLogo {
  icon: string;
  color: string;
  badge: string;
  subtitle: string;
}

const getCategoryColor = (category?: string): string => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("health") || cat.includes("medical")) {
    return "bg-rose-500";
  }
  if (cat.includes("law") || cat.includes("legal")) {
    return "bg-indigo-600";
  }
  if (cat.includes("education") || cat.includes("learn")) {
    return "bg-emerald-600";
  }
  return "bg-blue-600";
};

const renderLogoIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case "heart":
      return <Heart className={`${className} fill-current`} />;
    case "eye":
      return <Eye className={`${className} fill-current`} />;
    case "message":
      return <MessageSquare className={`${className} fill-current`} />;
    case "book":
      return <BookOpen className={className} />;
    default:
      return <Bot className={className} />;
  }
};

export default function ProductPage() {
  const { data: products = [] } = useProducts();
  const { data: services = [] } = useServices();
  const { data: heroData } = useCmsContent<any>("productHeroSolutions");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const whyChooseIconMap: Record<string, any> = {
    Settings,
    TrendingUp,
    ShieldCheck,
    Cpu: CpuIcon,
  };

  const dynamicServicesAsCards = (services || []).slice(0, 3).map((s: any) => ({
    id: s.id || s.slug,
    title: s.title,
    description: s.shortDesc || s.description || "",
    image: s.thumbnail || s.coverImage || s.image || "",
    features: Array.isArray(s.features) ? s.features.slice(0, 3) : [],
    link: `/services/${s.slug || s.id}`
  }));

  const solutionCards = Array.isArray(heroData?.cards) && heroData.cards.length > 0
    ? heroData.cards
    : dynamicServicesAsCards;

  const whyChooseTitle = heroData?.whyChooseTitle || "Why Choose";
  const whyChooseHighlight = heroData?.whyChooseHighlight || "Brain Bari?";
  const whyChooseFeatures = Array.isArray(heroData?.whyChooseFeatures) ? heroData.whyChooseFeatures : [];

  const scrollToSolutions = () => {
    const el = document.getElementById("ai-products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-[#fcfbfe] dark:bg-[#090d16] flex flex-col transition-colors">
      {/* Breadcrumb Bar */}
      <div className="bg-[#ebe8fd] dark:bg-[#0f172a] py-5 border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between text-[13px] text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black dark:hover:text-white font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-semibold">Product</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Proprietary AI Ecosystem
          </span>
        </div>
      </div>

      {/* SECTION 1: AI-Powered Solutions Hero */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#ebe8fd] via-white to-white dark:from-[#0f172a] dark:via-[#090d16] dark:to-[#090d16] transition-colors">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[10%] w-[35%] h-[50%] bg-blue-100 dark:bg-blue-950/20 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-pink-100 dark:bg-pink-950/20 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#121927] border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-slate-300 text-[13px] font-semibold mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <span className="text-blue-600 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              AI-Powered Solutions
            </div>
            
            <h1 className="text-[34px] sm:text-[42px] md:text-[52px] font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 leading-[1.1]">
              Intelligent Solutions for <br />
              <span className="text-blue-600 dark:text-blue-400">Smarter Businesses</span>
            </h1>
            
            <p className="text-[15px] text-gray-500 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed mb-6">
              Automate, analyze and accelerate with AI-powered tools <br className="hidden md:block" /> built for the future.
            </p>

            <button
              onClick={scrollToSolutions}
              className="bg-[#4b51f0] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#3f45d1] transition-colors shadow-[0_6px_20px_rgba(75,81,240,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Our Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {solutionCards.map((card: any, idx: number) => (
              <div
                key={card.id || card.title || idx}
                className="bg-white dark:bg-[#121927] rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-4">
                  <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-[#f4f7fe] dark:bg-[#0b0f19]">
                    <img
                      src={card.image || ""}
                      alt={card.title || "Solution"}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="px-8 pb-8 pt-4 flex flex-col flex-grow text-center">
                  <h3 className="text-[20px] font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-[14px] text-gray-500 dark:text-slate-400 mb-4 leading-relaxed flex-grow">
                    {card.description}
                  </p>
                  <div className="space-y-3 mb-6 text-left max-w-fit mx-auto">
                    {(card.features || []).map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-[13.5px] font-medium text-gray-700 dark:text-slate-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={card.link || "/services"}
                    className="text-[#4b51f0] dark:text-blue-400 text-[14.5px] font-semibold hover:text-[#3f45d1] dark:hover:text-blue-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR AI PRODUCTS (Powerful Platforms for Real-World Impact) */}
      <section id="ai-products-section" className="py-20 px-6 bg-white dark:bg-[#0b0f19] relative transition-colors">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-blue-600 dark:text-blue-400 font-bold text-[13px] tracking-[0.15em] uppercase mb-4">
              OUR AI PRODUCTS
            </h4>
            <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 dark:text-white tracking-tight mb-5">
              Powerful Platforms for <span className="text-blue-600 dark:text-blue-400">Real-World Impact</span>
            </h2>
            <p className="text-[15px] text-gray-500 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed">
              Explore our AI-powered platforms designed to solve real problems <br className="hidden md:block" /> in healthcare, law, education and public decision making.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((prod: any) => {
                // Use product's own logo data, with category-based fallback color
                const logo = prod?.logo
                  ? {
                      icon: prod?.logo.icon || "bot",
                      color: prod?.logo.color || getCategoryColor(prod?.category),
                      badge: prod?.title ? String(prod.title).split(" ")[0] : "Brain Bari",
                      subtitle: prod?.subtitle || prod?.tagline || "AI Platform"
                    }
                  : {
                      icon: "bot",
                      color: getCategoryColor(prod?.category),
                      badge: prod?.title ? String(prod.title).split(" ")[0] : "Brain Bari",
                      subtitle: prod?.tagline || prod?.category || "AI Platform"
                    };
                return (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-[#121927] rounded-[24px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-slate-800 p-3 pb-6 flex flex-col items-center text-center hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Top glow line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/30 to-transparent opacity-80 pointer-events-none" />

                    {/* Badge/Logo Pill Container */}
                    <div className="mb-8 flex items-center justify-center z-10 transition-transform group-hover:scale-105 duration-300 w-full h-[72px]">
                      <div className="flex items-center justify-center gap-3 w-[190px] h-[64px] bg-white dark:bg-[#0b0f19] border border-gray-100/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl px-3">
                        {/* Circle Icon */}
                        <div className={`w-10 h-10 rounded-full ${logo.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                          {renderLogoIcon(logo.icon, "w-5 h-5")}
                        </div>

                        {/* Text in Badge */}
                        <div className="flex flex-col items-start text-left leading-tight">
                          <span className="text-gray-900 dark:text-white font-extrabold text-[14px] leading-[1.15] tracking-tight">
                            {logo.badge}
                          </span>
                          <span className="text-gray-400 dark:text-slate-400 text-[9px] mt-0.5 font-medium leading-[1.2]">
                            {logo.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="flex-grow flex flex-col justify-start w-full z-10 mt-2 px-2">
                      <h3 className="font-extrabold text-[17px] text-[#1f2937] dark:text-white mb-2 leading-snug">
                        {prod.title}
                      </h3>
                      <p className="text-[13px] text-[#8c96a3] dark:text-slate-400 mb-4 leading-relaxed font-medium">
                        {prod.tagline || prod.description}
                      </p>
                    </div>

                    {/* View Product CTA */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className="bg-white dark:bg-[#0b0f19] text-[#4b51f0] dark:text-blue-400 border border-[#4b51f0]/30 dark:border-blue-500/40 px-6 py-2.5 rounded-full text-[14px] font-bold w-[160px] text-center hover:bg-[#4b51f0] hover:text-white hover:border-[#4b51f0] dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-all duration-300 mt-auto z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(75,81,240,0.3)] cursor-pointer"
                    >
                      View Product
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#121927] rounded-[24px] border border-gray-100 dark:border-slate-800 p-8 max-w-[600px] mx-auto">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products available currently</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">New SaaS products and AI platforms will be listed here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Why Choose Brain Bari? */}
      {whyChooseFeatures.length > 0 && (
        <section className="py-20 px-6 bg-white dark:bg-[#090d16] border-t border-gray-100 dark:border-slate-800 transition-colors">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col mb-16 items-center text-center">
              <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 dark:text-white tracking-tight">
                {whyChooseTitle} <span className="text-blue-600 dark:text-blue-400">{whyChooseHighlight}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseFeatures.map((feat: any, fIdx: number) => {
                const IconComp = whyChooseIconMap[feat.icon] || Settings;
                return (
                  <div
                    key={fIdx}
                    className="flex flex-col gap-4 items-center text-center bg-white dark:bg-[#121927] p-8 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_6px_20px_rgba(37,99,235,0.35)] mb-2">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                      <p className="text-[14px] text-gray-500 dark:text-slate-400 leading-relaxed px-2">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Signature Conversion CTA */}
      <ConversionCTA />

      {/* Interactive Product Details Modal */}
      {selectedProduct && (() => {
        const modalLogo = selectedProduct?.logo
          ? {
              icon: selectedProduct?.logo.icon || "bot",
              color: selectedProduct?.logo.color || getCategoryColor(selectedProduct?.category),
              badge: selectedProduct?.title ? String(selectedProduct.title).split(" ")[0] : "Brain Bari",
              subtitle: selectedProduct?.subtitle || selectedProduct?.tagline || "AI Platform"
            }
          : {
              icon: "bot",
              color: getCategoryColor(selectedProduct?.category),
              badge: selectedProduct?.title ? String(selectedProduct.title).split(" ")[0] : "Brain Bari",
              subtitle: selectedProduct?.tagline || selectedProduct?.category || "AI Platform"
            };
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121927] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${modalLogo.color} text-white flex items-center justify-center shadow-md`}>
                  {renderLogoIcon(modalLogo.icon, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">{selectedProduct.title}</h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="bg-gray-50 dark:bg-[#0b0f19] rounded-2xl p-4 border border-gray-100 dark:border-slate-800 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">
                  Core Platform Capabilities:
                </h4>
                <div className="space-y-2">
                  {selectedProduct.features?.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-800 dark:text-slate-300 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/contact?product=${encodeURIComponent(selectedProduct.title)}`}
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 bg-[#4b51f0] hover:bg-[#3f45d1] text-white text-center font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20"
                >
                  Request Enterprise Access
                </Link>
                <Link
                  href="/schedule"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-3 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-bold text-sm rounded-xl transition-colors"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
