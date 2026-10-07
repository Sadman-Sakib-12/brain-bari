"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

interface RequestDetailModalProps {
  detailModalType: "contact" | "quotes" | "consultations" | "subscribers" | null;
  selectedItem: any | null;
  onClose: () => void;
  updateContactStatus: (id: string, status: string) => void;
  updateQuoteStatus: (id: string, status: string, price: number) => void;
  updateConsultationStatus: (id: string, status: string) => void;
  editingQuotePrice: number;
  setEditingQuotePrice: (val: number) => void;
  editingQuoteStatus: string;
  setEditingQuoteStatus: (val: string) => void;
}

export default function RequestDetailModal({
  detailModalType,
  selectedItem,
  onClose,
  updateContactStatus,
  updateQuoteStatus,
  updateConsultationStatus,
  editingQuotePrice,
  setEditingQuotePrice,
  editingQuoteStatus,
  setEditingQuoteStatus
}: RequestDetailModalProps) {
  if (!detailModalType || !selectedItem) return null;

  if (detailModalType === "contact") {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
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
              onClick={onClose}
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
    );
  }

  if (detailModalType === "quotes") {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title={`Order Quote Review – ${selectedItem.orderNumber}`}
        subtitle={`Submitted by ${selectedItem.clientName} (${selectedItem.company || "Direct Inquiry"})`}
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                updateQuoteStatus(selectedItem.id, editingQuoteStatus, editingQuotePrice);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer"
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
    );
  }

  if (detailModalType === "consultations") {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
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
                  onClose();
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
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
              >
                Mark Completed
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
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
    );
  }

  return null;
}
