"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarAccountCard } from "@/components/layout/sidebar-account-card";
import { adminMenu } from "@/lib/navigation/admin-menu";
import { cn } from "@/lib/utils";

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  const navItemClass =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground";
  const activeClass =
    "bg-gradient-to-r from-orange-500/15 to-orange-500/5 font-semibold text-foreground shadow-sm shadow-black/[0.04] dark:from-orange-500/20 dark:to-orange-500/8 dark:shadow-black/25 border border-orange-500/20 dark:border-orange-500/25";

  return (
    <aside className="fixed left-2 top-[4.25rem] z-30 hidden h-[calc(100vh-4.75rem)] w-54 flex-col rounded-2xl border border-black/[0.06] bg-background/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-2xl md:flex dark:border-white/[0.08] dark:bg-black/60 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
      <nav aria-label="后台主导航" className="flex flex-1 flex-col gap-0.5 p-3">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(navItemClass, active && activeClass)}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <SidebarAccountCard className="m-3 mt-auto" />
    </aside>
  );
}
