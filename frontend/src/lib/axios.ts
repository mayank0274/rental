import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Return standard error envelope if possible
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      error: {
        statusCode: 500,
        message: error.message || "Something went wrong",
      },
    });
  }
);
