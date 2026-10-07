"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";
import { adminApi } from "@/lib/adminApi";

interface CreateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateConsultationModal({ isOpen, onClose, onSuccess }: CreateConsultationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("Enterprise AI Strategy");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("03:00 PM - 03:45 PM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.createBooking({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || "Independent Inquiry",
        topic: topic.trim() || "AI Consultation",
        date,
        timeSlot,
        message: message.trim() || "Booked by admin",
        status: "CONFIRMED",
      });

      toast.success("Consultation booking saved to PostgreSQL database!");
      onSuccess();
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch (err: any) {
      toast.error("Failed to create booking: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Consultation"
      subtitle="Manually schedule a client consultation or strategy session in NeonDB"
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
            form="create-consultation-form"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      }
    >
      <form id="create-consultation-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Client Name" required>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Client Email" required>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@company.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Phone Number">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +880 1700-000000"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Company / Organization">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Global"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Topic" required>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI Strategy"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Consultation Date" required>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Time Slot" required>
            <input
              type="text"
              required
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="03:00 PM - 03:45 PM"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>
        </div>

        <FormField label="Meeting Notes / Agendas">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Key discussion points, requirements, or meeting link..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>
      </form>
    </Modal>
  );
}
