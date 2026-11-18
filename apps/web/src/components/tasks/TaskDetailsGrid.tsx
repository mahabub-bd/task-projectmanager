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
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Task Details</h2>
        {isOverdue && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Overdue</Badge>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Status */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 h-7 w-full rounded border bg-background px-2 text-xs"
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
        <div className={`bg-card px-3 py-2 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : ''}`}>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <CalendarIcon className="h-3 w-3 shrink-0" />
            Due Date
          </div>
          <p className={`mt-1 text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
            {safeFormatDate(task.due_date, 'MMM d, yyyy')}
          </p>
        </div>

        {/* Assignees */}
        <div className="bg-card px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <User className="h-3 w-3 shrink-0" />
            Assignees
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {assignedUsers.length > 0 ? (
              assignedUsers.map((assignedUser: any) => (
                <Badge key={assignedUser.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {assignedUser.name}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Unassigned</p>
            )}
          </div>
        </div>

        {/* Creator */}
        <div className="bg-card px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <User className="h-3 w-3 shrink-0" />
            Created by
          </div>
          <p className="mt-1 text-xs truncate">{task.created_by_user?.name || 'Unknown'}</p>
        </div>

        {/* Created Date */}
        <div className="bg-card px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <Clock className="h-3 w-3 shrink-0" />
            Created Date
          </div>
          <p className="mt-1 text-xs truncate">{safeFormatDate(task.created_at, 'MMM d, yyyy')}</p>
        </div>

        {/* Project */}
        <div className="bg-card px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <FolderKanban className="h-3 w-3 shrink-0" />
            Project
          </div>
          {task.project ? (
            <div className="mt-1">
              <p className="text-xs font-medium truncate">{task.project.name}</p>
              {task.project.status && (
                <p className="text-[10px] text-muted-foreground">
                  {task.project.status.replace('_', ' ')}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">No project assigned</p>
          )}
        </div>
      </div>
    </section>
  );
}
