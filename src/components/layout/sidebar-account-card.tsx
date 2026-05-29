"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

interface SidebarAccountCardProps {
  className?: string;
  onLogout?: () => void;
}

export function SidebarAccountCard({ className, onLogout }: SidebarAccountCardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = user?.name || user?.username || "管理员";
  const roleLabel = user?.role || "Admin";

  function handleLogout() {
    logout();
    onLogout?.();
    router.push("/login");
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/85 p-2.5 shadow-sm shadow-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-black/30",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar name={displayName} src={user?.avatar} size="md" color="primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">{displayName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{roleLabel}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="退出登录"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
