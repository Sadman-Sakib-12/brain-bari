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
  Package
} from "lucide-react";
import industriesData from "@/data/industries.json";
import ConversionCTA from "@/components/ConversionCTA";

const iconMap: Record<string, any> = {
  HeartPulse,
  ShoppingBag,
  Landmark,
  Building,
  Scale,
  GraduationCap,
  Truck,
  Layers
};

const industryBadges = [
  // Row 1
  {
    id: "finance",
    name: "Finance & Banking",
    icon: Landmark,
    bg: "#fdf5eb",
    targetId: "fintech",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingCart,
    bg: "#eaf4fd",
    targetId: "ecommerce",
  },
  {
    id: "telecom",
    name: "Telecom",
    icon: Smartphone,
    bg: "#fdfae5",
    searchQuery: "telecom",
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Home,
    bg: "#faede8",
    targetId: "real-estate",
  },
  {
    id: "software",
    name: "Software",
    icon: Monitor,
    bg: "#f1eefa",
    targetId: "enterprise-saas",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Truck,
    bg: "#faf8e4",
    searchQuery: "automotive",
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: Heart,
    bg: "#eaf7ec",
    targetId: "healthcare",
  },
  // Row 2
  {
    id: "photo",
    name: "Photo & Video",
    icon: Camera,
    bg: "#fdf4e8",
    searchQuery: "video",
  },
  {
    id: "business",
    name: "Business",
    icon: ShoppingBag,
    bg: "#f2eff9",
    searchQuery: "business",
  },
  {
    id: "startup",
    name: "Startup",
    icon: Zap,
    bg: "#e6f8fa",
    searchQuery: "saas",
  },
  {
    id: "arvr",
    name: "AR/VR",
    icon: Infinity,
    bg: "#fdf9e3",
    searchQuery: "3d",
  },
  {
    id: "nonprofit",
    name: "Non-profit",
    icon: Users,
    bg: "#eaf4fb",
    searchQuery: "non-profit",
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: Scale,
    bg: "#faf7e4",
    targetId: "legal-civic",
  },
  {
    id: "govt",
    name: "Govt. & Public Sector",
    icon: Building2,
    bg: "#f6eff1",
    targetId: "legal-civic",
  },
  // Row 3
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: Fingerprint,
    bg: "#e6f4fc",
    searchQuery: "fitness",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    bg: "#fef8ce",
    searchQuery: "gaming",
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: Globe,
    bg: "#faeae7",
    searchQuery: "retail",
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    icon: Flame,
    bg: "#eef3f7",
    searchQuery: "energy",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: Sprout,
    bg: "#f8fae5",
    searchQuery: "agriculture",
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Package,
    bg: "#e2f7f3",
    targetId: "logistics",
  },
];

