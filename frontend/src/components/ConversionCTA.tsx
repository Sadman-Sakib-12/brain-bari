"use client";

import React from "react";
import Link from "next/link";
import siteSettings from "@/data/siteSettings.json";

export default function ConversionCTA() {
  const cta = siteSettings.conversionCta || {
    heading: "Ready to transfer your Business",
    description: "Developing and maintaining web applications using React.js, Next.js, and other related technologies. Collaborating with cross-functional teams to engineer digital infrastructure that scales effortlessly.",
    buttonText: "Schedule A Consultation",
    buttonLink: "/schedule"
  };

  return (
    <section className="py-20 bg-[#ebe8fd] dark:bg-[#0f1523] text-center border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="text-[34px] font-bold font-sans text-gray-900 dark:text-white mb-4 tracking-tight">
          {cta.heading || "Ready to transfer your Business"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
          {cta.description}
        </p>
        <Link 
          className="inline-block px-10 py-3.5 bg-[#602b0c] hover:bg-[#4a2008] text-white rounded-[3px] font-medium text-[14px] transition-colors duration-normal shadow-sm"
          href={cta.buttonLink || "/schedule"}
        >
          {cta.buttonText || "Schedule A Consultation"}
        </Link>
      </div>
    </section>
  );
}
