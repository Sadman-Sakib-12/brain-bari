import React from "react";
import {
  Monitor,
  MessageSquare,
  Sparkles,
  Cpu,
  Layers,
  Package,
  Globe,
  Building2,
} from "lucide-react";

export interface DynamicServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const getServiceIcon = (category?: string, index?: number) => {
  const icons = [Monitor, MessageSquare, Sparkles, Cpu, Layers, Package, Globe, Building2];
  const cat = (category || "").toLowerCase();
  if (cat.includes("chatbot")) return MessageSquare;
  if (cat.includes("custom") || cat.includes("assistant")) return Sparkles;
  if (cat.includes("agent") || cat.includes("automation")) return Cpu;
  if (cat.includes("saas")) return Layers;
  if (cat.includes("web") || cat.includes("app")) return Globe;
  if (cat.includes("enterprise")) return Building2;
  return icons[(index ?? 0) % icons.length];
};
