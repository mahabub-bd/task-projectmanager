import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ProjectHeaderProps {
  project: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}


export default function ProjectHeader({ project, onEdit, onDelete, onBack }: ProjectHeaderProps) {
  const isOverdue = project?.due_date &&
    new Date(project.due_date) < new Date() &&
    project?.status !== 'completed' &&
    project?.status !== 'cancelled';

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      {/* Left side - Back button and Project info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <h1 className="text-xl font-bold truncate">{project.name}</h1>
          {project.color && (
            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
          )}
          {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onEdit && (
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onEdit}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
