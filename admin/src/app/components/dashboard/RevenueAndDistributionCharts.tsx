"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface RevenueAndDistributionChartsProps {
  analytics: any;
  orders: any[];
  servicesCount: number;
}

export default function RevenueAndDistributionCharts({
  analytics,
  orders,
  servicesCount
}: RevenueAndDistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Monthly Revenue Growth ($)</h2>
            <p className="text-xs text-slate-500">Past 6 months billing and software contract delivery</p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            FY 2026
          </span>
        </div>

        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
          {Array.isArray(analytics?.monthlyChartData) && analytics.monthlyChartData.length > 0 ? (
            analytics.monthlyChartData.map((item: any, idx: number) => {
              const maxRev = Math.max(...analytics.monthlyChartData.map((m: any) => m.revenue || 0), 1000);
              const heightPercent = item.revenue > 0 ? Math.min(Math.round((item.revenue / maxRev) * 100), 100) : 4;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    ${((item.revenue || 0) / 1000).toFixed(1)}k
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-slate-900 to-indigo-700 group-hover:from-indigo-600 group-hover:to-cyan-400 transition-all duration-300 shadow-xs"
                  />
                  <span className="text-xs font-semibold text-slate-500 mt-1">
                    {item.month}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
              No revenue chart data recorded yet
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Total Orders: <strong className="text-slate-900 font-bold">{analytics?.overview?.totalOrders ?? orders.length}</strong></span>
          <span>Total Revenue: <strong className="text-slate-900 font-bold">${analytics?.overview?.totalRevenue ?? 0}</strong></span>
        </div>
      </div>

      {/* Service Category Share */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Revenue by Service</h2>
          <p className="text-xs text-slate-500">Distribution across active offerings</p>
        </div>

        <div className="space-y-4">
          {(analytics?.categoryDistribution && analytics.categoryDistribution.length > 0) ? (
            analytics.categoryDistribution.map((cat: any, i: number) => {
              const totalCount = analytics.categoryDistribution.reduce((acc: number, c: any) => acc + c.count, 0) || 1;
              const share = Math.round((cat.count / totalCount) * 100);
              const gradients = [
                "from-indigo-600 to-indigo-400",
                "from-cyan-600 to-cyan-400",
                "from-emerald-600 to-emerald-400",
                "from-amber-600 to-amber-400",
                "from-purple-600 to-purple-400"
              ];
              const grad = gradients[i % gradients.length];
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 capitalize">{cat.category.replace(/-/g, " ")}</span>
                    <span className="text-slate-900 font-bold">{share}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${share}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${grad}`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">No category orders placed yet</p>
          )}
        </div>

        <Link
          href="/services"
          className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-center flex items-center justify-center gap-1.5"
        >
          <span>Manage All Services ({servicesCount})</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
