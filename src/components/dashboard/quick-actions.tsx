import Link from "next/link";
import { ChevronRight, Menu, Settings, ShieldCheck, Users } from "lucide-react";

const actions = [
  {
    label: "Users",
    description: "Review accounts and access state",
    href: "/system/users",
    icon: Users,
  },
  {
    label: "Roles",
    description: "Tune permission groups",
    href: "/system/roles",
    icon: ShieldCheck,
  },
  {
    label: "Menus",
    description: "Shape navigation entries",
    href: "/system/menus",
    icon: Menu,
  },
  {
    label: "Settings",
    description: "Adjust platform defaults",
    href: "/system/settings",
    icon: Settings,
  },
];

export function QuickActions() {
  return (
    <section className="admin-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Command center</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Quick actions</h2>
        </div>
        <div className="hidden rounded-full border border-border/50 bg-muted/60 px-3 py-1 text-xs text-muted-foreground sm:block dark:border-white/[0.06] dark:bg-white/[0.04]">
          System
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-border/40 bg-card/80 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/50 bg-muted/50 text-orange-500 shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold text-card-foreground">
                    {action.label}
                    <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-orange-500" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
