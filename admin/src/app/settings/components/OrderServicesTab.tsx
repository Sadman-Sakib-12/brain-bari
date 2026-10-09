"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, RotateCcw, Check, CheckSquare } from "lucide-react";
import Card from "@/components/ui/Card";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

interface OrderServicesTabProps {
  orderServices: string[];
  setOrderServices: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function OrderServicesTab({
  orderServices,
  setOrderServices,
}: OrderServicesTabProps) {
  const [newServiceName, setNewServiceName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getContent("orderFormServices")
      .then((res) => {
        if (Array.isArray(res)) {
          setOrderServices(res);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newServiceName.trim();
    if (!trimmed) {
      toast.error("Please enter a service name");
      return;
    }
    if (orderServices.includes(trimmed)) {
      toast.error("This service already exists in the list");
      return;
    }
    setOrderServices([...orderServices, trimmed]);
    setNewServiceName("");
    toast.success(`"${trimmed}" added to list. Click "Save Changes" to apply.`);
  };

  const handleRemoveService = (index: number) => {
    const removed = orderServices[index];
    const updated = orderServices.filter((_, i) => i !== index);
    setOrderServices(updated);
    toast.info(`"${removed}" removed from list.`);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(orderServices[index]);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    const updated = [...orderServices];
    updated[index] = trimmed;
    setOrderServices(updated);
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    try {
      await adminApi.saveContent("orderFormServices", orderServices);
      toast.success("Order Form services saved to database successfully!", {
        description: `${orderServices.length} services will appear on the frontend Place Your Order page.`
      });
    } catch (err: any) {
      toast.error("Failed to save order services: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Place Your Order – Selectable Services</span>
              </h3>
              <p className="text-xs text-slate-500">
                Frontend Location: <strong className="text-slate-700">/order</strong> page &rarr; &quot;Services:&quot; 3-column checkboxes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveToDatabase}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        }
      >
        {/* Add New Service Input */}
        <form onSubmit={handleAddService} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="e.g. Mobile App Development, DevOps & Security..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </form>

        {/* Current Services List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>Configured Services ({orderServices.length})</span>
            <span>Live on /order page</span>
          </div>

          {orderServices.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No services added yet. Click &quot;Reset 7 Defaults&quot; above to restore standard services.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {orderServices.map((serviceName, index) => {
                const isEditing = editingIndex === index;
                return (
                  <div
                    key={`${serviceName}-${index}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(index);
                            if (e.key === "Escape") setEditingIndex(null);
                          }}
                          className="flex-1 px-2.5 py-1 text-xs border border-blue-400 rounded-lg focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(index)}
                          className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 truncate flex-1">
                        <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {serviceName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
