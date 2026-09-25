"use client";

import initialOrders from "@/data/orders.json";
import initialConsultations from "@/data/consultations.json";
import initialServices from "@/data/services.json";
import initialChatbots from "@/data/chatbots.json";
import initialPortfolio from "@/data/portfolio.json";
import initialProducts from "@/data/products.json";
import initialTeam from "@/data/team.json";
import initialBlogs from "@/data/blogs.json";
import initialFaqs from "@/data/faqs.json";
import initialUsers from "@/data/users.json";
import initialSettings from "@/data/siteSettings.json";
import initialWhyChooseUs from "@/data/whyChooseUs.json";
import initialEvents from "@/data/events.json";
import initialCaseStudies from "@/data/caseStudies.json";
import initialCaseStudiesPage from "@/data/caseStudiesPage.json";
import initialPartners from "@/data/partners.json";
import initialAbout from "@/data/about.json";
import initialIndustryExpertises from "@/data/industryExpertises.json";
import initialServicePackages from "@/data/servicePackages.json";
import initialRequests from "@/data/requests.json";
import initialMedia from "@/data/media.json";

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`brainbari_admin_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Failed to read storage key:", key, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    // 1. Save to browser localStorage for instant UI response
    localStorage.setItem(`brainbari_admin_${key}`, JSON.stringify(value));
    window.dispatchEvent(new Event("admin_store_updated"));

    // 2. Persist to filesystem and synchronize with Frontend files
    fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data: value })
    }).catch((err) => {
      console.warn("Failed to persist data to filesystem API:", err);
    });
  } catch (e) {
    console.error("Failed to write storage key:", key, e);
  }
}

export const adminStore = {
  getOrders: () => getStorage("orders", initialOrders),
  setOrders: (orders: typeof initialOrders) => setStorage("orders", orders),

  getConsultations: () => getStorage("consultations", initialConsultations),
  setConsultations: (consultations: typeof initialConsultations) => setStorage("consultations", consultations),

  getServices: () => getStorage("services", initialServices),
  setServices: (services: typeof initialServices) => setStorage("services", services),

  getChatbots: () => getStorage("chatbots", initialChatbots),
  setChatbots: (chatbots: typeof initialChatbots) => setStorage("chatbots", chatbots),

  getPortfolio: () => getStorage("portfolio", initialPortfolio),
  setPortfolio: (portfolio: typeof initialPortfolio) => setStorage("portfolio", portfolio),

  getProducts: () => getStorage("products", initialProducts),
  setProducts: (products: typeof initialProducts) => setStorage("products", products),

  getTeam: () => getStorage("team", initialTeam),
  setTeam: (team: typeof initialTeam) => setStorage("team", team),

  getBlogs: () => getStorage("blogs", initialBlogs),
  setBlogs: (blogs: typeof initialBlogs) => setStorage("blogs", blogs),

  getFaqs: () => getStorage("faqs", initialFaqs),
  setFaqs: (faqs: typeof initialFaqs) => setStorage("faqs", faqs),

  getUsers: () => getStorage("users", initialUsers),
  setUsers: (users: typeof initialUsers) => setStorage("users", users),

  getSettings: () => getStorage("settings", initialSettings),
  setSettings: (settings: typeof initialSettings) => setStorage("settings", settings),

  getWhyChooseUs: () => getStorage("whyChooseUs", initialWhyChooseUs),
  setWhyChooseUs: (whyChooseUs: typeof initialWhyChooseUs) => setStorage("whyChooseUs", whyChooseUs),

  getEvents: () => getStorage("events", initialEvents),
  setEvents: (events: typeof initialEvents) => setStorage("events", events),

  getCaseStudies: () => getStorage("caseStudies", initialCaseStudies),
  setCaseStudies: (caseStudies: typeof initialCaseStudies) => setStorage("caseStudies", caseStudies),

  getCaseStudiesPage: () => getStorage("caseStudiesPage", initialCaseStudiesPage),
  setCaseStudiesPage: (data: typeof initialCaseStudiesPage) => setStorage("caseStudiesPage", data),

  getPartners: () => getStorage("partners", initialPartners),
  setPartners: (partners: typeof initialPartners) => setStorage("partners", partners),

  getAbout: () => getStorage("about", initialAbout),
  setAbout: (about: any) => setStorage("about", about),

  getIndustryExpertises: () => getStorage("industryExpertises", initialIndustryExpertises),
  setIndustryExpertises: (data: typeof initialIndustryExpertises) => setStorage("industryExpertises", data),

  getServicePackages: () => getStorage("servicePackages", initialServicePackages),
  setServicePackages: (data: typeof initialServicePackages) => setStorage("servicePackages", data),

  getRequests: () => getStorage("requests", initialRequests),
  setRequests: (requests: typeof initialRequests) => setStorage("requests", requests),

  getMedia: () => getStorage("media", initialMedia),
  setMedia: (media: typeof initialMedia) => setStorage("media", media),

  getProjects: () => getStorage("portfolio", initialPortfolio),
  setProjects: (projects: typeof initialPortfolio) => setStorage("portfolio", projects),

  // Clear all localStorage caches to force fresh load from disk JSON files
  clearCache: () => {
    if (typeof window === "undefined") return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("brainbari_admin_")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new Event("admin_store_updated"));
    } catch (e) {
      console.error("Failed to clear admin store cache:", e);
    }
  },

  // Perform a full hard refresh of the application
  fullRefresh: () => {
    if (typeof window === "undefined") return;
    adminStore.clearCache();
    window.location.reload();
  }
};

