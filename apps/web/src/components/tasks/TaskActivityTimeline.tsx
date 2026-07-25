import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

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

interface TaskActivityTimelineProps {
  statusHistory: any[];
  onRefresh: () => void;
}

export default function TaskActivityTimeline({ statusHistory, onRefresh }: TaskActivityTimelineProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activity Timeline</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-1">
          <CheckCircle className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      {statusHistory && statusHistory.length > 0 ? (
        <div className="space-y-4">
          {statusHistory.map((history: any, index: number) => (
            <div key={history.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                {index < statusHistory.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{history.changed_by_user?.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{safeFormatDate(history.changed_at, 'MMM d, yyyy • h:mm a')}</span>
                  </span>
                </div>
                <p className="text-sm">
                  Changed status from{' '}
                  <Badge variant="outline" className="mx-1">{history.from_status?.replace('_', ' ') || history.from_status}</Badge>
                  {' '}to{' '}
                  <Badge variant="outline" className="mx-1">{history.to_status?.replace('_', ' ') || history.to_status}</Badge>
                </p>
                {history.reason && (
                  <p className="text-sm text-muted-foreground mt-1">Reason: {history.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
      )}
    </div>
  );
}
