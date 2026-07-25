import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FolderKanban } from 'lucide-react';

const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMM d, yyyy') => {
  if (!dateValue) return 'N/A';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    planning: { label: 'Planning', variant: 'status-draft' as any },
    active: { label: 'Active', variant: 'status-in_progress' as any },
    completed: { label: 'Completed', variant: 'status-completed' as any },
    on_hold: { label: 'On Hold', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'secondary' };
  return <Badge variant={variant}>{label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    low: { label: 'Low', variant: 'priority-low' as any },
    medium: { label: 'Medium', variant: 'priority-medium' as any },
    high: { label: 'High', variant: 'priority-high' as any },
    urgent: { label: 'Urgent', variant: 'priority-urgent' as any },
  };
  const { label, variant } = config[priority] || { label: priority, variant: 'secondary' };
  return <Badge variant={variant}>{label}</Badge>;
};

interface DepartmentProjectsProps {
  projects: any[];
  onProjectClick: (projectId: number) => void;
}

export default function DepartmentProjects({ projects, onProjectClick }: DepartmentProjectsProps) {
  const projectCount = projects.length;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Department Projects</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
          <FolderKanban className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{projectCount}</span>
        </div>
      </div>
      {projectCount > 0 ? (
        <div className="space-y-3">
          {projects.map((project: any) => {
            const isOverdue =
              project.due_date &&
              new Date(project.due_date) < new Date() &&
              project.status !== 'completed' &&
              project.status !== 'cancelled';

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onProjectClick(project.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                  isOverdue ? 'border-red-300 dark:border-red-800' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold truncate">{project.name}</h4>
                      {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                    {project.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground mb-2">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getStatusBadge(project.status)}
                      {getPriorityBadge(project.priority || 'medium')}
                      <Badge variant="outline">{project.progress || 0}% complete</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>Due: {safeFormatDate(project.due_date)}</span>
                      </span>
                      {project.manager && (
                        <span>• Manager: {project.manager.name}</span>
                      )}
                      {project.task_count !== undefined && (
                        <span>• {project.task_count} tasks</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No projects in this department yet.</p>
        </div>
      )}
    </div>
  );
}
