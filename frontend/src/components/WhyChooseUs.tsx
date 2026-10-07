"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, MessageSquare } from "lucide-react";
import { useSiteSettings, useCmsContent } from "@/hooks/useApi";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Compass,
  MessageSquare
};

export default function WhyChooseUs() {
  const { data: siteSettings } = useSiteSettings();
  const { data: cmsPillars } = useCmsContent<any[]>("whyChooseUs");

  const config = (siteSettings as any)?.whyChooseUs || {};

  const rawItems = (config as any)?.items;
  const pillars: any[] = (Array.isArray(cmsPillars) && cmsPillars.length > 0)
    ? cmsPillars
    : (Array.isArray(rawItems) ? rawItems : []);

  const defaultIcons = [Sparkles, Compass, MessageSquare];

  if (!config.heading && pillars.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-[#602b0c] rounded-2xl overflow-hidden shadow-xl border border-[#7a3710]">
          <div className="grid grid-cols-1 md:grid-cols-4 items-stretch text-white">
            
            {/* Left Box */}
            <div className="md:col-span-1 bg-[#763a1c]/80 p-6 md:p-8 flex flex-col justify-center items-start space-y-3 m-4 rounded-xl border border-[#8a421a]/50">
              <h2 className="text-xl md:text-[22px] font-bold font-sans">
                {config.heading}
              </h2>
              <p className="text-[#f3d3b3] text-xs sm:text-sm leading-relaxed">
                {config.subheading}
              </p>
              {config.buttonText && (
                <Link
                  href={config.buttonLink || "/about"}
                  className="inline-block px-5 py-2 mt-1 bg-[#4a2008] hover:bg-[#3d1a06] rounded-md text-xs sm:text-sm font-medium transition-colors duration-normal border border-[#602b0c] cursor-pointer text-center"
                >
                  {config.buttonText}
                </Link>
              )}
            </div>

            {/* Right 3 Items */}
            <div className="md:col-span-3 grid grid-cols-3 gap-1 sm:gap-8 p-3 sm:p-10 items-stretch">
              {pillars.length === 0 ? (
                <div className="col-span-3 flex items-center justify-center text-center py-6 text-[#e2b89d]/70 text-xs sm:text-sm font-sans">
                  Pillars will appear once configured in Admin Panel.
                </div>
              ) : (
                pillars.slice(0, 3).map((item: any, idx: number) => {
                  const IconComponent = iconMap[item.icon] || defaultIcons[idx % defaultIcons.length];
                  return (
                    <div 
                      key={item.id || idx} 
                      className="flex flex-col items-center text-center bg-[#763a1c]/20 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-white/5 sm:border-none justify-between"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center text-white">
                          <IconComponent className="w-6 h-6 sm:w-12 sm:h-12" />
                        </div>
                        <h3 className="font-bold text-[10px] sm:text-[17px] leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[#e2b89d] text-[8px] sm:text-[13px] mt-1 px-0.5 sm:px-2 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
