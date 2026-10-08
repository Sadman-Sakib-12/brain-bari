import axios from "axios";

const isClient = typeof window !== "undefined";
const API_BASE_URL = isClient
  ? (process.env.NEXT_PUBLIC_API_URL || "/api")
  : `${process.env.BACKEND_INTERNAL_URL || "https://brain-bari-production.up.railway.app"}/api`;
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Helper to get admin token from localStorage
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const storedUser = localStorage.getItem("brainbari_admin_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed.token || null;
    }
  } catch {
    return null;
  }
  return null;
}

// Request interceptor to attach JWT token if present or obtain automatically
api.interceptors.request.use(
  async (config) => {
    let token = getStoredToken();
    if (!token && typeof window !== "undefined" && !config.url?.includes("/auth/")) {
      try {
        token = await obtainAdminToken();
      } catch (err) {
        console.warn("Auto admin token initialization:", err);
      }
    }
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token refresh mutex to avoid concurrent authentication storms
let isFetchingToken = false;
let pendingRequests: Array<(token: string) => void> = [];

async function obtainAdminToken(): Promise<string> {
  const res = await axios.post(`${API_BASE_URL}/auth/jwt`, {
    email: "admin@brainbari.com",
    name: "Brain Bari Admin",
    role: "ADMIN",
  });
  const token = res.data?.data?.token;
  if (!token) throw new Error("No token returned by /auth/jwt");

  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("brainbari_admin_user");
      const userObj = existing ? JSON.parse(existing) : {};
      const updatedUser = {
        name: userObj.name || "Brain Bari Admin",
        email: userObj.email || "admin@brainbari.com",
        role: "ADMIN",
        ...userObj,
        token,
        lastRefreshedAt: new Date().toISOString(),
      };
      localStorage.setItem("brainbari_admin_user", JSON.stringify(updatedUser));
      localStorage.setItem("brainbari_admin_auth", "true");
      window.dispatchEvent(new Event("admin_auth_updated"));
    } catch (e) {
      console.warn("Failed saving token to localStorage:", e);
    }
  }
  return token;
}

// Response interceptor: automatically obtain admin token on 401 and retry seamlessly
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 Unauthorized for non-auth requests and not already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      if (isFetchingToken) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isFetchingToken = true;

      try {
        const newToken = await obtainAdminToken();
        isFetchingToken = false;

        // Drain pending requests with fresh token
        const callbacks = [...pendingRequests];
        pendingRequests = [];
        callbacks.forEach((cb) => cb(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (authErr) {
        isFetchingToken = false;
        pendingRequests = [];
        console.warn("Auto-admin authentication failed:", authErr);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
