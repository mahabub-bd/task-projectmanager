import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, UserPlus, Users } from 'lucide-react';

interface ActionBarProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onAssign?: () => void;
  onAddMember?: () => void;
}

/**
 * ActionBar component - displays action buttons aligned to the right
 * Commonly used in detail pages for quick actions like edit, delete, assign, etc.
 */
export default function ActionBar({ onEdit, onDelete, onBack, onAssign, onAddMember }: ActionBarProps) {
  return (
    <div className="flex items-center justify-end gap-2 sm:gap-3 mb-6">
      {onAssign && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium"
          onClick={onAssign}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Assign</span>
        </Button>
      )}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      )}
      {onAddMember && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium"
          onClick={onAddMember}
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add Member</span>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      )}
      {onBack && (
        <Button
          variant="default"
          size="sm"
          onClick={onBack}
          className="h-9 px-3 text-xs font-medium"
        >
          <ArrowLeft className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      )}
    </div>
  );
}
