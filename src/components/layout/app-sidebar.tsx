"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    "bg-gradient-to-r from-accent/80 to-accent/40 font-medium text-accent-foreground shadow-sm shadow-black/[0.03] dark:from-white/[0.08] dark:to-white/[0.04] dark:shadow-black/20";

  return (
    <aside className="fixed left-2 top-[4.25rem] z-30 hidden h-[calc(100vh-4.75rem)] w-54 flex-col rounded-2xl border border-black/[0.06] bg-background/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-2xl md:flex dark:border-white/[0.08] dark:bg-black/60 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
      <nav aria-label="后台主导航" className="flex flex-col gap-0.5 p-3">
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

      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent dark:via-white/[0.06]" />

      <p className="px-4 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        System
      </p>

      <div className="flex flex-col gap-px px-3">
        {[
          ["Online users", "128"],
          ["Roles", "8"],
          ["Menu nodes", "24"],
          ["Alerts", "3"],
        ].map(([label, count]) => (
          <div
            key={label}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-[13px] text-muted-foreground transition-all duration-200 hover:bg-accent/60 hover:text-accent-foreground dark:hover:bg-white/[0.05]"
          >
            <span className="truncate">{label}</span>
            <span className="ml-2 shrink-0 rounded-full bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground/50 transition-colors group-hover:bg-muted/80 group-hover:text-muted-foreground/70 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06]">
              {count}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
