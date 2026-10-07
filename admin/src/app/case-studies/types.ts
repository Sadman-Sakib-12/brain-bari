import React from "react";
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
  Palette
} from "lucide-react";

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metrics: string;
  technologies: string[];
  featured: boolean;
  slug?: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  text: string;
  rating: number;
}

export interface CaseStudiesHero {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const AVAILABLE_ICONS = [
  { value: "Code", label: "Code (Engineering / Custom Dev)" },
  { value: "Smartphone", label: "Smartphone (Mobile Dev)" },
  { value: "Globe", label: "Globe (Web Apps)" },
  { value: "Building2", label: "Building2 (Enterprise Systems)" },
  { value: "Rocket", label: "Rocket (MVP / Startups)" },
  { value: "UserCheck", label: "UserCheck (CTO as a Service)" },
  { value: "HelpCircle", label: "HelpCircle (IT Consulting)" },
  { value: "Layers", label: "Layers (SaaS / Cloud)" },
  { value: "Bot", label: "Bot (Conversational AI)" },
  { value: "Brain", label: "Brain (NLP / Semantic Search)" },
  { value: "Cpu", label: "Cpu (Machine Learning)" },
  { value: "Sparkles", label: "Sparkles (Generative AI)" },
  { value: "Palette", label: "Palette (UI/UX Design)" }
];

export const renderCapIcon = (iconName: string, className = "w-4 h-4") => {
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
    Palette,
  };
  const IconComp = iconMap[iconName] || Code;
  return React.createElement(IconComp, { className });
};
