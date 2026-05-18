import { apiClient } from "@/lib/api/client";
import type { MenuRecord } from "@/lib/api/types";

export type CreateMenuPayload = Omit<MenuRecord, "id">;
export type UpdateMenuPayload = Partial<CreateMenuPayload>;

export async function listMenus(): Promise<MenuRecord[]> {
  const response = await apiClient.get<MenuRecord[]>("/menus");

  return response.data;
}

export async function createMenu(payload: CreateMenuPayload): Promise<MenuRecord> {
  const response = await apiClient.post<MenuRecord>("/menus", payload);

  return response.data;
}

export async function updateMenu(id: string, payload: UpdateMenuPayload): Promise<MenuRecord> {
  const response = await apiClient.put<MenuRecord>(`/menus/${id}`, payload);

  return response.data;
}

export async function deleteMenu(id: string): Promise<{ id: string }> {
  const response = await apiClient.delete<{ id: string }>(`/menus/${id}`);

  return response.data;
}
