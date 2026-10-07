"use client";

import React, { useState } from "react";
import { Sparkles, Save, TrendingUp, Cpu, Rocket, Handshake, ShieldCheck, Layers, Award, CheckCircle2 } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Card from "@/components/ui/Card";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface PartnerHeroTabProps {
  pageCms: any;
  setPageCms: (data: any) => void;
}

export default function PartnerHeroTab({ pageCms, setPageCms }: PartnerHeroTabProps) {
  const [saving, setSaving] = useState(false);

  const hero = pageCms?.hero || {
    badge: "Strategic Partner Network",
    title: "Co-Create the Future with",
    titleHighlight: "Brain Bari AI Ecosystem",
    description: "Join forces with Brain Bari to deliver groundbreaking conversational AI, automated enterprise workflows, and high-performance bespoke software to organizations worldwide.",
  };

  const valueCards = pageCms?.valueCards || [
    {
      id: "val-1",
      icon: "TrendingUp",
      title: "Shared Growth & Revenue",
      description: "Unlock high-margin enterprise AI pipelines, recurring commission tiers, and collaborative co-selling channels.",
    },
    {
      id: "val-2",
      icon: "Cpu",
      title: "Cutting-Edge AI Integration",
      description: "Integrate Brain Bari's state-of-the-art LLM engines, autonomous agents, and high-speed API suites directly into client tech stacks.",
    },
    {
      id: "val-3",
      icon: "Rocket",
      title: "Early Access & Beta Toolsets",
      description: "Gain exclusive, zero-day access to upcoming generative AI models, private developer sandboxes, and dedicated engineering consultation.",
    },
  ];

  const showcase = pageCms?.showcase || {
    badge: "Active Ecosystem Network",
    title: "Our Strategic Partners & Collaborators",
    subtitle: "Leading universities, technology labs, and enterprise agency networks co-innovating with Brain Bari.",
  };

  const registration = pageCms?.registration || {
    badge: "Join Our Partner Network",
    title: "Accelerate Your Growth With Brain Bari AI",
    description: "Whether you are an enterprise agency, an independent software vendor, or a technology consulting firm, our partnership tracks offer competitive revenue shares, dedicated technical enablement, and co-marketing campaigns.",
    benefits: [
      "Lucrative revenue sharing & white-label deployment tiers",
      "Direct access to specialized LLM models & automated agents",
      "Co-branded case studies, PR, and lead distribution",
      "Priority 24/7 technical architect support & integration sandbox",
    ],
    formTitle: "Register for Partner Access",
    formSubtitle: "Submit your details and our Partner Ecosystem team will connect within 24 hours.",
  };

  const [benefitsText, setBenefitsText] = useState(
    Array.isArray(registration.benefits) ? registration.benefits.join("\n") : ""
  );

  const updateHeroField = (field: string, val: string) => {
    setPageCms({
      ...pageCms,
      hero: {
        ...hero,
        [field]: val,
      },
    });
  };

  const updateShowcaseField = (field: string, val: string) => {
    setPageCms({
      ...pageCms,
      showcase: {
        ...showcase,
        [field]: val,
      },
    });
  };

  const updateRegistrationField = (field: string, val: string) => {
    setPageCms({
      ...pageCms,
      registration: {
        ...registration,
        [field]: val,
      },
    });
  };

  const updateValueCard = (index: number, field: string, val: string) => {
    const updated = [...valueCards];
    updated[index] = { ...updated[index], [field]: val };
    setPageCms({
      ...pageCms,
      valueCards: updated,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedBenefits = benefitsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        hero,
        valueCards,
        showcase,
        registration: {
          ...registration,
          benefits: parsedBenefits,
        },
      };

      await adminApi.saveContent("partnersPage", payload);
      setPageCms(payload);
      toast.success("Partners page content saved to NeonDB!", {
        description: "Frontend /resources/partners page is updated live with your changes.",
      });
    } catch (err: any) {
      toast.error("Failed to save: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Partners Page Hero, Cards &amp; CTA Portal</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Edit all texts, headlines, value cards, partner showcase titles, and registration benefits displayed on the live frontend <code className="bg-purple-100/70 text-purple-900 px-1 py-0.5 rounded font-mono">/resources/partners</code> page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving to Database..." : "Save All Page Content"}</span>
        </button>
      </div>

      {/* 1. Hero Section Card */}
      <Card header={<h3 className="text-sm font-bold text-slate-900">1. Hero Header Information</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="Hero Badge Text">
            <input
              type="text"
              value={hero.badge || ""}
              onChange={(e) => updateHeroField("badge", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Strategic Partner Network"
            />
          </FormField>

          <FormField label="Hero Headline Main">
            <input
              type="text"
              value={hero.title || ""}
              onChange={(e) => updateHeroField("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Co-Create the Future with"
            />
          </FormField>

          <FormField label="Hero Headline Highlight (Gradient Text)">
            <input
              type="text"
              value={hero.titleHighlight || ""}
              onChange={(e) => updateHeroField("titleHighlight", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-[#a05fd3]"
              placeholder="Brain Bari AI Ecosystem"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Hero Description Paragraph">
              <textarea
                rows={3}
                value={hero.description || ""}
                onChange={(e) => updateHeroField("description", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none leading-relaxed"
                placeholder="Join forces with Brain Bari to deliver groundbreaking conversational AI..."
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* 2. 3 Value Pillars */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          2. Ecosystem Value Pillars (3 Cards)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {valueCards.map((card: any, idx: number) => (
            <Card
              key={card.id || idx}
              header={
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Card {idx + 1}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-medium">Icon:</span>
                    <select
                      value={card.icon || "TrendingUp"}
                      onChange={(e) => updateValueCard(idx, "icon", e.target.value)}
                      className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 cursor-pointer"
                    >
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Handshake">Handshake</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                <FormField label="Card Title">
                  <input
                    type="text"
                    value={card.title || ""}
                    onChange={(e) => updateValueCard(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                    placeholder="Shared Growth & Revenue"
                  />
                </FormField>

                <FormField label="Card Description">
                  <textarea
                    rows={3}
                    value={card.description || ""}
                    onChange={(e) => updateValueCard(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none leading-relaxed"
                    placeholder="Unlock high-margin enterprise AI pipelines..."
                  />
                </FormField>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Strategic Partners Showcase Section Header */}
      <Card header={<h3 className="text-sm font-bold text-slate-900">3. Partners Showcase Section (Grid Header)</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="Showcase Badge Text">
            <input
              type="text"
              value={showcase.badge || ""}
              onChange={(e) => updateShowcaseField("badge", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Active Ecosystem Network"
            />
          </FormField>

          <FormField label="Showcase Section Title">
            <input
              type="text"
              value={showcase.title || ""}
              onChange={(e) => updateShowcaseField("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              placeholder="Our Strategic Partners & Collaborators"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Showcase Subtitle Description">
              <input
                type="text"
                value={showcase.subtitle || ""}
                onChange={(e) => updateShowcaseField("subtitle", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="Leading universities, technology labs, and enterprise agency networks co-innovating with Brain Bari."
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* 4. Partner Registration & Benefits Section */}
      <Card header={<h3 className="text-sm font-bold text-slate-900">4. Partner Registration &amp; Benefits Portal (CTA Section)</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="Registration Badge Text">
            <input
              type="text"
              value={registration.badge || ""}
              onChange={(e) => updateRegistrationField("badge", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Join Our Partner Network"
            />
          </FormField>

          <FormField label="Registration Main Headline">
            <input
              type="text"
              value={registration.title || ""}
              onChange={(e) => updateRegistrationField("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              placeholder="Accelerate Your Growth With Brain Bari AI"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Registration Proposition Description">
              <textarea
                rows={2}
                value={registration.description || ""}
                onChange={(e) => updateRegistrationField("description", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none leading-relaxed"
                placeholder="Whether you are an enterprise agency, an independent software vendor..."
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField label="Key Partner Benefits (One item per line with checkmark)">
              <textarea
                rows={4}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs leading-relaxed"
                placeholder="Lucrative revenue sharing & white-label deployment tiers&#10;Direct access to specialized LLM models & automated agents&#10;Co-branded case studies, PR, and lead distribution&#10;Priority 24/7 technical architect support & integration sandbox"
              />
              <span className="block text-[11px] text-slate-400 mt-1">
                Each line entered here will display as a bullet point with a green checkmark on the live frontend.
              </span>
            </FormField>
          </div>

          <FormField label="Form Box Title">
            <input
              type="text"
              value={registration.formTitle || ""}
              onChange={(e) => updateRegistrationField("formTitle", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              placeholder="Register for Partner Access"
            />
          </FormField>

          <FormField label="Form Box Subtitle">
            <input
              type="text"
              value={registration.formSubtitle || ""}
              onChange={(e) => updateRegistrationField("formSubtitle", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              placeholder="Submit your details and our Partner Ecosystem team will connect within 24 hours."
            />
          </FormField>
        </div>
      </Card>

      <div className="flex justify-end pt-2 pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving to Database..." : "Save All Page Content"}</span>
        </button>
      </div>
    </div>
  );
}
