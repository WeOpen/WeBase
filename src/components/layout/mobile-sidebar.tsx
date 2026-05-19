"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sheet } from "@/components/ui/sheet";
import { adminMenu } from "@/lib/navigation/admin-menu";
import { useLayoutStore } from "@/lib/stores/layout-store";
import { cn } from "@/lib/utils";

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileSidebar() {
  const pathname = usePathname();
  const mobileSidebarOpen = useLayoutStore((state) => state.mobileSidebarOpen);
  const setMobileSidebarOpen = useLayoutStore((state) => state.setMobileSidebarOpen);

  const navItemClass =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground";
  const activeClass =
    "bg-gradient-to-r from-accent/80 to-accent/40 font-medium text-accent-foreground shadow-sm shadow-black/[0.03] dark:from-white/[0.08] dark:to-white/[0.04] dark:shadow-black/20";

  return (
    <Sheet
      open={mobileSidebarOpen}
      onOpenChange={setMobileSidebarOpen}
      side="left"
      title="WeBase 导航"
      className="w-64 bg-background p-0 pt-6"
    >
      <nav aria-label="移动端后台主导航" className="flex flex-col gap-0.5 p-3">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(navItemClass, active && activeClass)}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </Sheet>
  );
}
