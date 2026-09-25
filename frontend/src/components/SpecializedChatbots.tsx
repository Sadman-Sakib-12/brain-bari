"use client";

import React from "react";
import Link from "next/link";
import ClientLogos from "@/components/ClientLogos";
import chatbotsData from "@/data/specializedChatbots.json";
import siteSettings from "@/data/siteSettings.json";

export default function SpecializedChatbots() {
  const orderButtonText = (siteSettings as any)?.chatbotsConfig?.orderButtonText || "Order Now";

  const chatbots = (chatbotsData || []).slice(0, 8).map((bot: any) => ({
    title: bot.title || bot.name,
    description: bot.description || bot.shortDesc,
    price: bot.priceTag || (bot.price === 0 || bot.price === "0" ? "Free" : (typeof bot.price === "number" ? `$${bot.price}.00` : bot.price)),
    image: bot.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    slug: bot.slug || (bot.title || bot.name || "").toLowerCase().replace(/\s+/g, "-")
  }));

  return (
    <>
      {/* Client Logos Scrolling Bar */}
      <ClientLogos />

      {/* 8 White Chatbot Cards (4 on top, 4 below) matching exact user design */}
      <section className="py-12 sm:py-20 bg-white dark:bg-[#090d16] transition-colors duration-300">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {chatbots.map((bot, idx) => (
              <div
                key={bot.slug || idx}
                className="group flex flex-col h-full bg-white dark:bg-[#121927] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)] border border-gray-100/90 dark:border-white/10 overflow-hidden transform transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <img
                    src={bot.image}
                    alt={bot.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between bg-white dark:bg-[#121927]">
                  <div>
                    <h3 className="text-[17px] sm:text-[18px] font-bold font-sans text-gray-900 dark:text-white leading-snug tracking-tight mb-2 min-h-[46px] flex items-start group-hover:text-[#5c2406] dark:group-hover:text-[#f3d3b3] transition-colors">
                      {bot.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between w-full pt-4 mt-auto">
                    <div className="text-[17px] sm:text-[18px] font-bold font-sans text-gray-900 dark:text-white tracking-tight">
                      {bot.price}
                    </div>
                    <Link href={`/order?bot=${encodeURIComponent(bot.slug)}`}>
                      <button
                        type="button"
                        className="rounded-full bg-[#5c2406] hover:bg-[#431a04] active:scale-95 text-white font-semibold text-[13px] sm:text-[13.5px] px-4 py-2 shadow-sm transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{orderButtonText}</span>
                        <span className="text-[14px] leading-none">&rarr;</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
