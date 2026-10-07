"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Save,
  Tag,
  Layers
} from "lucide-react";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import BlogModal from "./components/BlogModal";
import BlogPreviewModal from "./components/BlogPreviewModal";
import BlogTableTab from "./components/BlogTableTab";
import BlogCategoriesTab from "./components/BlogCategoriesTab";
import BlogTagsTab from "./components/BlogTagsTab";

type BlogTab = "posts" | "categories" | "tags";

const CATEGORIES = ["AI Trends", "Tutorial", "Case Study", "Industry Insights", "News", "Company Update"];
const TAGS = ["LLM", "Chatbots", "Bangladesh Tech", "SaaS", "Automation", "Career", "Youth"];

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as BlogTab) || "posts";

  const [activeTab, setActiveTab] = useState<BlogTab>(initialTab);
  const [blogs, setBlogs] = useState<any[]>([]);
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
    previewHeading: "",
    points: [] as string[],
    content: "",
    readTime: "",
    author: "",
    image: "",
    published: true,
    publishedDate: new Date().toISOString().split("T")[0]
  });

  const loadBlogs = () => {
    adminApi.getBlogs().then((res) => {
      if (res && res.length > 0) setBlogs(res);
      else setBlogs(adminStore.getBlogs());
    }).catch(() => {
      setBlogs(adminStore.getBlogs());
    });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openAdd = () => {
    setEditingBlog(null);
    setForm({
      title: "",
      category: "AI Trends",
      excerpt: "",
      previewHeading: "",
      points: [],
      content: "",
      readTime: "",
      author: "",
      image: "",
      published: true,
      publishedDate: new Date().toISOString().split("T")[0]
    });
    setShowModal(true);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as BlogTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["posts", "categories", "tags"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    const validPoints = Array.isArray(form.points) ? form.points.filter(Boolean) : [];
    const blogSlug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingBlog) {
      const updated = blogs.map((b) => {
        if (b.id === editingBlog.id) {
          return {
            ...b,
            ...form,
            points: validPoints,
            slug: blogSlug,
            date: form.publishedDate
          };
        }
        return b;
      });

      adminApi.updateBlog(editingBlog.id, {
        title: form.title,
        slug: blogSlug,
        category: form.category,
        excerpt: form.excerpt,
        content: form.content,
        previewHeading: form.previewHeading,
        points: validPoints,
        coverImage: form.image,
        author: form.author,
        readTime: form.readTime,
        published: form.published,
      }).catch((err) => console.warn(err));

      setBlogs(updated);
      adminStore.setBlogs(updated);
      toast.success(`Post "${form.title}" updated.`);
    } else {
      adminApi.createBlog({
        title: form.title,
        slug: blogSlug,
        category: form.category,
        excerpt: form.excerpt,
        content: form.content,
        previewHeading: form.previewHeading,
        points: validPoints,
        coverImage: form.image,
        author: form.author,
        readTime: form.readTime,
        published: form.published,
      }).then((created) => {
        if (created) {
          setBlogs((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
        }
      }).catch((err) => console.warn(err));

      const newBlog = {
        id: `blog-${Date.now()}`,
        ...form,
        points: validPoints,
        slug: blogSlug,
        date: form.publishedDate
      };
      const updated = [newBlog, ...blogs];
      setBlogs(updated);
      adminStore.setBlogs(updated);
      toast.success(`Post "${form.title}" published.`);
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    adminApi.deleteBlog(deleteConfirmId).catch((err) => console.warn(err));
    const updated = blogs.filter((b) => b.id !== deleteConfirmId);
    setBlogs(updated);
    adminStore.setBlogs(updated);
    toast.success("Blog post deleted.");
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
    toast.info("Publication status updated.");
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchSearch =
      (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || b.category === selectedCategory;
    const matchStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Published" ? b.published !== false : b.published === false);
    return matchSearch && matchCat && matchStatus;
  });

  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Editorial"
        title="Blog & Articles"
        description="Publish knowledge hub articles, research summaries, and engineering insights. Managed Frontend Section: Blog Page (/resources/blog & /blog)."
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write New Article</span>
          </button>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "posts", label: "Articles", icon: BookOpen, count: blogs.length },
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

      {/* TAB 1: ALL ARTICLES TABLE */}
      {activeTab === "posts" && (
        <BlogTableTab
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => {
            setSelectedCategory(c);
            setCurrentPage(1);
          }}
          categories={CATEGORIES}
          selectedStatus={selectedStatus}
          onStatusChange={(s) => {
            setSelectedStatus(s);
            setCurrentPage(1);
          }}
          paginatedBlogs={paginatedBlogs}
          totalItems={filteredBlogs.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onTogglePublished={togglePublished}
          onPreview={(b) => setPreviewBlog(b)}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === "categories" && (
        <BlogCategoriesTab categories={CATEGORIES} blogs={blogs} />
      )}

      {/* TAB 3: TAGS */}
      {activeTab === "tags" && <BlogTagsTab tags={TAGS} />}

      {/* ADD / EDIT MODAL */}
      <BlogModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingBlog={editingBlog}
        form={form}
        setForm={setForm}
        categories={CATEGORIES}
        onSave={handleSave}
      />

      {/* ARTICLE PREVIEW MODAL */}
      <BlogPreviewModal
        previewBlog={previewBlog}
        onClose={() => setPreviewBlog(null)}
      />

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
