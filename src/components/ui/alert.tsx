import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "default" | "success" | "warning" | "danger";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isClosable?: boolean;
  onClose?: () => void;
}

const variantStyles = {
  default: {
    container: "border-border/50 bg-muted/30 dark:border-white/[0.06] dark:bg-white/[0.03]",
    icon: "text-muted-foreground",
    defaultIcon: Info,
  },
  success: {
    container: "border-green-500/25 bg-green-50/80 dark:border-green-500/20 dark:bg-green-500/10",
    icon: "text-green-600 dark:text-green-400",
    defaultIcon: CheckCircle2,
  },
  warning: {
    container: "border-yellow-500/25 bg-yellow-50/80 dark:border-yellow-500/20 dark:bg-yellow-500/10",
    icon: "text-yellow-600 dark:text-yellow-400",
    defaultIcon: AlertTriangle,
  },
  danger: {
    container: "border-red-500/25 bg-red-50/80 dark:border-red-500/20 dark:bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
    defaultIcon: XCircle,
  },
} as const;

function Alert({
  variant = "default",
  title,
  description,
  icon: IconProp,
  isClosable,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const style = variantStyles[variant];
  const Icon = IconProp ?? style.defaultIcon;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        style.container,
        className,
      )}
      {...props}
    >
      <span className={cn("mt-0.5 shrink-0", style.icon)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-medium text-card-foreground">{title}</p>}
        {description && <p className={cn("text-sm leading-6 text-muted-foreground", title && "mt-1")}>{description}</p>}
        {children}
      </div>
      {isClosable && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="关闭"
        >
          <XCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

Alert.displayName = "Alert";

export { Alert };
export type { AlertProps, AlertVariant };
