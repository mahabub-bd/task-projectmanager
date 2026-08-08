import { format } from 'date-fns';
import { Calendar, Clock, Target } from 'lucide-react';

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

interface MilestoneDetailsGridProps {
  milestone: any;
  onStatusChange: (status: string) => void;
  onProgressChange: (progress: number) => void;
  onProjectClick?: (projectId: string | number) => void;
}

export default function MilestoneDetailsGrid({
  milestone,
  onStatusChange,
  onProgressChange,
  onProjectClick,
}: MilestoneDetailsGridProps) {
  const isOverdue = milestone?.due_date &&
    new Date(milestone.due_date) < new Date() &&
    milestone?.status !== 'completed' &&
    milestone?.status !== 'cancelled';

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-3 py-3 sm:px-4 sm:py-3 lg:px-5">
        <div>
          <h2 className="text-sm font-semibold sm:text-base">Milestone Details</h2>
          <p className="text-xs text-muted-foreground">Progress, schedule, and project context</p>
        </div>
        {isOverdue && <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">Overdue</span>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
          <select
            value={milestone.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-2 py-1 rounded border bg-background text-sm"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Progress */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Progress</label>
          <select
            value={String(milestone.progress || 0)}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full px-2 py-1 rounded border bg-background text-sm"
          >
            <option value="0">0%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Start Date</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{safeFormatDate(milestone.start_date)}</span>
          </p>
        </div>

        {/* Due Date */}
        <div className={`p-3 sm:p-4 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : 'bg-card'}`}>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
          <p className={`text-sm font-medium inline-flex items-center gap-1 truncate ${isOverdue ? 'text-red-600' : ''
            }`}>
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{safeFormatDate(milestone.due_date)}</span>
          </p>
        </div>

        {/* End Date */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">End Date</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{safeFormatDate(milestone.end_date)}</span>
          </p>
        </div>

        {/* Project */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Project</label>
          {milestone.project ? (
            onProjectClick ? (
              <button
                onClick={() => onProjectClick(milestone.project.id)}
                className="text-sm font-medium text-primary hover:underline text-left truncate"
              >
                {milestone.project.name}
              </button>
            ) : (
              <p className="text-sm font-medium truncate">{milestone.project.name}</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned</p>
          )}
        </div>

        {/* Color */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Color</label>
          <div className="flex items-center gap-2">
            {milestone.color && (
              <div
                className="h-4 w-4 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: milestone.color }}
              />
            )}
            <span className="text-sm font-medium truncate">
              {milestone.color || 'Default'}
            </span>
          </div>
        </div>

        {/* Running Days */}
        <div className="bg-card p-3 sm:p-4">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Running</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {(() => {
              if (!milestone.created_at) return 'Just started';
              const runningDays = Math.floor((new Date().getTime() - new Date(milestone.created_at).getTime()) / (1000 * 60 * 60 * 24));
              return `${runningDays} day${runningDays === 1 ? '' : 's'}`;
            })()}
          </p>
        </div>
      </div>
    </section>
  );
}
