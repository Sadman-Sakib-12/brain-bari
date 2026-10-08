import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = ""
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
  const endIdx = Math.min(totalItems, currentPage * pageSize);

  if (totalPages <= 1 && totalItems <= pageSize) {
    return (
      <div className={`flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-3 px-4 ${className}`}>
        <span>Showing all {totalItems} entries</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 py-3 px-4 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <div>
        Showing <span className="font-semibold text-slate-900 dark:text-slate-200">{startIdx}</span> to{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{endIdx}</span> of{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          if (totalPages > 6 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
            return null;
          }
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                currentPage === p
                  ? "bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 font-bold shadow-2xs"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
