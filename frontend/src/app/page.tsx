import HeroSection from "@/components/HeroSection";
import CoreServices from "@/components/CoreServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import SpecializedChatbots from "@/components/SpecializedChatbots";
import WorkflowCapabilities from "@/components/WorkflowCapabilities";
import PortfolioSection from "@/components/PortfolioSection";
import ClientReviews from "@/components/ClientReviews";
import ConversionCTA from "@/components/ConversionCTA";

export const metadata = {
  title: "Brain Bari – AI & Software Solutions Company in Bangladesh",
  description: "Brain Bari is an AI and software solutions company in Bangladesh specializing in conversational AI chatbots, SaaS development, custom software, and innovative digital products."
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Core Services & Pricing (4 Cards) */}
      <CoreServices />

      {/* 3. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 4. Specialized AI Chatbots Grid (Note: SUSTHO card section is excluded per user requirements) */}
      <SpecializedChatbots />

      {/* 5. Capabilities & Workflow Showcase */}
      <WorkflowCapabilities />

      {/* 6. Portfolio / Our Projects Section */}
      <PortfolioSection />

      {/* 7. Client Reviews / Testimonials Section */}
      <ClientReviews />

      {/* 8. Ready to Transform Business CTA Banner */}
      <ConversionCTA />
    </div>
  );
}
