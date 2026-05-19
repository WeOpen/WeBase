import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileSidebar />
      <AppHeader />
      <AppSidebar />
      <div className="md:pl-58">
        <main className="min-h-[calc(100vh-3.75rem)] px-2 py-4 sm:px-3 sm:py-5">
          <div className="mx-auto w-full max-w-[1800px] animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
