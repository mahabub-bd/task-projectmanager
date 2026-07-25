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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Status */}
      <div className="rounded-lg border bg-card p-4">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm"
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
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4" />
          Due Date
        </div>
        <p className={`text-sm ${isOverdue ? 'text-red-600' : ''}`}>
          {safeFormatDate(task.due_date, 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Assignee */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <User className="h-4 w-4" />
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
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <User className="h-4 w-4" />
          Created by
        </div>
        <p className="text-sm">{task.created_by_user?.name || 'Unknown'}</p>
      </div>

      {/* Created Date */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Clock className="h-4 w-4" />
          Created Date
        </div>
        <p className="text-sm">{safeFormatDate(task.created_at, 'MMMM d, yyyy • h:mm a')}</p>
      </div>

      {/* Project */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <FolderKanban className="h-4 w-4" />
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
  );
}
