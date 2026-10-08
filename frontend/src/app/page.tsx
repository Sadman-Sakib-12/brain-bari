import React from "react";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brain Bari – AI & Software Solutions Company in Bangladesh",
  description: "Brain Bari is an AI and software solutions company in Bangladesh specializing in conversational AI chatbots, SaaS development, custom software, and innovative digital products."
};

async function getSiteSettings() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
  try {
    const res = await fetch(`${API_BASE}/cms/settings`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  return <HomePageClient initialSettings={settings} />;
}
