"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Save,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  Tag,
  Clock,
  Layers,
  ExternalLink
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialBlogs from "@/data/blogs.json";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

type BlogTab = "posts" | "categories" | "tags";

const CATEGORIES = ["AI Trends", "Tutorial", "Case Study", "Industry Insights", "News", "Company Update"];
const TAGS = ["LLM", "Chatbots", "Bangladesh Tech", "SaaS", "Automation", "Career", "Youth"];

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as BlogTab) || "posts";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<BlogTab>(initialTab);
  const [blogs, setBlogs] = useState<any[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewBlog, setPreviewBlog] = useState<any | null>(null);

  // Form fields
  const [form, setForm] = useState({
    title: "",
    category: "AI Trends",
    excerpt: "",
    previewHeading: "Key Takeaways & Industry Overview",
    points: ["Critical technological shifts and workforce demands", "Strategic implementation roadmap for businesses"],
    content: "",
    readTime: "5 min read",
    author: "Brain Bari Team",
    image: "",
    published: true,
    publishedDate: new Date().toISOString().split("T")[0]
  });
  const [pointInput, setPointInput] = useState("");

  const loadBlogs = () => {
    try {
      const stored = adminStore.getBlogs();
      if (stored && stored.length > 0) setBlogs(stored);
    } catch {
      setBlogs(initialBlogs);
    }
  };

  useEffect(() => {
    loadBlogs();
    window.addEventListener("admin_store_updated", loadBlogs);
    return () => window.removeEventListener("admin_store_updated", loadBlogs);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as BlogTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["posts", "categories", "tags"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const openAdd = () => {
    setEditingBlog(null);
    setForm({
      title: "",
      category: "AI Trends",
      excerpt: "",
      previewHeading: "Key Takeaways & Industry Overview",
      points: ["Critical technological shifts and workforce demands", "Strategic implementation roadmap for businesses"],
      content: "",
      readTime: "5 min read",
      author: "Brain Bari Editorial",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      published: true,
      publishedDate: new Date().toISOString().split("T")[0]
    });
    setPointInput("");
    setShowModal(true);
  };

  const openEdit = (blog: any) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || "",
      category: blog.category || "AI Trends",
      excerpt: blog.excerpt || "",
      previewHeading: blog.previewHeading || "",
      points: Array.isArray(blog.points) ? blog.points : [],
      content: blog.content || "",
      readTime: blog.readTime || "5 min read",
      author: blog.author || "Brain Bari Team",
      image: blog.image || "",
      published: blog.published !== false,
      publishedDate: blog.date || blog.publishedDate || new Date().toISOString().split("T")[0]
    });
    setPointInput("");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    const validPoints = Array.isArray(form.points) ? form.points.filter(Boolean) : [];

    if (editingBlog) {
      const updated = blogs.map((b) => {
        if (b.id === editingBlog.id) {
          return {
            ...b,
            ...form,
            points: validPoints,
            slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            date: form.publishedDate
          };
        }
        return b;
      });
      setBlogs(updated);
      adminStore.setBlogs(updated);
      toast.success("Blog post updated.");
    } else {
      const newPost = {
        id: `blog-${Date.now()}`,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        ...form,
        points: validPoints,
        date: form.publishedDate
      };
      const updated = [newPost, ...blogs];
      setBlogs(updated);
      adminStore.setBlogs(updated);
      toast.success("Blog post created.");
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = blogs.filter((b) => b.id !== deleteConfirmId);
    setBlogs(updated);
    adminStore.setBlogs(updated);
    toast.success("Blog post removed.");
    setDeleteConfirmId(null);
  };

  const togglePublished = (blogId: string) => {
    const updated = blogs.map((b) => {
      if (b.id === blogId) {
        return { ...b, published: !b.published };
      }
      return b;
    });
    setBlogs(updated);
    adminStore.setBlogs(updated);
    toast.info("Status toggled.");
  };

  // Filter and search
  const filteredBlogs = blogs.filter((b) => {
    const matchSearch =
      (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || (b.category || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Published" && b.published !== false) ||
      (selectedStatus === "Draft" && b.published === false);

    return matchSearch && matchCategory && matchStatus;
  });

  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Editorial"
        title="Blog &amp; Publications"
        description="Publish technological articles, AI engineering tutorials, and company announcements with live preview."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Post</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "posts", label: "All Posts", icon: BookOpen, count: blogs.length },
            { id: "categories", label: "Categories", icon: Layers, count: CATEGORIES.length },
            { id: "tags", label: "Tags", icon: Tag, count: TAGS.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as BlogTab);
                  router.push(tab.id === "posts" ? "/blog" : `/blog?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: ALL POSTS (PROFESSIONAL DATA TABLE / LIST PATTERN) */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search by title, author, or excerpt..."
              className="w-full sm:w-80"
            />

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
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
                            onClick={() => togglePublished(b.id)}
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
                              onClick={() => setPreviewBlog(b)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Preview Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(b)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(b.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
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
              totalItems={filteredBlogs.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {blogs.filter((b) => (b.category || "").toLowerCase() === cat.toLowerCase()).length} posts
                </span>
              </div>
              <p className="text-xs text-slate-500">Editorial series on {cat} across local and international sectors.</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TAGS */}
      {activeTab === "tags" && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Active Keyword Tags</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {TAGS.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBlog ? "Edit Blog Article" : "Draft New Article"}
        subtitle="Write editorial content, choose publication date, and set cover imagery."
        maxWidth="3xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingBlog ? "Save Changes" : "Publish Article"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <FormField label="Article Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. How AI Is Changing Skill Development in Bangladesh"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Author">
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Publication Date">
              <input
                type="date"
                value={form.publishedDate}
                onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </FormField>
          </div>

          <FormField label="Short Summary / Excerpt">
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Summary shown on article cards and search results."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Card Preview Subheading (previewHeading)">
            <input
              type="text"
              value={form.previewHeading}
              onChange={(e) => setForm({ ...form, previewHeading: e.target.value })}
              placeholder="e.g. Key Takeaways & Industry Overview"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
            />
          </FormField>

          {/* Points List Repeater */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs">
              <span>Frontend Bullet Points (points[]) ({form.points?.length || 0})</span>
            </h4>

            <div className="space-y-1.5">
              {form.points?.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const updated = [...form.points];
                      updated[pIdx] = e.target.value;
                      setForm({ ...form, points: updated });
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = form.points.filter((_, i) => i !== pIdx);
                      setForm({ ...form, points: updated });
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={pointInput}
                onChange={(e) => setPointInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pointInput.trim()) {
                    e.preventDefault();
                    setForm({ ...form, points: [...(form.points || []), pointInput.trim()] });
                    setPointInput("");
                  }
                }}
                placeholder="Type bullet point and click Add Point"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (pointInput.trim()) {
                    setForm({ ...form, points: [...(form.points || []), pointInput.trim()] });
                    setPointInput("");
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer text-xs shrink-0"
              >
                Add Point
              </button>
            </div>
          </div>

          <FormField label="Full Article Body Content">
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full text or markdown content..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cover Image URL">
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
              />
            </FormField>

            <FormField label="Read Time">
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="5 min read"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="publishedCheck"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="publishedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Visible as Published on Public Blog
            </label>
          </div>
        </div>
      </Modal>

      {/* ARTICLE PREVIEW MODAL */}
      {previewBlog && (
        <Modal
          isOpen={!!previewBlog}
          onClose={() => setPreviewBlog(null)}
          title="Article Preview"
          subtitle={`By ${previewBlog.author} · ${previewBlog.readTime || "5 min read"}`}
          maxWidth="2xl"
          footer={
            <button
              type="button"
              onClick={() => setPreviewBlog(null)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Close Preview
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            {previewBlog.image && (
              <img
                src={previewBlog.image}
                alt={previewBlog.title}
                className="w-full h-48 object-cover rounded-xl border border-slate-200"
              />
            )}
            <h2 className="text-lg font-bold text-slate-900">{previewBlog.title}</h2>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <span>{previewBlog.category}</span>
              <span>·</span>
              <span>{previewBlog.date || previewBlog.publishedDate || "2026-09-15"}</span>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {previewBlog.content || previewBlog.excerpt}
            </p>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this blog post?"
        confirmLabel="Delete Post"
        isDestructive={true}
      />
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Blog...</div>}>
      <BlogContent />
    </Suspense>
  );
}
