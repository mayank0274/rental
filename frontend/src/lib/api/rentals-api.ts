import { axiosInstance } from "../axios";
import type { ApiResponse } from "./auth-api";

export interface RentalItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  slug: string;
  price_per_day: number;
  images: string[];
  category: string;
  status: "available" | "unavailable" | "paused";
  location_city?: string;
  location_state?: string;
  location_country?: string;
  created_at: string;
  updated_at: string;
}

export interface RentalPublisher {
  name: string;
  email: string;
  phone?: string;
}

export type RentalDetail = RentalItem & {
  publisher?: RentalPublisher;
};

export interface RentalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RentalListDetails {
  items: RentalItem[];
  pagination?: RentalPagination;
}

export const rentalsApi = {
  list: (params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<RentalListDetails>> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.category) queryParams.category = params.category;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return axiosInstance.get("/api/rentals", { params: queryParams });
  },
  listMine: (): Promise<ApiResponse<RentalListDetails | RentalItem[]>> =>
    axiosInstance.get("/api/rentals/me"),
  create: (payload: {
    title: string;
    description: string;
    slug: string;
    price_per_day: number;
    images: string[];
    category: string;
    status?: "available" | "unavailable" | "paused";
    location_city?: string;
    location_state?: string;
    location_country?: string;
  }): Promise<ApiResponse<RentalItem>> => axiosInstance.post("/api/rentals", payload),
  getBySlug: (slug: string): Promise<ApiResponse<RentalDetail>> =>
    axiosInstance.get(`/api/rentals/${slug}`),
  update: (
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      slug: string;
      price_per_day: number;
      images: string[];
      category: string;
      status: "available" | "unavailable" | "paused";
      location_city?: string;
      location_state?: string;
      location_country?: string;
    }>
  ): Promise<ApiResponse<RentalItem>> =>
    axiosInstance.put(`/api/rentals/${id}`, payload),
  remove: (id: string): Promise<ApiResponse<null>> =>
    axiosInstance.delete(`/api/rentals/${id}`),
};
