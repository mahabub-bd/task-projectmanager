import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

/**
 * Performance Overview Component
 *
 * Displays key team metrics with trend indicators and target progress.
 * Features proper dark/light mode support with validated color palette.
 */

interface PerformanceMetric {
  value: number;
  previousValue?: number;
  target?: number;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency';
}

interface PerformanceOverviewProps {
  metrics: {
    tasksCompleted: PerformanceMetric;
    projectsOnTrack: PerformanceMetric;
    teamProductivity: PerformanceMetric;
    avgCompletionTime: PerformanceMetric;
  };
}

type TrendDirection = 'up' | 'down' | 'neutral';

interface TrendInfo {
  icon: typeof TrendingUp | typeof TrendingDown | typeof Minus;
  trend: TrendDirection;
  change: number;
}

interface MetricItem {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
  target?: number;
  unit?: string;
  format?: string;
  color: string;
}

/**
 * Format numeric values based on format type
 */
const formatValue = (value: number, format?: string, unit?: string): string => {
  let formatted: string;

  switch (format) {
    case 'percentage':
      formatted = `${value}%`;
      break;
    case 'currency':
      formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
      break;
    case 'number':
    default:
      formatted = new Intl.NumberFormat('en-US').format(value);
      break;
  }

  return unit ? `${formatted} ${unit}` : formatted;
};

/**
 * Calculate trend direction and change percentage
 * Uses 5% threshold to determine significant trends
 */
const getTrend = (current: number, previous?: number): TrendInfo => {
  if (!previous || previous === 0) {
    return { icon: Minus, trend: 'neutral', change: 0 };
  }

  const change = ((current - previous) / previous) * 100;

  if (change > 5) return { icon: TrendingUp, trend: 'up', change };
  if (change < -5) return { icon: TrendingDown, trend: 'down', change };
  return { icon: Minus, trend: 'neutral', change };
};

/**
 * Get color classes for metric indicators
 * Uses validated palette for both light and dark modes
 */
const getMetricColors = (color: string) => {
  const colors: Record<string, { bg: string; text: string; progress: string; ring: string }> = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-400/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      progress: 'bg-emerald-500 dark:bg-emerald-400',
      ring: 'focus:ring-emerald-500/50',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-400/10',
      text: 'text-blue-700 dark:text-blue-400',
      progress: 'bg-blue-500 dark:bg-blue-400',
      ring: 'focus:ring-blue-500/50',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-400/10',
      text: 'text-purple-700 dark:text-purple-400',
      progress: 'bg-purple-500 dark:bg-purple-400',
      ring: 'focus:ring-purple-500/50',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-400/10',
      text: 'text-amber-700 dark:text-amber-400',
      progress: 'bg-amber-500 dark:bg-amber-400',
      ring: 'focus:ring-amber-500/50',
    },
  };
  return colors[color] || colors.blue;
};

/**
 * Get trend badge variant for the Badge component
 */
const getTrendBadgeVariant = (trend: TrendDirection): string => {
  const variants = {
    up: 'status-completed', // Using emerald for positive trend
    down: 'priority-urgent', // Using red for negative trend
    neutral: 'priority-low', // Using slate for neutral trend
  };
  return variants[trend];
};

/**
 * PerformanceOverview Component
 *
 * Displays team performance metrics with:
 * - Trend indicators showing change from previous period
 * - Progress bars for target completion
 * - Proper dark/light mode support
 * - Accessible color contrasts
 */
export default function PerformanceOverview({ metrics }: PerformanceOverviewProps) {
  const metricItems: MetricItem[] = useMemo(() => {
    return [
      {
        key: 'tasksCompleted',
        label: 'Tasks Completed',
        value: metrics.tasksCompleted.value,
        previousValue: metrics.tasksCompleted.previousValue,
        target: metrics.tasksCompleted.target,
        unit: metrics.tasksCompleted.unit,
        format: metrics.tasksCompleted.format,
        color: 'emerald',
      },
      {
        key: 'projectsOnTrack',
        label: 'Projects On Track',
        value: metrics.projectsOnTrack.value,
        previousValue: metrics.projectsOnTrack.previousValue,
        target: metrics.projectsOnTrack.target,
        unit: metrics.projectsOnTrack.unit,
        format: metrics.projectsOnTrack.format,
        color: 'blue',
      },
      {
        key: 'teamProductivity',
        label: 'Team Productivity',
        value: metrics.teamProductivity.value,
        previousValue: metrics.teamProductivity.previousValue,
        target: metrics.teamProductivity.target,
        unit: metrics.teamProductivity.unit,
        format: metrics.teamProductivity.format || 'percentage',
        color: 'purple',
      },
      {
        key: 'avgCompletionTime',
        label: 'Avg. Completion Time',
        value: metrics.avgCompletionTime.value,
        previousValue: metrics.avgCompletionTime.previousValue,
        target: metrics.avgCompletionTime.target,
        unit: metrics.avgCompletionTime.unit || 'days',
        format: metrics.avgCompletionTime.format,
        color: 'amber',
      },
    ];
  }, [metrics]);

  return (
    <Card className="border h-full transition-colors duration-300 hover:border-primary/30 dark:hover:border-primary/20">
      <CardContent className="p-3 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 transition-all duration-300 hover:bg-primary/15">
              <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold tracking-tight">Performance Overview</h3>
              <p className="text-xs text-muted-foreground">Track your team's key metrics</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {metricItems.map((item) => {
            const { icon: TrendIcon, trend, change } = getTrend(item.value, item.previousValue);
            const colors = getMetricColors(item.color);
            const progressValue = item.target ? Math.min((item.value / item.target) * 100, 100) : 0;
            const isNearTarget = item.target && progressValue >= 80;
            const isAtTarget = item.target && progressValue >= 100;

            return (
              <div
                key={item.key}
                className="group relative rounded-lg p-2 transition-all duration-300 hover:bg-muted/30 border border-transparent hover:border-border/50"
              >
                <div className="space-y-2">
                  {/* Metric Header with Value and Trend */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-lg font-bold tracking-tight tabular-nums">
                        {formatValue(item.value, item.format, item.unit)}
                      </p>
                    </div>

                    {/* Trend Badge */}
                    <Badge
                      variant={getTrendBadgeVariant(trend) as any}
                      className="gap-1 px-2 py-0.5"
                      aria-label={`Trend: ${trend}, ${Math.abs(change).toFixed(1)}% change`}
                    >
                      <TrendIcon className="h-3 w-3" strokeWidth={2.5} />
                      <span className="tabular-nums">{Math.abs(change).toFixed(1)}%</span>
                    </Badge>
                  </div>

                  {/* Progress Section */}
                  {item.target && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span
                          className={cn(
                            'font-semibold tabular-nums',
                            isAtTarget ? 'text-emerald-600 dark:text-emerald-400' :
                            isNearTarget ? 'text-amber-600 dark:text-amber-400' :
                            'text-muted-foreground'
                          )}
                        >
                          {progressValue.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={progressValue}
                        className={cn(
                          'h-1.5 transition-all duration-500',
                          colors.ring
                        )}
                      />
                      {isAtTarget && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Target achieved!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Decoration */}
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Real-time updates
          </p>
        </div>
      </CardContent>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted)) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted));
          border-radius: 2px;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: hsl(var(--muted) / 0.5);
          }
        }
      `}</style>
    </Card>
  );
}
