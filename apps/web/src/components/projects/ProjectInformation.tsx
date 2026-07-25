import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectInformationProps {
  title: string;
  description?: string | null;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  createdAt?: string;
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    planning: { label: 'Planning', variant: 'status-draft' as any },
    active: { label: 'Active', variant: 'status-in_progress' as any },
    completed: { label: 'Completed', variant: 'status-completed' as any },
    on_hold: { label: 'On Hold', variant: 'secondary' },
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

const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return null;
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return null;
    return format(date, 'MMM d, yyyy');
  } catch {
    return null;
  }
};

export default function ProjectInformation({
  title,
  description,
  priority,
  status,
  dueDate,
  createdAt,
}: ProjectInformationProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          {/* Description */}
          {description && (
            <div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-2">
            {status && getStatusBadge(status)}
            {priority && getPriorityBadge(priority)}
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {dueDate && (
              <div className="flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" />
                <span>Due: {formatDate(dueDate)}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {formatDate(createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
