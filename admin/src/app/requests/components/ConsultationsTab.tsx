"use client";

import React from "react";
import { Trash2, Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";

interface ConsultationsTabProps {
  currentDataset: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
  onAddConsultation?: () => void;
}

export default function ConsultationsTab({
  currentDataset,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onDelete,
  onAddConsultation
}: ConsultationsTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Consultation Sessions &amp; Strategy Bookings</h3>
          <p className="text-xs text-slate-500">Total: {totalCount} consultations booked</p>
        </div>
        {onAddConsultation && (
          <button
            type="button"
            onClick={onAddConsultation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <th className="py-3 px-5">Ref / Client</th>
              <th className="py-3 px-5">Consultation Topic</th>
              <th className="py-3 px-5">Date &amp; Time Slot</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentDataset.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No consultation bookings found.
                </td>
              </tr>
            ) : (
              currentDataset.map((cns: any) => (
                <tr key={cns.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-semibold text-slate-700">{cns.bookingRef}</div>
                    <div className="font-semibold text-slate-900">{cns.clientName}</div>
                    <div className="text-[11px] text-slate-400">{cns.company || cns.clientEmail}</div>
                  </td>
                  <td className="py-3.5 px-5 max-w-xs">
                    <div className="font-medium text-slate-900 line-clamp-1">{cns.topic}</div>
                    {cns.notes && <div className="text-[11px] text-slate-400 line-clamp-1">{cns.notes}</div>}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-mono text-slate-700 font-semibold">{cns.date}</div>
                    <div className="text-[11px] text-slate-400">{cns.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusBadge status={cns.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(cns)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(cns.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Booking"
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
