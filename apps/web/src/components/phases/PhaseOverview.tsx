import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PhaseOverviewProps {
  name: string;
  description?: string | null;
  status?: string;
  progress?: number;
  color?: string;
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    not_started: { label: 'Not Started', variant: 'status-draft' as any },
    in_progress: { label: 'In Progress', variant: 'status-in_progress' as any },
    completed: { label: 'Completed', variant: 'status-completed' as any },
    on_hold: { label: 'On Hold', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'secondary' };
  return <Badge variant={variant}>{label}</Badge>;
};

export default function PhaseOverview({
  name,
  description,
  status,
  progress = 0,
  color,
}: PhaseOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Color with Progress in top right */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{name}</h1>
              {color && (
                <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
              )}
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
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
            </div>
          )}
          {/* Status */}
          {status && (
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div>{getStatusBadge(status)}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
