"use client";

import { ArrowRight, FileText, LogOut, Menu, Moon, Plus, Search, Settings, Sun, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { GlobalSearchDialog, buildGlobalSearchResults } from "@/components/layout/global-search-dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLayoutStore } from "@/lib/stores/layout-store";
import { cn } from "@/lib/utils";

type SearchResult = ReturnType<typeof buildGlobalSearchResults>[number];

const resultLabels: Record<SearchResult["type"], string> = {
  menu: "菜单",
  user: "用户",
  role: "角色",
};

const quickLinks = [
  { href: "/dashboard", icon: FileText, label: "仪表盘", count: "Overview" },
  { href: "/system/users", icon: UserRound, label: "用户管理", count: "Users" },
  { href: "/system/roles", icon: Settings, label: "角色权限", count: "Roles" },
];

function filterResults(results: SearchResult[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return results.slice(0, 6);
  }

  return results
    .filter((result) => result.keywords.toLowerCase().includes(normalizedQuery))
    .slice(0, 6);
}

function SubmitButton() {
  return (
    <Link href="/system/users" className="group/submit relative" aria-label="新建用户">
      <span className="relative inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-b from-orange-400 to-orange-600 px-3.5 text-xs font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_3px_12px_rgba(249,115,22,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.97] active:shadow-[0_0px_1px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full" />
        <Plus className="relative h-3.5 w-3.5 transition-transform duration-200 group-hover/submit:rotate-90" />
        <span className="relative hidden sm:inline">新建用户</span>
      </span>
    </Link>
  );
}

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleMobileSidebar = useLayoutStore((state) => state.setMobileSidebarOpen);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchWrapRef = React.useRef<HTMLFormElement>(null);
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const results = React.useMemo(() => buildGlobalSearchResults(), []);
  const filteredResults = React.useMemo(() => filterResults(results, query), [query, results]);
  const hasQuery = query.trim().length > 0;
  const showDropdown = focused && (hasQuery ? filteredResults.length > 0 : true);
  const isDark = resolvedTheme !== "light";
  const displayName = user?.name || user?.username || "管理员";

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }

      if (event.key === "Escape") {
        inputRef.current?.blur();
        setFocused(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function handleSelect(result: SearchResult) {
    setFocused(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(result.href);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (showDropdown && selectedIdx >= 0 && selectedIdx < filteredResults.length) {
      handleSelect(filteredResults[selectedIdx]);
      return;
    }

    if (filteredResults[0]) {
      handleSelect(filteredResults[0]);
    }
  }

  function handleKeyNav(event: React.KeyboardEvent) {
    if (!showDropdown || filteredResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIdx((current) => (current < filteredResults.length - 1 ? current + 1 : 0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIdx((current) => (current > 0 ? current - 1 : filteredResults.length - 1));
    }
  }

  return (
    <>
      <GlobalSearchDialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
      <header className="sticky top-0 z-50 w-full px-2 pb-0 pt-2 sm:px-3 sm:pt-2.5">
        <div className="mx-auto max-w-[1800px] rounded-2xl border border-black/[0.06] bg-background/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/60 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="flex h-12 items-center gap-3 px-2.5 sm:px-4">
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={() => toggleMobileSidebar(true)}
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Link href="/dashboard" className="group/logo flex items-center gap-1.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-foreground text-xs font-bold text-background transition-transform duration-200 group-hover/logo:scale-105">
                  WB
                </span>
                <span className="hidden text-[15px] font-bold tracking-tight text-foreground sm:inline">
                  We<span className="text-orange-500">Base</span>
                </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="管理模块">
              {[
                ["/dashboard", "仪表盘"],
                ["/system/users", "用户"],
                ["/system/roles", "角色"],
                ["/system/menus", "菜单"],
              ].map(([href, label]) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <form ref={searchWrapRef} onSubmit={handleSearchSubmit} className="relative flex-1">
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelectedIdx(-1);
                  }}
                  onFocus={() => setFocused(true)}
                  onKeyDown={handleKeyNav}
                  placeholder="搜索用户、角色、菜单..."
                  className="h-9 w-full rounded-xl border border-border bg-muted/40 py-1 pr-16 pl-9 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:bg-background focus:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus:ring-1 focus:ring-ring/30 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-white/[0.15] dark:focus:bg-white/[0.06] dark:focus:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3)]"
                  aria-label="全局搜索"
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-controls="header-search-listbox"
                  aria-autocomplete="list"
                />
                <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setFocused(false);
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="清空搜索"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  ) : null}
                  <kbd className="hidden rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/50 sm:inline-block dark:border-white/[0.06]">
                    Ctrl/⌘K
                  </kbd>
                </div>
              </div>

              {showDropdown ? (
                <div
                  id="header-search-listbox"
                  className="absolute left-0 right-0 top-full z-50 mx-auto mt-1.5 max-w-xl overflow-hidden rounded-xl border border-border/40 bg-background/95 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-[rgba(10,10,10,0.95)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.6)]"
                  role="listbox"
                >
                  {hasQuery ? (
                    <div className="px-2 py-1.5">
                      <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        Results
                      </p>
                      {filteredResults.map((result, index) => (
                        <button
                          key={result.id}
                          type="button"
                          role="option"
                          aria-selected={index === selectedIdx}
                          onMouseEnter={() => setSelectedIdx(index)}
                          onClick={() => handleSelect(result)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors sm:gap-3",
                            index === selectedIdx
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-accent/50",
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/60 text-[10px] font-semibold text-muted-foreground">
                            {result.title.slice(0, 1)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{result.title}</span>
                            <span className="block truncate text-[11px] text-muted-foreground">{result.description}</span>
                          </span>
                          <span className="hidden shrink-0 text-[10px] text-muted-foreground/50 sm:inline">
                            {resultLabels[result.type]}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2 py-2">
                      <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        Quick access
                      </p>
                      {quickLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setFocused(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent/50"
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                          <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                          <span className="text-[10px] text-muted-foreground/50">{item.count}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground/30" aria-hidden="true" />
                        </Link>
                      ))}

                      <div className="my-1.5 h-px bg-border/30 dark:bg-white/[0.04]" />

                      <p className="px-2 py-1 text-[10px] text-muted-foreground/40">
                        Try: “admin” “manager” “settings” “menu”
                      </p>
                    </div>
                  )}
                  <div className="hidden border-t border-border/30 px-3 py-1.5 sm:block dark:border-white/[0.04]">
                    <p className="text-[10px] text-muted-foreground/50">
                      <kbd className="rounded border border-border/30 px-1 font-mono dark:border-white/[0.06]">↑↓</kbd>{" "}
                      navigate{" "}
                      <kbd className="rounded border border-border/30 px-1 font-mono dark:border-white/[0.06]">↵</kbd>{" "}
                      select{" "}
                      <kbd className="rounded border border-border/30 px-1 font-mono dark:border-white/[0.06]">esc</kbd>{" "}
                      close
                    </p>
                  </div>
                </div>
              ) : null}
            </form>

            <div className="flex shrink-0 items-center gap-1">
              <Link
                href="/system/settings"
                className="hidden items-center rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
              >
                设置
              </Link>

              <SubmitButton />

              <div className="ml-1 flex items-center gap-1">
                <div className="hidden items-center gap-1.5 rounded-lg border border-border/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex dark:border-white/[0.06]">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden max-w-20 truncate lg:inline">{displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTheme(theme === "dark" || isDark ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" aria-hidden="true" />
                  <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="退出登录"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
