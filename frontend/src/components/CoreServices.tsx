"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useServices, useSiteSettings } from "@/hooks/useApi";

export default function CoreServices() {
  const { data: liveServices } = useServices();
  const { data: siteSettings } = useSiteSettings();
  const learnMoreLabel = (siteSettings as any)?.coreServices?.learnMoreText || "Learn More";
  const orderLabel = (siteSettings as any)?.coreServices?.orderText || "Order";

  const dataSource = liveServices || [];

  // Display Core Services directly from database
  const serviceCards = (dataSource || []).slice(0, 8).map((srv: any, idx: number) => {
    const resolvedLink =
      srv.link ||
      (srv.slug === "services"
        ? "/services"
        : `/services/${srv.slug || srv.category || "ai-chatbot"}`);

    const formattedPrice = typeof srv.price === "number"
      ? `Start ${srv.price}$`
      : (srv.price || (srv.startingPrice ? `Start ${srv.startingPrice}$` : ""));

    return {
      id: srv.id || `srv-${idx + 1}`,
      title: srv.title,
      price: formattedPrice,
      badge: srv.badge,
      image: srv.image || "",
      fallbackImage: srv.image || "",
      link: resolvedLink,
      slug: srv.slug || "ai-chatbot",
    };
  });

  return (
    <section className="py-12 md:py-16 bg-[#fcfbfe] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {serviceCards.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-sans">
            No services currently available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {serviceCards.map((srv, idx) => (
            <motion.div
              key={srv.id || `${srv.slug}-${idx}`}
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="service-card-item group relative h-[210px] sm:h-[300px] md:h-[380px] rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-2xl border border-gray-200/50 bg-slate-900"
            >
              <img
                src={srv.image}
                alt={srv.title}
                onError={(e) => {
                  // Fallback to local image if remote image fails
                  const target = e.currentTarget;
                  if (target.src !== srv.fallbackImage) {
                    target.src = srv.fallbackImage;
                  }
                }}
                className="object-cover absolute h-full w-full left-0 top-0 right-0 bottom-0 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

              {srv.badge && (
                <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] sm:text-[11px] font-bold text-white border border-white/30 tracking-wider z-10">
                  {srv.badge}
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent z-10">
                <h3 className="text-white text-[12px] sm:text-lg md:text-[20px] font-bold font-sans leading-tight">
                  {srv.title}
                </h3>
                <p className="text-amber-300 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 font-semibold">
                  {srv.price}
                </p>
                <div className="flex gap-1.5 sm:gap-3 mt-2 sm:mt-4">
                  <Link
                    href={srv.link}
                    className="flex-1 text-center py-1 sm:py-2.5 rounded-lg border border-white/30 text-white text-[9px] sm:text-[11px] font-black hover:bg-white/10 transition-colors uppercase tracking-wider"
                  >
                    {learnMoreLabel}
                  </Link>
                  <Link
                    href={`/order?service=${encodeURIComponent(srv.title)}`}
                    className="flex-1 text-center py-1 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white text-[9px] sm:text-[11px] font-black hover:scale-102 transition-all duration-300 uppercase tracking-wider shadow-sm shadow-purple-500/10"
                  >
                    {orderLabel}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

