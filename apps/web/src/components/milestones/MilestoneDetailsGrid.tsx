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
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Milestone Details</h2>
        {isOverdue && <span className="rounded-full bg-destructive px-1.5 py-0 text-[10px] font-medium text-destructive-foreground">Overdue</span>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {/* Status */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</label>
          <select
            value={milestone.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 h-7 w-full rounded border bg-background px-2 text-xs"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Progress */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Progress</label>
          <select
            value={String(milestone.progress || 0)}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="mt-1 h-7 w-full rounded border bg-background px-2 text-xs"
          >
            <option value="0">0%</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Start Date</label>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{safeFormatDate(milestone.start_date)}</span>
          </p>
        </div>

        {/* Due Date */}
        <div className={`bg-card px-3 py-2 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : ''}`}>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Due Date</label>
          <p className={`mt-1 flex items-center gap-1 text-xs font-medium truncate ${isOverdue ? 'text-red-600' : ''
            }`}>
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{safeFormatDate(milestone.due_date)}</span>
          </p>
        </div>

        {/* End Date */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">End Date</label>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium">
            <Target className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{safeFormatDate(milestone.end_date)}</span>
          </p>
        </div>

        {/* Project */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Project</label>
          {milestone.project ? (
            onProjectClick ? (
              <button
                onClick={() => onProjectClick(milestone.project.id)}
                className="mt-1 text-xs font-medium text-primary hover:underline text-left truncate"
              >
                {milestone.project.name}
              </button>
            ) : (
              <p className="mt-1 text-xs font-medium truncate">{milestone.project.name}</p>
            )
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Not assigned</p>
          )}
        </div>

        {/* Color */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Color</label>
          <div className="mt-1 flex items-center gap-1.5">
            {milestone.color && (
              <div
                className="h-3 w-3 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: milestone.color }}
              />
            )}
            <span className="text-xs font-medium truncate">
              {milestone.color || 'Default'}
            </span>
          </div>
        </div>

        {/* Running Days */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Running</label>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
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
