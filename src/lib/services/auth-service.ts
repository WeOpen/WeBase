import { apiClient } from "@/lib/api/client";
import type { CurrentUser, LoginPayload, LoginResult } from "@/lib/api/types";

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<LoginResult>("/auth/login", payload);

  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>("/auth/current-user");

  return response.data;
}
