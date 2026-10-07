"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Check, ArrowRight } from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";
import { DynamicServiceItem } from "./navbarHelpers";

interface ServicesMegaMenuProps {
  servicesRef: React.RefObject<HTMLDivElement | null>;
  services: DynamicServiceItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function ServicesMegaMenu({
  servicesRef,
  services,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: ServicesMegaMenuProps) {
  const { data: spotlight } = useCmsContent<any>("navbarSpotlight");
  const spotlightTitle = spotlight?.title || "";
  const spotlightDesc = spotlight?.description || "";
  const spotlightFeatures: string[] = Array.isArray(spotlight?.features) ? spotlight.features : [];
  const spotlightLinkText = spotlight?.linkText || "Explore Custom Software";
  const spotlightLinkUrl = spotlight?.linkUrl || "/services";

  return (
    <div
      ref={servicesRef}
      className="absolute top-full left-1/2 -translate-x-[48%] w-[960px] max-w-[calc(100vw-32px)] z-[999] pt-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-[#f4f2ff] dark:bg-[#121626] rounded-[28px] shadow-[0_24px_60px_-12px_rgba(112,68,220,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 border border-purple-200/70 dark:border-white/10 text-left">
        {/* Top Header Section */}
        <div className="mb-4 pb-3 border-b border-purple-200/50 dark:border-white/10">
          <h3 className="text-[19px] font-extrabold text-slate-950 dark:text-white tracking-tight">
            Our Services
          </h3>
          <div className="w-10 h-[3px] bg-[#9a3412] dark:bg-[#f97316] rounded-full mt-1.5"></div>
        </div>

        {/* Mega Menu Body */}
        <div className="flex gap-5 items-stretch">
          {/* Left 2-Column Services Grid */}
          <div className="flex-1 grid grid-cols-2 gap-x-2.5 gap-y-1.5">
            {services.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No services available.
              </div>
            ) : (
              services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Link
                    key={service.id || index}
                    href={service.href}
                    onClick={onClose}
                    className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-all group/item cursor-pointer border border-transparent hover:border-purple-100/80 dark:hover:border-white/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs group-hover/item:scale-105 group-hover/item:border-purple-300 group-hover/item:text-[#8b4ec9] transition-all">
                      <IconComponent className="w-4.5 h-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-slate-950 dark:text-white group-hover/item:text-[#8b4ec9] dark:group-hover/item:text-[#c084fc] transition-colors leading-tight mb-0.5">
                        {service.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-snug line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Right Spotlight Card */}
          <div className="w-[305px] shrink-0 bg-white dark:bg-[#1a233a] rounded-[22px] p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6036] via-[#f43f5e] to-[#ec4899] text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-950 dark:text-white leading-tight">
                    {spotlightTitle}
                  </h4>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                {spotlightDesc}
              </p>
              <div className="mt-3.5 space-y-2">
                {spotlightFeatures.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 stroke-[3]" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
              <Link
                href={spotlightLinkUrl}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#9a3412] hover:text-[#7c2d12] dark:text-orange-400 dark:hover:text-orange-300 transition-colors group/link"
              >
                <span>{spotlightLinkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
