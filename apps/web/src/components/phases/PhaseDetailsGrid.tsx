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

interface PhaseDetailsGridProps {
  phase: any;
  onStatusChange: (status: string) => void;
  onProgressChange: (progress: number) => void;
  onProjectClick?: (projectId: string | number) => void;
}

export default function PhaseDetailsGrid({
  phase,
  onStatusChange,
  onProgressChange,
  onProjectClick,
}: PhaseDetailsGridProps) {
  const isOverdue = phase?.due_date &&
    new Date(phase.due_date) < new Date() &&
    phase?.status !== 'completed' &&
    phase?.status !== 'cancelled';

  const milestonesCount = phase?.milestones?.length || 0;
  const completedMilestones = phase?.milestones?.filter((m: any) => m.status === 'completed')?.length || 0;

  return (
    <div className="rounded-lg border bg-card">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
        {/* Status */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
          <select
            value={phase.status}
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
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Progress</label>
          <select
            value={String(phase.progress || 0)}
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
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Start Date</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {safeFormatDate(phase.start_date)}
          </p>
        </div>

        {/* Due Date */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
          <p className={`text-sm font-medium inline-flex items-center gap-1 ${
            isOverdue ? 'text-red-600' : ''
          }`}>
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {safeFormatDate(phase.due_date)}
          </p>
        </div>

        {/* End Date */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">End Date</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            {safeFormatDate(phase.end_date)}
          </p>
        </div>

        {/* Project */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Project</label>
          {phase.project ? (
            onProjectClick ? (
              <button
                onClick={() => onProjectClick(phase.project.id)}
                className="text-sm font-medium text-primary hover:underline text-left"
              >
                {phase.project.name}
              </button>
            ) : (
              <p className="text-sm font-medium">{phase.project.name}</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned</p>
          )}
        </div>

        {/* Color */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Color</label>
          <div className="flex items-center gap-2">
            {phase.color && (
              <div
                className="h-4 w-4 rounded-full shadow-sm"
                style={{ backgroundColor: phase.color }}
              />
            )}
            <span className="text-sm font-medium">
              {phase.color || 'Default'}
            </span>
          </div>
        </div>

        {/* Milestones */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Milestones</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            {completedMilestones} / {milestonesCount}
          </p>
        </div>

        {/* Running Days */}
        <div className="p-3">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Running</label>
          <p className="text-sm font-medium inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {(() => {
              if (!phase.created_at) return 'Just started';
              const runningDays = Math.floor((new Date().getTime() - new Date(phase.created_at).getTime()) / (1000 * 60 * 60 * 24));
              return `${runningDays} day${runningDays === 1 ? '' : 's'}`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}
