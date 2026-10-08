import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ConversionCTA from "@/components/ConversionCTA";
import { 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Quote, 
  ShieldCheck, 
  Cpu
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchProject(slug: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/portfolios/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
}

async function fetchAllProjects() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/portfolios`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    return [];
  }
}

function normalizeProject(p: any) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category || "",
    status: p.featured ? "Featured" : (p.status || "Production"),
    statusColor: "purple",
    shortDesc: p.description || "",
    overview: p.overview || p.description || "",
    client: p.client || "",
    year: new Date(p.createdAt || Date.now()).getFullYear().toString(),
    duration: p.duration || p.timeline || "",
    role: p.role || "",
    techStack: Array.isArray(p.tags) ? p.tags : [],
    metrics: p.metrics || "",
    challenge: p.challenge || p.description || "",
    solution: p.solution || p.description || "",
    results: p.results || "",
    image: p.thumbnail || p.image || "",
    clientQuote: p.clientQuote || "",
    clientAuthor: p.clientAuthor || p.client || "",
    liveUrl: p.liveUrl || "",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawProject = await fetchProject(slug);
  const project = normalizeProject(rawProject);

  if (!project) {
    return {
      title: "Case Study Not Found – Brain Bari",
    };
  }

  return {
    title: `${project.title} | Case Study – Brain Bari`,
    description: project.shortDesc,
    openGraph: {
      title: `${project.title} – Brain Bari`,
      description: project.shortDesc,
      images: [{ url: project.image }],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawProject = await fetchProject(slug);
  const project: any = normalizeProject(rawProject);

  if (!project) {
    notFound();
  }

  const allProjects = await fetchAllProjects();
  const otherProjects = allProjects
    .filter((p: any) => p.slug !== project.slug)
    .map(normalizeProject);

  return (
    <div className="min-h-screen bg-[#ebe8fd] font-sans flex flex-col justify-between relative overflow-hidden pt-32 md:pt-36">
      {/* Background ambient radial blur orbs */}
      <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] bg-[#b57be4]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[700px] h-[700px] bg-[#e464a4]/15 rounded-full blur-[170px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-[#ff7e5f]/8 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <main className="flex-grow py-8 md:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-[1100px] mx-auto space-y-12">
          
          {/* Breadcrumb & Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/new-work"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#8a421a] transition-all bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-purple-100/60 shadow-xs hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Case Studies</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {project.status}
            </div>
          </div>

          {/* Hero Header */}
          <header className="space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-purple-100/80 text-[#8a421a] border border-purple-200/60 shadow-2xs">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold text-gray-500 bg-white/70 border border-purple-100">
                Delivered in {project.year}
              </span>
            </div>

            <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-black text-gray-950 tracking-tight leading-[1.1] max-w-[950px]">
              {project.title}
            </h1>

            <p className="text-gray-700 text-base sm:text-lg max-w-[850px] font-medium leading-relaxed">
              {project.overview || project.shortDesc}
            </p>
          </header>

          {/* Key Specs Bar (4 Info Cards) */}
          <section aria-label="Project Highlights" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Building className="w-4 h-4 text-[#b57be4]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Client</span>
              </div>
              <div className="text-sm font-black text-gray-900 leading-snug">
                {project.client}
              </div>
            </div>

            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-4 h-4 text-[#e464a4]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Turnaround</span>
              </div>
              <div className="text-sm font-black text-gray-900 leading-snug">
                {project.timeline || "3 Weeks"}
              </div>
            </div>

            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Industry</span>
              </div>
              <div className="text-sm font-black text-gray-900 leading-snug">
                {project.category}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#ff7e5f]/15 to-[#e464a4]/15 backdrop-blur-md rounded-2xl p-5 border border-[#e464a4]/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-[#8a421a] mb-1">
                <Award className="w-4 h-4 text-[#e464a4]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a421a]">Verified Metric</span>
              </div>
              <div className="text-sm font-black text-gray-950 leading-snug">
                {project.metrics}
              </div>
            </div>
          </section>

          {/* Project Featured Showcase Frame */}
          <section aria-label="Visual Preview" className="relative rounded-3xl overflow-hidden border border-white/90 shadow-[0_20px_50px_rgba(181,123,228,0.15)] bg-white/60">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[320px] sm:h-[450px] md:h-[520px] object-cover object-top"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Enterprise Implementation
                </div>
                <div className="text-lg sm:text-xl font-black mt-1">
                  Engineered &amp; Deployed by Brain Bari
                </div>
              </div>
              <Link
                href={`/order?service=${project.slug}`}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] shadow-md hover:scale-105 transition-all shrink-0 flex items-center gap-2"
              >
                <span>Build Similar Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Three Detailed Core Sections: Challenge, Solution, Results */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* The Challenge */}
            <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-700">
                  01. The Challenge
                </span>
                <h3 className="text-xl font-extrabold text-gray-950 leading-snug">
                  Identifying Core Bottlenecks
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {project.challenge}
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#8a421a]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8a421a]">
                  02. The Solution
                </span>
                <h3 className="text-xl font-extrabold text-gray-950 leading-snug">
                  Brain Bari Architecture
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Measurable Results */}
            <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  03. Proven Results
                </span>
                <h3 className="text-xl font-extrabold text-gray-950 leading-snug">
                  Measurable ROI &amp; Scale
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {project.results}
                </p>
              </div>
            </div>
          </section>

          {/* Key Deliverables & Capabilities Checklist */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <section className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#8a421a]">
                  Key Deliverables
                </div>
                <h3 className="text-2xl font-black text-gray-950">
                  Features &amp; Technical Capabilities Delivered
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {project.keyFeatures.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack & Architecture Cloud */}
          <section className="bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#8a421a]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8a421a]">
                  Technology Stack
                </div>
                <h3 className="text-xl font-black text-gray-950">
                  Built with High-Performance Tools &amp; Frameworks
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {(project.techStack || []).map((tech: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-purple-200/70 text-xs sm:text-sm font-bold text-gray-800 shadow-2xs hover:border-[#b57be4] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]"></span>
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Client Testimonial */}
          {project.testimonial && (
            <section className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-white/10 pointer-events-none">
                <Quote className="w-32 h-32" />
              </div>

              <div className="relative z-10 max-w-[800px] space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-amber-300 uppercase tracking-widest border border-white/20">
                  Client Feedback
                </div>

                <blockquote className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight text-white/95">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>

                <div className="pt-2">
                  <div className="font-extrabold text-base sm:text-lg text-white">
                    {project.testimonial.author}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-200 font-medium">
                    {project.testimonial.role}, {project.testimonial.company}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Next / Explore Other Case Studies */}
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#8a421a]">
                  More Case Studies
                </div>
                <h3 className="text-2xl font-black text-gray-950">
                  Explore More Solutions
                </h3>
              </div>
              <Link
                href="/new-work"
                className="text-xs font-bold text-[#8a421a] hover:underline flex items-center gap-1"
              >
                <span>View All Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((other) => (
                <Link
                  key={other.id}
                  href={`/new-work/${other.slug}`}
                  className="group flex flex-col sm:flex-row gap-5 p-5 bg-white/75 backdrop-blur-md rounded-3xl border border-white/80 hover:border-purple-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={other.image}
                      alt={other.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-grow">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#b57be4]">
                        {other.category}
                      </span>
                      <h4 className="text-base font-black text-gray-900 group-hover:text-[#8a421a] transition-colors leading-snug">
                        {other.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {other.shortDesc}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#b57be4] group-hover:text-[#8a421a] flex items-center gap-1 mt-3">
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Signature Conversion CTA */}
      <ConversionCTA />
    </div>
  );
}
