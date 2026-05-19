import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Gauge,
  MenuSquare,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export interface AdminMenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: AdminMenuItem[];
}

export const adminMenu: AdminMenuItem[] = [
  {
    title: "仪表盘",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    title: "用户管理",
    href: "/system/users",
    icon: UsersRound,
  },
  {
    title: "角色权限",
    href: "/system/roles",
    icon: ShieldCheck,
  },
  {
    title: "菜单管理",
    href: "/system/menus",
    icon: MenuSquare,
  },
  {
    title: "组件示例",
    href: "/system/components",
    icon: Blocks,
  },
  {
    title: "系统设置",
    href: "/system/settings",
    icon: Settings,
  },
];
