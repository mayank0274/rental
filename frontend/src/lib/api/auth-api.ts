import { axiosInstance } from "../axios";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: {
    statusCode: number;
    message: string;
    details: T;
  };
  error?: {
    statusCode: number;
    message: string;
    details?: any;
  };
}

export const authApi = {
  register: (data: any): Promise<ApiResponse<User>> =>
    axiosInstance.post("/api/auth/register", data),

  login: (data: any): Promise<ApiResponse<User>> =>
    axiosInstance.post("/api/auth/login", data),

  logout: (): Promise<ApiResponse<null>> =>
    axiosInstance.post("/api/auth/logout"),

  getMe: (): Promise<ApiResponse<User>> =>
    axiosInstance.get("/api/auth/me"),
};
