"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";
import { adminApi } from "@/lib/adminApi";

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: any[];
  onSuccess: (updated: any[]) => void;
}

export default function AddSubscriberModal({
  isOpen,
  onClose,
  subscribers,
  onSuccess,
}: AddSubscriberModalProps) {
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("Direct / Manual");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Subscriber email is required.");
      return;
    }

    if (subscribers.some((s) => s.email?.toLowerCase() === email.trim().toLowerCase())) {
      toast.error("This email is already in the subscriber list.");
      return;
    }

    setSubmitting(true);
    try {
      const newSub = {
        id: `sub-${Date.now()}`,
        email: email.trim(),
        source: source.trim() || "Manual Admin Entry",
        subscribedDate: new Date().toISOString().split("T")[0],
        status: "Active",
      };

      const updated = [newSub, ...subscribers];
      await adminApi.saveContent("newsletterSubscribers", updated);

      toast.success("Subscriber added to newsletter list!");
      onSuccess(updated);
      onClose();
      setEmail("");
    } catch (err: any) {
      toast.error("Failed to add subscriber: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Newsletter Subscriber"
      subtitle="Manually add an email subscriber to the newsletter broadcast list"
      maxWidth="md"
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
            form="add-subscriber-form"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Subscriber"}
          </button>
        </div>
      }
    >
      <form id="add-subscriber-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <FormField label="Subscriber Email Address" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. subscriber@company.com"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>

        <FormField label="Subscription Source">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Direct / Manual Client Addition"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
          />
        </FormField>
      </form>
    </Modal>
  );
}
