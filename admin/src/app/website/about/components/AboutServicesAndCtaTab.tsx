"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface AboutServicesAndCtaTabProps {
  type: "services" | "cta";
  about: any;
  setAbout: (val: any) => void;
}

export default function AboutServicesAndCtaTab({
  type,
  about,
  setAbout
}: AboutServicesAndCtaTabProps) {
  if (type === "services") {
    return (
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-2xs cursor-pointer"
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
    );
  }

  return (
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
  );
}
