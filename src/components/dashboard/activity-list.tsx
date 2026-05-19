import { Clock3 } from "lucide-react";

import type { ActivityItem } from "@/lib/api/types";

interface ActivityListProps {
  activities: ActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <section className="admin-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Live audit</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Recent activity</h2>
        </div>
        <Clock3 className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="mt-5 space-y-1">
        {activities.map((activity, index) => (
          <article
            key={activity.id}
            className="group relative rounded-xl border border-transparent px-3 py-3 transition hover:border-border/80 hover:bg-accent/50 dark:hover:bg-white/[0.05]"
          >
            <div className="absolute left-0 top-5 size-2 rounded-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
            {index < activities.length - 1 ? (
              <div className="absolute bottom-0 left-[3px] top-8 w-px bg-gradient-to-b from-orange-500/40 to-transparent" />
            ) : null}

            <div className="pl-5">
              <p className="text-sm leading-6 text-card-foreground">
                <span className="font-semibold">{activity.actor}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
