import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import servicePackagesData from "@/data/servicePackages.json";
import coreServices from "@/data/coreServices.json";

type ServiceSlug = keyof typeof servicePackagesData;

export async function generateStaticParams() {
  return [
    { slug: "ai-chatbot" },
    { slug: "custom-ai" },
    { slug: "ai-saas" },
    { slug: "ai-3d" },
    { slug: "ai-agents" },
    { slug: "saas-product" },
    { slug: "web-app-dev" },
    { slug: "enterprise-software" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = coreServices.find((s) => s.slug === slug);
  return {
    title: `${item ? item.title : "Service"} – Brain Bari`,
    description: item ? item.shortDesc : "Brain Bari AI & Software Solutions",
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const serviceDetail = servicePackagesData[slug as ServiceSlug];

  if (!serviceDetail) {
    notFound();
  }

  return (
    <div className="pt-48 pb-0 bg-[#fcfbfe]">
      {/* 1. About Service Hero Section */}
      <section className="max-w-[1300px] mx-auto px-6 mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-3xl p-8 lg:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex-1 w-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
            <img
              src={serviceDetail.image}
              alt={serviceDetail.heroTitleGradient}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight font-sans">
              {serviceDetail.heroTitlePrefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                {serviceDetail.heroTitleGradient}
              </span>
              {serviceDetail.heroTitleSuffix}
            </h1>
            {serviceDetail.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-gray-600 text-base md:text-lg leading-relaxed font-sans">
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/about/"
                className="px-8 py-3.5 bg-[#602b0c] text-white text-sm font-medium rounded-xl hover:bg-[#8a421a] transition-colors shadow-sm"
              >
                Read More
              </Link>
              <Link
                href="/new-work/"
                className="px-8 py-3.5 bg-[#b57be4] text-white text-sm font-medium rounded-xl hover:bg-[#a05fd3] transition-colors shadow-sm"
              >
                Work Prove
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Packages & Offerings List */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-8 mb-24">
        {serviceDetail.packages.map((pkg: any) => (
          <div
            key={pkg.id}
            className="bg-white hover:bg-[#faf9fe] rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(181,123,228,0.09)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <div className="w-full md:w-[320px] shrink-0 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug font-sans">
                {pkg.title}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-semibold">
                {pkg.meta}
              </p>
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                {pkg.isConsulting ? (
                  <Link
                    href="/schedule/"
                    className="inline-block px-8 py-3 border border-[#602b0c] text-[#602b0c] hover:bg-[#602b0c] hover:text-white rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    Book Now
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/schedule/"
                      className="inline-block px-8 py-3 border border-[#602b0c] text-[#602b0c] hover:bg-[#602b0c] hover:text-white rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/order?service=${pkg.id}`}
                      className="inline-block px-8 py-3 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white hover:opacity-95 rounded-xl text-sm font-black transition-all duration-300 shadow-sm"
                    >
                      Order Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Consultation CTA Section */}
      <section className="py-20 bg-[#ebe8fd] text-center border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[34px] font-bold font-sans text-[#111111] mb-4 tracking-tight">
            Ready to transfer your Business
          </h2>
          <p className="text-[#333333] text-[14px] max-w-[650px] mx-auto mb-6 leading-relaxed">
            Developing and maintaining web applications using React.js, Next.js, and other related technologies.
            <br />
            Collaborating with cross-functional teams including
          </p>
          <Link
            href="/schedule/"
            className="inline-block px-10 py-3.5 bg-[#602b0c] hover:bg-[#4a2008] text-white rounded-[3px] font-medium text-[14px] transition-colors duration-normal"
          >
            Schedule A Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
