import { apiClient } from "@/lib/api/client";
import type { ActivityItem, DashboardMetric } from "@/lib/api/types";

export interface DashboardOverview {
  metrics: DashboardMetric[];
  activities: ActivityItem[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await apiClient.get<DashboardOverview>("/dashboard/overview");

  return response.data;
}
