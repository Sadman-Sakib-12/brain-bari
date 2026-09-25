import React from "react";

export type StatusVariant =
  | "pending"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected"
  | "active"
  | "inactive"
  | "draft"
  | "published"
  | "upcoming"
  | "new"
  | "read"
  | "responded"
  | "default";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  variant,
  className = "",
  size = "md"
}: StatusBadgeProps) {
  // Normalize status string if variant not explicitly provided
  const normalized = (variant || status.toLowerCase().replace(/\s+/g, "_")) as StatusVariant;

  const styleMap: Record<StatusVariant, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-slate-100 text-slate-600 border-slate-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    upcoming: "bg-indigo-50 text-indigo-700 border-indigo-200",
    new: "bg-indigo-50 text-indigo-700 border-indigo-200",
    read: "bg-slate-100 text-slate-600 border-slate-200",
    responded: "bg-emerald-50 text-emerald-700 border-emerald-200",
    default: "bg-slate-100 text-slate-600 border-slate-200"
  };

  const badgeStyle = styleMap[normalized] || styleMap.default;
  const sizeStyle = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${badgeStyle} ${sizeStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      <span>{status}</span>
    </span>
  );
}
