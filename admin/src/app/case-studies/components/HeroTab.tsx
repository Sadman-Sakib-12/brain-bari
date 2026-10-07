"use client";

import React from "react";
import { Save } from "lucide-react";
import { CaseStudiesHero } from "../types";

interface HeroTabProps {
  hero: CaseStudiesHero;
  onChange: (updated: CaseStudiesHero) => void;
  onSave: () => void;
}

export default function HeroTab({ hero, onChange, onSave }: HeroTabProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Hero Section Content</h2>
          <p className="text-xs text-slate-500">
            Customize the headline, gradient highlight, description, and action button on the case studies page.
          </p>
        </div>

        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => onChange({ ...hero, badge: e.target.value })}
              placeholder="Solutions & Capabilities"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Main Title
              </label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => onChange({ ...hero, title: e.target.value })}
                placeholder="What product do you want to"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Title Highlight (Gradient Word)
              </label>
              <input
                type="text"
                value={hero.titleHighlight}
                onChange={(e) => onChange({ ...hero, titleHighlight: e.target.value })}
                placeholder="build?"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => onChange({ ...hero, description: e.target.value })}
              placeholder="Delivering value with tailored software solutions..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={hero.buttonText}
                onChange={(e) => onChange({ ...hero, buttonText: e.target.value })}
                placeholder="Start Your Solution"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={hero.buttonLink}
                onChange={(e) => onChange({ ...hero, buttonLink: e.target.value })}
                placeholder="/order"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Hero Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-[#ebe8fd] border border-purple-200/80 rounded-2xl p-6 flex flex-col justify-between text-center shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2.5 py-1 rounded-full inline-block mb-4">
            {hero.badge || "Solutions & Capabilities"}
          </span>

          <h3 className="text-xl font-black text-gray-950 tracking-tight leading-snug mb-2">
            {hero.title || "What product do you want to"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
              {hero.titleHighlight || "build?"}
            </span>
          </h3>

          <p className="text-xs text-gray-700 leading-relaxed mb-6">
            {hero.description}
          </p>
        </div>

        <div>
          <div className="inline-block px-6 py-2.5 bg-[#602b0c] text-white rounded-full font-bold text-xs shadow-xs">
            {hero.buttonText || "Start Your Solution"}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Live Preview matching frontend</p>
        </div>
      </div>
    </section>
  );
}
