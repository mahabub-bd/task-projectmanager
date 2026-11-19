import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  TrendingUp,
  UserRoundPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardCard, DashboardEmptyState } from './DashboardCard';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'task_created' | 'project_updated' | 'milestone_completed' | 'user_assigned';
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    projectName?: string;
    taskName?: string;
    status?: string;
  };
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  limit?: number;
  onNavigate?: (path: string) => void;
}

const activityStyles: Record<ActivityItem['type'], { icon: LucideIcon; tone: string }> = {
  task_completed: {
    icon: CheckCircle2,
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  task_created: { icon: Plus, tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  project_updated: {
    icon: TrendingUp,
    tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  milestone_completed: {
    icon: CalendarDays,
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  user_assigned: { icon: UserRoundPlus, tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
};

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return format(date, 'MMM d');
};

export default function ActivityFeed({ activities = [], limit = 5, onNavigate }: ActivityFeedProps) {
  const displayActivities = useMemo(() => activities.slice(0, limit), [activities, limit]);

  return (
    <DashboardCard
      icon={Activity}
      title="Recent activity"
      subtitle="Latest updates from your team"
      action={onNavigate ? { label: 'View all', onClick: () => onNavigate('/audit-logs') } : undefined}
    >
      {displayActivities.length === 0 ? (
        <DashboardEmptyState
          icon={Clock3}
          title="No recent activity"
          description="Changes to projects and tasks will appear here."
          compact
        />
      ) : (
        <ol className="dashboard-scroll relative max-h-[22rem] space-y-4 overflow-y-auto pr-1 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-border/70">
          {displayActivities.map((activity) => {
            const style = activityStyles[activity.type] || activityStyles.task_created;
            const Icon = style.icon;

            return (
              <li key={activity.id} className="relative flex gap-3">
                <span
                  className={cn(
                    'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-card',
                    style.tone
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium leading-snug">{activity.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
                    {activity.user && <span>{activity.user.name.split(' ')[0]}</span>}
                    {activity.description && (
                      <>
                        {activity.user && <span aria-hidden="true">·</span>}
                        <span className="truncate">{activity.description}</span>
                      </>
                    )}
                    <span className="ml-auto inline-flex shrink-0 items-center gap-1">
                      <Clock3 className="h-2.5 w-2.5" />
                      {timeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardCard>
  );
}
