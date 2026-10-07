"use client";

import React from "react";
import { Eye, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";

interface ContactMessagesTabProps {
  currentDataset: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function ContactMessagesTab({
  currentDataset,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onDelete
}: ContactMessagesTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <th className="py-3 px-5">Sender</th>
              <th className="py-3 px-5">Subject / Inquiry</th>
              <th className="py-3 px-5">Service Category</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentDataset.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No contact inquiries match your filters.
                </td>
              </tr>
            ) : (
              currentDataset.map((msg: any) => (
                <tr key={msg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900">{msg.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>{msg.email}</span>
                      {msg.phone && <span>· {msg.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 max-w-xs">
                    <div className="font-semibold text-slate-800 line-clamp-1">{msg.subject}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{msg.message}</div>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      {msg.serviceType || "AI Inquiry"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 font-mono whitespace-nowrap">
                    {msg.date?.split("T")[0] || "2026-09-18"}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusBadge status={msg.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(msg)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                        title="View Full Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(msg.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
