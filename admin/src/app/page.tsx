"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Activity } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import Card from "@/components/ui/Card";

import WelcomeBanner from "./components/dashboard/WelcomeBanner";
import SystemConnectivityBar from "./components/dashboard/SystemConnectivityBar";
import QuickOperationsHub from "./components/dashboard/QuickOperationsHub";
import KpiMetricsGrid from "./components/dashboard/KpiMetricsGrid";
import RevenueAndDistributionCharts from "./components/dashboard/RevenueAndDistributionCharts";
import RecentOrdersTable from "./components/dashboard/RecentOrdersTable";

function DashboardContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const loadData = () => {
    adminApi.getAnalytics().then((res) => {
      if (res) setAnalytics(res);
    }).catch(() => {});

    adminApi.getAllOrders().then((backendOrders) => {
      if (Array.isArray(backendOrders)) {
        setOrders(
          backendOrders.map((bo: any) => ({
            ...bo,
            orderNumber: `BB-${bo.id.slice(0, 6).toUpperCase()}`,
            clientName: bo.clientName || bo.user?.name || "Client",
            company: bo.company || bo.user?.company || "Independent Client",
            serviceTitle: bo.serviceName || "AI Solutions",
            budget: bo.budget || "Custom Quote",
            quotedPrice: bo.quotePrice || 0,
            status: bo.status ? bo.status.charAt(0).toUpperCase() + bo.status.slice(1).toLowerCase() : "Pending",
          }))
        );
      } else {
        setOrders([]);
      }
    }).catch(() => setOrders([]));

    adminApi.getAllBookings().then((backendBookings) => {
      if (Array.isArray(backendBookings)) {
        setConsultations(
          backendBookings.map((bb: any) => ({
            ...bb,
            bookingRef: `CNS-${bb.id.slice(0, 6).toUpperCase()}`,
            clientName: bb.name || bb.clientName || "Client",
            status: bb.status ? bb.status.charAt(0).toUpperCase() + bb.status.slice(1).toLowerCase() : "Pending",
          }))
        );
      } else {
        setConsultations([]);
      }
    }).catch(() => setConsultations([]));

    adminApi.getServices().then((backendServices) => {
      setServices(backendServices || []);
    }).catch(() => setServices([]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingOrders = orders.filter((o) => (o.status || "").toLowerCase() === "pending");
  const totalRevenue = analytics?.overview?.totalRevenue ?? orders.reduce((acc, o) => acc + (o.paidAmount || 0), 0);
  const pendingConsultations = consultations.filter((c) => (c.status || "").toLowerCase() === "pending");

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Recent";
    }
  };

  const activityLog = (analytics?.recentActivities || []).map((a: any) => ({
    ...a,
    time: a.time ? formatTimeAgo(a.time) : "Recent",
  }));

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <WelcomeBanner />

      {/* Real-time System Connectivity Bar */}
      <SystemConnectivityBar />

      {/* Client Quick Action Hub */}
      <QuickOperationsHub
        servicesCount={services.length}
        pendingCount={pendingOrders.length + pendingConsultations.length}
      />

      {/* 4 KPI Metric Cards */}
      <KpiMetricsGrid
        totalRevenue={totalRevenue}
        ordersCount={orders.length}
        pendingOrdersCount={pendingOrders.length}
        consultationsCount={consultations.length}
        pendingConsultationsCount={pendingConsultations.length}
        servicesCount={services.length}
      />

      {/* Analytics & Distribution Grid */}
      <RevenueAndDistributionCharts
        analytics={analytics}
        orders={orders}
        servicesCount={services.length}
      />

      {/* Recent Orders Review Table */}
      <RecentOrdersTable orders={orders} />

      {/* Activity Log */}
      <Card header={<h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Platform Activity</h3>}>
        {activityLog.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No recent activity logged in the database yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activityLog.slice(0, 6).map((log: any) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{log.details}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
