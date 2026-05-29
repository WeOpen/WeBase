"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeKey: string;
  setActiveKey: (key: string) => void;
  variant: "underline" | "pill";
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

interface TabsProps {
  defaultActiveKey: string;
  activeKey?: string;
  onSelectionChange?: (key: string) => void;
  variant?: "underline" | "pill";
  children: React.ReactNode;
  className?: string;
}

function Tabs({ defaultActiveKey, activeKey: controlledKey, onSelectionChange, variant = "underline", children, className }: TabsProps) {
  const [internalKey, setInternalKey] = React.useState(defaultActiveKey);
  const activeKey = controlledKey ?? internalKey;

  const setActiveKey = React.useCallback(
    (key: string) => {
      setInternalKey(key);
      onSelectionChange?.(key);
    },
    [onSelectionChange],
  );

  const value = React.useMemo(() => ({ activeKey, setActiveKey, variant }), [activeKey, setActiveKey, variant]);

  return (
    <TabsContext.Provider value={value}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  const { variant } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center",
        variant === "underline" && "border-b border-border/50 dark:border-white/[0.06]",
        variant === "pill" && "inline-flex rounded-full bg-muted/50 p-1 dark:bg-white/[0.04]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  tabKey: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

function Tab({ tabKey, children, isDisabled, className }: TabProps) {
  const { activeKey, setActiveKey, variant } = useTabsContext();
  const isActive = activeKey === tabKey;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={() => !isDisabled && setActiveKey(tabKey)}
      className={cn(
        "relative text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDisabled && "cursor-not-allowed opacity-50",
        variant === "underline" && [
          "px-4 py-2.5",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        ],
        variant === "pill" && [
          "rounded-full px-3.5 py-1.5",
          isActive ? "bg-foreground text-background shadow-sm dark:bg-foreground dark:text-background" : "text-muted-foreground hover:text-foreground",
        ],
        className,
      )}
    >
      {children}
      {variant === "underline" && isActive && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-orange-500 transition-all duration-200" />
      )}
    </button>
  );
}

function TabsPanel({ panelKey, children, className }: { panelKey: string; children: React.ReactNode; className?: string }) {
  const { activeKey } = useTabsContext();
  if (activeKey !== panelKey) return null;

  return (
    <div role="tabpanel" className={cn("pt-4", className)}>
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;

export { Tabs };
export type { TabsProps, TabProps };
