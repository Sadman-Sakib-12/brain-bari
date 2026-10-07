"use client";

import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";

export default function ClientReviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: reviewsCms } = useCmsContent<any>("reviewsSettings");
  const { data: reviewsData = [] } = useCmsContent<any[]>("reviews");

  const badgeText = reviewsCms?.badge || "⭐ Client Testimonials";
  const titleText = reviewsCms?.title || "What Our Clients";
  const titleHighlight = reviewsCms?.titleHighlight || "Say About Us";
  const descText =
    reviewsCms?.description ||
    "Discover how our conversational AI chatbots, enterprise SaaS products, and custom software drive measurable ROI for companies worldwide.";
  const ratingText = reviewsCms?.ratingText || "4.9 / 5.0 (120+ reviews)";

  const reviews = Array.isArray(reviewsData) ? reviewsData : [];

  if (reviews.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#fcfbfe] dark:bg-[#090d16] relative overflow-hidden transition-colors duration-300">
      {/* Decorative gradient blur background */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/90 dark:bg-slate-800/90 border border-purple-200/80 dark:border-slate-700 rounded-full text-xs font-bold text-purple-900 dark:text-purple-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {badgeText}
            </div>
            
            <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight font-sans">
              {titleText}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {titleHighlight}
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-[14.5px] sm:text-[15.5px] leading-relaxed">
              {descText}
            </p>
          </div>

          {/* Rating Summary & Slider Controls */}
          <div className="flex items-center gap-4 self-start md:self-end shrink-0">
            <div className="hidden sm:flex flex-col items-end pr-3 border-r border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                {ratingText}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Previous review"
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Next review"
                className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel / Reviews Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 scroll-smooth snap-x snap-mandatory"
        >
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="w-[320px] sm:w-[380px] shrink-0 snap-start bg-white dark:bg-[#121927] rounded-2xl p-7 border border-gray-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(Math.min(Math.max(Math.floor(review.rating || 5), 1), 5))].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-purple-300/60 dark:text-slate-600" />
                </div>

                {/* Service Tag */}
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold mb-3 border border-blue-100 dark:border-blue-900/50">
                  {review.service}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 text-[14px] sm:text-[14.5px] leading-relaxed italic mb-6">
                  &ldquo;{review.comment || review.review}&rdquo;
                </p>
              </div>

              {/* Client Profile Info */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  {review.avatar && (
                    <img
                      src={review.avatar}
                      alt={review.clientName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20 dark:ring-blue-400/20 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-[14.5px] font-bold text-gray-950 dark:text-white truncate flex items-center gap-1">
                      {review.clientName}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                      {review.role || review.company || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
