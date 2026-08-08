import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckSquare } from 'lucide-react';
import { useMemo } from 'react';

const formatDashboardDate = (dateValue?: string | Date | null, fallback = 'No date set') => {
  if (!dateValue) return fallback;
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface RecentTasksProps {
  tasks: any[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
}

export default function RecentTasks({ tasks, isLoading, onNavigate }: RecentTasksProps) {
  const recentTasks = useMemo(() => tasks.slice(0, 6), [tasks]);

  return (
    <Card className="h-full border-2">
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <div className="rounded-lg bg-primary/10 p-1 sm:p-1.5">
              <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold">Recent Tasks</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Latest task updates</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="rounded-lg bg-primary/10 p-0.5 sm:p-1">
              <CheckSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{tasks.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 space-y-1.5 sm:space-y-2">
          {isLoading ? (
            <div className="p-6 sm:p-8 text-center text-muted-foreground">
              <div className="mx-auto mb-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-xs sm:text-sm">Loading tasks...</p>
            </div>
          ) : recentTasks.length > 0 ? (
            <>
              {recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => onNavigate(`/tasks/${task.id}`)}
                  className="flex items-start gap-2 sm:gap-3 rounded-lg p-2 sm:p-2.5 transition-all duration-200 hover:bg-accent/50 cursor-pointer group border border-border/50"
                >
                  <div
                    className={`mt-1 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0 shadow-sm ${task.priority === 'urgent'
                        ? 'bg-red-500 shadow-red-500/50'
                        : task.priority === 'high'
                          ? 'bg-orange-500 shadow-orange-500/50'
                          : task.priority === 'medium'
                            ? 'bg-blue-500 shadow-blue-500/50'
                            : 'bg-gray-400 shadow-gray-400/50'
                      }`}
                  />

                  <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-semibold truncate leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                    {task.description && (
                      <p className="line-clamp-1 text-[10px] sm:text-xs text-muted-foreground hidden xs:block">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <Badge variant={`status-${task.status}` as any} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-medium">
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={`priority-${task.priority}` as any} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-medium">
                        {task.priority}
                      </Badge>
                      {task.project?.name && (
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                          {task.project.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 sm:gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-muted-foreground rounded-full bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1">
                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="truncate max-w-12 sm:max-w-none">{formatDashboardDate(task.due_date)}</span>
                    </div>
                    {task.assigned_to_user && (
                      <div className="flex items-center gap-1 rounded-full bg-primary/5 px-1.5 sm:px-2 py-0.5 sm:py-1">
                        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
                          {task.assigned_to_user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[9px] sm:text-[11px] font-medium text-foreground max-w-12 sm:max-w-16 truncate">
                          {task.assigned_to_user.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-sm sm:text-base font-semibold">No tasks yet</h3>
              <p className="mb-4 text-xs sm:text-sm text-muted-foreground">Create your first task to get started.</p>
              <Button onClick={() => onNavigate('/tasks')} size="sm" className="text-xs sm:text-sm h-8 sm:h-9">Create Task</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
