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
  iconBgColor = 'bg-primary/10',
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn(
      'group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/50',
      className
    )}>
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all duration-300 group-hover:from-primary/10" />

      <CardContent className="p-3 sm:p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Content */}
          <div className="flex-1 space-y-0.5 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <div className={cn(
              'text-xl sm:text-3xl font-bold tracking-tight',
              valueClassName
            )}>
              {value}
            </div>

            {/* Subtext or Trend */}
            {subtext && !trend && (
              <p className="text-[10px] sm:text-sm text-muted-foreground">{subtext}</p>
            )}

            {/* Trend Indicator */}
            {trend && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                )}
                <span className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-muted-foreground ml-0.5 sm:ml-1 hidden xs:inline">vs last month</span>
              </div>
            )}
          </div>

          {/* Right side - Icon */}
          <div className={cn(
            'flex h-9 w-9 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300',
            iconBgColor,
            'group-hover:scale-110 group-hover:shadow-md'
          )}>
            <Icon className={cn('h-4 w-4 sm:h-7 sm:w-7', iconClassName)} />
          </div>
        </div>

        {/* Bottom highlight bar on hover */}
        <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary/50 to-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rounded-b-2xl" />
      </CardContent>
    </Card>
  );
}
