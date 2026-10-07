"use client";

import React from "react";
import { MessageSquare, DollarSign, CalendarCheck, Mail } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";

export type RequestTab = "contact" | "quotes" | "consultations" | "subscribers";

interface RequestsHeaderNavProps {
  activeTab: RequestTab;
  onTabChange: (tab: RequestTab) => void;
  contactCount: number;
  quotesCount: number;
  consultationsCount: number;
  subscribersCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export default function RequestsHeaderNav({
  activeTab,
  onTabChange,
  contactCount,
  quotesCount,
  consultationsCount,
  subscribersCount,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: RequestsHeaderNavProps) {
  return (
    <>
      <PageHeader
        badge="Enterprise Leads / Customer Submissions"
        title="Orders, Consultations & Inquiries"
        description="Review real-time customer submissions from the website. Managed Frontend Sources: Contact Page (/contact) Inquiries • Order Page (/order) Requests • Schedule Page (/schedule) Consultation Bookings."
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "contact", label: "Contact Inquiries (/contact)", icon: MessageSquare, count: contactCount },
            { id: "quotes", label: "Orders & Quotes (/order)", icon: DollarSign, count: quotesCount },
            { id: "consultations", label: "Consultations (/schedule)", icon: CalendarCheck, count: consultationsCount },
            { id: "subscribers", label: "Newsletter Subscribers", icon: Mail, count: subscribersCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id as RequestTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* SEARCH AND STATUS FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name, email, or company..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {activeTab === "contact" && (
              <>
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Responded">Responded</option>
              </>
            )}
            {activeTab === "quotes" && (
              <>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </>
            )}
            {activeTab === "consultations" && (
              <>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </>
            )}
            {activeTab === "subscribers" && (
              <>
                <option value="Active">Active</option>
                <option value="Unsubscribed">Unsubscribed</option>
              </>
            )}
          </select>
        </div>
      </div>
    </>
  );
}
