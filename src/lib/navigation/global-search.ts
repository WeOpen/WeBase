import { roles, users } from "@/lib/api/mock-data";
import { adminMenu, type AdminMenuItem } from "@/lib/navigation/admin-menu";

export type SearchResultType = "menu" | "user" | "role";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  keywords: string;
};

function flattenMenu(items: AdminMenuItem[]): AdminMenuItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenMenu(item.children) : [])]);
}

export function buildGlobalSearchResults(): SearchResult[] {
  const menuResults = flattenMenu(adminMenu).map((item) => ({
    id: `menu:${item.href}`,
    type: "menu" as const,
    title: item.title,
    description: item.href,
    href: item.href,
    keywords: [item.title, item.href].join(" "),
  }));

  const userResults = users.map((user) => ({
    id: `user:${user.id}`,
    type: "user" as const,
    title: user.name,
    description: `${user.username} · ${user.email} · ${user.role}`,
    href: "/system/users",
    keywords: [user.name, user.username, user.email, user.role, user.status].join(" "),
  }));

  const roleResults = roles.map((role) => ({
    id: `role:${role.id}`,
    type: "role" as const,
    title: role.name,
    description: `${role.code} · ${role.description}`,
    href: "/system/roles",
    keywords: [role.name, role.code, role.description, role.status].join(" "),
  }));

  return [...menuResults, ...userResults, ...roleResults];
}
