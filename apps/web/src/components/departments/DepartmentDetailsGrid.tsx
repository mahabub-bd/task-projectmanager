import { Building, Calendar as CalendarIcon, Building2, Users } from 'lucide-react';
import { format } from 'date-fns';

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

interface DepartmentDetailsGridProps {
  department: any;
  projectsCount: number;
  tasksCount: number;
  membersCount: number;
}

export default function DepartmentDetailsGrid({
  department,
  projectsCount,
  tasksCount,
  membersCount,
}: DepartmentDetailsGridProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {/* Organization */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Building className="h-4 w-4 shrink-0" />
          <span className="truncate">Organization</span>
        </div>
        <p className="text-sm truncate" title={department.organization?.name || 'Not assigned'}>
          {department.organization?.name || 'Not assigned'}
        </p>
      </div>

      {/* Parent Department */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">Parent</span>
        </div>
        <p className="text-sm truncate" title={department.parent?.name || 'Root department'}>
          {department.parent?.name || 'Root department'}
        </p>
      </div>

      {/* Created Date */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>Created</span>
        </div>
        <p className="text-sm truncate">{safeFormatDate(department.created_at)}</p>
      </div>

      {/* Members Count */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Users className="h-4 w-4 shrink-0" />
          <span>Members</span>
        </div>
        <p className="text-sm">{membersCount > 0 ? `${membersCount} members` : 'No members'}</p>
      </div>

      {/* Projects Count */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>Projects</span>
        </div>
        <p className="text-sm">{projectsCount > 0 ? `${projectsCount} projects` : 'No projects'}</p>
      </div>

      {/* Tasks Count */}
      <div className="rounded-lg border bg-card p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>Tasks</span>
        </div>
        <p className="text-sm">{tasksCount > 0 ? `${tasksCount} tasks` : 'No tasks'}</p>
      </div>
    </div>
  );
}
