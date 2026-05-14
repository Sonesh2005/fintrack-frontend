import axios from "axios";
import toast from "react-hot-toast";
import NProgress from "../utils/nprogress";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// ✅ SINGLE REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    NProgress.start(); // start loader

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// ✅ SINGLE RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    NProgress.done(); // stop loader
    return response;
  },
  (error) => {
    NProgress.done(); // stop loader on error

    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");

        setTimeout(() => {
          window.location.replace("/login");
        }, 1500);
      } else if (status >= 500) {
        toast.error("Server error. Try again later.");
      } else {
        toast.error(error.response.data?.message || "Something went wrong");
      }
    } else {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;