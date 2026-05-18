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

  return (
    <Sheet
      open={mobileSidebarOpen}
      onOpenChange={setMobileSidebarOpen}
      side="left"
      title="WeBase 导航"
      className="bg-background/92 backdrop-blur-2xl"
    >
      <div className="mb-6 rounded-3xl border border-border/70 bg-card/60 p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-sm font-semibold text-primary">
            WB
          </div>
          <div>
            <p className="font-semibold text-foreground">WeBase Admin</p>
            <p className="text-xs text-muted-foreground">移动控制台</p>
          </div>
        </div>
      </div>

      <nav aria-label="移动端后台主导航" className="space-y-2">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary/35 bg-primary/12 text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card/70 hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")}
                aria-hidden="true"
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </Sheet>
  );
}
