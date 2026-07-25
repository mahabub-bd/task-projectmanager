import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import React from 'react';
import {
  ArrowLeft,
  Edit,
  FolderKanban,
  MoreVertical,
  Trash2,
  UserPlus,
} from 'lucide-react';

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

interface TaskHeaderProps {
  task: any;
  isOverdue: boolean;
  onAssign: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  assignedUsers: any[];
}

export default function TaskHeader({
  task,
  isOverdue,
  onAssign,
  onEdit,
  onDelete,
  onBack,
  assignedUsers,
}: TaskHeaderProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <Badge variant={task.status === 'completed' ? ('status-completed' as any) : ('status-open' as any)}>
            {task.status?.replace('_', ' ')}
          </Badge>
          <Badge variant={task.priority === 'high' || task.priority === 'urgent' ? ('priority-high' as any) : ('priority-medium' as any)}>
            {task.priority}
          </Badge>
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created {safeFormatDate(task.created_at)}
          {task.project?.name && (
            <>
              {' '}•{' '}
              <span className="inline-flex items-center gap-1">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Project {task.project.name}</span>
              </span>
            </>
          )}
          {assignedUsers.length > 0 && <> • Assigned to {assignedUsers.map((user: any) => user.name).join(', ')}</>}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAssign}>
          <UserPlus className="h-4 w-4 mr-2" />
          Assign
        </Button>
        <Button size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
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
                  Delete Task
                </Button>
              </div>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
