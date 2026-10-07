"use client";

import React from "react";
import { Sparkles, Save, Tag, Plus, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface HeroSectionTabProps {
  settings: any;
  setSettings: (val: any) => void;
  onSave: () => void;
}

export default function HeroSectionTab({
  settings,
  setSettings,
  onSave
}: HeroSectionTabProps) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hero Section Configuration</h3>
              <p className="text-xs text-slate-500">
                Primary H1 headline, robot illustration, search bar placeholder, filter pills, and AI chat bubbles.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hero</span>
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Directly synchronized with frontend hero banner.</span>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Headline Prefix" required hint="Main white headline text before highlight">
            <input
              type="text"
              value={settings.hero?.headline || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, headline: e.target.value }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
              placeholder="Powering Ideas with"
            />
          </FormField>

          <FormField label="Headline Gradient Words" required hint="Words styled with high-tech cyan/blue gradient">
            <input
              type="text"
              value={settings.hero?.headlineGradient || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, headlineGradient: e.target.value }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
              placeholder="AI & Software"
            />
          </FormField>
        </div>

        <FormField label="Subheadline / Tagline Description">
          <textarea
            rows={3}
            value={settings.hero?.subheadline || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                hero: { ...settings.hero, subheadline: e.target.value }
              })
            }
            className="w-full px-3 py-2 border rounded-xl"
            placeholder="We build cutting-edge conversational AI chatbots..."
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Primary CTA Button Text">
            <input
              type="text"
              value={settings.hero?.ctaText || "Start Your Project"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, ctaText: e.target.value }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
            />
          </FormField>

          <FormField label="Top Announcement Badge">
            <input
              type="text"
              value={settings.hero?.badge || "✨ Next-Gen AI & Web Agency"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, badge: e.target.value }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Hero Search Bar Placeholder">
            <input
              type="text"
              value={settings.hero?.searchPlaceholder || "What do you want to build?"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, searchPlaceholder: e.target.value }
                })
              }
              className="w-full px-3 py-2 border rounded-xl"
              placeholder="What do you want to build?"
            />
          </FormField>

          <ImageUpload
            label="Robot / Hero Graphic"
            category="Hero & Banners"
            value={settings.hero?.robotImage || "https://res.cloudinary.com/lndolcud/image/upload/v1791406762/brain-bari/hero_robot.jpg"}
            onChange={(url) =>
              setSettings({
                ...settings,
                hero: { ...settings.hero, robotImage: url },
              })
            }
            helpText="Uploaded and optimized for instant loading on frontend."
          />
        </div>

        {/* Filter Pills Repeater */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Search Filter Pills (Category Badges)</h4>
              <p className="text-[11px] text-slate-500">Quick recommendation tags displayed beneath the search input</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const currentPills = Array.isArray(settings.hero?.filterPills)
                  ? [...settings.hero.filterPills]
                  : ["AI Chatbot", "Custom AI Assistant", "AI SaaS", "AI & 3D Web Apps"];
                currentPills.push("New AI Filter");
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, filterPills: currentPills }
                });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {(Array.isArray(settings.hero?.filterPills)
              ? settings.hero.filterPills
              : ["AI Chatbot", "Custom AI Assistant", "AI SaaS", "AI & 3D Web Apps"]
            ).map((pill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
                <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={pill}
                  onChange={(e) => {
                    const currentPills = Array.isArray(settings.hero?.filterPills)
                      ? [...settings.hero.filterPills]
                      : ["AI Chatbot", "Custom AI Assistant", "AI SaaS", "AI & 3D Web Apps"];
                    currentPills[idx] = e.target.value;
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, filterPills: currentPills }
                    });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentPills = Array.isArray(settings.hero?.filterPills)
                      ? [...settings.hero.filterPills]
                      : ["AI Chatbot", "Custom AI Assistant", "AI SaaS", "AI & 3D Web Apps"];
                    currentPills.splice(idx, 1);
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, filterPills: currentPills }
                    });
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Speech Bubbles */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div>
            <h4 className="font-bold text-slate-900 text-xs">AI Chat Bubbles on Hero Graphic</h4>
            <p className="text-[11px] text-slate-500">Floating dialogue bubbles shown next to the robot illustration</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="AI Robot Dialogue Bubble 1">
              <input
                type="text"
                value={settings.hero?.speechBubble1 ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, speechBubble1: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border rounded-xl"
                placeholder="Hi! How can AI scale my business today?"
              />
            </FormField>

            <FormField label="Client Dialogue Bubble 2">
              <input
                type="text"
                value={settings.hero?.speechBubble2 ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, speechBubble2: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border rounded-xl"
                placeholder="We design & ship custom AI agents in 48 hours."
              />
            </FormField>
          </div>
        </div>
      </div>
    </Card>
  );
}
