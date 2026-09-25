"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Inbox,
  MessageSquare,
  DollarSign,
  CalendarCheck,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Phone,
  Building,
  User,
  Clock,
  Send,
  AlertCircle
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialRequests from "@/data/requests.json";
import initialOrders from "@/data/orders.json";
import initialConsultations from "@/data/consultations.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type RequestTab = "contact" | "quotes" | "consultations" | "subscribers";

function RequestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as RequestTab) || "contact";

  const [activeTab, setActiveTab] = useState<RequestTab>(initialTab);
  const [requests, setRequests] = useState<any>(initialRequests);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [consultations, setConsultations] = useState<any[]>(initialConsultations);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals & Details
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detailModalType, setDetailModalType] = useState<RequestTab | null>(null);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{ id: string; type: RequestTab } | null>(null);

  // Quote editing
  const [editingQuotePrice, setEditingQuotePrice] = useState<number>(0);
  const [editingQuoteStatus, setEditingQuoteStatus] = useState<string>("Pending");

  const loadData = () => {
    try {
      const req = adminStore.getRequests();
      if (req && req.contactMessages) setRequests(req);
      const ord = adminStore.getOrders();
      if (ord && ord.length > 0) setOrders(ord);
      const con = adminStore.getConsultations();
      if (con && con.length > 0) setConsultations(con);

      // Also fetch fresh from API to capture newly placed orders from Frontend
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

      fetch("/api/save-content?key=requests")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data?.contactMessages) {
            setRequests(data.data);
          }
        })
        .catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as RequestTab;
    if (tab && ["contact", "quotes", "consultations", "subscribers"].includes(tab)) {
      setActiveTab(tab);
      setCurrentPage(1);
      setSearchQuery("");
      setSelectedStatus("All");
    }
  }, [searchParams]);

  const handleTabChange = (tab: RequestTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedStatus("All");
    router.push(`/requests?tab=${tab}`);
  };

  // Status changes
  const updateContactStatus = (id: string, newStatus: string) => {
    const updatedMsgs = requests.contactMessages.map((m: any) =>
      m.id === id ? { ...m, status: newStatus } : m
    );
    const updated = { ...requests, contactMessages: updatedMsgs };
    setRequests(updated);
    adminStore.setRequests(updated);
    toast.success(`Contact status changed to "${newStatus}".`);
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  const updateQuoteStatus = (orderId: string, newStatus: string, quotePrice?: number) => {
    const updated = orders.map((o: any) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          quotedPrice: quotePrice !== undefined ? quotePrice : o.quotedPrice
        };
      }
      return o;
    });
    setOrders(updated);
    adminStore.setOrders(updated);
    toast.success(`Quote status updated to "${newStatus}".`);
    if (selectedItem?.id === orderId) {
      setSelectedItem({
        ...selectedItem,
        status: newStatus,
        quotedPrice: quotePrice !== undefined ? quotePrice : selectedItem.quotedPrice
      });
    }
  };

  const updateConsultationStatus = (cnsId: string, newStatus: string) => {
    const updated = consultations.map((c: any) =>
      c.id === cnsId ? { ...c, status: newStatus } : c
    );
    setConsultations(updated);
    adminStore.setConsultations(updated);
    toast.success(`Booking status changed to "${newStatus}".`);
    if (selectedItem?.id === cnsId) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  // Deletions
  const handleDeleteConfirm = () => {
    if (!deleteConfirmInfo) return;
    const { id, type } = deleteConfirmInfo;

    if (type === "contact") {
      const updated = {
        ...requests,
        contactMessages: requests.contactMessages.filter((m: any) => m.id !== id)
      };
      setRequests(updated);
      adminStore.setRequests(updated);
      toast.success("Contact message deleted.");
    } else if (type === "quotes") {
      const updated = orders.filter((o: any) => o.id !== id);
      setOrders(updated);
      adminStore.setOrders(updated);
      toast.success("Order quote request deleted.");
    } else if (type === "consultations") {
      const updated = consultations.filter((c: any) => c.id !== id);
      setConsultations(updated);
      adminStore.setConsultations(updated);
      toast.success("Consultation booking deleted.");
    } else if (type === "subscribers") {
      const updated = {
        ...requests,
        newsletterSubscribers: requests.newsletterSubscribers.filter((s: any) => s.id !== id)
      };
      setRequests(updated);
      adminStore.setRequests(updated);
      toast.success("Subscriber removed.");
    }

    setDeleteConfirmInfo(null);
    setSelectedItem(null);
  };

  // Data selection by tab
  const contactList = requests.contactMessages || [];
  const quoteList = orders || [];
  const consultationList = consultations || [];
  const subscriberList = requests.newsletterSubscribers || [];

  // Filtered lists
  const filteredContact = contactList.filter((m: any) => {
    const matchSearch =
      (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "All" || m.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const filteredQuotes = quoteList.filter((q: any) => {
    const matchSearch =
      (q.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.serviceTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "All" || q.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const filteredConsultations = consultationList.filter((c: any) => {
    const matchSearch =
      (c.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.bookingRef || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "All" || c.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const filteredSubscribers = subscriberList.filter((s: any) => {
    const matchSearch = (s.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "All" || s.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Current paginated set
  let currentDataset: any[] = [];
  let totalCount = 0;

  if (activeTab === "contact") {
    totalCount = filteredContact.length;
    currentDataset = filteredContact.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  } else if (activeTab === "quotes") {
    totalCount = filteredQuotes.length;
    currentDataset = filteredQuotes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  } else if (activeTab === "consultations") {
    totalCount = filteredConsultations.length;
    currentDataset = filteredConsultations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  } else {
    totalCount = filteredSubscribers.length;
    currentDataset = filteredSubscribers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Requests & Inquiries"
        title="Requests &amp; Communications"
        description="Review inbound client messages, assign project quotations, confirm consultation bookings, and manage newsletter subscribers."
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "contact", label: "Contact Messages", icon: MessageSquare, count: contactList.length },
            { id: "quotes", label: "Quote Requests", icon: DollarSign, count: quoteList.length },
            { id: "consultations", label: "Consultation Bookings", icon: CalendarCheck, count: consultationList.length },
            { id: "subscribers", label: "Newsletter Subscribers", icon: Mail, count: subscriberList.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as RequestTab)}
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
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search by name, email, or company..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
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

      {/* TAB 1: CONTACT MESSAGES TABLE */}
      {activeTab === "contact" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                            onClick={() => {
                              setSelectedItem(msg);
                              setDetailModalType("contact");
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                            title="View Full Message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmInfo({ id: msg.id, type: "contact" })}
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 2: QUOTE REQUESTS TABLE */}
      {activeTab === "quotes" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                            onClick={() => {
                              setSelectedItem(order);
                              setEditingQuotePrice(order.quotedPrice || 0);
                              setEditingQuoteStatus(order.status || "Pending");
                              setDetailModalType("quotes");
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                          >
                            Review &amp; Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmInfo({ id: order.id, type: "quotes" })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 3: CONSULTATION REQUESTS TABLE */}
      {activeTab === "consultations" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                            onClick={() => {
                              setSelectedItem(cns);
                              setDetailModalType("consultations");
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmInfo({ id: cns.id, type: "consultations" })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 4: NEWSLETTER SUBSCRIBERS TABLE */}
      {activeTab === "subscribers" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                          onClick={() => setDeleteConfirmInfo({ id: sub.id, type: "subscribers" })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* DETAIL MODAL: CONTACT MESSAGE */}
      {detailModalType === "contact" && selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setDetailModalType(null)}
          title="Contact Message Details"
          subtitle={`Received on ${selectedItem.date?.split("T")[0] || "2026-09-18"}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-2">
              {selectedItem.status !== "Responded" && (
                <button
                  type="button"
                  onClick={() => updateContactStatus(selectedItem.id, "Responded")}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Mark as Responded
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailModalType(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sender Name</span>
                <p className="font-semibold text-slate-900">{selectedItem.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedItem.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                <p className="text-slate-700">{selectedItem.phone || "Not provided"}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <p className="text-slate-700">{selectedItem.serviceType}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Subject</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedItem.subject}</h4>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Message</span>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-line mt-1 leading-relaxed">
                {selectedItem.message}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL: QUOTE REQUEST & APPROVAL */}
      {detailModalType === "quotes" && selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setDetailModalType(null)}
          title={`Order Quote Review – ${selectedItem.orderNumber}`}
          subtitle={`Submitted by ${selectedItem.clientName} (${selectedItem.company})`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDetailModalType(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  updateQuoteStatus(selectedItem.id, editingQuoteStatus, editingQuotePrice);
                  setDetailModalType(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
              >
                Save Quote &amp; Status
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Service</span>
                <p className="font-semibold text-slate-900">{selectedItem.serviceTitle}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Client Budget</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedItem.budget}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Timeline</span>
                <p className="font-semibold text-slate-900">{selectedItem.timeline}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Client Requirements</span>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 mt-1 leading-relaxed">
                {selectedItem.requirements}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assign Quoted Contract Price ($ USD)
                </label>
                <input
                  type="number"
                  value={editingQuotePrice}
                  onChange={(e) => setEditingQuotePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Update Order Status
                </label>
                <select
                  value={editingQuoteStatus}
                  onChange={(e) => setEditingQuoteStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved (Quote Ready)</option>
                  <option value="In Progress">In Progress (Paid)</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL: CONSULTATION BOOKING */}
      {detailModalType === "consultations" && selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setDetailModalType(null)}
          title={`Consultation Session – ${selectedItem.bookingRef}`}
          subtitle={`Client: ${selectedItem.clientName}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-2">
              {selectedItem.status !== "Confirmed" && (
                <button
                  type="button"
                  onClick={() => {
                    updateConsultationStatus(selectedItem.id, "Confirmed");
                    setDetailModalType(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
                >
                  Confirm Meeting
                </button>
              )}
              {selectedItem.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => {
                    updateConsultationStatus(selectedItem.id, "Completed");
                    setDetailModalType(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Mark Completed
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailModalType(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                <p className="font-semibold text-slate-900 font-mono">{selectedItem.date}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time Slot</span>
                <p className="font-semibold text-slate-900">{selectedItem.timeSlot}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Client Email</span>
                <p className="text-slate-700 font-mono">{selectedItem.clientEmail}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Company</span>
                <p className="text-slate-700">{selectedItem.company || "Independent"}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Discussion Topic</span>
              <p className="font-bold text-slate-900 mt-0.5">{selectedItem.topic}</p>
            </div>

            {selectedItem.notes && (
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Client Notes</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 mt-0.5 leading-relaxed">
                  {selectedItem.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmInfo}
        onClose={() => setDeleteConfirmInfo(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Record"
        message="Are you sure you want to permanently delete this entry from your communications and requests records?"
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Requests...</div>}>
      <RequestsContent />
    </Suspense>
  );
}
