"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("group relative", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground/50 opacity-0 transition-all hover:bg-muted hover:text-muted-foreground group-hover:opacity-100"
        aria-label={copied ? "已复制" : "复制代码"}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/30 p-4 text-[13px] leading-6 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.02]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
