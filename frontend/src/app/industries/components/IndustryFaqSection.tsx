"use client";

import React from "react";
import { useCmsContent } from "@/hooks/useApi";

interface IndustryFaqItem {
  question: string;
  answer: string;
}

interface IndustryFaqSectionProps {
  faqs?: IndustryFaqItem[];
  heading?: string;
  subheading?: string;
}

export default function IndustryFaqSection({
  faqs: propFaqs,
  heading,
  subheading
}: IndustryFaqSectionProps) {
  const { data: cmsPage } = useCmsContent<any>("industriesPage");

  const displayFaqs: IndustryFaqItem[] =
    propFaqs && propFaqs.length > 0
      ? propFaqs
      : Array.isArray(cmsPage?.faqs)
      ? cmsPage.faqs
      : [];

  const displayHeading = heading || cmsPage?.faqHeading || "Frequently Asked Questions About Industry AI";
  const displaySubheading =
    subheading ||
    cmsPage?.faqSubheading ||
    "Answers to common questions regarding deployment, integration, and security for industry-specific AI solutions.";

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight mb-3">
            {displayHeading}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            {displaySubheading}
          </p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fbfaff] border border-[#c8c2eb]/60">
              <h3 className="text-sm font-bold text-gray-950 mb-1.5">
                {faq.question}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
