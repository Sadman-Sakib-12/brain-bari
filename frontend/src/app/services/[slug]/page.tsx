import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, Clock, ShieldCheck, Sparkles, ChevronRight, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchService(slug: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/services/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

async function fetchServicePackages() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/cms/content/servicePackages`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchService(slug);
  return {
    title: `${item ? item.title : "Service Details"} – Brain Bari AI Solutions`,
    description: item
      ? item.shortDesc || item.fullDesc
      : "Brain Bari AI & Software Solutions",
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, packagesMap] = await Promise.all([
    fetchService(slug),
    fetchServicePackages(),
  ]);

  const customDetail = packagesMap[slug];

  if (!service && !customDetail) {
    notFound();
  }

  // Resolved titles & metadata
  const heroTitle = service?.title || customDetail?.heroTitleGradient || "AI Solution";
  const heroImage =
    customDetail?.image ||
    customDetail?.coverImage ||
    service?.image ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";

  const paragraphs: string[] =
    customDetail?.paragraphs && customDetail.paragraphs.length > 0
      ? customDetail.paragraphs
      : [
          service?.fullDesc ||
            service?.shortDesc ||
            "Production-ready AI and software engineering built to accelerate your business operations, automate workflows, and drive higher conversions.",
        ];

  // Packages list: Use custom packages added via Admin CMS
  // If no packages configured yet in admin, render ONE clean package card (never duplicate 4 times)
  const packagesList: any[] =
    customDetail?.packages && Array.isArray(customDetail.packages) && customDetail.packages.length > 0
      ? customDetail.packages
      : [
          {
            id: service?.slug || slug,
            title: service?.title || "Complete Service Package",
            meta: service?.price
              ? `Starting at $${service.price} • ${service.deliveryDays || 7} Days Turnaround`
              : "Starting at $499 • 7 Days Turnaround",
            description: service?.shortDesc || service?.fullDesc || "",
            image: service?.image || heroImage,
            features: Array.isArray(service?.features) ? service.features : [],
            link: `/order?service=${encodeURIComponent(service?.title || heroTitle)}`,
          },
        ];

  return (
    <div className="pt-32 md:pt-44 pb-20 bg-[#fcfbfe]">
      {/* BREADCRUMB */}
      <div className="max-w-[1300px] mx-auto px-6 mb-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/services" className="hover:text-gray-900 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold truncate max-w-[260px] sm:max-w-none">
            {heroTitle}
          </span>
        </nav>
      </div>

      {/* 1. ABOUT SERVICE HERO SECTION */}
      <section className="max-w-[1300px] mx-auto px-6 mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-3xl p-8 lg:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-100">
          {/* LEFT: HERO IMAGE */}
          <div className="flex-1 w-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100">
            <img
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT: HERO CONTENT */}
          <div className="flex-1 space-y-6 text-left">
            {service?.category && (
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#8b4ec9] border border-purple-200/80 text-xs font-bold uppercase tracking-wider inline-block">
                {service.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight font-sans tracking-tight">
              {customDetail?.heroTitlePrefix || ""}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                {customDetail?.heroTitleGradient || heroTitle}
              </span>
              {customDetail?.heroTitleSuffix || ""}
            </h1>

            {paragraphs.map((para: string, pIdx: number) => (
              <p key={pIdx} className="text-gray-600 text-base md:text-lg leading-relaxed font-sans">
                {para}
              </p>
            ))}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/order?service=${encodeURIComponent(heroTitle)}`}
                className="px-8 py-3.5 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-md shadow-pink-500/15 transition-all flex items-center gap-2"
              >
                <span>Order This Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/schedule"
                className="px-8 py-3.5 bg-white border border-gray-200 text-gray-800 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE PACKAGES & OFFERINGS LIST (THE CARD LAYOUT FROM SCREENSHOT) */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-8 mb-24">
        {packagesList.map((pkg: any) => (
          <div
            key={pkg.id}
            className="bg-white hover:bg-[#faf9fe] rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(181,123,228,0.09)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            {/* LEFT: THUMBNAIL IMAGE */}
            <div className="w-full md:w-[320px] shrink-0 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-slate-900">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug font-sans">
                {pkg.title}
              </h2>

              <p className="text-gray-500 text-sm md:text-base font-semibold">
                {pkg.meta}
              </p>

              {pkg.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              )}

              {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  {pkg.features.map((feat: string, fIdx: number) => (
                    <span key={fIdx} className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href="/schedule"
                  className="inline-block px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  Learn More
                </Link>

                <Link
                  href={pkg.link || `/order?service=${encodeURIComponent(pkg.title)}`}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white hover:opacity-95 rounded-xl text-sm font-black transition-all duration-300 shadow-sm"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. CONSULTATION CTA SECTION */}
      <section className="py-20 bg-[#ebe8fd] text-center border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[34px] font-bold font-sans text-[#111111] mb-4 tracking-tight">
            Ready to transform your Business?
          </h2>
          <p className="text-[#333333] text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
            Partner with Brain Bari engineers to architect, build, and deploy production-grade AI
            and software solutions tailored to your industry.
          </p>
          <Link
            href="/schedule"
            className="inline-block px-10 py-3.5 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white rounded-xl font-bold text-sm shadow-md hover:scale-102 transition-all duration-300"
          >
            Schedule A Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
