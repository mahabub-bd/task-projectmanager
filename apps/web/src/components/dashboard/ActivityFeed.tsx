import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useMemo } from 'react';

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
}

const defaultActivities: ActivityItem[] = [];

const getActivityIcon = (type: ActivityItem['type']) => {
  const icons = {
    task_completed: { icon: CheckCircle2, className: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
    task_created: { icon: Plus, className: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    project_updated: { icon: TrendingUp, className: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    milestone_completed: { icon: Calendar, className: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
    user_assigned: { icon: UserPlus, className: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
  };
  return icons[type] || icons.task_created;
};

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return format(date, 'MMM d');
};

export default function ActivityFeed({ activities = defaultActivities, limit = 5 }: ActivityFeedProps) {
  const displayActivities = useMemo(() => activities.slice(0, limit), [activities, limit]);

  return (
    <Card className="h-full border-2">
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="rounded-lg bg-primary/10 p-1 sm:p-1.5">
              <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Recent Activity</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Latest updates from your team</p>
            </div>
          </div>
        </div>

        {displayActivities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-3 sm:p-4">
              <div className="mx-auto mb-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-muted">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">No recent activity</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto -mx-1 space-y-1.5 sm:space-y-2">
            {displayActivities.map((activity) => {
              const { icon: Icon, className } = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id}
                  className="flex gap-2 sm:gap-2.5 group rounded-lg p-2 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  {/* Icon with subtle shadow */}
                  <div className={`relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${className}`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>

                  {/* Content - improved spacing */}
                  <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                    {/* Line 1: Title */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-semibold truncate flex-1 leading-tight">{activity.title}</p>
                      {activity.user && (
                        <div className="flex items-center gap-1 shrink-0 rounded-full bg-primary/5 px-1 sm:px-1.5 py-0.5">
                          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
                            {activity.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[9px] sm:text-[11px] font-medium text-foreground truncate max-w-10 sm:max-w-none">
                            {activity.user.name.split(' ')[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Line 2: Metadata row */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {activity.metadata?.projectName && (
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 font-medium">
                          {activity.metadata.projectName}
                        </Badge>
                      )}
                      {activity.description && (
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate max-w-30 sm:max-w-50 hidden xs:block">
                          {activity.description}
                        </span>
                      )}
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground/70 ml-auto shrink-0 flex items-center gap-0.5 sm:gap-1">
                        <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        {timeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
