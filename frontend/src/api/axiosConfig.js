import axios from "axios";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

let isRefreshing = false;
let pendingRequestQueue = [];
let refreshPromise = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COOLDOWN = 5000; 
let lastRefreshAttempt = 0;

function enqueuePendingRequest(callback) {
  pendingRequestQueue.push(callback);
}

function resolvePendingQueue(error, tokenRefreshed) {
  const queue = [...pendingRequestQueue];
  pendingRequestQueue = [];
  
  queue.forEach((callback) => {
    try {
      callback(error, tokenRefreshed);
    } catch (err) {
      console.warn("Error in pending request callback:", err);
    }
  });
}

function clearRefreshState() {
  isRefreshing = false;
  refreshPromise = null;
  refreshAttempts = 0;
}

// Create Axios instance with base config
const API = axios.create({
  baseURL: "https://api.safestreet.com.au/api",
  // baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }
     
    const csrfToken = localStorage.getItem("csrfToken");
    const method = (config.method || "get").toLowerCase();
    const isStateChanging = ["post", "put", "patch", "delete"].includes(method);
    if (isStateChanging && csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Errors with improved refresh logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config || {};
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Something went wrong";

    // Do not try to refresh for the refresh endpoint itself
    const isRefreshCall = (originalRequest.url || "").includes("/auth/refresh");

    if (status === 401 && !originalRequest._skipAuthRetry && !isRefreshCall) {
      // Flag to avoid re-queuing the same request
      originalRequest._skipAuthRetry = true;

      // Check if we're in cooldown period
      const now = Date.now();
      if (now - lastRefreshAttempt < REFRESH_COOLDOWN) {
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          return Promise.reject(new Error("Authentication required"));
        }
        // Wait a bit and retry the original request (token might have been refreshed by another tab)
        await new Promise(resolve => setTimeout(resolve, 100));
        return API.request(originalRequest);
      }

      // Check max refresh attempts
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.warn("Max refresh attempts reached, logging out");
        try {
          useAuthStore.getState().logout();
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        } catch (_) {}
        return Promise.reject(new Error("Max refresh attempts exceeded"));
      }

      // If a refresh is already happening, queue this request
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          enqueuePendingRequest((err, ok) => {
            if (err || !ok) {
              reject(err || new Error("Refresh failed"));
              return;
            }
            // Retry the original request
            API.request(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      // Start a single refresh
      isRefreshing = true;
      lastRefreshAttempt = now;
      refreshAttempts++;

      refreshPromise = API.post("/auth/refresh", {}, { 
        withCredentials: true, 
        skipAuth: true,
        timeout: 10000 // 10 second timeout
      })
      .then(() => {
        // Success - reset attempts and resolve queue
        refreshAttempts = 0;
        resolvePendingQueue(null, true);
        return API.request(originalRequest);
      })
      .catch((refreshErr) => {
        console.error("Token refresh failed:", refreshErr);
        
        // If this was the last attempt or a definitive failure, logout
        const isDefinitiveFailure = refreshErr.response?.status === 401 || 
                                   refreshErr.response?.status === 403 ||
                                   refreshAttempts >= MAX_REFRESH_ATTEMPTS;
        
        if (isDefinitiveFailure) {
          resolvePendingQueue(refreshErr, false);
          try {
            useAuthStore.getState().logout();
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
          } catch (_) {}
        } else {
          // Temporary failure, resolve queue with error but don't logout
          resolvePendingQueue(refreshErr, false);
        }
        
        throw refreshErr;
      })
      .finally(() => {
        clearRefreshState();
      });

      return refreshPromise;
    }

    // Handle other error status codes
    if (status === 403) {
      toast.error(message || "Access denied. Your role may have changed.");
    } else if (status === 400) {
      toast.error(message || "Bad request");
    } else if (status === 404) {
      toast.error(message || "Not found");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (status && status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Optional: Add visibility change listener to reset refresh state when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Reset refresh attempts when page becomes visible again
    // This helps prevent issues when returning from sleep/background
    if (!isRefreshing) {
      refreshAttempts = 0;
    }
  }
});

// Optional: Clear refresh state on page unload
window.addEventListener('beforeunload', () => {
  clearRefreshState();
  resolvePendingQueue(new Error("Page unloading"), false);
});

export default API;