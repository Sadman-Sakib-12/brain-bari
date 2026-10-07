"use client";

const inMemoryCache: Record<string, any> = {};

function getMemory<T>(key: string, fallback: T): T {
  if (inMemoryCache[key] !== undefined) {
    return inMemoryCache[key];
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`brainbari_store_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        inMemoryCache[key] = parsed;
        return parsed;
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  }
  return fallback;
}

function setMemory<T>(key: string, value: T): void {
  inMemoryCache[key] = value;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`brainbari_store_${key}`, JSON.stringify(value));
    } catch (e) {
      // ignore storage errors
    }
  }
}

// Initial empty states when database has no records
const emptyArray: any[] = [];
const emptyObject: Record<string, any> = {};

export const adminStore = {
  getOrders: () => getMemory("orders", emptyArray),
  setOrders: (orders: any[]) => setMemory("orders", orders),

  getConsultations: () => getMemory("consultations", emptyArray),
  setConsultations: (consultations: any[]) => setMemory("consultations", consultations),

  getServices: () => getMemory("services", emptyArray),
  setServices: (services: any[]) => setMemory("services", services),

  getChatbots: () => getMemory("chatbots", emptyArray),
  setChatbots: (chatbots: any[]) => setMemory("chatbots", chatbots),

  getPortfolio: () => getMemory("portfolio", emptyArray),
  setPortfolio: (portfolio: any[]) => setMemory("portfolio", portfolio),

  getProducts: () => getMemory("products", emptyArray),
  setProducts: (products: any[]) => setMemory("products", products),

  getTeam: () => getMemory("team", emptyArray),
  setTeam: (team: any[]) => setMemory("team", team),

  getBlogs: () => getMemory("blogs", emptyArray),
  setBlogs: (blogs: any[]) => setMemory("blogs", blogs),

  getFaqs: () => getMemory("faqs", emptyArray),
  setFaqs: (faqs: any[]) => setMemory("faqs", faqs),

  getUsers: () => getMemory("users", emptyArray),
  setUsers: (users: any[]) => setMemory("users", users),

  getSettings: () => getMemory("settings", emptyObject),
  setSettings: (settings: any) => setMemory("settings", settings),

  getWhyChooseUs: () => getMemory("whyChooseUs", emptyArray),
  setWhyChooseUs: (whyChooseUs: any[]) => setMemory("whyChooseUs", whyChooseUs),

  getEvents: () => getMemory("events", emptyArray),
  setEvents: (events: any[]) => setMemory("events", events),

  getCaseStudies: () => getMemory("caseStudies", emptyArray),
  setCaseStudies: (caseStudies: any[]) => setMemory("caseStudies", caseStudies),

  getCaseStudiesPage: () => getMemory("caseStudiesPage", emptyObject),
  setCaseStudiesPage: (data: any) => setMemory("caseStudiesPage", data),

  getPartners: () => getMemory("partners", emptyArray),
  setPartners: (partners: any[]) => setMemory("partners", partners),

  getAbout: () => getMemory("about", emptyObject),
  setAbout: (about: any) => setMemory("about", about),

  getIndustryExpertises: () => getMemory("industryExpertises", emptyArray),
  setIndustryExpertises: (data: any[]) => setMemory("industryExpertises", data),

  getServicePackages: () => getMemory("servicePackages", emptyObject),
  setServicePackages: (data: any) => setMemory("servicePackages", data),

  getRequests: () => getMemory("requests", emptyObject),
  setRequests: (requests: any) => setMemory("requests", requests),

  getClientLogos: () => getMemory("clientLogos", emptyArray),
  setClientLogos: (logos: any[]) => setMemory("clientLogos", logos),

  getBookingSlots: () => getMemory("bookingSlots", emptyArray),
  setBookingSlots: (slots: string[]) => setMemory("bookingSlots", slots),

  getIndustryBadges: () => getMemory("industryBadges", emptyArray),
  setIndustryBadges: (badges: any[]) => setMemory("industryBadges", badges),

  getMedia: () => getMemory("media", emptyArray),
  setMedia: (media: any[]) => setMemory("media", media),

  syncWithBackend: async () => {
    // No-op: pages load directly from database via adminApi
  },

  clearCache: () => {
    for (const key of Object.keys(inMemoryCache)) {
      delete inMemoryCache[key];
    }
  },

  resetDefaults: async () => {
    for (const key of Object.keys(inMemoryCache)) {
      delete inMemoryCache[key];
    }
  },

  fullRefresh: async () => {
    // In-memory refresh
  },
};
