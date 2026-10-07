"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  DollarSign,
  CalendarCheck,
  Mail
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import ContactMessagesTab from "./components/ContactMessagesTab";
import QuotesOrdersTab from "./components/QuotesOrdersTab";
import ConsultationsTab from "./components/ConsultationsTab";
import SubscribersTab from "./components/SubscribersTab";
import RequestDetailModal from "./components/RequestDetailModal";
import RequestsHeaderNav from "./components/RequestsHeaderNav";
import CreateOrderModal from "./components/CreateOrderModal";
import CreateConsultationModal from "./components/CreateConsultationModal";
import AddSubscriberModal from "./components/AddSubscriberModal";

type RequestTab = "contact" | "quotes" | "consultations" | "subscribers";

function RequestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as RequestTab) || "contact";

  const [activeTab, setActiveTab] = useState<RequestTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<any>({ contactMessages: [], newsletterSubscribers: [] });
  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals & Details
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detailModalType, setDetailModalType] = useState<RequestTab | null>(null);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{ id: string; type: RequestTab } | null>(null);

  // Manual Creation Modals
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);

  // Quote editing
  const [editingQuotePrice, setEditingQuotePrice] = useState<number>(0);
  const [editingQuoteStatus, setEditingQuoteStatus] = useState<string>("Pending");

  const loadData = () => {
    try {
      // Fetch fresh live orders directly from Express/PostgreSQL database
      adminApi.getAllOrders().then((backendOrders) => {
        if (backendOrders && Array.isArray(backendOrders)) {
          setOrders(
            backendOrders.map((bo: any) => ({
              id: bo.id,
              orderNumber: `BB-${bo.id.slice(0, 6).toUpperCase()}`,
              clientName: bo.clientName || bo.user?.name || "Client",
              clientEmail: bo.clientEmail || bo.user?.email || "N/A",
              clientPhone: bo.clientPhone || "N/A",
              serviceTitle: bo.serviceName || "AI Solutions",
              serviceCategory: bo.category || "ai-services",
              budget: bo.budget || "Custom Quote",
              timeline: bo.deliveryTime || "Standard",
              requirements: bo.requirements || "Inquiry from website",
              status: bo.status ? bo.status.charAt(0).toUpperCase() + bo.status.slice(1).toLowerCase() : "Pending",
              quotedPrice: bo.quotePrice || 0,
              paidAmount: 0,
              submissionDate: bo.createdAt || new Date().toISOString(),
            }))
          );
        }
      }).catch(() => {});

      // Fetch fresh live bookings directly from Express/PostgreSQL database
      adminApi.getAllBookings().then((backendBookings) => {
        if (backendBookings && Array.isArray(backendBookings)) {
          setConsultations(
            backendBookings.map((bb: any) => ({
              id: bb.id,
              bookingRef: `CNS-${bb.id.slice(0, 6).toUpperCase()}`,
              clientName: bb.name || bb.clientName || "Client",
              clientEmail: bb.email || bb.clientEmail || "N/A",
              clientPhone: bb.phone || bb.clientPhone || "+880 1700-000000",
              company: bb.company || "Independent Inquiry",
              topic: bb.topic || "AI Strategy",
              date: bb.date || new Date().toISOString().split("T")[0],
              timeSlot: bb.timeSlot || "03:00 PM - 03:45 PM",
              status: bb.status ? bb.status.charAt(0).toUpperCase() + bb.status.slice(1).toLowerCase() : "Pending",
              notes: bb.message || bb.notes || "Booked from website",
              createdAt: bb.createdAt || new Date().toISOString(),
            }))
          );
        }
      }).catch(() => {});

      // Fetch fresh live contact messages directly from Express/PostgreSQL database
      adminApi.getAllContactMessages().then((msgs) => {
        if (msgs && Array.isArray(msgs)) {
          setRequests((prev: any) => ({
            ...prev,
            contactMessages: msgs.map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              phone: m.phone || "N/A",
              service: m.subject || "General Inquiry",
              budget: "Flexible",
              message: m.message,
              date: m.createdAt || new Date().toISOString(),
              status: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase() : "New",
            })),
          }));
        }
      }).catch(() => {});

      adminApi.getContent("newsletterSubscribers").then((subs) => {
        if (subs && Array.isArray(subs)) {
          setRequests((prev: any) => ({
            ...prev,
            newsletterSubscribers: subs,
          }));
        }
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
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
    adminApi.updateContactMessageStatus(id, newStatus).catch(() => {});
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
    adminApi.updateOrderQuote(orderId, {
      quotedPrice: quotePrice,
      quotePrice: quotePrice,
      status: newStatus,
    }).catch((err) => console.warn("Failed to update quote in backend:", err));
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
    adminApi.updateBookingStatus(cnsId, newStatus).catch(() => {});
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
      adminApi.deleteContactMessage(id).catch(() => {});
      toast.success("Contact message deleted.");
    } else if (type === "quotes") {
      const updated = orders.filter((o: any) => o.id !== id);
      setOrders(updated);
      adminApi.deleteOrder(id).catch((err) => console.warn("Failed to delete order in DB:", err));
      toast.success("Order quote request deleted from database.");
    } else if (type === "consultations") {
      const updated = consultations.filter((c: any) => c.id !== id);
      setConsultations(updated);
      adminApi.deleteBooking(id).catch((err) => console.warn("Failed to delete booking in DB:", err));
      toast.success("Consultation booking deleted from database.");
    } else if (type === "subscribers") {
      const updated = {
        ...requests,
        newsletterSubscribers: requests.newsletterSubscribers.filter((s: any) => s.id !== id)
      };
      setRequests(updated);
      adminApi.saveContent("newsletterSubscribers", updated.newsletterSubscribers).catch(() => {});
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

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RequestsHeaderNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        contactCount={contactList.length}
        quotesCount={quoteList.length}
        consultationsCount={consultationList.length}
        subscribersCount={subscriberList.length}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setCurrentPage(1);
        }}
      />

      {/* TAB 1: CONTACT MESSAGES TABLE */}
      {activeTab === "contact" && (
        <ContactMessagesTab
          currentDataset={currentDataset}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onView={(msg) => {
            setSelectedItem(msg);
            setDetailModalType("contact");
          }}
          onDelete={(id) => setDeleteConfirmInfo({ id, type: "contact" })}
        />
      )}

      {/* TAB 2: QUOTE REQUESTS TABLE */}
      {activeTab === "quotes" && (
        <QuotesOrdersTab
          currentDataset={currentDataset}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onAddOrder={() => setIsCreateOrderOpen(true)}
          onReview={(order) => {
            setSelectedItem(order);
            setEditingQuotePrice(order.quotedPrice || 0);
            setEditingQuoteStatus(order.status || "Pending");
            setDetailModalType("quotes");
          }}
          onDelete={(id) => setDeleteConfirmInfo({ id, type: "quotes" })}
        />
      )}

      {/* TAB 3: CONSULTATION REQUESTS TABLE */}
      {activeTab === "consultations" && (
        <ConsultationsTab
          currentDataset={currentDataset}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onAddConsultation={() => setIsCreateBookingOpen(true)}
          onView={(cns) => {
            setSelectedItem(cns);
            setDetailModalType("consultations");
          }}
          onDelete={(id) => setDeleteConfirmInfo({ id, type: "consultations" })}
        />
      )}

      {/* TAB 4: NEWSLETTER SUBSCRIBERS TABLE */}
      {activeTab === "subscribers" && (
        <SubscribersTab
          currentDataset={currentDataset}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onAddSubscriber={() => setIsAddSubscriberOpen(true)}
          onDelete={(id) => setDeleteConfirmInfo({ id, type: "subscribers" })}
        />
      )}

      {/* MODAL */}
      <RequestDetailModal
        detailModalType={detailModalType}
        selectedItem={selectedItem}
        onClose={() => setDetailModalType(null)}
        updateContactStatus={updateContactStatus}
        updateQuoteStatus={updateQuoteStatus}
        updateConsultationStatus={updateConsultationStatus}
        editingQuotePrice={editingQuotePrice}
        setEditingQuotePrice={setEditingQuotePrice}
        editingQuoteStatus={editingQuoteStatus}
        setEditingQuoteStatus={setEditingQuoteStatus}
      />

      {/* MANUAL CREATION MODALS */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onSuccess={loadData}
      />
      <CreateConsultationModal
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
        onSuccess={loadData}
      />
      <AddSubscriberModal
        isOpen={isAddSubscriberOpen}
        onClose={() => setIsAddSubscriberOpen(false)}
        subscribers={requests.newsletterSubscribers || []}
        onSuccess={(updated) => {
          setRequests((prev: any) => ({ ...prev, newsletterSubscribers: updated }));
        }}
      />

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
