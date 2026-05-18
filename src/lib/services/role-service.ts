import { apiClient } from "@/lib/api/client";
import type { RoleRecord } from "@/lib/api/types";

export type CreateRolePayload = Omit<RoleRecord, "id">;
export type UpdateRolePayload = Partial<CreateRolePayload>;

export async function listRoles(): Promise<RoleRecord[]> {
  const response = await apiClient.get<RoleRecord[]>("/roles");

  return response.data;
}

export async function createRole(payload: CreateRolePayload): Promise<RoleRecord> {
  const response = await apiClient.post<RoleRecord>("/roles", payload);

  return response.data;
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<RoleRecord> {
  const response = await apiClient.put<RoleRecord>(`/roles/${id}`, payload);

  return response.data;
}

export async function deleteRole(id: string): Promise<{ id: string }> {
  const response = await apiClient.delete<{ id: string }>(`/roles/${id}`);

  return response.data;
}
