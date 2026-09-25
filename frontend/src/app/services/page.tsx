"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Clock, 
  Check, 
  Bot, 
  Layers, 
  Cpu, 
  Box, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from "lucide-react";
import coreServices from "@/data/coreServices.json";
import ConversionCTA from "@/components/ConversionCTA";

const iconMap: Record<string, React.ElementType> = {
  "ai-chatbot": Bot,
  "ai-saas": Layers,
  "custom-ai": Cpu,
  "ai-3d": Box,
  "ai-agents": Cpu,
  "saas-product": Layers,
  "web-app-dev": Box,
  "enterprise-software": Cpu,
};

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = [
    { id: "all", label: "All Services" },
    { id: "ai-chatbot", label: "AI Chatbots" },
    { id: "ai-saas", label: "AI SaaS" },
    { id: "custom-ai", label: "Custom Assistants" },
    { id: "ai-3d", label: "3D & Web Apps" }
  ];

  // Search, Sort, and Filter Logic
  const filteredServices = useMemo(() => {
    let result = [...coreServices];

    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDesc.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // 3. Price slider filter
    result = result.filter((s) => s.startingPrice <= maxPrice);

    // 4. Sort logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "delivery") {
      result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy, maxPrice]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, currentPage]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="pt-28 pb-0 min-h-screen bg-[#fcfbfe] flex flex-col">
      {/* Breadcrumb Section */}
      <div className="bg-[#ebe8fd] py-5 border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between text-[13px] text-gray-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Services</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            Engineering &amp; Solutions
          </span>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="bg-[#ebe8fd] pb-14 pt-8">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] tracking-tight leading-tight">
              Enterprise AI &amp; Software{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#e464a4]">
                Capabilities
              </span>
            </h1>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Tailor-made conversational intelligence, production-ready SaaS frameworks, and custom digital infrastructure designed to scale your business.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-6 py-12 flex-1 w-full">
        {/* Filter & Search Bar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search services by keyword or feature..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b57be4] focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#b57be4] focus:bg-white"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="delivery">Fastest Delivery</option>
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="md:col-span-3 space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Max Budget:</span>
                <span className="text-[#602b0c] font-extrabold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-[#602b0c] cursor-pointer"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#602b0c] text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 font-semibold px-1">
          <span>Showing {paginatedServices.length} of {filteredServices.length} services</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#602b0c] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Services Grid */}
        {paginatedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {paginatedServices.map((srv) => {
              const Icon = iconMap[srv.category] || Bot;
              return (
                <div
                  key={srv.id}
                  className="rounded-2xl bg-white p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center group-hover:bg-[#602b0c] group-hover:text-white transition-colors duration-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-[#602b0c] bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
                        {srv.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-950 group-hover:text-[#602b0c] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {srv.shortDesc}
                      </p>
                    </div>

                    <div className="p-3 bg-[#faf9fe] rounded-xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">From</span>
                        <span className="text-2xl font-black text-gray-950">${srv.startingPrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Timeline</span>
                        <span className="text-xs font-bold text-[#602b0c] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {srv.deliveryDays} Days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {srv.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="flex-1 text-center py-2.5 px-3 border border-gray-300 hover:border-[#602b0c] hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition-all"
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/order?service=${srv.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 bg-gradient-to-r from-[#ff7e5f] to-[#e464a4] text-white text-xs font-black rounded-xl shadow-xs transition-all hover:opacity-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
            <Bot className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No matching services found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms, increasing your budget slider, or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setMaxPrice(1000);
              }}
              className="px-5 py-2.5 bg-[#602b0c] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-[#602b0c] text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Signature Brain Bari CTA Section */}
      <ConversionCTA />
    </div>
  );
}
