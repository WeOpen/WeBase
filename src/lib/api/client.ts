import { mockDelete, mockGet, mockPost, mockPut } from "./mock-adapter";
import type { ApiResponse } from "./types";

export const apiClient = {
  get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    return mockGet<T>(url, params);
  },

  post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    return mockPost<T>(url, body);
  },

  put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    return mockPut<T>(url, body);
  },

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return mockDelete<T>(url);
  },
};
