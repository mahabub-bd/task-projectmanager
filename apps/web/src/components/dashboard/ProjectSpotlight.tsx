import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowUpRight, CalendarDays, Flag, FolderKanban, ListTodo, UserRound } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardCard, DashboardEmptyState } from './DashboardCard';

const formatDashboardDate = (dateValue?: string | Date | null, fallback = 'No date set') => {
  if (!dateValue) return fallback;
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, 'MMM d, yyyy');
};

const statusBadge = (status?: string) => {
  const labels: Record<string, string> = {
    planning: 'Planning',
    active: 'Active',
    completed: 'Completed',
    on_hold: 'On hold',
    cancelled: 'Cancelled',
  };

  const variants: Record<string, any> = {
    planning: 'status-draft',
    active: 'status-in_progress',
    completed: 'status-completed',
    on_hold: 'secondary',
    cancelled: 'destructive',
  };

  return (
    <Badge variant={variants[status || ''] || 'secondary'} className="px-2 py-0.5 text-[10px]">
      {labels[status || ''] || status || 'Unknown'}
    </Badge>
  );
};

const priorityDot = (priority?: string) => {
  const tones: Record<string, string> = {
    low: 'bg-slate-400',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-rose-500',
  };
  return (
    <span
      title={priority ? `Priority: ${priority}` : 'No priority'}
      className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tones[priority || ''] || 'bg-muted-foreground/40')}
    />
  );
};

interface ProjectSpotlightProps {
  projects: any[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
}

export default function ProjectSpotlight({ projects, isLoading, onNavigate }: ProjectSpotlightProps) {
  const featuredProjects = useMemo(() => {
    return [...projects]
      .sort((a: any, b: any) => {
        const aDue = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      })
      .slice(0, 4);
  }, [projects]);

  const now = new Date();

  return (
    <DashboardCard
      icon={FolderKanban}
      title="Project spotlight"
      subtitle="Active work, ordered by upcoming deadline"
      count={featuredProjects.length}
      action={{ label: 'View all', onClick: () => onNavigate('/projects') }}
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : featuredProjects.length === 0 ? (
        <DashboardEmptyState
          icon={FolderKanban}
          title="No active projects yet"
          description="Create your first project to start tracking delivery health."
          actionLabel="Create a project"
          onAction={() => onNavigate('/projects')}
        />
      ) : (
        <div className="space-y-2.5">
          {featuredProjects.map((project: any) => {
            const progress = project.progress || 0;
            const totalTasks = project.totalTasks || project.task_count || 0;
            const isOverdue =
              project.due_date &&
              new Date(project.due_date) < now &&
              project.status !== 'completed' &&
              project.status !== 'cancelled';

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onNavigate(`/projects/${project.id}`)}
                className="group w-full rounded-xl border border-border/60 bg-background/40 p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-9 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color || 'hsl(var(--primary))' }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold transition-colors group-hover:text-primary">
                        {project.name}
                      </h3>
                      {priorityDot(project.priority)}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {statusBadge(project.status)}
                      {isOverdue && (
                        <Badge variant="priority-urgent" className="px-2 py-0.5 text-[10px]">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 pl-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="truncate text-muted-foreground">
                        {project.completedTasks ?? 0} of {totalTasks} tasks done
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground',
                      isOverdue && 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    <CalendarDays className="h-3 w-3" />
                    {formatDashboardDate(project.due_date, 'No deadline')}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pl-4 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="h-3 w-3" />
                    {project.manager?.name?.split(' ')[0] || 'Unassigned'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ListTodo className="h-3 w-3" />
                    {totalTasks} tasks
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {project.milestone_count ?? project.milestones?.length ?? 0} milestones
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
