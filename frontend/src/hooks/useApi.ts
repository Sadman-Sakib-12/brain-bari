"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// -------------------------------------------------------------
// 1. Core Services Query Hooks (Backend Database Single Source of Truth)
// -------------------------------------------------------------
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await api.get("/services");
        const list = res.data?.data;
        if (Array.isArray(list)) {
          return list.map((s: any) => ({
            id: s.id,
            slug: s.slug || s.title?.toLowerCase().replace(/\s+/g, "-"),
            title: s.title,
            category: s.category,
            badge: s.badge || "",
            startingPrice: s.price ?? 0,
            deliveryDays: s.deliveryDays ?? 7,
            shortDesc: s.shortDesc || "",
            fullDesc: s.fullDesc || s.shortDesc || "",
            features: Array.isArray(s.features) ? s.features : [],
            image: s.image || "",
            rating: 5.0,
            active: s.isActive ?? true,
          }));
        }
        return [];
      } catch (err) {
        console.error("Backend services error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useService(idOrSlug: string) {
  return useQuery({
    queryKey: ["service", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      try {
        const res = await api.get(`/services/${idOrSlug}`);
        return res.data?.data || null;
      } catch (err) {
        console.error("Backend service detail error:", err);
        return null;
      }
    },
    enabled: !!idOrSlug,
  });
}

// -------------------------------------------------------------
// 2. Specialized Chatbots Query Hook
// -------------------------------------------------------------
export function useChatbots() {
  return useQuery({
    queryKey: ["chatbots"],
    queryFn: async () => {
      try {
        const res = await api.get("/chatbots");
        const list = res.data?.data;
        if (Array.isArray(list)) {
          return list.map((c: any) => ({
            id: c.id,
            name: c.name,
            category: c.category,
            startingPrice: c.price ?? 0,
            deliveryDays: c.deliveryTime ? parseInt(c.deliveryTime) || 4 : 4,
            shortDesc: c.description || "",
            features: Array.isArray(c.tags) ? c.tags : [],
            image: c.image || "",
            liveDemo: c.liveDemo || "",
            active: c.isActive ?? true,
          }));
        }
        return [];
      } catch (err) {
        console.error("Backend chatbots error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

// -------------------------------------------------------------
// 3. Products Query Hook (SaaS Platforms & AI Solutions)
// -------------------------------------------------------------
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await api.get("/products");
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (err) {
        console.error("Backend products error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      try {
        const res = await api.get(`/products/${idOrSlug}`);
        return res.data?.data || null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!idOrSlug,
  });
}

// -------------------------------------------------------------
// 4. Portfolio & Work Projects Query Hooks
// -------------------------------------------------------------
export function usePortfolios(category?: string) {
  return useQuery({
    queryKey: ["portfolios", category],
    queryFn: async () => {
      try {
        const url = category && category !== "all" ? `/portfolios?category=${category}` : "/portfolios";
        const res = await api.get(url);
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (err) {
        console.error("Backend portfolios error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

export function usePortfolio(idOrSlug: string) {
  return useQuery({
    queryKey: ["portfolio", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      try {
        const res = await api.get(`/portfolios/${idOrSlug}`);
        return res.data?.data || null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!idOrSlug,
  });
}

// -------------------------------------------------------------
// 5. Site Settings Query Hook (CMS)
// -------------------------------------------------------------
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      try {
        const res = await api.get("/cms/settings");
        return res.data?.data || null;
      } catch (err) {
        console.error("Backend site settings error:", err);
        return null;
      }
    },
    staleTime: 60 * 1000,
  });
}

// -------------------------------------------------------------
// 6. Generic CMS Content Hook (Database Single Source)
// -------------------------------------------------------------
export function useCmsContent<T = any>(key: string) {
  return useQuery<T | null>({
    queryKey: ["cms-content", key],
    queryFn: async () => {
      try {
        const res = await api.get(`/cms/content/${key}`);
        return res.data?.data ?? null;
      } catch (err) {
        return null;
      }
    },
    staleTime: 60 * 1000,
  });
}

// -------------------------------------------------------------
// 7. Blogs Query Hooks
// -------------------------------------------------------------
export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      try {
        const res = await api.get("/blogs");
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (err) {
        console.error("Backend blogs error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useBlog(idOrSlug: string) {
  return useQuery({
    queryKey: ["blog", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      try {
        const res = await api.get(`/blogs/${idOrSlug}`);
        return res.data?.data || null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!idOrSlug,
  });
}

// -------------------------------------------------------------
// 8. FAQs Query Hook
// -------------------------------------------------------------
export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      try {
        const res = await api.get("/faqs");
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (err) {
        console.error("Backend faqs error:", err);
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

// -------------------------------------------------------------
// 9. Create Order Mutation Hook
// -------------------------------------------------------------
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderPayload: {
      name: string;
      email: string;
      phone: string;
      selectedServices?: string[];
      message?: string;
      serviceTitle?: string;
      budget?: string;
      requirements?: string;
    }) => {
      const svcName = orderPayload.serviceTitle || (orderPayload.selectedServices?.join(", ") || "Custom AI Solutions");
      const backendRes = await api.post("/orders", {
        serviceName: svcName,
        serviceTitle: svcName,
        requirements: orderPayload.requirements || orderPayload.message || "Consultation Request",
        budget: orderPayload.budget || "Custom Quote",
        clientName: orderPayload.name,
        clientEmail: orderPayload.email,
        clientPhone: orderPayload.phone,
      });

      return backendRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// -------------------------------------------------------------
// 10. Create Consultation Booking Mutation Hook
// -------------------------------------------------------------
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingPayload: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      date?: string;
      timeSlot?: string;
      topic?: string;
      message?: string;
    }) => {
      const backendRes = await api.post("/bookings", {
        name: bookingPayload.name,
        email: bookingPayload.email,
        phone: bookingPayload.phone || "",
        company: bookingPayload.company || "",
        topic: bookingPayload.topic || "AI Consultation",
        date: bookingPayload.date || new Date().toISOString().split("T")[0],
        timeSlot: bookingPayload.timeSlot || "",
        message: bookingPayload.message || "",
        clientName: bookingPayload.name,
        clientEmail: bookingPayload.email,
        clientPhone: bookingPayload.phone || "",
        notes: bookingPayload.message || "",
      });

      return backendRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// -------------------------------------------------------------
// 11. Submit Contact Message Mutation Hook
// -------------------------------------------------------------
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone?: string;
      message: string;
      selectedServices?: string[];
    }) => {
      const res = await api.post("/cms/contact", payload);
      return res.data;
    },
  });
}
