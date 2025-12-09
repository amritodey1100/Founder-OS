import axios from "axios";
import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Column operations
export const columnsAPI = {
  // Get user's columns
  getColumns: async () => {
    const response = await api.get("/columns");
    return response.data.columns;
  },

  // Update all columns
  updateColumns: async (columns) => {
    const response = await api.put("/columns", { columns });
    return response.data.columns;
  },

  // Migrate from localStorage (one-time)
  migrateColumns: async (columns) => {
    const response = await api.post("/columns/migrate", { columns });
    return response.data;
  },
};

export default api;
