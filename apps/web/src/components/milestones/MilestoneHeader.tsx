import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface MilestoneHeaderProps {
  milestone: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    not_started: { label: 'Not Started', variant: 'status-draft' as const },
    in_progress: { label: 'In Progress', variant: 'status-in_progress' as const },
    completed: { label: 'Completed', variant: 'status-completed' as const },
    on_hold: { label: 'On Hold', variant: 'secondary' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
  };
  const { label, variant } = config[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={variant}>{label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const config: Record<string, { label: string; variant: any }> = {
    low: { label: 'Low', variant: 'priority-low' as const },
    medium: { label: 'Medium', variant: 'priority-medium' as const },
    high: { label: 'High', variant: 'priority-high' as const },
    urgent: { label: 'Urgent', variant: 'priority-urgent' as const },
  };
  const { label, variant } = config[priority] || { label: priority || 'No priority', variant: 'secondary' as const };
  return <Badge variant={variant}>{label}</Badge>;
};

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

export default function MilestoneHeader({ milestone, onEdit, onDelete, onBack }: MilestoneHeaderProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const isOverdue = milestone?.due_date &&
    new Date(milestone.due_date) < new Date() &&
    milestone?.status !== 'completed' &&
    milestone?.status !== 'cancelled';

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">{milestone.name}</h1>
          {milestone.color && (
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: milestone.color }} />
          )}
          {getStatusBadge(milestone.status)}
          {milestone.priority && getPriorityBadge(milestone.priority)}
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Created {safeFormatDate(milestone.created_at)}</span>
          </span>
          {milestone.project && (
            <> • Project: {milestone.project.name}</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onEdit && (
          <Button size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
                <MoreVertical className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Milestone
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
