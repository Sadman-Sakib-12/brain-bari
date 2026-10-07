"use client";

import React from "react";
import { TrendingUp, ShoppingBag, CalendarCheck, Layers, CheckCircle2 } from "lucide-react";

interface KpiMetricsGridProps {
  totalRevenue: number;
  ordersCount: number;
  pendingOrdersCount: number;
  consultationsCount: number;
  pendingConsultationsCount: number;
  servicesCount: number;
}

export default function KpiMetricsGrid({
  totalRevenue,
  ordersCount,
  pendingOrdersCount,
  consultationsCount,
  pendingConsultationsCount,
  servicesCount
}: KpiMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ${totalRevenue.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-2.5">
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+24.8%</span>
          <span className="text-slate-400 font-normal">project delivery volume</span>
        </div>
      </div>

      {/* Client Orders */}
      <div className="bg-white border border-slate-200/90 hover:border-amber-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Client Orders &amp; Quotes
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {ordersCount}
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {pendingOrdersCount} Pending Review
          </span>
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Consultation Bookings
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {consultationsCount}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2.5">
          <span className="font-semibold text-indigo-600 px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">{pendingConsultationsCount} pending</span>
          <span>calendar syncs</span>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-white border border-slate-200/90 hover:border-purple-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            AI Services Catalog
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {servicesCount}
        </div>
        <div className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Active in Client Showcase</span>
        </div>
      </div>
    </div>
  );
}
