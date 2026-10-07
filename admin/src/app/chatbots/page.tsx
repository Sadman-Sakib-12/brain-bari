"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Bot, Plus, Edit2, Trash2, Tag, DollarSign, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import EmptyState from "@/components/ui/EmptyState";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";

function ChatbotsContent() {
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [editingBot, setEditingBot] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Active");

  const loadChatbots = () => {
    adminApi.getChatbots().then((res) => {
      if (Array.isArray(res)) {
        setChatbots(
          res.map((c: any) => ({
            ...c,
            title: c.title || c.name || "Specialized AI Bot",
            name: c.name || c.title || "Specialized AI Bot",
            price: typeof c.price === "number" ? `$${c.price}` : c.price || "$499",
            deliveryDays: c.deliveryTime ? parseInt(c.deliveryTime) || 5 : c.deliveryDays || 5,
            tags: Array.isArray(c.tags) ? c.tags : [],
            status: c.isActive === false ? "Draft" : c.status || "Active",
          }))
        );
      } else {
        setChatbots([]);
      }
    }).catch(() => {
      setChatbots([]);
    });
  };

  useEffect(() => {
    loadChatbots();
  }, []);

  const openAddModal = () => {
    setEditingBot(null);
    setTitle("");
    setPrice("");
    setDescription("");
    setDeliveryDays(5);
    setImage("");
    setTags("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const openEditModal = (bot: any) => {
    setEditingBot(bot);
    setTitle(bot.title || bot.name || "");
    setPrice(String(bot.price || 499));
    setDescription(bot.description || "");
    setDeliveryDays(bot.deliveryDays || (bot.deliveryTime ? parseInt(bot.deliveryTime) || 5 : 5));
    setImage(bot.image || "");
    setTags(bot.tags ? bot.tags.join(", ") : "");
    setStatus(bot.status || (bot.isActive === false ? "Draft" : "Active"));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 499;

    let updated: any[];

    if (!editingBot) {
      adminApi.createChatbot({
        name: title,
        category: "AI Chatbot",
        price: numPrice,
        deliveryTime: `${deliveryDays} Days`,
        tags: tagArray,
        description,
        image,
        isActive: status === "Active",
      }).then((created) => {
        if (created) {
          setChatbots((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
        }
      }).catch((err) => console.warn(err));

      const newBot = {
        id: `bot-${Date.now()}`,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        title,
        price,
        description,
        deliveryDays: Number(deliveryDays),
        image,
        tags: tagArray,
        status,
      };
      updated = [...chatbots, newBot];
      toast.success("New specialized chatbot added!");
    } else {
      adminApi.updateChatbot(editingBot.id, {
        name: title,
        price: numPrice,
        deliveryTime: `${deliveryDays} Days`,
        tags: tagArray,
        description,
        image,
        isActive: status === "Active",
      }).catch((err) => console.warn(err));

      updated = chatbots.map((b) => {
        if (b.id === editingBot.id) {
          return {
            ...b,
            title,
            price,
            description,
            deliveryDays: Number(deliveryDays),
            image,
            tags: tagArray,
            status,
          };
        }
        return b;
      });
      toast.success("Chatbot card updated successfully!");
    }

    setChatbots(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    adminApi.deleteChatbot(deleteConfirmId).catch((err) => console.warn(err));
    const updated = chatbots.filter((b) => b.id !== deleteConfirmId);
    setChatbots(updated);
    setDeleteConfirmId(null);
    toast.success("Chatbot removed from catalog");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        badge="Specialized Solutions"
        title="Specialized AI Chatbots"
        description="Manage domain-specific AI chatbot products. Managed Frontend Sections: Homepage → Specialized AI Chatbots • Order Page (/order) Chatbot Selection."
        actions={
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Chatbot</span>
          </button>
        }
      />

      {/* Chatbots Cards Grid */}
      {chatbots.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No Specialized Chatbots Found"
          description="You haven't configured any specialized chatbot products yet."
          action={
            <button
              type="button"
              onClick={openAddModal}
              className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Add First Chatbot
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {chatbots.map((bot) => (
            <div
              key={bot.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors text-left"
            >
              <div>
                <div className="relative w-full h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={bot.image}
                    alt={bot.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={bot.status || "Active"} size="sm" />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {bot.title || bot.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(bot)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Chatbot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(bot.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Chatbot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {bot.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bot.tags?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                <span className="font-bold text-indigo-600 font-mono text-sm">
                  {bot.price}
                </span>
                <span className="text-slate-500 text-[11px]">
                  ~{bot.deliveryDays || 7} Days Delivery
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBot ? "Edit Specialized Chatbot" : "Add Specialized Chatbot"}
        subtitle="Configure product details, pricing tag, and frontend tags."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Chatbot Product Title" required>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ai Health Chatbot"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price / Price Tag" required>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. Free or $890.00"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50 font-mono"
              />
            </FormField>

            <FormField label="Delivery Timeline (Days)" required>
              <input
                type="number"
                required
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
              />
            </FormField>
          </div>

          <FormField label="Description" required>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what this chatbot accomplishes..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50 resize-none leading-relaxed"
            />
          </FormField>

          <FormField label="Tags (Comma separated)" hint="e.g. Healthcare, Triage, Multi-Language">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Healthcare, Bengali & English, Triage"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
            />
          </FormField>

          <ImageUpload
            label="Chatbot Graphic (Cloudinary CDN)"
            category="Services"
            value={image}
            onChange={setImage}
            helpText="Directly uploaded to Cloudinary CDN for instant rendering."
          />

          <FormField label="Catalog Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50 cursor-pointer"
            >
              <option value="Active">Active (Visible)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>
          </FormField>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs transition-colors cursor-pointer"
            >
              {editingBot ? "Save Changes" : "Create Chatbot"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Chatbot Product"
        message="Are you sure you want to delete this chatbot from the catalog? This action will remove it from the frontend showcase."
        confirmLabel="Delete Chatbot"
        isDestructive={true}
      />
    </div>
  );
}

export default function ChatbotsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Chatbots...</div>}>
      <ChatbotsContent />
    </Suspense>
  );
}
