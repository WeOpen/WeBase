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
    tone: "text-orange-600 dark:text-orange-400",
    chip: "border-orange-200/50 bg-orange-50/80 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    fill: "bg-orange-500/80 dark:bg-orange-400/80",
  },
  down: {
    label: "Cooling",
    icon: ArrowDownRight,
    tone: "text-muted-foreground",
    chip: "border-border/60 bg-muted/60 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]",
    fill: "bg-muted-foreground/45",
  },
  stable: {
    label: "Stable",
    icon: ArrowRight,
    tone: "text-muted-foreground",
    chip: "border-border/60 bg-muted/60 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]",
    fill: "bg-foreground/45",
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
    <article className="group relative flex h-full min-w-0 flex-col rounded-xl border border-border/40 bg-card/80 p-5 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
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

      <div className="mt-7 flex items-end gap-1.5" aria-hidden="true">
        {trendBars[metric.trend].map((height, index) => (
          <span
            key={`${metric.label}-${height}-${index}`}
            className={cn("w-full rounded-full opacity-70", trend.fill)}
            style={{ height: `${height / 4}px` }}
          />
        ))}
      </div>

      <p className={cn("mt-4 text-xs font-medium", trend.tone)}>
        {trend.label} compared with the previous cycle
      </p>
    </article>
  );
}
