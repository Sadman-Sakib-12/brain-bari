"use client";

import React from "react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useApi";

export default function ConversionCTA() {
  const { data: siteSettings } = useSiteSettings();
  const cta = (siteSettings as any)?.conversionCta || (siteSettings as any)?.ctaBanner || {};

  if (!cta.heading) return null;

  return (
    <section className="py-20 bg-[#ebe8fd] dark:bg-[#0f1523] text-center border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="text-[34px] font-bold font-sans text-gray-900 dark:text-white mb-4 tracking-tight">
          {cta.heading}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
          {cta.description || cta.subheadline}
        </p>
        <Link 
          className="inline-block px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-[14px] transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35"
          href={cta.buttonLink || "/schedule"}
        >
          {cta.buttonText || "Schedule A Consultation"}
        </Link>
      </div>
    </section>
  );
}
