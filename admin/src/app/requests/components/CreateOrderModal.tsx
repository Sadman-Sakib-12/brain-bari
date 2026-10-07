"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";
import { adminApi } from "@/lib/adminApi";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [serviceName, setServiceName] = useState("Autonomous AI Chatbot Development");
  const [budget, setBudget] = useState("$500 - $1,500");
  const [quotePrice, setQuotePrice] = useState<number>(500);
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !serviceName.trim()) {
      toast.error("Client name, email, and service name are required.");
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.createOrder({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        serviceName: serviceName.trim(),
        serviceTitle: serviceName.trim(),
        budget: budget.trim() || "Custom Quote",
        quotePrice: Number(quotePrice) || 0,
        requirements: requirements.trim() || "Manual quote created by admin",
        status: "APPROVED",
      });

      toast.success("Order quote created and stored in PostgreSQL database!");
      onSuccess();
      onClose();
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setRequirements("");
    } catch (err: any) {
      toast.error("Failed to create order: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project Quote / Order"
      subtitle="Manually create a client service order or enterprise quote in NeonDB"
      maxWidth="lg"
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-order-form"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Save Order Quote"}
          </button>
        </div>
      }
    >
      <form id="create-order-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Client Full Name" required>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Client Email Address" required>
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="e.g. client@enterprise.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Client Phone / Contact">
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="e.g. +880 1700-000000"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Service / Solution" required>
            <input
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Autonomous AI Chatbot Development"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Budget Range">
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $500 - $1,500"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Quoted Price ($ USD)">
            <input
              type="number"
              value={quotePrice}
              onChange={(e) => setQuotePrice(Number(e.target.value))}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <FormField label="Project Requirements & Notes">
          <textarea
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Key technical scope, deliverables, or client notes..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>
      </form>
    </Modal>
  );
}
