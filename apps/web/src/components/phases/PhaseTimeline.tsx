import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PhaseTimelineProps {
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function PhaseTimeline({ createdAt, updatedAt }: PhaseTimelineProps) {
  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'MMM d, yyyy • h:mm a');
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-medium">Created</span>
        <span>{formatDate(createdAt)}</span>
        <span className="text-muted-foreground/50">•</span>
        <span className="font-medium">Updated</span>
        <span>{formatDate(updatedAt)}</span>
      </div>
    </div>
  );
}
