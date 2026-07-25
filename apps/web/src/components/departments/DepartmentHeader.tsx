import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Building2, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DepartmentHeaderProps {
  department: any;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

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

export default function DepartmentHeader({ department, onEdit, onDelete, onBack }: DepartmentHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">{department.name}</h1>
          {department.parent ? (
            <Badge variant="outline" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {department.parent.name}
            </Badge>
          ) : (
            <Badge variant="secondary">Root Department</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          <span>Created {safeFormatDate(department.created_at)}</span>
          {department.organization && <> • {department.organization.name}</>}
        </p>
      </div>

      <div className="flex items-center gap-2">
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
                  Delete Department
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
