import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconClassName,
  valueClassName,
  iconBgColor = 'bg-primary/10 text-primary',
  trend,
  className,
}: StatsCardProps) {
  const hasFooter = Boolean(subtext || trend);

  return (
    <Card
      className={cn(
        'stats-card group relative flex h-full flex-col overflow-hidden rounded-xl border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        className
      )}
    >
      {/* Accent line that draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary/50 to-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-xs">
              {title}
            </p>
            <p
              className={cn(
                'mt-1.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl',
                valueClassName
              )}
            >
              {value}
            </p>
          </div>

          <span
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm sm:h-10 sm:w-10',
              iconBgColor
            )}
          >
            <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', iconClassName)} aria-hidden="true" />
          </span>
        </div>

        {hasFooter && (
          <div className="mt-auto flex min-h-[1.375rem] flex-wrap items-center gap-x-2.5 gap-y-1 pt-3 text-[13px]">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-medium',
                  trend.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="tabular-nums">
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              </span>
            )}

            {subtext && (
              <span className="truncate text-muted-foreground">{subtext}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
