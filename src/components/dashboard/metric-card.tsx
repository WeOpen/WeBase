import { ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import type { DashboardMetric } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type TrendConfig = {
  label: string;
  icon: LucideIcon;
  tone: string;
  chip: string;
  fill: string;
};

const trendConfig = {
  up: {
    label: "Growing",
    icon: ArrowUpRight,
    tone: "text-emerald-300",
    chip: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    fill: "bg-emerald-300/80",
  },
  down: {
    label: "Cooling",
    icon: ArrowDownRight,
    tone: "text-sky-300",
    chip: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    fill: "bg-sky-300/80",
  },
  stable: {
    label: "Stable",
    icon: ArrowRight,
    tone: "text-muted-foreground",
    chip: "border-white/10 bg-white/5 text-muted-foreground",
    fill: "bg-primary/60",
  },
} satisfies Record<DashboardMetric["trend"], TrendConfig>;

const trendBars: Record<DashboardMetric["trend"], number[]> = {
  up: [34, 48, 42, 64, 72, 88],
  down: [82, 74, 68, 52, 46, 38],
  stable: [54, 56, 52, 57, 55, 58],
};

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const trend = trendConfig[metric.trend];
  const TrendIcon = trend.icon;

  return (
    <article className="admin-surface group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_28px_80px_rgb(0_0_0_/_36%)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-card-foreground">
            {metric.value}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
            trend.chip,
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {metric.change}
        </span>
      </div>

      <div className="relative mt-7 flex items-end gap-1.5" aria-hidden="true">
        {trendBars[metric.trend].map((height, index) => (
          <span
            key={`${metric.label}-${height}-${index}`}
            className={cn("w-full rounded-full opacity-70", trend.fill)}
            style={{ height: `${height / 4}px` }}
          />
        ))}
      </div>

      <p className={cn("relative mt-4 text-xs font-medium", trend.tone)}>
        {trend.label} compared with the previous cycle
      </p>
    </article>
  );
}
