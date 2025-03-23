import axios from "axios";
import { auth } from "./firebaseInitialize";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach fresh Firebase token to every request
api.interceptors.request.use(
  (config: any) => {
    if (auth.currentUser) {
      return auth.currentUser.getIdToken().then((token: string) => {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
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
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
