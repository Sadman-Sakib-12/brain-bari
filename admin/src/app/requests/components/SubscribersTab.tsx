"use client";

import React from "react";
import { Trash2, Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";

interface SubscribersTabProps {
  currentDataset: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onDelete: (id: string) => void;
  onAddSubscriber?: () => void;
}

export default function SubscribersTab({
  currentDataset,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDelete,
  onAddSubscriber
}: SubscribersTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Newsletter Subscribers List</h3>
          <p className="text-xs text-slate-500">Total: {totalCount} active subscribers</p>
        </div>
        {onAddSubscriber && (
          <button
            type="button"
            onClick={onAddSubscriber}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <th className="py-3 px-5">Subscriber Email</th>
              <th className="py-3 px-5">Subscription Source</th>
              <th className="py-3 px-5">Joined Date</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentDataset.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              currentDataset.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 font-mono">
                    {sub.email}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    {sub.source || "Homepage Footer"}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 font-mono">
                    {sub.subscribedDate || "2026-09-18"}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onDelete(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Unsubscribe / Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
