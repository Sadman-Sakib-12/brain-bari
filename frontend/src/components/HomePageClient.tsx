"use client";

import React from "react";
import HeroSection from "@/components/HeroSection";
import CoreServices from "@/components/CoreServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import SpecializedChatbots from "@/components/SpecializedChatbots";
import WorkflowCapabilities from "@/components/WorkflowCapabilities";
import PortfolioSection from "@/components/PortfolioSection";
import ClientReviews from "@/components/ClientReviews";
import ConversionCTA from "@/components/ConversionCTA";
import { useSiteSettings } from "@/hooks/useApi";

interface HomePageClientProps {
  initialSettings?: any;
}

export default function HomePageClient({ initialSettings }: HomePageClientProps) {
  const { data: clientSettings } = useSiteSettings();
  const settings = clientSettings || initialSettings || {};
  const sections = settings?.homepageSections || {};

  // Check if a section is visible (defaults to true if unset)
  const isVisible = (key: string): boolean => {
    return sections[key] !== false;
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      {isVisible("hero") && <HeroSection />}

      {/* 2. Core Services & Pricing (4 Cards) */}
      {isVisible("coreServices") && <CoreServices />}

      {/* 3. Why Choose Us Section */}
      {isVisible("whyChooseUs") && <WhyChooseUs />}

      {/* 4. Specialized AI Chatbots Grid */}
      {isVisible("specializedChatbots") && <SpecializedChatbots />}

      {/* 5. Capabilities & Workflow Showcase */}
      {isVisible("workflow") && <WorkflowCapabilities />}

      {/* 6. Portfolio / Our Projects Section */}
      {isVisible("portfolio") && <PortfolioSection />}

      {/* 7. Client Reviews / Testimonials Section */}
      {isVisible("reviews") && <ClientReviews />}

      {/* 8. Ready to Transform Business CTA Banner */}
      {isVisible("cta") && <ConversionCTA />}
    </div>
  );
}
