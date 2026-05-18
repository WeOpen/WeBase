export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Status = "enabled" | "disabled";

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  remember: boolean;
}

export interface LoginResult {
  token: string;
  user: CurrentUser;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export interface UserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: Status;
  createdAt: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  status: Status;
  permissions: string[];
}

export interface MenuRecord {
  id: string;
  parentId?: string;
  name: string;
  path: string;
  icon: string;
  sort: number;
  status: Status;
}

export interface SystemSettings {
  systemName: string;
  logoText: string;
  defaultTheme: "light" | "dark" | "system";
  sessionTimeout: number;
  passwordPolicy: string;
  emailNotification: boolean;
  inAppNotification: boolean;
}
