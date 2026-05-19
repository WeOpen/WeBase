import { ActivityList } from "@/components/dashboard/activity-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardOverview } from "@/lib/services/dashboard-service";

const healthItems = [
  { label: "API latency", value: "42ms", level: 86 },
  { label: "Job queue", value: "Clear", level: 72 },
  { label: "Storage", value: "68%", level: 68 },
];

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="admin-surface relative overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-600 dark:text-orange-400">
                WeBase Admin
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                Welcome back. Your control plane is calm, current, and ready.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Monitor access, permissions, menus, and operational signals from a
                refined dashboard built for fast administrative decisions.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Operational posture</span>
                <span className="rounded-full border border-orange-200/50 bg-orange-50/80 px-2.5 py-1 text-xs font-medium text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
                  Healthy
                </span>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className="aspect-square rounded-[0.35rem] bg-muted/60 shadow-inner odd:bg-orange-500/20 [&:nth-child(5n)]:bg-orange-500/45 [&:nth-child(7n)]:bg-accent"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overview.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <div className="space-y-6">
            <QuickActions />
            <section className="admin-surface p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">System health</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Service signals
                  </h2>
                </div>
                <span className="rounded-full border border-border/50 bg-muted/60 px-3 py-1 text-xs text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]">
                  Mock telemetry
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {healthItems.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-card-foreground">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <ActivityList activities={overview.activities} />
        </div>
      </div>
    </AppShell>
  );
}
