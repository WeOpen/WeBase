import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,rgb(95_140_255_/_12%),transparent_26rem)]" />
      <MobileSidebar />
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 pb-8 pt-2 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl fade-in">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
