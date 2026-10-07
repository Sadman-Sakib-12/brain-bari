"use client";

import React, { useState } from "react";
import { Save, Plus, Trash2, Building2 } from "lucide-react";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface ClientLogosTabProps {
  clientLogos: any[];
  setClientLogos: (l: any[]) => void;
}

export default function ClientLogosTab({ clientLogos, setClientLogos }: ClientLogosTabProps) {
  const [newLogoName, setNewLogoName] = useState("");
  const [newLogoSrc, setNewLogoSrc] = useState("");

  const handleSave = () => {
    adminStore.setClientLogos(clientLogos);
    adminApi.saveContent("clientLogos", clientLogos);
    toast.success("Client logos saved to database!");
  };

  const handleAdd = () => {
    if (!newLogoName.trim() || !newLogoSrc.trim()) {
      toast.error("Please enter client name and upload or select a logo");
      return;
    }
    setClientLogos([...clientLogos, { name: newLogoName.trim(), src: newLogoSrc.trim() }]);
    setNewLogoName("");
    setNewLogoSrc("");
    toast.success("Logo added to list. Click 'Save Logos' to persist.");
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Client Partner Showcase Logos
            </h3>
            <p className="text-xs text-slate-500">Frontend Section: Homepage &amp; Work Pages → Client / Partner Logos Marquee Section</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Logos</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {clientLogos.map((logo, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 shrink-0">
                  <img src={logo.src} alt={logo.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{logo.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{logo.src}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClientLogos(clientLogos.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-900 text-xs">Add New Client Partner Logo</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newLogoName}
              onChange={(e) => setNewLogoName(e.target.value)}
              placeholder="Client Name (e.g. FAME Delivered)"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl"
            />
            <ImageUpload
              label="Client Logo Image"
              category="Client Logos"
              value={newLogoSrc}
              onChange={setNewLogoSrc}
              helpText="High-resolution company logo (transparent PNG/SVG recommended)."
              compact={true}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client Logo</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
