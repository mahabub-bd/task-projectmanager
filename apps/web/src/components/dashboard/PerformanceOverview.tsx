import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface DeliveryHealthStats {
  completionRate: number;
  onTrackRate: number;
  milestoneRate: number;
  activeTasks: number;
  overdueTasks: number;
  completedMilestones: number;
  totalMilestones: number;
}

interface PerformanceOverviewProps {
  stats: DeliveryHealthStats;
}

function ProgressRing({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - safeValue / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-semibold tabular-nums tracking-tight">{safeValue}%</p>
        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Completed
        </p>
      </div>
    </div>
  );
}

export default function PerformanceOverview({ stats }: PerformanceOverviewProps) {
  const overdueRate =
    stats.activeTasks > 0 ? Math.round((stats.overdueTasks / stats.activeTasks) * 100) : 0;

  const signals = [
    {
      label: 'Tasks on track',
      value: stats.onTrackRate,
      hint: `${stats.activeTasks} active`,
      bar: 'bg-blue-500',
    },
    {
      label: 'Milestones reached',
      value: stats.milestoneRate,
      hint: `${stats.completedMilestones} of ${stats.totalMilestones}`,
      bar: 'bg-violet-500',
    },
    {
      label: 'Overdue tasks',
      value: overdueRate,
      hint: `${stats.overdueTasks} need attention`,
      bar: 'bg-rose-500',
    },
  ];

  return (
    <DashboardCard
      icon={Activity}
      title="Delivery health"
      subtitle="Signals from your current workload"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <ProgressRing value={stats.completionRate} />

        <div className="w-full flex-1 space-y-4">
          {signals.map((signal) => (
            <div key={signal.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium">{signal.label}</span>
                <span className="text-xs font-semibold tabular-nums">{signal.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-[width] duration-700', signal.bar)}
                  style={{ width: `${Math.min(signal.value, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">{signal.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        Calculated from current tasks and milestones in this workspace.
      </p>
    </DashboardCard>
  );
}
