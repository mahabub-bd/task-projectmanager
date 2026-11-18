import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-border bg-background text-foreground hover:bg-muted",
        success:
          "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300",
        warning:
          "border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950 dark:text-amber-300",
        info:
          "border-blue-200/60 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950 dark:text-blue-300",
        "status-draft":
          "border-slate-200/60 bg-slate-100 text-slate-600 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-400",
        "status-open":
          "border-blue-200/60 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950 dark:text-blue-300",
        "status-in_progress":
          "border-indigo-200/60 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950 dark:text-indigo-300",
        "status-review":
          "border-violet-200/60 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950 dark:text-violet-300",
        "status-completed":
          "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300",
        "status-closed":
          "border-slate-200/60 bg-slate-100 text-slate-500 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-400",
        "priority-low":
          "border-slate-200/60 bg-slate-100 text-slate-600 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-400",
        "priority-medium":
          "border-blue-200/60 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950 dark:text-blue-300",
        "priority-high":
          "border-orange-200/60 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950 dark:text-orange-300",
        "priority-urgent":
          "border-red-200/60 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950 dark:text-red-300",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        default: "px-2 py-0.5 text-[11px]",
        lg: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            variant === "default" && "bg-primary-foreground",
            variant === "secondary" && "bg-secondary-foreground/60",
            variant === "destructive" && "bg-destructive-foreground",
            variant === "outline" && "bg-foreground/50",
            variant === "success" && "bg-emerald-500",
            variant === "warning" && "bg-amber-500",
            variant === "info" && "bg-blue-500",
            variant === "status-draft" && "bg-slate-400",
            variant === "status-open" && "bg-blue-500",
            variant === "status-in_progress" && "bg-indigo-500",
            variant === "status-review" && "bg-violet-500",
            variant === "status-completed" && "bg-emerald-500",
            variant === "status-closed" && "bg-slate-400",
            variant === "priority-low" && "bg-slate-400",
            variant === "priority-medium" && "bg-blue-500",
            variant === "priority-high" && "bg-orange-500",
            variant === "priority-urgent" && "bg-red-500"
          )}
        />
      )}
      {children}
    </span>
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
