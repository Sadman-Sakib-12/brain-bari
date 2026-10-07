import api from "./axios";

// -------------------------------------------------------------
// Admin API Service Layer (Direct connection to PostgreSQL DB)
// -------------------------------------------------------------

export const adminApi = {
  // Services
  getServices: async () => {
    try {
      const res = await api.get("/services");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend services:", err);
      return [];
    }
  },
  createService: async (serviceData: any) => {
    const res = await api.post("/services", serviceData);
    return res.data?.data;
  },
  updateService: async (id: string, serviceData: any) => {
    const res = await api.patch(`/services/${id}`, serviceData);
    return res.data?.data;
  },
  deleteService: async (id: string) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
  },

  // Chatbots
  getChatbots: async () => {
    try {
      const res = await api.get("/chatbots");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend chatbots:", err);
      return [];
    }
  },
  createChatbot: async (chatbotData: any) => {
    const res = await api.post("/chatbots", chatbotData);
    return res.data?.data;
  },
  updateChatbot: async (id: string, chatbotData: any) => {
    const res = await api.patch(`/chatbots/${id}`, chatbotData);
    return res.data?.data;
  },
  deleteChatbot: async (id: string) => {
    const res = await api.delete(`/chatbots/${id}`);
    return res.data;
  },

  // Products
  getProducts: async () => {
    try {
      const res = await api.get("/products");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend products:", err);
      return [];
    }
  },
  createProduct: async (productData: any) => {
    const res = await api.post("/products", productData);
    return res.data?.data;
  },
  updateProduct: async (id: string, productData: any) => {
    const res = await api.patch(`/products/${id}`, productData);
    return res.data?.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  // Portfolios / Projects
  getPortfolios: async () => {
    try {
      const res = await api.get("/portfolios");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend portfolios:", err);
      return [];
    }
  },
  createPortfolio: async (portfolioData: any) => {
    const res = await api.post("/portfolios", portfolioData);
    return res.data?.data;
  },
  updatePortfolio: async (id: string, portfolioData: any) => {
    const res = await api.patch(`/portfolios/${id}`, portfolioData);
    return res.data?.data;
  },
  deletePortfolio: async (id: string) => {
    const res = await api.delete(`/portfolios/${id}`);
    return res.data;
  },

  // Blogs
  getBlogs: async () => {
    try {
      const res = await api.get("/blogs");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend blogs:", err);
      return [];
    }
  },
  createBlog: async (blogData: any) => {
    const res = await api.post("/blogs", blogData);
    return res.data?.data;
  },
  updateBlog: async (id: string, blogData: any) => {
    const res = await api.patch(`/blogs/${id}`, blogData);
    return res.data?.data;
  },
  deleteBlog: async (id: string) => {
    const res = await api.delete(`/blogs/${id}`);
    return res.data;
  },

  // FAQs
  getFaqs: async () => {
    try {
      const res = await api.get("/faqs");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend faqs:", err);
      return [];
    }
  },
  createFaq: async (faqData: any) => {
    const res = await api.post("/faqs", faqData);
    return res.data?.data;
  },
  updateFaq: async (id: string, faqData: any) => {
    const res = await api.patch(`/faqs/${id}`, faqData);
    return res.data?.data;
  },
  deleteFaq: async (id: string) => {
    const res = await api.delete(`/faqs/${id}`);
    return res.data;
  },

  // Orders
  getAllOrders: async () => {
    try {
      const res = await api.get("/orders/admin/all");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend orders:", err);
      return [];
    }
  },
  createOrder: async (orderData: any) => {
    const res = await api.post("/orders", orderData);
    return res.data?.data;
  },
  updateOrderQuote: async (id: string, payload: { quotedPrice?: number; quotePrice?: number; status: string }) => {
    const rawPrice = payload.quotePrice !== undefined ? payload.quotePrice : payload.quotedPrice;
    const body = {
      ...payload,
      quotePrice: rawPrice,
      quotedPrice: rawPrice,
      status: payload.status ? payload.status.toUpperCase().replace(/\s+/g, "_") : undefined,
    };
    const res = await api.patch(`/orders/${id}/quote`, body);
    return res.data?.data;
  },
  deleteOrder: async (id: string) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },

  // Bookings / Consultations
  getAllBookings: async () => {
    try {
      const res = await api.get("/bookings/admin/all");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend bookings:", err);
      return [];
    }
  },
  createBooking: async (bookingData: any) => {
    const res = await api.post("/bookings", bookingData);
    return res.data?.data;
  },
  updateBookingStatus: async (id: string, status: string) => {
    const normalizedStatus = status ? status.toUpperCase().replace(/\s+/g, "_") : status;
    const res = await api.patch(`/bookings/${id}/status`, { status: normalizedStatus });
    return res.data?.data;
  },
  deleteBooking: async (id: string) => {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  },

  // Contact Messages
  getAllContactMessages: async () => {
    try {
      const res = await api.get("/cms/contact/all");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend contact messages:", err);
      return [];
    }
  },
  updateContactMessageStatus: async (id: string, status: string) => {
    const res = await api.patch(`/cms/contact/${id}/status`, { status });
    return res.data?.data;
  },
  deleteContactMessage: async (id: string) => {
    const res = await api.delete(`/cms/contact/${id}`);
    return res.data;
  },

  // Dynamic CMS Content (Sections: whyChooseUs, about, caseStudiesPage, servicePackages, team, partners, events, reviews)
  getContent: async (key: string) => {
    try {
      const res = await api.get(`/cms/content/${key}`);
      return res.data?.data;
    } catch (err) {
      console.warn(`Failed to fetch backend CMS content for key '${key}':`, err);
      return null;
    }
  },
  saveContent: async (key: string, data: any) => {
    const res = await api.put(`/cms/content/${key}`, { data });
    return res.data?.data;
  },

  // Site Settings
  getSettings: async () => {
    try {
      const res = await api.get("/cms/settings");
      return res.data?.data;
    } catch (err) {
      console.warn("Failed to fetch backend settings:", err);
      return null;
    }
  },
  updateSettings: async (settingsData: any) => {
    const res = await api.patch("/cms/settings", settingsData);
    return res.data?.data;
  },
  // Analytics
  getAnalytics: async () => {
    try {
      const res = await api.get("/analytics/admin-stats");
      return res.data?.data;
    } catch (err) {
      console.warn("Failed to fetch backend analytics:", err);
      return null;
    }
  },

  // Users Management (Real PostgreSQL Database)
  getUsers: async () => {
    try {
      const res = await api.get("/users?limit=100");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch backend users:", err);
      return [];
    }
  },
  createUser: async (userData: any) => {
    const res = await api.post("/users", userData);
    return res.data?.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const res = await api.patch(`/users/${id}/role`, { role });
    return res.data?.data;
  },
  updateUserProfile: async (id: string, data: any) => {
    const res = await api.patch(`/users/${id}/profile`, data);
    return res.data?.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // Media Library & Cloudinary Uploads
  getMediaList: async () => {
    try {
      const res = await api.get("/media");
      return res.data?.data || [];
    } catch (err) {
      console.warn("Failed to fetch media library from backend:", err);
      // Fallback to cms/content/media
      try {
        const fallback = await api.get("/cms/content/media");
        return fallback.data?.data || [];
      } catch {
        return [];
      }
    }
  },
  uploadMedia: async (file: File, category: string = "General Assets") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("folder", "brain-bari");

    const res = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data?.data;
  },
  deleteMediaAsset: async (id: string) => {
    const res = await api.delete(`/media/${encodeURIComponent(id)}`);
    return res.data;
  },
};

