"use client";

import { ArrowRight, FileText, Search, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { buildGlobalSearchResults, type SearchResult, type SearchResultType } from "@/lib/navigation/global-search";
import { cn } from "@/lib/utils";

const resultLabels: Record<SearchResultType, string> = {
  menu: "菜单",
  user: "用户",
  role: "角色",
};

const resultIcons = {
  menu: FileText,
  user: UserRound,
  role: ShieldCheck,
};

function getFilteredResults(results: SearchResult[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return results.slice(0, 8);
  }

  return results
    .filter((result) => result.keywords.toLowerCase().includes(normalizedQuery))
    .slice(0, 8);
}

type GlobalSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const router = useRouter();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const searchResults = React.useMemo(() => buildGlobalSearchResults(), []);
  const filteredResults = React.useMemo(
    () => getFilteredResults(searchResults, query),
    [query, searchResults],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setQuery("");
    }
  };

  const handleSelect = (result: SearchResult) => {
    handleOpenChange(false);
    router.push(result.href);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="全局搜索"
      initialFocusRef={searchInputRef}
      className="max-w-2xl overflow-hidden rounded-[2rem] border-border/75 bg-card/92 shadow-[0_34px_100px_rgb(0_0_0_/_42%)] backdrop-blur-2xl"
    >
      <div className="rounded-3xl border border-border/70 bg-background/30 p-3 sm:p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/75 bg-background/65 px-4 py-3 shadow-inner">
          <Search className="h-5 w-5 shrink-0 text-orange-500" aria-hidden="true" />
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索菜单、用户、角色..."
            className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            aria-label="全局搜索关键词"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          输入名称、邮箱、角色编码或路径，按 Esc 关闭。
        </p>
      </div>

      <div className="mt-4 max-h-[26rem] overflow-y-auto pr-1">
        {filteredResults.length > 0 ? (
          <div className="space-y-2">
            {filteredResults.map((result) => {
              const Icon = resultIcons[result.type];

              return (
                <Button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  variant="ghost"
                  className={cn(
                    "group h-auto w-full justify-start gap-3 whitespace-normal rounded-2xl border border-transparent p-3 text-left font-normal transition-all duration-200",
                    "hover:border-border hover:bg-accent/50 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-white/[0.05] dark:hover:shadow-black/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/75 bg-background/60 text-muted-foreground transition-colors group-hover:border-border group-hover:bg-accent/50 group-hover:text-orange-500">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {result.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-border/70 bg-background/45 text-[10px] text-muted-foreground"
                      >
                        {resultLabels[result.type]}
                      </Badge>
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {result.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/35 px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">没有找到匹配结果</p>
            <p className="mt-2 text-xs text-muted-foreground">
              试试用户邮箱、角色编码或菜单名称。
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
