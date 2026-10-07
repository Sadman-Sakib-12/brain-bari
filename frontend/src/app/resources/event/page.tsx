"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Share2
} from "lucide-react";
import ConversionCTA from "@/components/ConversionCTA";
import { toast } from "sonner";
import { useCmsContent } from "@/hooks/useApi";

export default function EventPage() {
  const [filter, setFilter] = useState("all");
  const { data: rawEvents = [] } = useCmsContent<any[]>("events");
  const { data: pageCms } = useCmsContent<any>("eventsPage");
  const eventsList = Array.isArray(rawEvents) ? rawEvents : [];

  const heroTitle = pageCms?.hero?.title || "Grow Your Network & Skills";
  const heroHighlight = pageCms?.hero?.titleHighlight || "with Our Events";
  const heroDesc = pageCms?.hero?.description || "Discover community gatherings, hackathons, executive roadmaps, and industry symposiums organized by Brain Bari.";

  const filteredEvents = eventsList.filter((e) => {
    if (filter === "all") return true;
    return e.category === filter;
  });

  return (
    <div className="pt-28 min-h-screen bg-[#fcfbfe] flex flex-col">
      {/* Breadcrumb Bar */}
      <div className="bg-[#ebe8fd] py-5 border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between text-[13px] text-gray-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-700">Resources</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Events</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            Community &amp; Culture
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#ebe8fd] py-16 px-6 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            {heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
              {heroHighlight}
            </span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {heroDesc}
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("nearest")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === "nearest"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Nearest Events
            </button>
            <button
              onClick={() => setFilter("latest")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === "latest"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Latest Event
            </button>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 px-6 max-w-[1240px] mx-auto w-full">
        <div className="space-y-12">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_6px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Event Image */}
              <div className="lg:col-span-5 h-[260px] sm:h-[320px] lg:h-full relative overflow-hidden bg-gray-100">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  {evt.date}
                </div>
              </div>

              {/* Event Info */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 mb-3">
                    <span className="flex items-center gap-1 text-[#602b0c]">
                      <Calendar className="w-3.5 h-3.5" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {evt.location}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-4 leading-snug">
                    {evt.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {evt.description}
                  </p>

                  <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#602b0c] mb-2.5">
                      Agenda Highlights:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                      {evt.agenda.map((ag, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#602b0c] shrink-0" />
                          <span>{ag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25"
                  >
                    Join or Inquire
                  </Link>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Event link copied to clipboard!");
                      }
                    }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
                    title="Share Event"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
