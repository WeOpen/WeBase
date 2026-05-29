import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "flat";
  isHoverable?: boolean;
  isPressable?: boolean;
}

const cardVariants = {
  default: "border border-border/50 bg-card/80 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]",
  outlined: "border border-border/50 bg-transparent dark:border-white/[0.06]",
  flat: "border-0 bg-muted/50 dark:bg-white/[0.04]",
} as const;

function Card({ variant = "default", isHoverable, isPressable, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl text-card-foreground transition-all duration-200",
        cardVariants[variant],
        isHoverable && "hover:shadow-md hover:border-border dark:hover:border-white/[0.1]",
        isPressable && "cursor-pointer active:scale-[0.98] active:shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pt-5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight text-card-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 border-t border-border/50 px-5 py-3 dark:border-white/[0.06]", className)} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export { Card };
export type { CardProps };
