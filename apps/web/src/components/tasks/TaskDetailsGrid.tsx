import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, FolderKanban, User } from 'lucide-react';

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

interface TaskDetailsGridProps {
  task: any;
  assignedUsers: any[];
  isOverdue: boolean;
  onStatusChange: (status: string) => void;
}

export default function TaskDetailsGrid({ task, assignedUsers, isOverdue, onStatusChange }: TaskDetailsGridProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-base font-semibold">Task Details</h2>
          <p className="text-xs text-muted-foreground">Assignment, schedule, and project context</p>
        </div>
        {isOverdue && <Badge variant="destructive">Overdue</Badge>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {/* Status */}
        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground block">Status</label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-8 w-full rounded-md border bg-background px-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Due Date */}
        <div className={`space-y-1.5 p-4 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : 'bg-card'}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            Due Date
          </div>
          <p className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
            {safeFormatDate(task.due_date, 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Assignee */}
        <div className="space-y-1.5 bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            Assignees
          </div>
          <div className="flex flex-wrap gap-2">
            {assignedUsers.length > 0 ? (
              assignedUsers.map((assignedUser: any) => (
                <Badge key={assignedUser.id} variant="secondary">
                  {assignedUser.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm">Unassigned</p>
            )}
          </div>
        </div>

        {/* Creator */}
        <div className="space-y-1.5 bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            Created by
          </div>
          <p className="text-sm">{task.created_by_user?.name || 'Unknown'}</p>
        </div>

        {/* Created Date */}
        <div className="space-y-1.5 bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Created Date
          </div>
          <p className="text-sm">{safeFormatDate(task.created_at, 'MMMM d, yyyy • h:mm a')}</p>
        </div>

        {/* Project */}
        <div className="space-y-1.5 bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <FolderKanban className="h-3.5 w-3.5" />
            Project
          </div>
          {task.project ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">{task.project.name}</p>
              {task.project.status && (
                <p className="text-xs text-muted-foreground">
                  Status: {task.project.status.replace('_', ' ')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm">No project assigned</p>
          )}
        </div>
      </div>
    </section>
  );
}
