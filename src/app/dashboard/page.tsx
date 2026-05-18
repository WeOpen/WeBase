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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgb(95_140_255_/_20%),transparent_18rem),radial-gradient(circle_at_92%_10%,rgb(52_211_153_/_10%),transparent_16rem)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
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

            <div className="rounded-2xl border border-white/10 bg-background/45 p-4 shadow-inner">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Operational posture</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                  Healthy
                </span>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className="aspect-square rounded-[0.35rem] bg-primary/15 shadow-inner odd:bg-primary/25 [&:nth-child(5n)]:bg-emerald-300/55 [&:nth-child(7n)]:bg-white/10"
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
                  <p className="text-sm font-medium text-primary">System health</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Service signals
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
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
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 shadow-[0_0_18px_rgb(95_140_255_/_42%)]"
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
