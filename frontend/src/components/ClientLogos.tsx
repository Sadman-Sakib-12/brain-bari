"use client";

import React from "react";
import { useCmsContent } from "@/hooks/useApi";

export default function ClientLogos({ className = "" }: { className?: string }) {
  const { data: rawLogos, isLoading } = useCmsContent<Array<{ name: string; src: string }>>("clientLogos");
  const logos = Array.isArray(rawLogos) ? rawLogos : [];

  if (isLoading || logos.length === 0) {
    return null;
  }

  // Duplicate array for seamless infinite marquee loop
  const displayLogos = [...logos, ...logos];

  return (
    <section className={`py-10 md:py-14 bg-white dark:bg-[#090d16] overflow-hidden border-b border-gray-100 dark:border-white/10 transition-colors duration-300 ${className}`}>
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="relative w-full overflow-hidden flex rounded-xl">
          {/* Gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-36 bg-gradient-to-r from-white dark:from-[#090d16] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-36 bg-gradient-to-l from-white dark:from-[#090d16] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="animate-scroll flex items-center gap-12 md:gap-20 py-2">
            {displayLogos.map((logo, idx) => (
              <div
                key={idx}
                className="relative w-32 h-14 md:w-44 md:h-18 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0 flex items-center justify-center cursor-pointer select-none"
                title={logo.name}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
