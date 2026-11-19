import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDot,
  CirclePlus,
  CircleX,
  Eye,
  Flame,
  Info,
  MinusCircle,
  PenLine,
  PlayCircle,
} from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Badge colors per theme:
 * - Light mode: -100 tinted background, -800 text, -200 border
 * - Dark mode:  -950 background, -300 text, -800/60 border (muted, easy on eyes)
 *
 * Full literal class strings — Tailwind's JIT scanner cannot see
 * interpolated names like `border-${hue}-200`.
 */
const tint = (hue: "blue" | "emerald" | "amber" | "indigo" | "violet" | "orange" | "red") => {
  const hues = {
    blue: {
      badge:
        "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/60 dark:bg-blue-950 dark:text-blue-300",
      dot: "bg-blue-500",
    },
    emerald: {
      badge:
        "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    amber: {
      badge:
        "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    indigo: {
      badge:
        "border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-800/60 dark:bg-indigo-950 dark:text-indigo-300",
      dot: "bg-indigo-500",
    },
    violet: {
      badge:
        "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800/60 dark:bg-violet-950 dark:text-violet-300",
      dot: "bg-violet-500",
    },
    orange: {
      badge:
        "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800/60 dark:bg-orange-950 dark:text-orange-300",
      dot: "bg-orange-500",
    },
    red: {
      badge:
        "border-red-200 bg-red-100 text-red-800 dark:border-red-800/60 dark:bg-red-950 dark:text-red-300",
      dot: "bg-red-500",
    },
  } as const
  return hues[hue]
}

const neutralTint = {
  badge:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-400",
  dot: "bg-slate-400",
}

const BADGE_COLORS = {
  default: {
    badge:
      "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 dark:border-transparent dark:bg-primary dark:text-primary-foreground dark:shadow-sm dark:hover:bg-primary/90",
    dot: "bg-primary",
  },
  secondary: {
    badge: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    dot: "bg-secondary-foreground/60",
  },
  destructive: {
    badge:
      "border-red-200 bg-red-100 text-red-800 hover:bg-red-200/70 dark:border-transparent dark:bg-destructive dark:text-destructive-foreground dark:shadow-sm dark:hover:bg-destructive/90",
    dot: "bg-red-500",
  },
  outline: {
    badge: "border-border bg-background text-foreground hover:bg-muted",
    dot: "bg-foreground/50",
  },
  success: tint("emerald"),
  warning: tint("amber"),
  info: tint("blue"),

  "status-draft": neutralTint,
  "status-open": tint("blue"),
  "status-in_progress": tint("indigo"),
  "status-review": tint("violet"),
  "status-completed": tint("emerald"),
  "status-closed": neutralTint,

  "priority-low": neutralTint,
  "priority-medium": tint("blue"),
  "priority-high": tint("orange"),
  "priority-urgent": tint("red"),
} as const

type BadgeColorKey = keyof typeof BADGE_COLORS

/**
 * Default icon shown per variant. Icons render automatically for these
 * variants (pass `icon={false}` to hide, or `icon={<X />}` to override).
 */
const DEFAULT_ICONS: Partial<Record<BadgeColorKey, React.ReactNode>> = {
  success: <CheckCircle2 />,
  warning: <AlertTriangle />,
  info: <Info />,
  destructive: <CircleX />,
  "status-draft": <PenLine />,
  "status-open": <CirclePlus />,
  "status-in_progress": <PlayCircle />,
  "status-review": <Eye />,
  "status-completed": <CheckCircle2 />,
  "status-closed": <Ban />,
  "priority-low": <MinusCircle />,
  "priority-medium": <CircleDot />,
  "priority-high": <Flame />,
  "priority-urgent": <AlertTriangle />,
}

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-xs font-medium capitalize leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: Object.fromEntries(
        Object.entries(BADGE_COLORS).map(([key, { badge }]) => [key, badge])
      ) as Record<BadgeColorKey, string>,
      size: {
        sm: "px-1.5 py-0.5 text-[11px]",
        default: "px-2 py-1 text-xs",
        lg: "px-2.5 py-1.5 text-sm",
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
  /**
   * Icon before the label.
   * - `true` (default for colored variants): shows the variant's default icon
   * - ReactNode: custom icon override
   * - `false`: hides the icon
   */
  icon?: React.ReactNode | boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot = false, icon, children, ...props }, ref) => {
    const colors = BADGE_COLORS[(variant ?? "default") as BadgeColorKey] ?? BADGE_COLORS.default
    const variantKey = (variant ?? "default") as BadgeColorKey

    // If the caller already renders its own icon as a child element
    // (e.g. <Badge><Network />Division</Badge>), don't add the default one.
    const hasCustomChildIcon = React.Children.toArray(children).some((child) =>
      React.isValidElement(child)
    )

    // Colored variants show their default icon unless explicitly disabled.
    const resolvedIcon =
      icon === false
        ? null
        : icon !== undefined && icon !== true
          ? icon
          : hasCustomChildIcon
            ? null
            : DEFAULT_ICONS[variantKey]

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", colors.dot)} />
        )}
        {resolvedIcon && (
          <span aria-hidden="true" className="shrink-0 [&>svg]:h-3 [&>svg]:w-3">
            {resolvedIcon}
          </span>
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
