import axios from "axios";
import { authService } from "./auth";
import { message } from "antd";

const API_URL = "https://server.qmu-psixologik.uz/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      message.error("Sessiya tugadi. Qayta kiring");
    } else if (error.response?.status === 500) {
      message.error("Server xatosi");
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth APIs
export const authAPI = {
  studentLogin: (data) => api.post("/auth/student-login", data),
  adminLogin: (data) => api.post("/auth/admin-login", data),
};

// Student APIs
export const studentAPI = {
  getProfile: () => api.get("/students/profile"),
  getTestResults: () => api.get("/students/test-results"),
  getStatistics: () => api.get("/students/statistics"),
};

// Test APIs
export const testAPI = {
  getTests: () => api.get("/tests"),
  getTest: (id) => api.get(`/tests/${id}`),
  submitTest: (id, answers) => api.post(`/tests/${id}/submit`, { answers }),
  getTestResult: (id) => api.get(`/tests/${id}/result`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getFaculties: () => api.get("/admin/faculties"),
  getGroups: (params) => api.get("/admin/groups", { params }),
  getStudents: (params) => api.get("/admin/students", { params }),
  getTestResults: (params) => api.get("/admin/test-results", { params }),
  getTestResult: (id) => api.get(`/admin/test-results/${id}`),
  reviewTestResult: (id, data) =>
    api.put(`/admin/test-results/${id}/review`, data),
  getTestStatistics: () => api.get("/admin/statistics/tests"),
};

export default api;
