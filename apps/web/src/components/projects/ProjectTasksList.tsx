import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, FolderKanban, Users } from 'lucide-react';
import { format } from 'date-fns';

const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMMM d, yyyy') => {
  if (!dateValue) return 'N/A';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
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

interface ProjectTasksListProps {
  tasks: any[];
  onTaskClick: (taskId: number) => void;
}

export default function ProjectTasksList({ tasks, onTaskClick }: ProjectTasksListProps) {
  const taskCount = tasks.length;

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <h3 className="font-semibold text-sm sm:text-base">Project Tasks</h3>
        </div>
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-primary">{taskCount}</span>
        </div>
      </div>
      {taskCount > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {tasks.map((task: any) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onTaskClick(task.id)}
              className="w-full rounded-lg border p-2.5 sm:p-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <FolderKanban className="h-4 w-4 text-primary" />
                    <span>{task.title}</span>
                  </p>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getPriorityBadge(task.priority || 'medium')}
                    <Badge variant="outline">{task.progress || 0}% complete</Badge>
                  </div>
                </div>
                <Badge variant={`status-${task.status}` as any}>{task.status?.replace('_', ' ')}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Due: {safeFormatDate(task.due_date)}</span>
                </span>
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tasks assigned to this project yet.</p>
      )}
    </div>
  );
}
