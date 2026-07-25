import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

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
    draft: { label: 'Draft', variant: 'status-draft' as any },
    open: { label: 'Open', variant: 'status-in_progress' as any },
    in_progress: { label: 'In Progress', variant: 'status-in_progress' as any },
    review: { label: 'Review', variant: 'status-in_progress' as any },
    completed: { label: 'Completed', variant: 'status-completed' as any },
    closed: { label: 'Closed', variant: 'status-completed' as any },
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

interface DepartmentTasksProps {
  tasks: any[];
  onTaskClick: (taskId: number) => void;
}

export default function DepartmentTasks({ tasks, onTaskClick }: DepartmentTasksProps) {
  const taskCount = tasks.length;
  const now = new Date();

  const overdueTasks = tasks.filter(
    (task: any) => task.due_date && new Date(task.due_date) < now && task.status !== 'completed' && task.status !== 'closed',
  ).length;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Department Tasks</h3>
        </div>
        <div className="flex items-center gap-3">
          {overdueTasks > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">{overdueTasks} overdue</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{taskCount}</span>
          </div>
        </div>
      </div>
      {taskCount > 0 ? (
        <div className="space-y-3">
          {tasks.map((task: any) => {
            const isOverdue =
              task.due_date && new Date(task.due_date) < now && task.status !== 'completed' && task.status !== 'closed';

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onTaskClick(task.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                  isOverdue ? 'border-red-300 dark:border-red-800' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold truncate">{task.title}</h4>
                      {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                    {task.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority || 'medium')}
                      <Badge variant="outline">{task.progress || 0}% complete</Badge>
                      {task.project && <Badge variant="outline">{task.project.name}</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>Due: {safeFormatDate(task.due_date)}</span>
                      </span>
                      {task.assigned_to_user && <span>• Assigned to: {task.assigned_to_user.name}</span>}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No tasks in this department yet.</p>
        </div>
      )}
    </div>
  );
}
