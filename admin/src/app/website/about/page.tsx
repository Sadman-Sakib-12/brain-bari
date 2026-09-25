"use client";

import React, { useState, useEffect } from "react";
import {
  Info,
  Save,
  RotateCcw,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Target,
  Code2,
  Megaphone
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialAbout from "@/data/about.json";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type AboutTab = "content" | "mission" | "journey" | "services" | "cta";

export default function WebsiteAboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>("content");
  const [about, setAbout] = useState<any>(initialAbout);
  const [saved, setSaved] = useState(false);

  // Milestone inline editor
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);

  const loadData = () => {
    try {
      const stored = adminStore.getAbout();
      if (stored && stored.hero) {
        setAbout(stored);
      }
    } catch {
      setAbout(initialAbout);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  const handleSave = () => {
    adminStore.setAbout(about);
    setSaved(true);
    toast.success("About page content saved!", {
      description: "Synchronized with frontend /about page."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset all About content back to default?")) {
      setAbout(initialAbout);
      adminStore.setAbout(initialAbout);
      toast.info("Reset to default content.");
    }
  };

  // Add work area
  const [newWorkArea, setNewWorkArea] = useState("");
  const addWorkArea = () => {
    if (!newWorkArea.trim()) return;
    setAbout({
      ...about,
      hero: {
        ...about.hero,
        workAreas: [...(about.hero?.workAreas || []), newWorkArea.trim()]
      }
    });
    setNewWorkArea("");
  };

  const removeWorkArea = (idx: number) => {
    const updated = [...(about.hero?.workAreas || [])];
    updated.splice(idx, 1);
    setAbout({
      ...about,
      hero: {
        ...about.hero,
        workAreas: updated
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Website CMS / About Section"
        title="About Page Manager"
        description="Manage company vision, mission statement, work areas, and historical milestones displayed on the public /about page."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "content", label: "About Content", icon: Info },
            { id: "mission", label: "Mission & Vision", icon: Target },
            { id: "journey", label: "Milestones & Journey", icon: Calendar },
            { id: "services", label: "Development Services", icon: Code2 },
            { id: "cta", label: "About CTA Banner", icon: Megaphone }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AboutTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: ABOUT CONTENT */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Hero &amp; Company Introduction</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Main Headline (H1)" required>
                <input
                  type="text"
                  value={about.hero?.headline || ""}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, headline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Intro Lead Paragraph">
                <textarea
                  rows={2}
                  value={about.hero?.intro || ""}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, intro: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Sub-Headline">
                <input
                  type="text"
                  value={about.hero?.subHeadline || ""}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, subHeadline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Delivering Intelligent Solutions Across Industries"
                />
              </FormField>

              <FormField label="Full Company Description">
                <textarea
                  rows={4}
                  value={about.hero?.body || ""}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, body: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="Closing Summary Text">
                <textarea
                  rows={2}
                  value={about.hero?.closingText || ""}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, closingText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="We work with startups, SMEs, and enterprises across multiple industries..."
                />
              </FormField>
            </div>
          </Card>

          {/* Work Areas */}
          <Card header={<h3 className="text-sm font-bold text-slate-900">Our Work Areas</h3>}>
            <div className="space-y-4 text-xs">
              <FormField label="Work Areas Section Title">
                <input
                  type="text"
                  value={about.hero?.workAreasTitle || "Our Work Areas Include:"}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      hero: { ...about.hero, workAreasTitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  placeholder="Our Work Areas Include:"
                />
              </FormField>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWorkArea}
                  onChange={(e) => setNewWorkArea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWorkArea()}
                  placeholder="e.g. Multilingual LLM Fine-Tuning"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={addWorkArea}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Add Area
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {about.hero?.workAreas?.map((area: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                  >
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => removeWorkArea(idx)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: MISSION & VISION */}
      {activeTab === "mission" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<h3 className="text-sm font-bold text-slate-900">Corporate Mission Statement</h3>}>
            <div className="space-y-3 text-xs">
              <FormField label="Mission Headline">
                <input
                  type="text"
                  value={about.mission?.headline || "Democratizing Enterprise AI Across Emerging Markets"}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      mission: { ...about.mission, headline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>
              <FormField label="Mission Description">
                <textarea
                  rows={4}
                  value={
                    about.mission?.description ||
                    "To bridge the divide between cutting-edge conversational artificial intelligence and daily business operations, delivering quantifiable productivity growth."
                  }
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      mission: { ...about.mission, description: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>
            </div>
          </Card>

          <Card header={<h3 className="text-sm font-bold text-slate-900">Future Vision &amp; Strategy</h3>}>
            <div className="space-y-3 text-xs">
              <FormField label="Vision Statement">
                <input
                  type="text"
                  value={about.vision?.headline || "Precision AI Engineering Built for Real ROI"}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      vision: { ...about.vision, headline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>
              <FormField label="Vision Details">
                <textarea
                  rows={4}
                  value={
                    about.vision?.description ||
                    "Becoming Bangladesh's foremost enterprise AI solutions powerhouse by pioneering intelligent autonomous agents, multi-tenant SaaS, and 3D web technologies."
                  }
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      vision: { ...about.vision, description: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: STATISTICS & JOURNEY */}
      {activeTab === "journey" && (
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Company Milestones &amp; Timeline</h3>
                <p className="text-xs text-slate-500">Historical achievements displayed on the About page</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingMilestone({
                    id: `m-${Date.now()}`,
                    title: "",
                    subtitle: "2026",
                    desc: "",
                    tag: "Milestone",
                    alignRight: false
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>
          }
        >
          {/* Inline Milestone Editor Form (No Modal) */}
          {editingMilestone && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-900">
                  {about.journey?.milestones?.some((x: any) => x.id === editingMilestone.id && x.title)
                    ? "Edit Milestone"
                    : "Add New Milestone"}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Title" required>
                  <input
                    type="text"
                    value={editingMilestone?.title || ""}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                    placeholder="e.g. AI Product & Solution Development"
                  />
                </FormField>

                <FormField label="Subtitle / Year">
                  <input
                    type="text"
                    value={editingMilestone?.subtitle || ""}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                    placeholder="e.g. Company Establishment · 2024"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Tag / Badge">
                  <input
                    type="text"
                    value={editingMilestone?.tag || ""}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, tag: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-xl"
                    placeholder="e.g. Growth"
                  />
                </FormField>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="milestone-align"
                    checked={!!editingMilestone?.alignRight}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, alignRight: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                  />
                  <label htmlFor="milestone-align" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Align to right side of timeline (<code>alignRight</code>)
                  </label>
                </div>
              </div>

              <FormField label="Description">
                <textarea
                  rows={2}
                  value={editingMilestone?.desc || ""}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, desc: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl"
                  placeholder="Detail the key achievement..."
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const milestones = [...(about.journey?.milestones || [])];
                    const existingIdx = milestones.findIndex((x) => x.id === editingMilestone.id);
                    if (existingIdx >= 0) {
                      milestones[existingIdx] = editingMilestone;
                    } else {
                      milestones.push(editingMilestone);
                    }
                    setAbout({ ...about, journey: { ...about.journey, milestones } });
                    setEditingMilestone(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-200 text-xs">
            {about.journey?.milestones?.map((m: any, idx: number) => (
              <div key={m.id || idx} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-800 shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{m.title}</span>
                      <span className="text-[11px] text-slate-500 font-medium">({m.subtitle})</span>
                      {m.tag && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {m.tag}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                        m.alignRight 
                          ? "bg-purple-50 text-purple-700 border-purple-200" 
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {m.alignRight ? "Timeline Right" : "Timeline Left"}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMilestone({
                        alignRight: false,
                        ...m
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = about.journey.milestones.filter((item: any) => item.id !== m.id);
                      setAbout({ ...about, journey: { ...about.journey, milestones: updated } });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: DEVELOPMENT SERVICES */}
      {activeTab === "services" && (
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Full Cycle Development Services</h3>
                <p className="text-xs text-slate-500">Manage development lifecycle offerings displayed on the About page</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(about.services?.items || [])];
                  items.push({
                    id: `s-${Date.now()}`,
                    title: "NEW SERVICE AREA",
                    desc: "Service area description outlining methodologies and business advantages."
                  });
                  setAbout({
                    ...about,
                    services: {
                      ...(about.services || {}),
                      items
                    }
                  });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <FormField label="Services Section Heading">
              <input
                type="text"
                value={about.services?.heading || "Full Cycle Development Services"}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    services: { ...(about.services || {}), heading: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              />
            </FormField>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs">Services List ({about.services?.items?.length || 0}):</h4>
              {about.services?.items?.map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const items = about.services.items.filter((_: any, i: number) => i !== idx);
                        setAbout({
                          ...about,
                          services: { ...(about.services || {}), items }
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <FormField label="Service Title">
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => {
                        const items = [...(about.services?.items || [])];
                        items[idx].title = e.target.value;
                        setAbout({
                          ...about,
                          services: { ...(about.services || {}), items }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </FormField>

                  <FormField label="Service Description">
                    <textarea
                      rows={2}
                      value={item.desc || ""}
                      onChange={(e) => {
                        const items = [...(about.services?.items || [])];
                        items[idx].desc = e.target.value;
                        setAbout({
                          ...about,
                          services: { ...(about.services || {}), items }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </FormField>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: ABOUT CTA BANNER */}
      {activeTab === "cta" && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">About Page Conversion CTA Banner</h3>}>
          <div className="space-y-4 text-xs">
            <FormField label="CTA Heading" required>
              <input
                type="text"
                value={about.cta?.heading || "Ready to transfer your Business"}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    cta: { ...(about.cta || {}), heading: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="CTA Description">
              <textarea
                rows={3}
                value={
                  about.cta?.desc ||
                  "Developing and maintaining web applications using React.js, Next.js, and other related technologies."
                }
                onChange={(e) =>
                  setAbout({
                    ...about,
                    cta: { ...(about.cta || {}), desc: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="CTA Button Text">
                <input
                  type="text"
                  value={about.cta?.buttonText || "Schedule A Consultation"}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      cta: { ...(about.cta || {}), buttonText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </FormField>

              <FormField label="CTA Destination Link">
                <input
                  type="text"
                  value={about.cta?.buttonLink || "/schedule/"}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      cta: { ...(about.cta || {}), buttonLink: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </FormField>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
