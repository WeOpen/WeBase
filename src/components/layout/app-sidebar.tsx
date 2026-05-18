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

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-border/70 bg-background/45 px-4 py-6 backdrop-blur-xl lg:block">
      <div className="sticky top-6 space-y-5">
        <div className="admin-surface px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
            WeOpen
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-sm font-semibold text-primary shadow-[0_14px_34px_rgb(95_140_255_/_18%)]">
              WB
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground">
                WeBase Admin
              </p>
              <p className="text-xs text-muted-foreground">控制台模板</p>
            </div>
          </div>
        </div>

        <nav aria-label="后台主导航" className="space-y-2">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "border-primary/35 bg-primary/12 text-foreground shadow-[0_18px_42px_rgb(95_140_255_/_14%)]"
                    : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card/70 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                    active
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-border/60 bg-card/35 text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
