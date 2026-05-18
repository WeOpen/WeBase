"use client";

import { LogOut, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLayoutStore } from "@/lib/stores/layout-store";

export function AppHeader() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setMobileSidebarOpen = useLayoutStore((state) => state.setMobileSidebarOpen);

  const isDark = resolvedTheme !== "light";
  const displayName = user?.name || user?.username || "管理员";

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 rounded-[1.75rem] border border-border/70 bg-card/72 px-3 py-2 shadow-[0_20px_70px_rgb(0_0_0_/_24%)] backdrop-blur-2xl sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-2xl lg:hidden"
            aria-label="打开移动端导航"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 text-sm font-semibold text-primary shadow-[0_12px_30px_rgb(95_140_255_/_16%)] sm:flex">
              WB
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                WeBase Admin
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                精致、克制、暗色优先的管理后台
              </p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-72 items-center gap-3 rounded-2xl border border-border/70 bg-background/45 px-4 py-2.5 text-sm text-muted-foreground md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1">搜索用户、角色、菜单...</span>
          <kbd className="rounded-lg border border-border/80 bg-card/80 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            ⌘ K
          </kbd>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground md:hidden">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            aria-label={isDark ? "切换到浅色主题" : "切换到深色主题"}
            onClick={handleToggleTheme}
          >
            {isDark ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>

          <div className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-background/40 px-3 py-2 text-sm text-foreground sm:flex">
            <UserRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="max-w-24 truncate">{displayName}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl"
            aria-label="退出登录"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
