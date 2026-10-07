"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Handshake,
  Sparkles,
  TrendingUp,
  Cpu,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users2,
  Layers,
  Award
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ConversionCTA from "@/components/ConversionCTA";
import { useCmsContent } from "@/hooks/useApi";

export default function PartnersPage() {
  const { data: rawPartners = [] } = useCmsContent<any[]>("partners");
  const { data: pageCms } = useCmsContent<any>("partnersPage");
  const partnersData = Array.isArray(rawPartners) ? rawPartners : [];

  const [partnerEmail, setPartnerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [partnershipType, setPartnershipType] = useState("Agency & Reseller Partner");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamic Content from CMS / Admin
  const heroBadge = pageCms?.hero?.badge || "Strategic Partner Network";
  const heroTitle = pageCms?.hero?.title || "Co-Create the Future with";
  const heroHighlight = pageCms?.hero?.titleHighlight || "Brain Bari AI Ecosystem";
  const heroDesc = pageCms?.hero?.description || 
    "Join forces with Brain Bari to deliver groundbreaking conversational AI, automated enterprise workflows, and high-performance bespoke software to organizations worldwide.";

  const valueCards = Array.isArray(pageCms?.valueCards) ? pageCms.valueCards : [];

  const showcaseBadge = pageCms?.showcase?.badge || "Active Ecosystem Network";
  const showcaseTitle = pageCms?.showcase?.title || "Our Strategic Partners & Collaborators";
  const showcaseSubtitle = pageCms?.showcase?.subtitle || 
    "Leading universities, technology labs, and enterprise agency networks co-innovating with Brain Bari.";

  const registrationBadge = pageCms?.registration?.badge || "Join Our Partner Network";
  const registrationTitle = pageCms?.registration?.title || "Accelerate Your Growth With Brain Bari AI";
  const registrationDesc = pageCms?.registration?.description || 
    "Whether you are an enterprise agency, an independent software vendor, or a technology consulting firm, our partnership tracks offer competitive revenue shares, dedicated technical enablement, and co-marketing campaigns.";
  const registrationBenefits: string[] = Array.isArray(pageCms?.registration?.benefits) 
    ? pageCms.registration.benefits 
    : [];
  const formTitle = pageCms?.registration?.formTitle || "Register for Partner Access";
  const formSubtitle = pageCms?.registration?.formSubtitle || 
    "Submit your details and our Partner Ecosystem team will connect within 24 hours.";


  const partnerIconMap: Record<string, any> = {
    TrendingUp,
    Cpu,
    Rocket,
    Handshake,
    ShieldCheck,
    Sparkles,
    Layers,
    Award,
  };

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    partnersData.forEach((p: any) => {
      if (p.type && p.type.trim()) set.add(p.type.trim());
    });
    const list = Array.from(set);
    return list.length > 0 ? ["All", ...list] : ["All", "Academic & Research", "Healthcare Consortium", "Technology & API Integration", "Agency & Reseller Partner"];
  }, [partnersData]);

  const filteredPartners = selectedCategory === "All"
    ? partnersData
    : partnersData.filter((p: any) =>
      (p.type || "").toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes((p.type || "").toLowerCase())
    );

  const getPartnerTheme = (idx: number) => {
    const themes = [
      {
        gradient: "from-blue-600 via-indigo-600 to-purple-600",
        shadow: "shadow-indigo-500/20",
        pill: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
        icon: Building2,
      },
      {
        gradient: "from-emerald-500 via-teal-600 to-cyan-700",
        shadow: "shadow-teal-500/20",
        pill: "bg-teal-50 text-teal-700 border-teal-200/60",
        icon: ShieldCheck,
      },
      {
        gradient: "from-violet-600 via-purple-600 to-pink-600",
        shadow: "shadow-purple-500/20",
        pill: "bg-purple-50 text-purple-700 border-purple-200/60",
        icon: Layers,
      },
      {
        gradient: "from-orange-500 via-rose-600 to-pink-600",
        shadow: "shadow-rose-500/20",
        pill: "bg-rose-50 text-rose-700 border-rose-200/60",
        icon: Users2,
      },
    ];
    return themes[idx % themes.length];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) {
      toast.error("Please enter your work email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/cms/contact", {
        name: companyName ? `${companyName} (${partnershipType})` : `Partner Applicant (${partnershipType})`,
        email: partnerEmail.trim(),
        message: `Partnership Program Interest:\nCompany Name: ${companyName || "N/A"}\nPartnership Track: ${partnershipType}`,
        selectedServices: ["Partnership Program", partnershipType],
      });
      setSubmitted(true);
      toast.success("Thank you! Your partnership interest has been registered.");
    } catch (err: any) {
      console.error("Partner application submit error:", err);
      setSubmitted(true);
      toast.success("Thank you! Your partnership interest has been registered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebe8fd] font-sans flex flex-col justify-between relative overflow-hidden pt-36 md:pt-40">
      {/* Background ambient radial blur orbs matching Brain Bari signature style */}
      <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] bg-[#b57be4]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[700px] h-[700px] bg-[#e464a4]/15 rounded-full blur-[170px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-[#ff7e5f]/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">

        {/* Sticky Breadcrumb Bar */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8">
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-full text-xs text-gray-500 shadow-2xs">
            <Link href="/" className="hover:text-black font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-600">Resources</span>
            <span className="text-gray-300">/</span>
            <span className="text-purple-900 font-bold">Partners Network</span>
          </nav>
        </div>

        {/* Hero Section (Fully Editable from Admin -> /partners?tab=hero) */}
        <section className="py-6 md:py-12 px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Top Badge */}
            {heroBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-purple-200/60 text-[#a05fd3] text-[11px] font-bold uppercase tracking-widest shadow-2xs">
                <span className="w-2 h-2 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] rounded-full animate-pulse"></span>
                <Handshake className="w-3.5 h-3.5 text-[#a05fd3]" />
                <span>{heroBadge}</span>
              </div>
            )}

            {/* Headline */}
            <h1 className="text-[34px] sm:text-[50px] md:text-[64px] font-black text-[#1a1a1a] tracking-tight leading-[1.08] max-w-3xl mx-auto">
              {heroTitle}{" "}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] via-[#e464a4] to-[#a05fd3]">
                {heroHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            {heroDesc && (
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                {heroDesc}
              </p>
            )}

            {/* Ecosystem Value Pillars (Fully Editable from Admin) */}
            {valueCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
                {valueCards.map((card: any, idx: number) => {
                  const IconComp = partnerIconMap[card.icon] || TrendingUp;
                  const cardStyles = [
                    {
                      iconBg: "bg-gradient-to-tr from-pink-500/10 to-rose-500/20 text-[#e464a4] border-rose-200/50",
                      borderHover: "hover:border-[#e464a4]/40",
                    },
                    {
                      iconBg: "bg-gradient-to-tr from-purple-500/10 to-indigo-500/20 text-[#a05fd3] border-purple-200/50",
                      borderHover: "hover:border-[#a05fd3]/40",
                    },
                    {
                      iconBg: "bg-gradient-to-tr from-amber-500/10 to-orange-500/20 text-[#ff7e5f] border-orange-200/50",
                      borderHover: "hover:border-[#ff7e5f]/40",
                    },
                  ];
                  const style = cardStyles[idx % cardStyles.length];

                  return (
                    <div
                      key={card.id || idx}
                      className={`bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(181,123,228,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group ${style.borderHover}`}
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-purple-100/30 to-pink-100/10 rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform"></div>

                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-2xs ${style.iconBg}`}>
                        <IconComp className="w-7 h-7" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-950 mb-3 tracking-tight">
                        {card.title}
                      </h3>

                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Active Partners Showcase Grid (Header & Partners Editable from Admin) */}
        <section className="py-14 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto space-y-8">

            {/* Section Header */}
            <div className="text-center space-y-3">
              {showcaseBadge && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/70 border border-purple-200/60 text-[#a05fd3] text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#ff7e5f]" />
                  <span>{showcaseBadge}</span>
                </div>
              )}
              {showcaseTitle && (
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                  {showcaseTitle}
                </h2>
              )}
              {showcaseSubtitle && (
                <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                  {showcaseSubtitle}
                </p>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="w-full flex justify-center pt-2">
              <div className="flex items-center overflow-x-auto md:overflow-x-visible md:justify-center md:flex-wrap gap-2 max-w-full px-2 py-1 select-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-2xs border whitespace-nowrap shrink-0 ${isActive
                          ? "bg-blue-600 text-white border-transparent scale-105 shadow-md shadow-blue-500/25"
                          : "bg-white/80 backdrop-blur-md text-gray-600 border-purple-100/60 hover:border-blue-500 hover:text-blue-600 hover:scale-102"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Partner Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              {filteredPartners.map((partner: any, idx: number) => {
                const theme = getPartnerTheme(idx);

                return (
                  <div
                    key={partner.id || idx}
                    className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(181,123,228,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar with Logo / Emblem Avatar & Status */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          {partner.logoUrl ? (
                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 p-2 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} text-white font-black text-base flex items-center justify-center shrink-0 shadow-md ${theme.shadow} tracking-wider`}>
                              {partner.logoInitials || partner.name?.slice(0, 2)?.toUpperCase() || "BB"}
                            </div>
                          )}

                          <div>
                            <h3 className="font-extrabold text-base sm:text-lg text-gray-950 group-hover:text-[#a05fd3] transition-colors leading-snug">
                              {partner.name}
                            </h3>
                            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border mt-1 ${theme.pill}`}>
                              {partner.type || "Strategic Partner"}
                            </span>
                          </div>
                        </div>

                        {/* Live Status Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[11px] font-bold shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{partner.status || "Active Partner"}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 pl-0.5">
                        {partner.description || "Partner collaboration in specialized AI solutions, engineering, and digital growth."}
                      </p>
                    </div>

                    {/* Footer Info & External Link */}
                    <div className="pt-3 border-t border-purple-50 flex items-center justify-between text-xs">
                      {partner.joinedDate ? (
                        <span className="text-gray-400 font-medium text-[11px]">
                          Partner since {new Date(partner.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium text-[11px]">Verified Partner</span>
                      )}

                      {partner.website && partner.website.startsWith("http") && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-[#a05fd3] transition-colors bg-white px-3 py-1 rounded-xl border border-gray-200/70 hover:border-purple-200 shadow-2xs"
                        >
                          <span>Visit Partner</span>
                          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#a05fd3]" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* High-Converting Partner Application / Interest Section (Editable from Admin) */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-[1100px] mx-auto bg-white/85 backdrop-blur-xl rounded-[32px] border border-white/90 shadow-[0_20px_50px_rgba(181,123,228,0.12)] p-8 sm:p-12 md:p-14 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* Left Column: Value Proposition (Editable from Admin) */}
              <div className="lg:col-span-6 space-y-6">
                {registrationBadge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/70 text-[#a05fd3] text-[11px] font-bold uppercase tracking-wider">
                    <Handshake className="w-3.5 h-3.5" />
                    <span>{registrationBadge}</span>
                  </div>
                )}

                {registrationTitle && (
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                    {registrationTitle}
                  </h3>
                )}

                {registrationDesc && (
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {registrationDesc}
                  </p>
                )}

                {registrationBenefits.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {registrationBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Registration Form (Title & Subtitle Editable from Admin) */}
              <div className="lg:col-span-6 bg-[#ebe8fd]/60 border border-purple-200/50 rounded-2xl p-6 sm:p-8">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-950">{formTitle}</h4>
                  <p className="text-xs text-gray-600 mt-1">{formSubtitle}</p>
                </div>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-emerald-950 text-base">You&apos;re On the Priority List!</h5>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm">
                      Thank you for your interest in Brain Bari. Our ecosystem director will reach out to schedule an introductory strategy session.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Company or Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Global Solutions"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e464a4]/30 focus:border-[#a05fd3] transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Business Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e464a4]/30 focus:border-[#a05fd3] transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Partnership Track
                      </label>
                      <select
                        value={partnershipType}
                        onChange={(e) => setPartnershipType(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e464a4]/30 focus:border-[#a05fd3] transition-all shadow-2xs"
                      >
                        <option value="Agency & Reseller Partner">Agency &amp; Reseller Partner (Wholesale AI)</option>
                        <option value="Technology & API Integration">Technology &amp; API Integration (Infrastructure)</option>
                        <option value="Enterprise Referral Consultant">Enterprise Referral Consultant (Commission)</option>
                        <option value="Academic & Research Collaboration">Academic &amp; Research Collaboration</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{isSubmitting ? "Submitting Application..." : "Join Partner Network"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
