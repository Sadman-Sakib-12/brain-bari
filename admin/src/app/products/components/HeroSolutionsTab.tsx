"use client";

import React from "react";
import { Sparkles, Save, ShieldCheck } from "lucide-react";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";
import Card from "@/components/ui/Card";

interface HeroSolutionsTabProps {
  heroCards: any[];
  savingHeroCards: boolean;
  onSaveHeroCards: () => void;
  onUpdateHeroCard: (index: number, field: string, value: any) => void;
  whyChooseTitle?: string;
  setWhyChooseTitle?: (t: string) => void;
  whyChooseHighlight?: string;
  setWhyChooseHighlight?: (h: string) => void;
  whyChooseFeatures?: any[];
  setWhyChooseFeatures?: (f: any[]) => void;
}

export default function HeroSolutionsTab({
  heroCards,
  savingHeroCards,
  onSaveHeroCards,
  onUpdateHeroCard,
  whyChooseTitle = "Why Choose Brain Bari Products",
  setWhyChooseTitle,
  whyChooseHighlight = "for Your Enterprise",
  setWhyChooseHighlight,
  whyChooseFeatures = [],
  setWhyChooseFeatures,
}: HeroSolutionsTabProps) {
  const updateFeature = (index: number, field: string, val: string) => {
    if (!setWhyChooseFeatures) return;
    const copy = [...whyChooseFeatures];
    copy[index] = { ...copy[index], [field]: val };
    setWhyChooseFeatures(copy);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Hero Section Showcase (3 Solutions on /product)</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            These 3 cards are displayed prominently right under the headline <em>&ldquo;Intelligent Solutions for Smarter Businesses&rdquo;</em> at the top of the frontend Products Page (<code className="bg-blue-100/70 text-blue-900 px-1 py-0.5 rounded">/product</code>).
          </p>
        </div>
        <button
          type="button"
          onClick={onSaveHeroCards}
          disabled={savingHeroCards}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savingHeroCards ? "Saving to NeonDB..." : "Save Product CMS"}</span>
        </button>
      </div>

      {/* 3 Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {heroCards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Card {idx + 1}: {card.title}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {card.id}</span>
              </div>

              <ImageUpload
                label="Card Graphic"
                category="Products"
                value={card.image || ""}
                onChange={(url) => onUpdateHeroCard(idx, "image", url)}
                helpText="Product card visual image."
              />

              <FormField label="Card Title" required>
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => onUpdateHeroCard(idx, "title", e.target.value)}
                  placeholder="e.g. AI Chatbots"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-semibold"
                />
              </FormField>

              <FormField label="Short Description" required>
                <textarea
                  rows={2}
                  value={card.description || ""}
                  onChange={(e) => onUpdateHeroCard(idx, "description", e.target.value)}
                  placeholder="Short summary of this solution..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none"
                />
              </FormField>

              <FormField label="Bullet Features (one per line)">
                <textarea
                  rows={3}
                  value={(card.features || []).join("\n")}
                  onChange={(e) =>
                    onUpdateHeroCard(
                      idx,
                      "features",
                      e.target.value.split("\n").filter(Boolean)
                    )
                  }
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none"
                />
              </FormField>

              <FormField label="Learn More Destination URL">
                <input
                  type="text"
                  value={card.link || ""}
                  onChange={(e) => onUpdateHeroCard(idx, "link", e.target.value)}
                  placeholder="/services/ai-chatbot"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono"
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Section Manager */}
      {setWhyChooseTitle && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">&ldquo;Why Choose Brain Bari Products&rdquo; Section</h3>}>
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Section Headline">
                <input
                  type="text"
                  value={whyChooseTitle}
                  onChange={(e) => setWhyChooseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  placeholder="Why Choose Brain Bari Products"
                />
              </FormField>

              <FormField label="Headline Highlight (Gradient Text)">
                <input
                  type="text"
                  value={whyChooseHighlight}
                  onChange={(e) => setWhyChooseHighlight?.(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  placeholder="for Your Enterprise"
                />
              </FormField>
            </div>

            {whyChooseFeatures && whyChooseFeatures.length > 0 && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4 Value Pillar Feature Cards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyChooseFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">Pillar {fIdx + 1}</span>
                        <span className="text-[10px] font-mono text-slate-400">{feat.icon}</span>
                      </div>
                      <FormField label="Title">
                        <input
                          type="text"
                          value={feat.title || ""}
                          onChange={(e) => updateFeature(fIdx, "title", e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </FormField>
                      <FormField label="Description">
                        <textarea
                          rows={2}
                          value={feat.desc || ""}
                          onChange={(e) => updateFeature(fIdx, "desc", e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg resize-none"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSaveHeroCards}
          disabled={savingHeroCards}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savingHeroCards ? "Saving..." : "Save Product CMS Changes"}</span>
        </button>
      </div>
    </div>
  );
}
