import { axiosInstance } from "../axios";
import type { ApiResponse } from "./auth-api";

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
}

export const uploadApi = {
  uploadMultiple: (params: {
    files: File[];
    folder?: string;
  }): Promise<ApiResponse<UploadResult[]>> => {
    const formData = new FormData();
    params.files.forEach((file) => {
      formData.append("files", file);
    });
    if (params.folder) {
      formData.append("folder", params.folder);
    }

    return axiosInstance.post("/api/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
