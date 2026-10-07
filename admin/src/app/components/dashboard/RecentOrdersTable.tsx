"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface RecentOrdersTableProps {
  orders: any[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Client Orders &amp; Quotes</h2>
          <p className="text-xs text-slate-500">Incoming service requests requiring admin review and milestone quotes</p>
        </div>

        <Link
          href="/requests?tab=quotes"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>View All ({orders.length})</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <th className="py-3 px-5">Order Ref</th>
              <th className="py-3 px-5">Client &amp; Organization</th>
              <th className="py-3 px-5">Requested Solution</th>
              <th className="py-3 px-5">Budget</th>
              <th className="py-3 px-5">Quote Price</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No client orders placed yet.
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-semibold text-slate-800">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                      {order.orderNumber || "ORD-001"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {(order.clientName || "C").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{order.clientName}</div>
                        <div className="text-[11px] text-slate-400">{order.company || "Independent Client"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-slate-800">{order.serviceTitle}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-500">
                    {order.budget}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">
                    ${order.quotedPrice || "TBD"}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href="/requests?tab=quotes"
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 transition-colors"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
