"use client";

import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";

interface BlogTableTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  paginatedBlogs: any[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onTogglePublished: (id: string) => void;
  onPreview: (b: any) => void;
  onEdit: (b: any) => void;
  onDelete: (id: string) => void;
}

export default function BlogTableTab({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedStatus,
  onStatusChange,
  paginatedBlogs,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onTogglePublished,
  onPreview,
  onEdit,
  onDelete
}: BlogTableTabProps) {
  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search articles by title or keyword..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2">
          <FilterBar
            options={["All", ...categories]}
            activeId={selectedCategory}
            onChange={onCategoryChange}
          />
          <FilterBar
            options={["All", "Published", "Draft"]}
            activeId={selectedStatus}
            onChange={onStatusChange}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Author</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Published Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No blog posts match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">{b.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{b.excerpt || b.content}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium whitespace-nowrap">
                      {b.author || "Brain Bari Editorial"}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {b.category || "AI Trends"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onTogglePublished(b.id)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <StatusBadge status={b.published !== false ? "Published" : "Draft"} size="sm" />
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono whitespace-nowrap">
                      {b.date || b.publishedDate || "2026-09-15"}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreview(b)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Preview Article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(b)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
