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
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold">Recent Tasks</h3>
              <p className="text-xs text-muted-foreground">Latest task updates</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="rounded-lg bg-primary/10 p-1">
              <CheckSquare className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">{tasks.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 space-y-2">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm">Loading tasks...</p>
            </div>
          ) : recentTasks.length > 0 ? (
            <>
              {recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => onNavigate(`/tasks/${task.id}`)}
                  className="flex items-start gap-3 rounded-t-lg p-2.5 transition-all duration-200 hover:bg-accent/50 cursor-pointer group border-b last:border-b-0 border-border/50"
                >
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 shadow-sm ${task.priority === 'urgent'
                        ? 'bg-red-500 shadow-red-500/50'
                        : task.priority === 'high'
                          ? 'bg-orange-500 shadow-orange-500/50'
                          : task.priority === 'medium'
                            ? 'bg-blue-500 shadow-blue-500/50'
                            : 'bg-gray-400 shadow-gray-400/50'
                      }`}
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h4 className="text-sm font-semibold truncate leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                    {task.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={`status-${task.status}` as any} className="text-[10px] px-2 py-0.5 font-medium">
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={`priority-${task.priority}` as any} className="text-[10px] px-2 py-0.5 font-medium">
                        {task.priority}
                      </Badge>
                      {task.project?.name && (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                          {task.project.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground rounded-full bg-muted/50 px-2 py-1">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">{formatDashboardDate(task.due_date)}</span>
                    </div>
                    {task.assigned_to_user && (
                      <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-2 py-1">
                        <div className="h-4 w-4 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-[10px] font-semibold text-white shadow-xs">
                          {task.assigned_to_user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-medium text-foreground max-w-16 truncate">
                          {task.assigned_to_user.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold">No tasks yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Create your first task to get started.</p>
              <Button onClick={() => onNavigate('/tasks')} size="sm">Create Task</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
