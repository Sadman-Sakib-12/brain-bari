"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import ShinyText from "@/components/reactbits/ShinyText";

import WishQuoteModal from "@/components/WishQuoteModal";

// Default pill colors matching the design
const defaultPillColors: Record<string, string> = {
  "AI Solutions": "#9333ea",      // Purple
  "Custom Software": "#3b82f6",  // Blue
  "SaaS Development": "#ec4899", // Pink
};

const fallbackColors = ["#9333ea", "#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];

// Animated Typing Dots for the AI conversation bubbles
function TypingDots({
  dotColor = "bg-gray-700",
  delayOffset = 0
}: {
  dotColor?: string;
  delayOffset?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 px-0.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
          animate={{
            y: [0, -3, 0],
            opacity: [0.35, 1, 0.35],
            scale: [0.85, 1.15, 0.85]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delayOffset + i * 0.35,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const { data: liveSettings, isLoading } = useSiteSettings();
  const rawHeroData = (liveSettings as any)?.hero || null;
  const heroData = rawHeroData || {
    headline: "Powering Ideas\nwith",
    headlineGradient: "AI & Software",
    subheadline: "Crafting intelligent conversational agents, custom software, and scalable SaaS platforms for businesses worldwide.",
    speechBubble1: "Hi! How can I help you?",
    speechBubble2: "Hi Skilabot! I need your help.",
    filterPills: ["AI Solutions", "Custom Software", "SaaS Development"],
    robotImage: "/images/hero_robot.jpg",
    ctaText: "Start Your Project",
    searchPlaceholder: "What do you want to build?",
    badge: "✨ Next-Gen AI Automation Platform",
  };

  const rawHeadline = heroData?.headline || "";
  const headline = rawHeadline;

  // Gradient headline
  const headlineGradient = heroData?.headlineGradient || "";

  const searchPlaceholder = heroData?.searchPlaceholder || "";
  const ctaText = heroData?.ctaText || "";
  const robotImage = heroData?.robotImage || "";
  const speechBubble1 = heroData?.speechBubble1 || "";
  const speechBubble2 = heroData?.speechBubble2 || "";
  const heroBadge = heroData?.badge || heroData?.topBadge || "✨ Next-Gen AI Automation Platform";

  const rawPills: string[] = Array.isArray(heroData?.filterPills) && heroData.filterPills.length > 0
    ? heroData.filterPills
    : ["AI Solutions", "Custom Software", "SaaS Development"];


  // Seamless marquee repeating sequence
  const displayPills = React.useMemo(() => {
      if (rawPills.length === 0) return [];
      let base = [...rawPills];
      while (base.length < 12) {
        base = [...base, ...rawPills];
      }
      // Duplicate 2x for seamless -50% infinite translateX marquee
      return [...base, ...base];
    }, [rawPills]);

  const [searchQuery, setSearchQuery] = useState("");
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState("");

  if (isLoading && !rawHeroData) {
    return (
      <section className="relative w-full bg-[#ebe8fd] dark:bg-[#0f1523] pt-36 pb-16 md:pt-36 md:pb-24 overflow-hidden transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedWish(searchQuery.trim() || "AI Solutions");
    setWishModalOpen(true);
  };

  const handlePillClick = (pill: string) => {
    setSearchQuery(pill);
    setSelectedWish(pill);
    setWishModalOpen(true);
  };

  return (
    <section className="relative w-full bg-[#ebe8fd] dark:bg-[#0f1523] pt-36 pb-16 md:pt-36 md:pb-24 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* LEFT COLUMN: Main Typography & Search Bar (Static - text animation removed per request) */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start text-left z-10">
            {/* Top Badge using shadcn Badge + React Bits ShinyText */}
            <Badge variant="brand" className="mb-4 px-3.5 py-1 text-xs gap-1.5 shadow-xs border-[#c8c2eb] bg-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShinyText text={heroBadge} speed={3} className="font-semibold" />
            </Badge>

            {/* Headline H1 with Exact Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black tracking-tight text-[#111111] dark:text-white leading-[1.12] mb-8">
              <span className="whitespace-pre-line">{headline}</span>
              <br />
              <span
                className="whitespace-pre-line bg-clip-text text-transparent inline-block"
                style={{
                  backgroundImage: "linear-gradient(90deg, #ff715b 0%, #d85ee8 48%, #7b5ef5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {headlineGradient}
              </span>
            </h1>

            {/* Pill Search & Action Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-full p-2 pl-6 pr-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-purple-200/70 dark:border-white/10 flex items-center justify-between mb-6 gap-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none pr-2"
              />

              <button
                type="submit"
                className="px-6 sm:px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-full transition-all duration-200 shadow-md shadow-blue-500/25 cursor-pointer whitespace-nowrap shrink-0"
              >
                {ctaText}
              </button>
            </form>

            {/* Category Filter Pills Infinite Marquee Slider */}
            <div className="relative w-full max-w-[500px] overflow-hidden select-none py-1.5">
              {/* Left & Right gradient fade masks for smooth entrance/exit */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#ebe8fd] dark:from-[#0f1523] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#ebe8fd] dark:from-[#0f1523] to-transparent z-10 pointer-events-none" />

              {/* Marquee Track */}
              <div className="animate-marquee-smooth flex items-center gap-2.5 sm:gap-3 py-1">
                {displayPills.map((pill, idx) => {
                  const dotColor = defaultPillColors[pill] || fallbackColors[idx % fallbackColors.length];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className="group bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full border border-purple-100/90 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 flex items-center cursor-pointer shrink-0 whitespace-nowrap transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-2 shrink-0 transition-transform duration-200 group-hover:scale-125"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span>{pill}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Robot Showcase with Layered Floating Chat Bubbles */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Relative Frame containing Robot Card and 3D Overlaid Floating Bubbles */}
            <div className="relative w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px] flex justify-center animate-vokals-bob">

              {/* Subtle ambient glow behind the card */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-pink-500/25 rounded-[34px] blur-2xl -z-10 pointer-events-none animate-glow-pulse" />

              {/* Robot Card Container with Head Padding and Background Blend */}
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl w-full h-[520px] sm:h-[600px] md:h-[640px] lg:h-[670px] bg-[#190f2d] border border-white/20 pt-8 sm:pt-12 flex flex-col justify-end">
                {/* Subtle top dark vignette gradient to blend the head padding seamlessly */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#190f2d] via-[#190f2d]/80 to-transparent pointer-events-none z-10" />

                <div className="relative w-full h-full overflow-hidden flex items-end justify-center">
                  <img
                    src={robotImage}
                    alt="BrainBari AI Robot Assistant"
                    className="w-full h-full object-cover object-top select-none"
                  />
                </div>
              </div>

              {/* BUBBLE 1: Top Bot Message (Text has NO separate floating/jitter animation) */}
              {speechBubble1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="absolute top-[14%] sm:top-[15%] -left-3 sm:-left-16 z-20"
                >
                  <div className="bg-white text-gray-900 text-xs sm:text-[13px] font-medium px-4 py-2.5 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-gray-100/80 flex items-center whitespace-nowrap relative select-none">
                    <span>{speechBubble1}</span>
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-white" />
                  </div>
                </motion.div>
              )}

              {/* BUBBLE 2: Three dots small pill (Floating animation intact) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
                className="absolute top-[26%] sm:top-[27%] left-3 sm:-left-3 z-20"
              >
                <div className="animate-vokals-float-3">
                  <div className="bg-white px-3.5 py-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center">
                    <TypingDots dotColor="bg-gray-700" delayOffset={0} />
                  </div>
                </div>
              </motion.div>

              {/* BUBBLE 3: Purple User Message (Text has NO separate floating/jitter animation) */}
              {speechBubble2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
                  className="absolute top-[38%] sm:top-[39%] -left-8 sm:-left-24 z-20"
                >
                  <div className="bg-[#9d62db] text-white text-xs sm:text-[13px] font-medium px-4 py-2.5 rounded-2xl shadow-[0_14px_32px_rgba(157,98,219,0.38)] flex items-center whitespace-nowrap relative select-none">
                    <span>{speechBubble2}</span>
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-[#9d62db]" />
                  </div>
                </motion.div>
              )}

              {/* BUBBLE 4: Silver/Gray dots card (Floating animation intact) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
                className="absolute top-[51%] sm:top-[52%] left-5 sm:left-2 z-20"
              >
                <div className="animate-vokals-float-1">
                  <div className="bg-gradient-to-b from-[#f3f4f6] to-[#e2e8f0] px-4 py-2.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-white/80 flex items-center">
                    <TypingDots dotColor="bg-gray-800" delayOffset={0.3} />
                  </div>
                </div>
              </motion.div>

              {/* BUBBLE 5: Bottom small white dots pill (Floating animation intact) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.75 }}
                className="absolute top-[62%] sm:top-[63%] -left-4 sm:-left-12 z-20"
              >
                <div className="animate-vokals-float-3">
                  <div className="bg-white px-3.5 py-2 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center">
                    <TypingDots dotColor="bg-gray-700" delayOffset={0.6} />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* Wish Quote Modal from user screenshot */}
      <WishQuoteModal
        isOpen={wishModalOpen}
        onClose={() => setWishModalOpen(false)}
        wish={selectedWish}
      />
    </section>
  );
}