import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Flag, Plus } from 'lucide-react';

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

interface PhaseMilestonesListProps {
  milestones: any[];
  onMilestoneClick?: (milestoneId: number) => void;
  onAddMilestone?: () => void;
}

export default function PhaseMilestonesList({ milestones, onMilestoneClick, onAddMilestone }: PhaseMilestonesListProps) {
  const milestoneCount = milestones.length;
  const completedCount = milestones.filter((m: any) => m.status === 'completed').length;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <h3 className="font-semibold">Phase Milestones</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Flag className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{completedCount}/{milestoneCount}</span>
          </div>
          {onAddMilestone && (
            <Button size="sm" variant="outline" onClick={onAddMilestone}>
              <Plus className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          )}
        </div>
      </div>
      {milestoneCount > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {milestones.map((milestone: any) => (
            <div
              key={milestone.id}
              className={`rounded-lg border p-3 ${onMilestoneClick ? 'cursor-pointer hover:bg-accent' : ''}`}
              onClick={() => onMilestoneClick?.(milestone.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <Flag className="h-4 w-4 text-primary" />
                    <span>{milestone.name}</span>
                  </p>
                  {milestone.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{milestone.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{milestone.progress || 0}% complete</Badge>
                  </div>
                </div>
                <Badge variant={`status-${milestone.status}` as any}>{milestone.status?.replace('_', ' ')}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Due: {safeFormatDate(milestone.due_date)}</span>
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">No milestones in this phase yet.</p>
          {onAddMilestone && (
            <Button size="sm" variant="outline" onClick={onAddMilestone}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Milestone
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
