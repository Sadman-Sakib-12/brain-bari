"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBlogs, useCmsContent } from "@/hooks/useApi";

interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date?: string;
  author?: string;
  readTime?: string;
  excerpt: string;
  status?: string;
  image: string;
  previewHeading?: string;
  points?: string[];
  [key: string]: any;
}

export default function BlogPage() {
  const { data: blogs = [] } = useBlogs();
  const { data: pageCms } = useCmsContent<any>("blogPage");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    (blogs || []).forEach((b: any) => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach((t: string) => {
          if (t && t.trim()) set.add(t.trim());
        });
      }
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    const list = Array.from(set);
    return list.length > 0 ? ["All", ...list] : ["All", "AI Trends", "Web Development", "Case Studies"];
  }, [blogs]);

  const blogItems: BlogPost[] = (blogs || []).map((b: any) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    category: Array.isArray(b.tags) && b.tags.length > 0 ? b.tags[0] : (b.category || "AI Trends"),
    date: new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    author: b.author || "Brain Bari Team",
    excerpt: b.excerpt || (b.content ? b.content.slice(0, 160) + "..." : ""),
    image: b.coverImage || b.thumbnail || b.image || "",
  }));

  const filteredBlogs = blogItems.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const headingText = pageCms?.heading || "Innovation meets expertise in our range of service";
  const bannerImg = pageCms?.bannerImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=80";
  const placeholderText = pageCms?.searchPlaceholder || "Type to start searching...";

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden pt-40 md:pt-36">
      {/* 1. Header Title */}
      <section className="text-center px-6 mb-8">
        <h1 className="text-[34px] md:text-[40px] font-medium text-black tracking-tight leading-snug max-w-[600px] mx-auto font-sans">
          {headingText}
        </h1>
      </section>

      {/* 2. Banner with Centered Search Box */}
      <section className="px-6 mb-12">
        <div className="max-w-[1300px] mx-auto relative rounded-3xl overflow-hidden shadow-sm h-[200px] md:h-[260px] bg-gradient-to-r from-purple-900 via-indigo-950 to-blue-900">
          <img
            src={bannerImg}
            alt="AI Service Banner"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-8 left-0 w-full flex justify-center px-6 z-10">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center w-full max-w-[600px] bg-white rounded-full border border-blue-400 p-1 shadow-sm"
            >
              <input
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent text-[13px] sm:text-[14px] px-3 sm:px-6 py-2 border-none outline-none text-gray-800 min-w-0"
              />
              <button
                type="submit"
                className="bg-[#2b2b2b] text-white px-4 sm:px-8 py-2 sm:py-2.5 text-[13px] sm:text-[14px] rounded-full font-medium hover:bg-black transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Category Slider / Ribbon */}
      <section className="px-6 mb-16">
        <div className="max-w-[1300px] mx-auto overflow-hidden">
          <div className="w-full relative mb-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 px-2 md:px-6">
              {categories.map((cat, idx) => (
                <React.Fragment key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[14px] md:text-[15px] whitespace-nowrap transition-colors font-medium cursor-pointer ${selectedCategory === cat ? "text-blue-600 font-bold" : "text-black hover:text-blue-600"
                      }`}
                  >
                    {cat}
                  </button>
                  {idx < categories.length - 1 && (
                    <div className="hidden sm:block w-[1.5px] h-4 bg-blue-500/60 shrink-0"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Blog Posts List Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((post) => (
              <div
                key={post.id}
                className="flex flex-col md:flex-row bg-[#ebe8fd] rounded-[20px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="relative w-full md:w-[32%] h-[240px] md:h-auto shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover md:object-center"
                  />
                </div>

                <div className="w-full md:w-[68%] p-6 md:py-8 md:px-10 flex flex-col justify-between">
                  <div>
                    <h2 className="text-[18px] md:text-[20px] font-medium text-black mb-2 leading-snug font-sans">
                      {post.title}
                    </h2>
                    <div className="text-[13px] text-gray-800 leading-relaxed font-light space-y-3">
                      {post.previewHeading && (
                        <p className="font-semibold text-gray-900">{post.previewHeading}</p>
                      )}
                      <p className="text-gray-700">{post.excerpt}</p>
                      {post.points && (
                        <ul className="list-disc pl-5 space-y-0.5 text-gray-700 text-xs">
                          {post.points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/contact?subject=Inquiry regarding: ${encodeURIComponent(post.title)}`}
                      className="inline-block bg-[#752a02] text-white text-[13px] font-medium px-6 py-2 rounded-full hover:bg-[#571e00] transition-colors shadow-sm"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#ebe8fd] rounded-[20px] p-8 max-w-[600px] mx-auto">
              <h3 className="text-lg font-bold text-gray-900">No blog posts found</h3>
              <p className="text-sm text-gray-600 mt-2">Articles and insights will be published here shortly.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