export default function IndustriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const handleBadgeClick = (badge: (typeof industryBadges)[0]) => {
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pt-20">
      
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-start sticky top-[72px] sm:top-[80px] z-30 shadow-xs"
      >
        <div className="max-w-[1240px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#8a421a] transition-colors flex items-center gap-1">
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
              Industries
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#ebe8fd] via-[#f4f2fe] to-white py-16 sm:py-24 px-6 border-b border-[#c8c2eb]/40">
        <div className="max-w-[1240px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#c8c2eb] text-[#8a421a] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Domain-Specific AI Architecture</span>
          </div>
          <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-black text-gray-950 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Engineering AI &amp; Software Across{" "}
            <span className="bg-gradient-to-r from-[#8a421a] via-[#602b0c] to-indigo-800 bg-clip-text text-transparent">
              High-Impact Industries
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            We don&apos;t build one-size-fits-all software. We architect specialized conversational chatbots, intelligent automation pipelines, and enterprise web solutions tailored directly to your industry&apos;s regulatory and customer realities.
          </p>

          {/* Quick Search & Filter Tabs */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search industries, AI solutions, or challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#8a421a] focus:ring-2 focus:ring-[#8a421a]/20 text-sm shadow-sm transition-all"
              />
            </div>
          </div>

          {/* 20 Organic Leaf/Petal Industry Badges Showcase */}
          <div className="max-w-[1180px] mx-auto mt-6 mb-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-4.5">
              {industryBadges.map((badge) => {
                const Icon = badge.icon;
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
                    className={`w-[124px] sm:w-[136px] md:w-[144px] h-[92px] sm:h-[100px] flex flex-col items-center justify-center p-2.5 transition-all duration-200 cursor-pointer select-none group border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                      isActive
                        ? "ring-2 ring-[#8a421a] shadow-md scale-105"
                        : "hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 stroke-[1.6] group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-[11px] sm:text-[12px] font-medium text-gray-800 text-center leading-tight mt-1.5 px-1 line-clamp-2">
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
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#c8c2eb] text-[#8a421a] hover:bg-[#8a421a] hover:text-white transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>✕ Clear Selection &amp; View All Industries</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Why Industry Specific AI Matters */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight mb-3">
              Why Domain Expertise Drives Superior AI ROI
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Generic LLM wrappers fail when confronted with real-world jargon, strict compliance protocols, and nuanced customer inquiries. Here is how Brain Bari designs for measurable outcomes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-950 mb-2">Deep Knowledge Base Fine-Tuning</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We ingest and structure your proprietary catalogues, documentation, and historic client interactions into private RAG vectors with zero data leakage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-100 text-xs font-semibold text-[#8a421a] flex items-center gap-1">
                <span>Tailored Embeddings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-950 mb-2">Security &amp; Regulatory Compliance</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Whether adhering to healthcare privacy or banking confidentiality, our systems incorporate strict permission guards and audit logs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-100 text-xs font-semibold text-[#8a421a] flex items-center gap-1">
                <span>Enterprise Grade Security</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-950 mb-2">Quantifiable Business Results</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every solution is engineered around core KPIs: cut response times from hours to seconds, automate up to 85% of repeat tasks, and lift conversions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-100 text-xs font-semibold text-[#8a421a] flex items-center gap-1">
                <span>Measurable Efficiency</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Industries Showcase */}
      <section className="py-16 sm:py-24 px-6 bg-[#fcfbfe]">
        <div className="max-w-[1240px] mx-auto space-y-16">
          {filteredIndustries.map((ind, index) => {
            const IconComponent = iconMap[ind.icon] || Bot;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-28 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-gray-300 transition-all"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  
                  {/* Left Info Column */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${ind.colorGradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#8a421a] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                          {ind.badge}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-1">
                          {ind.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                      {ind.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {ind.description}
                    </p>

                    {/* Challenges Solved */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Core Industry Friction We Solve</span>
                      </h4>
                      <ul className="space-y-2">
                        {ind.challenges.map((chal, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                            <div className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold">✕</span>
                            </div>
                            <span>{chal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Architecture &amp; Frameworks
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {ind.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium"
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
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#602b0c] hover:bg-[#4a2008] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <span>Consult for {ind.shortTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {ind.featuredProduct && (
                        <Link
                          href={ind.featuredProduct.link}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-all border border-gray-200"
                        >
                          <span>Explore {ind.featuredProduct.name}</span>
                          <ExternalLink className="w-3 h-3 text-gray-500" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Solutions & Metrics Column */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* ROI Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#ebe8fd]/60 border border-[#c8c2eb]">
                      {ind.keyMetrics.map((met, mIdx) => (
                        <div key={mIdx} className="text-center">
                          <div className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight">
                            {met.value}
                          </div>
                          <div className="text-[10.5px] font-medium text-gray-600 line-clamp-1 mt-0.5">
                            {met.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Solutions List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                        Engineered AI Capabilities
                      </h4>
                      {ind.solutions.map((sol, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#c8c2eb] transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <h5 className="text-sm font-bold text-gray-950">
                              {sol.title}
                            </h5>
                          </div>
                          <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                            {sol.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Featured Product Banner if applicable */}
                    {ind.featuredProduct && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                            Featured Live Product
                          </div>
                          <div className="text-sm font-bold text-gray-950">
                            {ind.featuredProduct.name} &mdash; <span className="text-gray-600 font-normal">{ind.featuredProduct.tag}</span>
                          </div>
                        </div>
                        <Link
                          href={ind.featuredProduct.link}
                          className="px-3.5 py-1.5 rounded-full bg-white text-orange-900 text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors shrink-0 shadow-xs"
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
      <section className="py-16 sm:py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight mb-3">
              Frequently Asked Questions About Industry AI
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Answers to common questions regarding deployment, integration, and security for industry-specific AI solutions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60">
              <h3 className="text-sm font-bold text-gray-950 mb-1.5">
                Can our AI chatbot connect directly to our proprietary CRM or ERP?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes. We build custom API connectors for Salesforce, HubSpot, SAP, custom SQL databases, Shopify, and local ERP systems to ensure bidirectional real-time data sync.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60">
              <h3 className="text-sm font-bold text-gray-950 mb-1.5">
                Is our confidential industry data used to train public AI models?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Never. We deploy private virtual private cloud (VPC) embeddings and enterprise agreements that legally guarantee your company data and customer chats are never used for public LLM training.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60">
              <h3 className="text-sm font-bold text-gray-950 mb-1.5">
                How long does an industry-specific deployment take?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Standard conversational AI chatbots and RAG assistants are typically deployed in 1 to 2 weeks. Custom enterprise software platforms or multi-tenant SaaS MVPs take between 6 to 8 weeks from design to production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion CTA */}
      <ConversionCTA />

    </div>
  );
}
