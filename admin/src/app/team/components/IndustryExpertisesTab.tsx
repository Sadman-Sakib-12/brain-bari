"use client";

import React from "react";
import { Award, Plus, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";

interface IndustryExpertisesTabProps {
  expertises: any[];
  onAddExp: () => void;
  onEditExp: (idx: number) => void;
  onDeleteExp: (idx: number) => void;
  onMoveExp: (idx: number, direction: "up" | "down") => void;
}

export default function IndustryExpertisesTab({
  expertises,
  onAddExp,
  onEditExp,
  onDeleteExp,
  onMoveExp
}: IndustryExpertisesTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Industry Capability Cards ({expertises.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Frontend Section: Resources → Team Showcase Page (/resources/team) Industry Expertise Badges.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddExp}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Capability Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {expertises.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
          >
            {/* Visual Preview Box */}
            <div className="py-2 flex items-center justify-center">
              <div
                style={{ backgroundColor: item.bg || "#faf3e0" }}
                className="flex flex-col items-center justify-center text-center w-[145px] h-[95px] shadow-xs border border-gray-100/60 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] transition-transform hover:scale-105"
              >
                <div className="mb-2 text-gray-700">
                  <svg
                    className="w-7 h-7 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-gray-700 px-2 leading-tight">
                  {item.title}
                </span>
              </div>
            </div>

            {/* Card Meta & Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-md border border-slate-300 shrink-0"
                  style={{ backgroundColor: item.bg }}
                />
                <code className="text-[10px] text-slate-500 font-mono">{item.bg}</code>
              </div>

              <div className="flex items-center gap-1">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  onClick={() => onMoveExp(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Move card earlier"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveExp(idx, "down")}
                  disabled={idx === expertises.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Move card later"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onEditExp(idx)}
                  className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer ml-1"
                  title="Edit Card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteExp(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
