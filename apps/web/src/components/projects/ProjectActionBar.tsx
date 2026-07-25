import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ProjectActionBarProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export default function ProjectActionBar({ onEdit, onDelete, onBack }: ProjectActionBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {onEdit && (
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onEdit}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
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
