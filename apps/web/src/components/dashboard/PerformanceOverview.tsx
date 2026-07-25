import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMemo } from 'react';

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

const formatValue = (value: number, format?: string, unit?: string) => {
  let formatted = value.toString();

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

const getTrend = (current: number, previous?: number) => {
  if (!previous) return { icon: Minus, trend: 'neutral', change: 0 };

  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  if (change > 5) return { icon: TrendingUp, trend: 'up', change };
  if (change < -5) return { icon: TrendingDown, trend: 'down', change };
  return { icon: Minus, trend: 'neutral', change };
};

export default function PerformanceOverview({ metrics }: PerformanceOverviewProps) {
  const metricItems = useMemo(() => {
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
    <Card className="border-2 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold">Performance Overview</h3>
              <p className="text-xs text-muted-foreground">Track your team's key metrics</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {metricItems.map((item) => {
            const { icon: TrendIcon, trend, change } = getTrend(item.value, item.previousValue);
            const progressValue = item.target ? Math.min((item.value / item.target) * 100, 100) : 0;

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold">
                      {formatValue(item.value, item.format, item.unit)}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
                    trend === 'up'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : trend === 'down'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </div>
                </div>

                {item.target && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress to target</span>
                      <span className="font-medium">{progressValue.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressValue} className="h-1.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
