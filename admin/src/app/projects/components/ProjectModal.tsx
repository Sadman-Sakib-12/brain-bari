"use client";

import React from "react";
import { Tag, CheckCircle2, Trash2, Quote } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: any | null;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  client: string;
  setClient: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  timeline: string;
  setTimeline: (v: string) => void;
  statusColor: string;
  setStatusColor: (v: string) => void;
  shortDesc: string;
  setShortDesc: (v: string) => void;
  overview: string;
  setOverview: (v: string) => void;
  metrics: string;
  setMetrics: (v: string) => void;
  challenge: string;
  setChallenge: (v: string) => void;
  solution: string;
  setSolution: (v: string) => void;
  results: string;
  setResults: (v: string) => void;
  image: string;
  setImage: (v: string) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  liveUrl: string;
  setLiveUrl: (v: string) => void;
  techStack: string[];
  setTechStack: (v: string[]) => void;
  techInput: string;
  setTechInput: (v: string) => void;
  keyFeatures: string[];
  setKeyFeatures: (v: string[]) => void;
  featureInput: string;
  setFeatureInput: (v: string) => void;
  testimonial: { quote: string; author: string; role: string; company?: string };
  setTestimonial: (v: { quote: string; author: string; role: string; company?: string }) => void;
  onSave: () => void;
}

export default function ProjectModal({
  isOpen,
  onClose,
  editingProject,
  title,
  setTitle,
  slug,
  setSlug,
  category,
  setCategory,
  client,
  setClient,
  year,
  setYear,
  timeline,
  setTimeline,
  statusColor,
  setStatusColor,
  shortDesc,
  setShortDesc,
  overview,
  setOverview,
  metrics,
  setMetrics,
  challenge,
  setChallenge,
  solution,
  setSolution,
  results,
  setResults,
  image,
  setImage,
  isFeatured,
  setIsFeatured,
  liveUrl,
  setLiveUrl,
  techStack,
  setTechStack,
  techInput,
  setTechInput,
  keyFeatures,
  setKeyFeatures,
  featureInput,
  setFeatureInput,
  testimonial,
  setTestimonial,
  onSave
}: ProjectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? "Edit Project Details" : "Add New Project"}
      subtitle="Manage client name, key performance metrics, and case study narrative."
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer"
          >
            {editingProject ? "Save Changes" : "Create Project"}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Project Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TaxBot AI Platform"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Slug (URL identifier)">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="taxbot-ai-platform"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Client / Partner">
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="CarePoint Hospital"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="AI & Automation">AI &amp; Automation</option>
              <option value="SaaS Platform">SaaS Platform</option>
              <option value="Web Applications">Web Applications</option>
              <option value="Enterprise Systems">Enterprise Systems</option>
            </select>
          </FormField>

          <FormField label="Year">
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <FormField label="Short Card Summary (shortDesc)" required>
          <input
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="e.g. Comprehensive enterprise automation system built with Brain Bari AI technology."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Detailed Case Study Overview">
          <textarea
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Detailed description of the problem space, client scale, and technical scope..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Project Timeline / Turnaround">
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 4 Weeks (Concept to Deployment)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Status Badge Color">
            <select
              value={statusColor}
              onChange={(e) => setStatusColor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
            >
              <option value="emerald">Emerald (Active / Live Platform)</option>
              <option value="amber">Amber (AI Agent Active)</option>
              <option value="cyan">Cyan (Market Sync Live)</option>
              <option value="purple">Purple (Enterprise Deployment)</option>
              <option value="blue">Blue (Production Beta)</option>
            </select>
          </FormField>
        </div>

        <FormField label="Key Result / Metric Highlight">
          <input
            type="text"
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            placeholder="e.g. 75% Faster Resolution & 10k Monthly Queries"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-emerald-700"
          />
        </FormField>

        <FormField label="Problem / Challenge">
          <textarea
            rows={2}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="What obstacle did the client face?"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Brain Bari Engineered Solution">
          <textarea
            rows={2}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="How did our AI team resolve it?"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Measurable Proven Results">
          <textarea
            rows={2}
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Specific quantifiable business outcome..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        {/* Tech Stack Repeater */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>Technology Stack ({techStack.length})</span>
            </h4>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => setTechStack(techStack.filter((_, i) => i !== tIdx))}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && techInput.trim()) {
                  e.preventDefault();
                  if (!techStack.includes(techInput.trim())) {
                    setTechStack([...techStack, techInput.trim()]);
                  }
                  setTechInput("");
                }
              }}
              placeholder="Type technology (e.g. Next.js, Python FastAPI, PostgreSQL) and press Add"
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (techInput.trim() && !techStack.includes(techInput.trim())) {
                  setTechStack([...techStack, techInput.trim()]);
                  setTechInput("");
                }
              }}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
            >
              Add Tech
            </button>
          </div>
        </div>

        {/* Key Deliverables / Features Repeater */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Deliverables &amp; Technical Capabilities ({keyFeatures.length})</span>
            </h4>
          </div>

          <div className="space-y-1.5">
            {keyFeatures.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => {
                    const updated = [...keyFeatures];
                    updated[fIdx] = e.target.value;
                    setKeyFeatures(updated);
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => setKeyFeatures(keyFeatures.filter((_, i) => i !== fIdx))}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && featureInput.trim()) {
                  e.preventDefault();
                  setKeyFeatures([...keyFeatures, featureInput.trim()]);
                  setFeatureInput("");
                }
              }}
              placeholder="e.g. Automated PDF Processing & Abstract Evaluation Engine"
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (featureInput.trim()) {
                  setKeyFeatures([...keyFeatures, featureInput.trim()]);
                  setFeatureInput("");
                }
              }}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
            >
              Add Feature
            </button>
          </div>
        </div>

        {/* Client Testimonial Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-purple-600" />
            <span>Client Testimonial (Optional)</span>
          </h4>
          <FormField label="Client Quote">
            <textarea
              rows={2}
              value={testimonial.quote}
              onChange={(e) => setTestimonial({ ...testimonial, quote: e.target.value })}
              placeholder="What did the client say about Brain Bari's delivery?"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FormField label="Author Name">
              <input
                type="text"
                value={testimonial.author}
                onChange={(e) => setTestimonial({ ...testimonial, author: e.target.value })}
                placeholder="Dr. Sarah Johnson"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </FormField>
            <FormField label="Author Role">
              <input
                type="text"
                value={testimonial.role}
                onChange={(e) => setTestimonial({ ...testimonial, role: e.target.value })}
                placeholder="Program Director"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </FormField>
            <FormField label="Company Name">
              <input
                type="text"
                value={testimonial.company || ""}
                onChange={(e) => setTestimonial({ ...testimonial, company: e.target.value })}
                placeholder="Global Bioethics Forum"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload
            label="Thumbnail Graphic"
            category="Projects"
            value={image}
            onChange={setImage}
            helpText="Project showcase image."
            compact={true}
          />

          <FormField label="Live Production URL">
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px] font-mono"
            />
          </FormField>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isFeaturedProj"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="isFeaturedProj" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Feature this project on the homepage showcase
          </label>
        </div>
      </div>
    </Modal>
  );
}
