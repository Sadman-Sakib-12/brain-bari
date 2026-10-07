"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";

export default function TermsAndConditionsPage() {
  const { data: rawSettings } = useSiteSettings();
  const settings: any = rawSettings || {};
  const privacyData = settings?.privacy || {};

  const siteName = settings?.siteName || "Brain Bari";
  const contactEmail = privacyData?.termsContactEmail || settings?.email || "legal@brainbari.com";
  const lastUpdated = privacyData?.lastUpdated || "October 2026";

  // Dynamic Header Texts from Backend
  const heroBadge = privacyData?.termsBadge || "Master Services Agreement & Client Terms";
  const pageTitle = privacyData?.termsTitle || "Terms & Conditions";
  const pageSubtitle =
    privacyData?.termsSubtitle ||
    `These Master Services Terms govern the design, engineering, and artificial intelligence development engagements provided by ${siteName}.`;
  const ipBadge = privacyData?.termsIpBadge || "100% Client IP Ownership";

  // Dynamic Sidebar & Navigation Texts from Backend
  const tocTitle = privacyData?.termsTocTitle || "Table of Contents";
  const crossNote = privacyData?.termsCrossNote || "Need enterprise confidentiality details?";
  const crossText = privacyData?.termsCrossText || "Read Privacy Policy & NDA";

  // Dynamic Contact Box Texts from Backend
  const contactHeading = privacyData?.termsContactHeading || "Legal & Contracting Inquiries";
  const contactDescription =
    privacyData?.termsContactDescription ||
    "For enterprise custom MSAs, purchase order routing, or billing compliance questions, contact our contracting team:";
  const contactButtonText = privacyData?.termsContactButton || "Contact Contracting Team";

  // Dynamic Clauses from Backend Database
  const sections = Array.isArray(privacyData?.termsSections) && privacyData.termsSections.length > 0
    ? privacyData.termsSections
    : [];

  const [activeSection, setActiveSection] = useState(sections[0]?.id || "acceptance");

  useEffect(() => {
    if (sections.length > 0 && !sections.find((s: any) => s.id === activeSection)) {
      setActiveSection(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white dark:bg-[#070b14] text-slate-800 dark:text-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Document Header (Clean, Formal, Professional) */}
        <header className="pb-8 border-b border-slate-200 dark:border-slate-800/80 mb-12">
          {/* Breadcrumb / Top category */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {pageTitle}
            </span>
          </div>

          {heroBadge && (
            <div className="inline-block text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2.5">
              {heroBadge}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {pageTitle}
          </h1>

          {pageSubtitle && (
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-normal">
              {pageSubtitle}
            </p>
          )}

          {/* Legal Document Metadata Row */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            {lastUpdated && (
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Effective Date:</span> {lastUpdated}
              </div>
            )}
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Organization:</span> {siteName}
            </div>
            {ipBadge && (
              <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{ipBadge}</span>
              </div>
            )}
            <div className="ml-auto">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                <span>Privacy Policy &amp; NDA</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Document Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Table of Contents Rail */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>{tocTitle}</span>
              </div>

              <nav className="space-y-1">
                {sections.map((sec: any) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
                        setActiveSection(sec.id);
                      }}
                      className={`block py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 border-l-2 border-indigo-600"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {sec.title}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 space-y-1.5">
                <div>{crossNote}</div>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>{crossText}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Document Body (Continuous Legal Text, NOT Cards) */}
          <main className="lg:col-span-8 space-y-12">
            {sections.map((sec: any, idx: number) => {
              const isIpOwnership = sec.id === "ip-ownership";
              const paragraphs = String(sec.content || "").split("\n\n");

              return (
                <section
                  key={sec.id || idx}
                  id={sec.id}
                  className="scroll-mt-28 space-y-4"
                >
                  {/* Clean Section Heading */}
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    {sec.title}
                  </h2>

                  {/* Clean Legal IP Ownership Blockquote (if IP Ownership section) */}
                  {isIpOwnership && privacyData?.termsText && (
                    <div className="my-4 border-l-3 border-emerald-600 dark:border-emerald-400 pl-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                      {privacyData.termsText}
                    </div>
                  )}

                  {/* Paragraphs and Bullet points */}
                  <div className="space-y-4">
                    {paragraphs.map((para, pIdx) => {
                      if (para.startsWith("•") || para.includes("\n•")) {
                        const bullets = para.split("\n").filter(Boolean);
                        return (
                          <ul
                            key={pIdx}
                            className="list-disc pl-5 space-y-2 text-[15px] text-slate-700 dark:text-slate-300 leading-[1.75]"
                          >
                            {bullets.map((b, bIdx) => (
                              <li key={bIdx} className="pl-1">
                                {b.replace(/^•\s*/, "")}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p
                          key={pIdx}
                          className="text-[15px] sm:text-[16px] text-slate-700 dark:text-slate-300 leading-[1.8] font-normal"
                        >
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Formal Document Sign-off / Contact Block */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {contactHeading}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {contactDescription}
              </p>
              <div className="pt-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{contactButtonText} ({contactEmail})</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
