import { Button } from '@/components/ui/button';
import { ArrowRight, Edit, Trash2, UserPlus, Users } from 'lucide-react';

interface ActionBarProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onAssign?: () => void;
  onAddMember?: () => void;
}

export default function ActionBar({ onEdit, onDelete, onBack, onAssign, onAddMember }: ActionBarProps) {
  return (
    <div className="flex items-center justify-end mb-4">
      <div className="flex items-center gap-1.5 shrink-0">
        {onAssign && (
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onAssign}>
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Assign
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onEdit}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        )}
        {onAddMember && (
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onAddMember}>
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Add Member
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {onBack && (
          <Button variant="default" size="sm" onClick={onBack} className="h-8 px-3 text-xs">
            Back
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
