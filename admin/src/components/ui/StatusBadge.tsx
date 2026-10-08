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

  const styleMap: Record<StatusVariant, { badge: string; dot: string }> = {
    pending: { badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
    approved: { badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
    in_progress: { badge: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20", dot: "bg-purple-500 animate-pulse" },
    completed: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    rejected: { badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
    active: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    inactive: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
    draft: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
    published: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    upcoming: { badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20", dot: "bg-indigo-500" },
    new: { badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20", dot: "bg-cyan-500 animate-pulse" },
    read: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
    responded: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    default: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" }
  };

  const current = styleMap[normalized] || styleMap.default;
  const sizeStyle = size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-[11px] px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.badge} ${sizeStyle} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{status}</span>
    </span>
  );
}
