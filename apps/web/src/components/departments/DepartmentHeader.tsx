import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ArrowLeft, Building2, Edit, MoreVertical, Trash2 } from 'lucide-react';

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
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{department.name}</h1>
          {department.parent ? (
            <Badge variant="outline" className="gap-1.5 shrink-0">
              <Building2 className="h-3 w-3 hidden sm:inline-block" />
              {department.parent.name}
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">Root Department</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          <span>Created {safeFormatDate(department.created_at)}</span>
          {department.organization && (
            <>
              <span className="hidden sm:inline"> • </span>
              <span className="sm:hidden"> • </span>
              {department.organization.name}
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={onEdit} className="shrink-0">
          <Edit className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
          <span className="sm:hidden">Edit</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Department
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Department
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={onBack} className="hidden sm:inline-flex shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
