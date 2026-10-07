"use client";

import React from "react";
import { Trash2, Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";

interface QuotesOrdersTabProps {
  currentDataset: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onReview: (item: any) => void;
  onDelete: (id: string) => void;
  onAddOrder?: () => void;
}

export default function QuotesOrdersTab({
  currentDataset,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onReview,
  onDelete,
  onAddOrder
}: QuotesOrdersTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Client Orders &amp; Enterprise Quotes</h3>
          <p className="text-xs text-slate-500">Total: {totalCount} requests recorded</p>
        </div>
        {onAddOrder && (
          <button
            type="button"
            onClick={onAddOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Manual Quote</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <th className="py-3 px-5">Ref / Client</th>
              <th className="py-3 px-5">Requested Service</th>
              <th className="py-3 px-5">Budget Range</th>
              <th className="py-3 px-5">Quoted Price</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentDataset.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No project quotes found.
                </td>
              </tr>
            ) : (
              currentDataset.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-semibold text-slate-800">{order.orderNumber}</div>
                    <div className="font-semibold text-slate-900">{order.clientName}</div>
                    <div className="text-[11px] text-slate-400">{order.company}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-slate-900">{order.serviceTitle}</div>
                    <div className="text-[11px] text-slate-400">{order.timeline || "2 Weeks"}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-600">
                    {order.budget}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                    ${order.quotedPrice || 0}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onReview(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                      >
                        Review &amp; Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(order.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Quote"
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
