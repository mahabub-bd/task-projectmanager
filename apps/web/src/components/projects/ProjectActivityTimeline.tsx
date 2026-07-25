import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMM d, yyyy • h:mm a') => {
  if (!dateValue) return 'N/A';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    planning: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300',
    on_hold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300',
    not_started: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300',
    in_progress: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
};

interface ProjectActivityTimelineProps {
  statusHistory: any[];
  onRefresh: () => void;
}

export default function ProjectActivityTimeline({ statusHistory, onRefresh }: ProjectActivityTimelineProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Activity</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="h-8 px-2 gap-1 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
      {statusHistory && statusHistory.length > 0 ? (
        <div className="space-y-2">
          {statusHistory.slice(0, 5).map((history: any) => (
            <div key={history.id} className="flex items-start gap-2 text-xs pb-2 last:pb-0 border-b last:border-0">
              <div className="mt-0.5">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="font-medium truncate">{history.changed_by_user?.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{safeFormatDate(history.changed_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className={`text-xs ${getStatusColor(history.from_status)} border`}>
                    {history.from_status?.replace('_', ' ') || 'None'}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className={`text-xs ${getStatusColor(history.to_status)} border`}>
                    {history.to_status?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">No activity yet</p>
      )}
    </div>
  );
}
