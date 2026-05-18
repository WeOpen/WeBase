import type {
  ActivityItem,
  CurrentUser,
  DashboardMetric,
  MenuRecord,
  RoleRecord,
  SystemSettings,
  UserRecord,
} from "./types";

export const currentUser: CurrentUser = {
  id: "u-001",
  name: "Admin User",
  username: "admin",
  email: "admin@webase.local",
  role: "Super Admin",
  avatar: "/avatar-placeholder.png",
};

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Total Users", value: "1,248", change: "+12.5%", trend: "up" },
  { label: "Active Roles", value: "8", change: "+1", trend: "up" },
  { label: "Menu Items", value: "24", change: "0%", trend: "stable" },
  { label: "System Alerts", value: "3", change: "-2", trend: "down" },
];

export const activityItems: ActivityItem[] = [
  { id: "a-001", actor: "Admin User", action: "updated", target: "System settings", time: "2026-05-18 09:30" },
  { id: "a-002", actor: "Jane Miller", action: "created", target: "Operations role", time: "2026-05-18 08:45" },
  { id: "a-003", actor: "Chen Wei", action: "disabled", target: "Legacy user", time: "2026-05-17 17:20" },
  { id: "a-004", actor: "Admin User", action: "reviewed", target: "Menu permissions", time: "2026-05-17 15:10" },
];

export const users: UserRecord[] = [
  { id: "u-001", username: "admin", name: "Admin User", email: "admin@webase.local", role: "Super Admin", status: "enabled", createdAt: "2026-01-05" },
  { id: "u-002", username: "jane", name: "Jane Miller", email: "jane@webase.local", role: "Manager", status: "enabled", createdAt: "2026-02-12" },
  { id: "u-003", username: "chenwei", name: "Chen Wei", email: "chen.wei@webase.local", role: "Operator", status: "enabled", createdAt: "2026-03-03" },
  { id: "u-004", username: "alex", name: "Alex Kim", email: "alex@webase.local", role: "Auditor", status: "disabled", createdAt: "2026-03-28" },
  { id: "u-005", username: "maria", name: "Maria Garcia", email: "maria@webase.local", role: "Support", status: "enabled", createdAt: "2026-04-10" },
  { id: "u-006", username: "liam", name: "Liam Smith", email: "liam@webase.local", role: "Operator", status: "disabled", createdAt: "2026-04-22" },
];

export const roles: RoleRecord[] = [
  { id: "r-001", name: "Super Admin", code: "SUPER_ADMIN", description: "Full access to all admin features.", userCount: 1, status: "enabled", permissions: ["*"] },
  { id: "r-002", name: "Manager", code: "MANAGER", description: "Manage users, roles, and dashboards.", userCount: 1, status: "enabled", permissions: ["dashboard:read", "users:write", "roles:read"] },
  { id: "r-003", name: "Operator", code: "OPERATOR", description: "Operate daily business workflows.", userCount: 2, status: "enabled", permissions: ["dashboard:read", "menus:read"] },
  { id: "r-004", name: "Auditor", code: "AUDITOR", description: "Read-only review permissions.", userCount: 1, status: "disabled", permissions: ["dashboard:read", "users:read", "roles:read"] },
];

export const menus: MenuRecord[] = [
  { id: "m-001", name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", sort: 1, status: "enabled" },
  { id: "m-002", name: "User Management", path: "/users", icon: "Users", sort: 2, status: "enabled" },
  { id: "m-003", name: "Role Management", path: "/roles", icon: "ShieldCheck", sort: 3, status: "enabled" },
  { id: "m-004", name: "Menu Management", path: "/menus", icon: "Menu", sort: 4, status: "enabled" },
  { id: "m-005", name: "System Settings", path: "/settings", icon: "Settings", sort: 5, status: "enabled" },
  { id: "m-006", name: "Audit Logs", path: "/settings/audit-logs", icon: "ScrollText", parentId: "m-005", sort: 6, status: "disabled" },
];

export const systemSettings: SystemSettings = {
  systemName: "WeBase Admin",
  logoText: "WB",
  defaultTheme: "system",
  sessionTimeout: 30,
  passwordPolicy: "Minimum 8 characters with letters and numbers.",
  emailNotification: true,
  inAppNotification: true,
};
