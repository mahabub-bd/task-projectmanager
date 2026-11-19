import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDays, CheckSquare2, ListTodo } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardCard, DashboardEmptyState } from './DashboardCard';

const formatDashboardDate = (dateValue?: string | Date | null, fallback = 'No date') => {
  if (!dateValue) return fallback;
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, 'MMM d');
};

const priorityDot: Record<string, string> = {
  urgent: 'bg-rose-500',
  high: 'bg-orange-500',
  medium: 'bg-blue-500',
  low: 'bg-slate-400',
};

interface RecentTasksProps {
  tasks: any[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
}

export default function RecentTasks({ tasks, isLoading, onNavigate }: RecentTasksProps) {
  const recentTasks = useMemo(() => tasks.slice(0, 6), [tasks]);
  const now = new Date();

  return (
    <DashboardCard
      icon={CheckSquare2}
      title="Recent tasks"
      subtitle="Newest tasks across your workspace"
      count={recentTasks.length}
      action={{ label: 'View all', onClick: () => onNavigate('/tasks') }}
    >
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : recentTasks.length === 0 ? (
        <DashboardEmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Create a task to start tracking work in this workspace."
          actionLabel="Go to tasks"
          onAction={() => onNavigate('/tasks')}
        />
      ) : (
        <div className="dashboard-scroll max-h-[26rem] space-y-2 overflow-y-auto pr-1">
          {recentTasks.map((task: any) => {
            const isOverdue =
              task.due_date && new Date(task.due_date) < now && task.status !== 'completed';

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onNavigate(`/tasks/${task.id}`)}
                className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-2.5 text-left transition-colors hover:border-border/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    priorityDot[task.priority] || 'bg-muted-foreground/40'
                  )}
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-medium transition-colors group-hover:text-primary">
                    {task.title}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={`status-${task.status}` as any} className="px-2 py-0.5 text-xs">
                      {String(task.status || 'unknown').replace('_', ' ')}
                    </Badge>
                    {task.project?.name && (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs break-words text-muted-foreground">
                        {task.project.name}
                      </span>
                    )}
                  </span>
                </span>

                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[13px] text-muted-foreground',
                      isOverdue && 'font-medium text-rose-600 dark:text-rose-400'
                    )}
                  >
                    <CalendarDays className="h-3 w-3" />
                    {formatDashboardDate(task.due_date)}
                  </span>
                  {task.assigned_to_user && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/90 text-[11px] font-semibold text-primary-foreground">
                        {task.assigned_to_user.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                      <span className="hidden max-w-20 truncate sm:inline">
                        {task.assigned_to_user.name?.split(' ')[0]}
                      </span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
