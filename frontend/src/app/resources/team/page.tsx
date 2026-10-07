"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Mail, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Calendar, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useCmsContent } from "@/hooks/useApi";
import ConversionCTA from "@/components/ConversionCTA";

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const { data: rawTeam = [] } = useCmsContent<any[]>("team");
  const { data: rawExpertises = [] } = useCmsContent<any[]>("industryExpertises");
  const { data: pageCms } = useCmsContent<any>("teamPage");
  const teamMembers = Array.isArray(rawTeam) ? rawTeam : [];
  const industryCards = Array.isArray(rawExpertises) ? rawExpertises : [];

  const expertisesTitle = pageCms?.expertisesSection?.title || "Our Industry Expertises";
  const expertisesDesc = pageCms?.expertisesSection?.description || "Our deep understanding of diverse industries empowers us to design customized software solutions. Let our expertise be the Catalyst for your next triumph.";
  const teamTitle = pageCms?.teamSection?.title || "Meet Our";
  const teamHighlight = pageCms?.teamSection?.titleHighlight || "Team";
  const teamSubtitle = pageCms?.teamSection?.subtitle || "Click on any team member to view their complete profile and expertise.";
  const teamBadge = pageCms?.teamSection?.badge || "Interactive Profiles";

  // Divide team members into executives and specialists
  const executives = teamMembers.slice(0, 3).map((m, idx) => ({
    ...m,
    aspect: idx === 2 ? "aspect-[8/3]" : "aspect-[4/3]",
    colSpan: idx === 2 ? "col-span-1 md:col-span-2" : "col-span-1"
  }));

  const specialists = teamMembers.slice(3);

  return (
    <div className="pt-28 min-h-screen bg-white flex flex-col">
      {/* Breadcrumb Bar */}
      <div className="bg-[#ebe8fd] py-5 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between text-[13px] text-gray-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-700">Resources</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Team</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c2d12] bg-amber-100 px-3 py-1 rounded-full">
            People &amp; Expertise
          </span>
        </div>
      </div>

      {/* SECTION 1: Our Industry Expertises */}
      <section className="w-full pt-16 pb-20 bg-white flex flex-col items-center justify-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 text-center space-y-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {expertisesTitle}
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
            {expertisesDesc}
          </p>

          {/* 20 Asymmetrical Pastel Cards Grid */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-6 pt-10 max-w-6xl w-full">
            {industryCards.map((item, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: item.bg }}
                className="flex flex-col items-center justify-center text-center w-[145px] h-[95px] shadow-xs border border-gray-100/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 cursor-pointer rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px]"
              >
                <div className="mb-2 text-gray-700">
                  <svg
                    className="w-7 h-7 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-gray-700 px-2 leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Meet Our Team */}
      <section className="w-full py-20 bg-white border-t border-gray-100 flex flex-col items-center justify-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 space-y-14">
          <div className="text-center md:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight">
                {teamTitle} <span className="font-extrabold text-[#7c2d12]">{teamHighlight}</span>
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {teamSubtitle}
              </p>
            </div>
            <span className="text-xs text-[#7c2d12] font-semibold bg-amber-50 px-3 py-1 rounded-full w-max border border-amber-200/50">
              {teamBadge}
            </span>
          </div>

          {/* Executives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executives.map((exec) => (
              <div
                key={exec.id}
                onClick={() => setSelectedMember(exec)}
                className={`flex flex-col gap-4 ${exec.colSpan} cursor-pointer group transform transition-all duration-300 hover:-translate-y-1`}
                title={`Click to view ${exec.name}'s profile`}
              >
                {/* Upper Avatar Card with soft background and circular framed headshot */}
                <div className={`relative w-full ${exec.aspect} bg-[#ebe8fd] rounded-[28px] flex items-center justify-center p-4 sm:p-6 shadow-xs border border-purple-100/80 group-hover:border-purple-300 group-hover:shadow-md transition-all overflow-hidden`}>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_25px_rgba(0,0,0,0.12)] bg-white relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={exec.avatar}
                      alt={exec.name}
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                </div>

                {/* Bottom Role & Name Pill */}
                <div className="bg-[#b4beee] text-center py-3.5 px-4 rounded-[20px] shadow-xs group-hover:bg-[#a3aff0] transition-colors">
                  <h3 className="text-[17px] font-extrabold text-gray-900 leading-tight">
                    {exec.name}
                  </h3>
                  <p className="text-[12px] text-gray-800 font-semibold mt-1">
                    {exec.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Specialists & Engineers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2 justify-center">
            {specialists.map((spec) => (
              <div
                key={spec.id}
                onClick={() => setSelectedMember(spec)}
                className="flex flex-col gap-3 cursor-pointer group transform transition-all duration-300 hover:-translate-y-1"
                title={`Click to view ${spec.name}'s profile`}
              >
                {/* Circular framed headshot on rounded background */}
                <div className="relative w-full aspect-square bg-[#ebe8fd] rounded-[22px] flex items-center justify-center p-3 shadow-xs border border-purple-100/80 group-hover:border-purple-300 group-hover:shadow-md transition-all overflow-hidden">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white shadow-[0_6px_20px_rgba(0,0,0,0.1)] bg-white relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                </div>

                {/* Bottom Role & Name Pill */}
                <div className="bg-[#b4beee] text-center py-3 px-2 rounded-[16px] shadow-xs group-hover:bg-[#a3aff0] transition-colors">
                  <h4 className="text-sm font-extrabold text-gray-900 truncate">
                    {spec.name}
                  </h4>
                  <p className="text-[11px] text-gray-800 font-semibold mt-0.5 truncate">
                    {spec.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Conversion CTA */}
      <ConversionCTA />

      {/* Interactive Team Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-purple-100 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
              {/* Avatar Frame */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#b4beee] shadow-lg shrink-0 bg-[#ebe8fd]">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="object-cover object-top w-full h-full"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1.5 pt-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{selectedMember.department}</span>
                </div>

                <h3 className="text-2xl font-black text-gray-950 tracking-tight">
                  {selectedMember.name}
                </h3>

                <p className="text-sm font-bold text-[#7c2d12]">
                  {selectedMember.role}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-0.5 rounded-md">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Experience: {selectedMember.experience}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-0.5 rounded-md">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {selectedMember.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="bg-[#ebe8fd]/60 rounded-2xl p-5 border border-purple-100 mb-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#602b0c] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Professional Background</span>
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedMember.fullBio}
              </p>
            </div>

            {/* Core Competencies & Skills */}
            <div className="mb-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                Core Competencies &amp; Skills:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
              <Link
                href="/schedule"
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with Team</span>
              </Link>

              <Link
                href={`/contact?inquiry=${encodeURIComponent(`Contact regarding ${selectedMember.name}`)}`}
                onClick={() => setSelectedMember(null)}
                className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
