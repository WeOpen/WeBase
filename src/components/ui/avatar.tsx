/* eslint-disable @next/next/no-img-element -- Avatar supports arbitrary user-provided image URLs. */

import * as React from "react";

import { cn } from "@/lib/utils";

const avatarSizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

type AvatarSize = keyof typeof avatarSizes;

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  isBordered?: boolean;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const colorClasses = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  warning: "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  danger: "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
} as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function Avatar({
  src,
  alt,
  name,
  size = "md",
  isBordered = false,
  color = "default",
  className,
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);

  const imageSrc = typeof src === "string" && src.length > 0 && failedSrc !== src ? src : null;
  const fallback = name ? getInitials(name) : "?";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium transition-transform duration-200",
        avatarSizes[size],
        colorClasses[color],
        isBordered && "ring-2 ring-orange-500/30 ring-offset-2 ring-offset-background",
        className,
      )}
      {...props}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt ?? name ?? "avatar"}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(imageSrc)}
        />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </div>
  );
}

Avatar.displayName = "Avatar";

export { Avatar };
export type { AvatarProps, AvatarSize };
