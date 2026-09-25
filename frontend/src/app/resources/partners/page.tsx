"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Handshake, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Rocket, 
  Mail, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { toast } from "sonner";
import ConversionCTA from "@/components/ConversionCTA";
import partnersData from "@/data/partners.json";

export default function PartnersPage() {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [partnershipType, setPartnershipType] = useState("Agency Partner");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! Your partnership interest has been registered.");
  };

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
            <Link href="/resources" className="hover:text-black font-medium transition-colors">
              Resources
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Partners</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            Ecosystem Growth
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#ebe8fd] via-white to-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 text-[#602b0c] text-xs font-bold shadow-sm">
            <Handshake className="w-3.5 h-3.5 text-purple-600" />
            <span>Partnership Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-tight">
            Something Great Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
              Coming Soon
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            We are working hard to build a revolutionary Partnership ecosystem. Stay tuned to collaborate, scale, and succeed together.
          </p>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#602b0c]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">Shared Growth</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Unlock new revenue streams and reach a wider audience of potential clients.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-[#602b0c]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">AI Integration</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Integrate our cutting-edge AI chatbots and SaaS engines into your client solutions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-[#602b0c]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">Early Access</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Get exclusive early access to our newest AI models and beta toolsets.
              </p>
            </div>
          </div>

          {/* Active Partners Showcase Grid */}
          <div className="pt-14 text-left">
            <div className="text-center mb-8 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                Active Ecosystem Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Our Strategic Partners &amp; Collaborators
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {(partnersData || []).map((partner: any) => (
                <div key={partner.id} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#602b0c] text-white font-black flex items-center justify-center text-sm shrink-0 shadow-sm">
                    {partner.logoInitials || partner.name?.slice(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-gray-900">{partner.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {partner.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8a421a] font-semibold">{partner.type}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{partner.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Early Interest Form */}
          <div className="mt-14 max-w-xl mx-auto bg-[#ebe8fd] p-8 rounded-3xl border border-purple-200/80 text-left">
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              Register for Early Partner Access
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Be among the first 50 enterprise and agency partners to receive priority integrations and revenue sharing.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>You are on the priority list! Our team will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Innovations Ltd."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#602b0c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#602b0c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Partnership Category
                  </label>
                  <select
                    value={partnershipType}
                    onChange={(e) => setPartnershipType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#602b0c]"
                  >
                    <option value="Agency Partner">Agency &amp; Reseller Partner</option>
                    <option value="Technology Integration">Technology &amp; API Integration</option>
                    <option value="Enterprise Referral">Enterprise Referral Consultant</option>
                    <option value="Academic & Research">Academic &amp; Research Collaboration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#602b0c] hover:bg-[#4a2008] text-white rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer"
                >
                  Join Partner Network
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
