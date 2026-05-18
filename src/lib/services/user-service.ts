import { apiClient } from "@/lib/api/client";
import type { PageResult, Status, UserRecord } from "@/lib/api/types";

export interface ListUsersParams {
  keyword?: string;
  status?: Status;
  page?: number;
  pageSize?: number;
}

export type CreateUserPayload = Omit<UserRecord, "id">;
export type UpdateUserPayload = Partial<CreateUserPayload>;

export async function listUsers(params?: ListUsersParams): Promise<PageResult<UserRecord>> {
  const response = await apiClient.get<PageResult<UserRecord>>("/users", params);

  return response.data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserRecord> {
  const response = await apiClient.post<UserRecord>("/users", payload);

  return response.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserRecord> {
  const response = await apiClient.put<UserRecord>(`/users/${id}`, payload);

  return response.data;
}

export async function deleteUser(id: string): Promise<{ id: string }> {
  const response = await apiClient.delete<{ id: string }>(`/users/${id}`);

  return response.data;
}
