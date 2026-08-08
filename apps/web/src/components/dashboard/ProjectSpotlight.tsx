import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock, FileText, FolderKanban, Target, Users } from 'lucide-react';
import { useMemo } from 'react';

const getProjectTaskCount = (project: any) =>
  Array.isArray(project?.tasks) ? project.tasks.length : project?.task_count || 0;

const getProjectMilestoneCount = (project: any) =>
  Array.isArray(project?.milestones) ? project.milestones.length : project?.milestone_count || 0;

const formatDashboardDate = (dateValue?: string | Date | null, fallback = 'No date set') => {
  if (!dateValue) return fallback;
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, 'MMM d, yyyy');
};

const getProjectStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    planning: { label: 'Planning', variant: 'status-draft' as const },
    active: { label: 'Active', variant: 'status-in_progress' as const },
    completed: { label: 'Completed', variant: 'status-completed' as const },
    on_hold: { label: 'On Hold', variant: 'secondary' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
  };
  const badge = config[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
};

const getProjectPriorityBadge = (priority: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    low: { label: 'Low', variant: 'priority-low' as const },
    medium: { label: 'Medium', variant: 'priority-medium' as const },
    high: { label: 'High', variant: 'priority-high' as const },
    urgent: { label: 'Urgent', variant: 'priority-urgent' as const },
  };
  const badge = config[priority] || { label: priority || 'No priority', variant: 'secondary' as const };
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
};

const getRunningDays = (createdAt: string | Date | null | undefined): number | null => {
  if (!createdAt) return null;
  try {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
};

interface ProjectSpotlightProps {
  projects: any[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
}

export default function ProjectSpotlight({ projects, isLoading, onNavigate }: ProjectSpotlightProps) {
  const now = new Date();

  const featuredProjects = useMemo(() => {
    return [...projects]
      .sort((a: any, b: any) => {
        const aDue = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      })
      .slice(0, 4);
  }, [projects]);

  return (
    <Card className="h-full border-2">
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <div className="rounded-lg bg-primary/10 p-1 sm:p-1.5">
              <FolderKanban className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Project Spotlight</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Active projects overview</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/projects')} className="gap-1 shrink-0 px-2 h-8 sm:h-9 sm:px-3">
            <span className="hidden xs:inline">View all</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 space-y-2">
          {isLoading ? (
            <div className="p-6 sm:p-8 text-center text-muted-foreground">
              <div className="mx-auto mb-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-xs sm:text-sm">Loading projects...</p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <>
              {featuredProjects.map((project: any) => {
                const isOverdue =
                  project.due_date &&
                  new Date(project.due_date) < now &&
                  project.status !== 'completed' &&
                  project.status !== 'cancelled';
                const runningDays = getRunningDays(project.created_at);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onNavigate(`/projects/${project.id}`)}
                    className="w-full text-left rounded-lg p-2 sm:p-2.5 transition-all cursor-pointer duration-200 hover:bg-accent/50 group border border-border/50"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Header: Name, badges, overdue */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {project.color && (
                          <div
                            className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 rounded-full shadow-sm"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <h4 className="min-w-0 flex-1 font-semibold text-xs sm:text-sm truncate group-hover:text-primary transition-colors">{project.name}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          {getProjectStatusBadge(project.status)}
                          {getProjectPriorityBadge(project.priority)}
                          {isOverdue && <Badge variant="destructive" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">!</Badge>}
                        </div>
                      </div>

                      {/* Progress section - show on top for mobile */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[9px] sm:text-[10px] mb-1">
                            <span className="font-medium text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{project.progress || 0}%</span>
                          </div>
                          <Progress value={project.progress || 0} className="h-1 sm:h-1.5" />
                        </div>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground rounded-full bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1 shrink-0">
                          <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0" />
                          <span className="truncate max-w-16 sm:max-w-none">{formatDashboardDate(project.due_date)}</span>
                        </div>
                      </div>

                      {/* Metadata row - compact for mobile */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px]">
                        <div className="flex items-center gap-1 rounded-full bg-primary/5 px-1.5 sm:px-2 py-0.5 sm:py-1">
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-primary" />
                          <span className="font-medium text-foreground truncate max-w-16 sm:max-w-none">
                            {project.manager?.name?.split(' ')[0] || 'No PM'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1">
                          <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                          <span className="text-muted-foreground">{getProjectTaskCount(project)} tasks</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1">
                          <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                          <span className="text-muted-foreground">{getProjectMilestoneCount(project)} m</span>
                        </div>
                        {runningDays !== null && (
                          <div className="flex items-center gap-1 rounded-full bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                            <span className="text-muted-foreground">{runningDays}d</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
                <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-sm sm:text-base font-semibold">No projects yet</h3>
              <p className="mb-4 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Create your first project to start tracking delivery health.
              </p>
              <Button onClick={() => onNavigate('/projects')} size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                Create Your First Project
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
