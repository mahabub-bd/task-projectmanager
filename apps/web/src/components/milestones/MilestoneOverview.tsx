import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MilestoneOverviewProps {
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

export default function MilestoneOverview({
  name,
  description,
  status,
  progress = 0,
  color,
}: MilestoneOverviewProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{name}</h1>
              {color && (
                <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-background" style={{ backgroundColor: color }} aria-label="Milestone color" />
              )}
            </div>
            {description && <p className="line-clamp-2 text-sm leading-5 text-muted-foreground whitespace-pre-wrap">{description}</p>}
            {status && <div className="flex flex-wrap items-center gap-2">{getStatusBadge(status)}</div>}
          </div>
          <div className="relative h-16 w-16 shrink-0" aria-label={`${normalizedProgress}% complete`}>
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-muted" strokeWidth="3.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-primary" strokeWidth="3.5" strokeDasharray={`${normalizedProgress}, 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{normalizedProgress}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
