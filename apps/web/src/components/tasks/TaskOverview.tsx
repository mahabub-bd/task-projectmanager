import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TaskOverviewProps {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  progress?: number;
  color?: string;
  isOverdue?: boolean;
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    todo: { label: 'To Do', variant: 'status-draft' as any },
    in_progress: { label: 'In Progress', variant: 'status-in_progress' as any },
    in_review: { label: 'In Review', variant: 'status-completed' as any },
    completed: { label: 'Completed', variant: 'status-completed' as any },
    closed: { label: 'Closed', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'secondary' };
  return <Badge variant={variant}>{label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    low: { label: 'Low', variant: 'priority-low' as any },
    medium: { label: 'Medium', variant: 'priority-medium' as any },
    high: { label: 'High', variant: 'priority-high' as any },
    urgent: { label: 'Urgent', variant: 'priority-urgent' as any },
  };
  const { label, variant } = config[priority] || { label: priority || 'Medium', variant: 'priority-medium' as any };
  return <Badge variant={variant}>{label}</Badge>;
};

export default function TaskOverview({
  title,
  description,
  status,
  priority,
  progress = 0,
  color,
  isOverdue = false,
}: TaskOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Color with Progress in top right */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{title}</h1>
              {color && (
                <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
              )}
              {isOverdue && <Badge variant="destructive">Overdue</Badge>}
            </div>
            {/* Progress Circle - Top Right */}
            <div className="relative h-24 w-24 shrink-0">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[18px] font-semibold">{progress}%</span>
              </div>
            </div>
          </div>
          {/* Description */}
          {description && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
            </div>
          )}
          {/* Status and Priority */}
          <div className="flex gap-4 items-center">
            {status && (
              <div className=" flex gap-2 items-center">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div>{getStatusBadge(status)}</div>
              </div>
            )}
            {priority && (
              <div className=" flex gap-2 items-center">
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div>{getPriorityBadge(priority)}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
