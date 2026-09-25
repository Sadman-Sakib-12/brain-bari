"use client";

import React from "react";
import Link from "next/link";
import { 
  Code, 
  Smartphone, 
  Globe, 
  Building2, 
  Rocket, 
  UserCheck, 
  HelpCircle, 
  Layers, 
  Bot, 
  Brain, 
  Cpu, 
  Sparkles, 
  Palette, 
  Star,
  ArrowRight
} from "lucide-react";
import ConversionCTA from "@/components/ConversionCTA";
import caseStudiesData from "@/data/caseStudies.json";
import pageData from "@/data/caseStudiesPage.json";

// --- TypeScript Contracts for Real-World Data Safety ---
interface CapabilityItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface TestimonialItem {
  id?: string;
  name: string;
  company: string;
  text: string;
  rating?: number;
}

interface CaseStudyItem {
  id: string;
  title: string;
  client?: string;
  category: string;
  metrics?: string;
  description: string;
  technologies?: string[];
  featured?: boolean;
}

interface HeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

// Map string icon identifiers from CMS to production Lucide icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Smartphone,
  Globe,
  Building2,
  Rocket,
  UserCheck,
  HelpCircle,
  Layers,
  Bot,
  Brain,
  Cpu,
  Sparkles,
  Palette
};

export default function CaseStudiesPage() {
  // Defensive fallbacks to ensure smooth zero-crash rendering in all environments
  const hero: HeroConfig = {
    badge: pageData?.hero?.badge || "Solutions & Capabilities",
    title: pageData?.hero?.title || "What product do you want to",
    titleHighlight: pageData?.hero?.titleHighlight || "build?",
    description:
      pageData?.hero?.description ||
      "Delivering value with tailored software solutions. Brain Bari is your trusted software and AI development partner.",
    buttonText: pageData?.hero?.buttonText || "Start Your Solution",
    buttonLink: pageData?.hero?.buttonLink || "/order"
  };

  const capabilities: CapabilityItem[] = (pageData?.capabilities as CapabilityItem[]) || [];
  const testimonials: TestimonialItem[] = (pageData?.testimonials as TestimonialItem[]) || [];
  const caseStudies: CaseStudyItem[] = (caseStudiesData as CaseStudyItem[]) || [];

  return (
    <div className="pt-28 min-h-screen bg-[#fcfbfe] flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Breadcrumbs Bar */}
      <div className="bg-[#ebe8fd] py-5 border-b border-gray-200/80">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between text-[13px] text-gray-600">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link 
              href="/" 
              className="hover:text-black font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded"
            >
              Home
            </Link>
            <span className="text-gray-400" aria-hidden="true">/</span>
            <Link 
              href="/resources" 
              className="hover:text-black font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded"
            >
              Resources
            </Link>
            <span className="text-gray-400" aria-hidden="true">/</span>
            <span className="text-gray-900 font-semibold" aria-current="page">Case Studies</span>
          </nav>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-200/60">
            {hero.badge}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="bg-[#ebe8fd] py-16 sm:py-20 px-6 text-center border-b border-gray-200/80">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            {hero.title} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
              {hero.titleHighlight}
            </span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {hero.description}
          </p>
          <div className="pt-4">
            <Link
              href={hero.buttonLink}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#602b0c] hover:bg-[#4a2008] text-white rounded-full font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-98"
            >
              {hero.buttonText}
            </Link>
          </div>
        </div>
      </header>

      {/* Development Capabilities Grid */}
      {capabilities.length > 0 && (
        <section className="py-20 px-6 max-w-[1240px] mx-auto w-full" aria-label="Development Capabilities">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Full-Spectrum Development Capabilities
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              From initial research and architecture to production deployment and AI model fine-tuning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item, idx) => {
              const IconComponent = iconMap[item.icon] || Code;
              return (
                <article
                  key={item.id || `cap-${idx}`}
                  className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-purple-200/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div 
                        className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center group-hover:bg-[#602b0c] group-hover:text-white transition-colors duration-200"
                        aria-hidden="true"
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-950 mb-2.5 group-hover:text-[#602b0c] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href="/order"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#602b0c] hover:text-[#ff7e5f] transition-colors"
                    >
                      <span>Request Details</span>
                      <span className="font-mono text-sm" aria-hidden="true">&gt;&gt;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Client Case Studies from CMS */}
      {caseStudies.length > 0 && (
        <section className="py-20 px-6 bg-white border-t border-gray-100" aria-label="Featured Case Studies">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center mb-14 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                Real-World Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                Featured Client Case Studies
              </h2>
              <p className="text-gray-600 text-sm max-w-lg mx-auto">
                Explore how Brain Bari engineered custom AI assistants and enterprise solutions for real business results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((cs) => (
                <article
                  key={cs.id}
                  className="bg-gradient-to-br from-white to-purple-50/40 rounded-3xl p-7 sm:p-8 border border-purple-100/80 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-[#602b0c] text-xs font-bold rounded-full">
                      {cs.category}
                    </span>
                    {cs.metrics && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {cs.metrics}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-950 leading-snug">
                    {cs.title}
                  </h3>
                  {cs.client && (
                    <p className="text-xs font-semibold text-purple-900">
                      Client: {cs.client}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {cs.description}
                  </p>

                  {cs.technologies && cs.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2" aria-label="Technologies Used">
                      {cs.technologies.map((tech, techIdx) => (
                        <span 
                          key={techIdx} 
                          className="text-[11px] font-medium bg-white text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 px-6 bg-[#ebe8fd] border-t border-gray-200/80" aria-label="Client Testimonials">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center mb-14 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                What our clients say about our work
              </h2>
              <div className="flex justify-center gap-1 text-amber-500 my-3" aria-label="5-star average rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm max-w-lg mx-auto">
                Trusted by international conferences, enterprise tax firms, and growing digital startups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item, idx) => {
                const starCount = Math.min(Math.max(item.rating || 5, 1), 5);
                return (
                  <blockquote
                    key={item.id || `test-${idx}`}
                    className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex gap-1 text-amber-500 mb-4" aria-label={`${starCount} out of 5 stars`}>
                        {[...Array(starCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                        &ldquo;{item.text}&rdquo;
                      </p>
                    </div>

                    <footer className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <cite className="font-bold text-gray-950 text-sm not-italic block">{item.name}</cite>
                        <span className="text-xs text-gray-500 block">{item.company}</span>
                      </div>
                      <div 
                        className="w-8 h-8 rounded-full bg-purple-100 text-[#602b0c] flex items-center justify-center font-bold text-xs select-none"
                        aria-hidden="true"
                      >
                        {item.name ? item.name.charAt(0).toUpperCase() : "C"}
                      </div>
                    </footer>
                  </blockquote>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
