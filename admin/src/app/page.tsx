"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  CalendarCheck,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart3,
  Activity,
  Zap,
  Globe,
  FileText,
  DollarSign,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  Eye
} from "lucide-react";
import { adminStore } from "@/lib/store";
import analyticsData from "@/data/analytics.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import { toast } from "sonner";

type DashboardTab = "overview" | "statistics" | "activity" | "actions";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as DashboardTab) || "overview";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any>(null);

  const loadData = () => {
    setOrders(adminStore.getOrders());
    setConsultations(adminStore.getConsultations());
    setUsers(adminStore.getUsers());
    setServices(adminStore.getServices());
    setRequests(adminStore.getRequests());

    fetch("/api/save-content?key=orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      })
      .catch(() => {});

    fetch("/api/save-content?key=consultations")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setConsultations(data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as DashboardTab;
    if (tab && ["overview", "statistics", "activity", "actions"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    const url = tab === "overview" ? "/" : `/?tab=${tab}`;
    router.push(url);
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paidAmount || 0), 0) + 32650;
  const pendingConsultations = consultations.filter((c) => c.status === "Pending");

  // Recent activity audit log entries
  const activityLog = [
    {
      id: "act-1",
      action: "Quote Assigned",
      details: "Admin assigned quotation $850 for Order BB-2026-081 (TechBangla)",
      time: "15 minutes ago",
      type: "order",
      user: "Lead Admin"
    },
    {
      id: "act-2",
      action: "Consultation Confirmed",
      details: "Booked 45-min strategy session with Mahmudur Rahman (Bengal Financial)",
      time: "1 hour ago",
      type: "booking",
      user: "System AI"
    },
    {
      id: "act-3",
      action: "Content Published",
      details: "Published new tech article: 'How AI Is Changing Skill Development in Bangladesh'",
      time: "3 hours ago",
      type: "cms",
      user: "Content Lead"
    },
    {
      id: "act-4",
      action: "Service Updated",
      details: "Updated deliverables and pricing packages for 'AI Chatbot' core service",
      time: "Yesterday, 4:20 PM",
      type: "service",
      user: "Lead Admin"
    },
    {
      id: "act-5",
      action: "New Contact Inquiry",
      details: "Dr. Sabina Yasmin submitted inquiry for 'AI Patient Pre-Triage Assistant'",
      time: "Yesterday, 2:10 PM",
      type: "inquiry",
      user: "Public Portal"
    },
    {
      id: "act-6",
      action: "Filesystem Synced",
      details: "Synchronized site settings and hero banner configuration with frontend data",
      time: "2 days ago",
      type: "system",
      user: "Automated Daemon"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        badge="Enterprise Admin / Console"
        title="Dashboard"
        description="Comprehensive overview of client inquiries, project quotes, revenue growth, and live CMS operations."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/services?action=add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </Link>
            <Link
              href="/requests?tab=quotes"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span>Review Quotes ({pendingOrders.length})</span>
            </Link>
          </div>
        }
      >
        {/* Navigation Tabs for Dashboard */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "statistics", label: "Statistics & Insights", icon: BarChart3 },
            { id: "activity", label: "Recent Activity", icon: Activity },
            { id: "actions", label: "Quick Actions", icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Revenue
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
                <span>+24.8%</span>
                <span className="text-slate-400 font-normal">vs last month</span>
              </div>
            </div>

            {/* Client Orders */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Client Orders
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {orders.length}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {pendingOrders.length} Pending Review
                </span>
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Consultation Bookings
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {consultations.length}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                <span className="font-semibold text-indigo-600">{pendingConsultations.length} pending</span>
                <span>calendar sync</span>
              </div>
            </div>

            {/* Registered Users */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Team &amp; Specialists
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {users.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-2">
                All Active Staff
              </div>
            </div>
          </div>

          {/* Analytics & Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
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
                {analyticsData.monthlyRevenue.map((item, idx) => {
                  const maxRev = 13000;
                  const heightPercent = Math.round((item.revenue / maxRev) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        ${(item.revenue / 1000).toFixed(1)}k
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[36px] rounded-t-lg bg-slate-800 group-hover:bg-indigo-600 transition-colors duration-150"
                      />
                      <span className="text-xs font-medium text-slate-500 mt-1">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Average Deal Size: <strong className="text-slate-900 font-semibold">$1,850</strong></span>
                <span>Total Projects Completed: <strong className="text-slate-900 font-semibold">128+</strong></span>
              </div>
            </div>

            {/* Service Category Share */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue by Service</h2>
                <p className="text-xs text-slate-500">Distribution across 4 core offerings</p>
              </div>

              <div className="space-y-4">
                {analyticsData.categoryDistribution.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{cat.category}</span>
                      <span className="text-slate-900 font-bold">{cat.share}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/services"
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <span>Manage All Services ({services.length})</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Recent Orders Review Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                  <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                    <th className="py-3 px-5">Order Ref</th>
                    <th className="py-3 px-5">Client &amp; Company</th>
                    <th className="py-3 px-5">Requested Service</th>
                    <th className="py-3 px-5">Budget</th>
                    <th className="py-3 px-5">Quote Price</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-semibold text-slate-800">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{order.clientName}</div>
                        <div className="text-[11px] text-slate-400">{order.company}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-800">{order.serviceTitle}</div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-500">
                        {order.budget}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">
                        ${order.quotedPrice}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href="/requests?tab=quotes"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATISTICS & INSIGHTS */}
      {activeTab === "statistics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead Conversion Rate</span>
              <div className="text-3xl font-bold text-slate-900 mt-2">64.2%</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">+8.4% this quarter</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Deal Value</span>
              <div className="text-3xl font-bold text-slate-900 mt-2">$2,140</div>
              <p className="text-xs text-slate-500 mt-1">Across 4 core services</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Show Rate</span>
              <div className="text-3xl font-bold text-slate-900 mt-2">92.5%</div>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Google Meet automated sync</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Client Retention</span>
              <div className="text-3xl font-bold text-slate-900 mt-2">88.0%</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Maintenance &amp; SaaS scaling</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card header={<h3 className="text-sm font-bold text-slate-900">Quote Inquiries by Industry</h3>}>
              <div className="space-y-4">
                {[
                  { name: "FinTech & Banking", pct: 38, count: "18 Requests" },
                  { name: "Healthcare & Diagnostics", pct: 28, count: "13 Requests" },
                  { name: "E-Commerce & Logistics", pct: 20, count: "10 Requests" },
                  { name: "Education & EdTech", pct: 14, count: "7 Requests" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{item.name}</span>
                      <span className="text-slate-500 font-mono">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100">
                      <div style={{ width: `${item.pct}%` }} className="h-full rounded-full bg-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card header={<h3 className="text-sm font-bold text-slate-900">Traffic &amp; Conversion Channels</h3>}>
              <div className="space-y-4">
                {[
                  { name: "Direct Website Form", pct: 45, val: "45%" },
                  { name: "WhatsApp Direct CTA", pct: 30, val: "30%" },
                  { name: "Referral & Strategic Partners", pct: 15, val: "15%" },
                  { name: "Webinars & Events", pct: 10, val: "10%" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{item.name}</span>
                      <span className="text-slate-500 font-mono">{item.val}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100">
                      <div style={{ width: `${item.pct}%` }} className="h-full rounded-full bg-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: RECENT ACTIVITY */}
      {activeTab === "activity" && (
        <Card header={<h3 className="text-sm font-bold text-slate-900">Platform Audit Log &amp; Activity Stream</h3>}>
          <div className="divide-y divide-slate-100">
            {activityLog.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">By {log.user}</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: QUICK ACTIONS */}
      {activeTab === "actions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/services?action=add"
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors block space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add New AI Service</h3>
            <p className="text-xs text-slate-500">Create a new core offering with deliverables, starting price, and delivery timeline.</p>
          </Link>

          <Link
            href="/blog?action=add"
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors block space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Publish Blog Article</h3>
            <p className="text-xs text-slate-500">Draft or publish a tech editorial for Botbari public readers.</p>
          </Link>

          <Link
            href="/website/homepage?tab=hero"
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors block space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Configure Homepage Hero</h3>
            <p className="text-xs text-slate-500">Update main H1 headline, robot conversation bubbles, and call-to-actions.</p>
          </Link>

          <Link
            href="/requests?tab=quotes"
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors block space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Review Pending Quotes</h3>
            <p className="text-xs text-slate-500">Assign final contract quotations for submitted client orders.</p>
          </Link>

          <Link
            href="/media"
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors block space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Media Library</h3>
            <p className="text-xs text-slate-500">Upload graphics, product mockups, and whitepapers with instant URLs.</p>
          </Link>

          <button
            type="button"
            onClick={() => {
              adminStore.clearCache();
              toast.success("Cache cleared! Reloading fresh content from storage.");
              setTimeout(() => window.location.reload(), 1000);
            }}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Sync &amp; Clear Cache</h3>
            <p className="text-xs text-slate-500">Force reload all local storage cache and synchronize with backend disk files.</p>
          </button>
        </div>
      )}
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
