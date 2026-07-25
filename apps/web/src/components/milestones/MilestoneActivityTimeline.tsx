import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';

interface MilestoneActivityTimelineProps {
  statusHistory?: any[];
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    not_started: { label: 'Not Started', variant: 'status-draft' as const },
    in_progress: { label: 'In Progress', variant: 'status-in_progress' as const },
    completed: { label: 'Completed', variant: 'status-completed' as const },
    on_hold: { label: 'On Hold', variant: 'secondary' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
  };
  const badge = config[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
};

export default function MilestoneActivityTimeline({
  statusHistory = [],
}: MilestoneActivityTimelineProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Activity History
        </div>
        <p className="text-xs text-muted-foreground text-center py-2">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        Activity History
      </div>
      <div className="space-y-2">
        {statusHistory.slice(0, 5).map((activity: any, index: number) => (
          <div key={index} className="flex items-start gap-2 text-xs pb-2 last:pb-0 border-b last:border-0">
            <div className="mt-0.5">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                {getStatusBadge(activity.to_status)}
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{format(new Date(activity.changed_at), 'MMM d, yyyy • h:mm a')}</span>
              </div>
              <p className="text-muted-foreground">
                Changed by <span className="font-medium">{activity.changed_by_user?.name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
