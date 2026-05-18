import { apiClient } from "@/lib/api/client";
import type { SystemSettings } from "@/lib/api/types";

export type UpdateSettingsPayload = Partial<SystemSettings>;

export async function getSettings(): Promise<SystemSettings> {
  const response = await apiClient.get<SystemSettings>("/settings");

  return response.data;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<SystemSettings> {
  const response = await apiClient.put<SystemSettings>("/settings", payload);

  return response.data;
}
