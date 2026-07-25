import { format } from 'date-fns';
import { Clock } from 'lucide-react';

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

interface ProjectTimelineProps {
  createdAt: string;
  updatedAt: string;
}

export default function ProjectTimeline({ createdAt, updatedAt }: ProjectTimelineProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-medium">Created</span>
        <span>{safeFormatDate(createdAt, 'MMM d, yyyy • h:mm a')}</span>
        <span className="text-muted-foreground/50">•</span>
        <span className="font-medium">Updated</span>
        <span>{safeFormatDate(updatedAt, 'MMM d, yyyy • h:mm a')}</span>
      </div>
    </div>
  );
}
