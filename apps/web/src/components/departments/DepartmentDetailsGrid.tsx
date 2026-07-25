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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Organization */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Building className="h-4 w-4" />
          Organization
        </div>
        <p className="text-sm">{department.organization?.name || 'Not assigned'}</p>
      </div>

      {/* Parent Department */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Building2 className="h-4 w-4" />
          Parent Department
        </div>
        <p className="text-sm">{department.parent?.name || 'Root department'}</p>
      </div>

      {/* Created Date */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4" />
          Created Date
        </div>
        <p className="inline-flex items-center gap-2 text-sm">
          <span>{safeFormatDate(department.created_at)}</span>
        </p>
      </div>

      {/* Members Count */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Users className="h-4 w-4" />
          Members
        </div>
        <p className="text-sm">{membersCount > 0 ? `${membersCount} members` : 'No members'}</p>
      </div>

      {/* Projects Count */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4" />
          Projects
        </div>
        <p className="text-sm">{projectsCount > 0 ? `${projectsCount} projects` : 'No projects'}</p>
      </div>

      {/* Tasks Count */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4" />
          Tasks
        </div>
        <p className="text-sm">{tasksCount > 0 ? `${tasksCount} tasks` : 'No tasks'}</p>
      </div>
    </div>
  );
}
