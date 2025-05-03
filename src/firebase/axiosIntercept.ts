import axios from "axios";
import { auth } from "./firebaseInitialize";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach fresh Firebase token and firebaseId (from localStorage) to every request
api.interceptors.request.use(
  async (config: any) => {
    config.headers = config.headers || {};

    // Retrieve firebaseId dynamically from localStorage
    const firebaseId = localStorage.getItem("firebaseId");
    console.log("firebaseId from localStorage:", firebaseId);
    if (firebaseId) {
      config.headers["X-Firebase-Id"] = firebaseId;
    }

    // Attach Firebase token if there's a current user
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry & refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && auth.currentUser) {
      try {
        const newToken = await auth.currentUser.getIdToken(true);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch {
        console.error("Token refresh failed. Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
