import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Flag, ListTodo, User } from 'lucide-react';

const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMM d, yyyy') => {
  if (!dateValue) return 'Not set';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'Not set';
    return format(date, formatStr);
  } catch {
    return 'Not set';
  }
};

interface ProjectDetailsGridProps {
  project: any;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
}

export default function ProjectDetailsGrid({ project, onStatusChange, onPriorityChange }: ProjectDetailsGridProps) {
  const isOverdue = project?.due_date &&
    new Date(project.due_date) < new Date() &&
    project?.status !== 'completed' &&
    project?.status !== 'cancelled';

  const statusColors: Record<string, string> = {
    planning: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    on_hold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Project Details</h2>
        {isOverdue && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Overdue</Badge>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9">
        {/* Status */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</label>
          {onStatusChange ? (
            <Select value={project.status} onValueChange={onStatusChange}>
              <SelectTrigger className="mt-1 h-7 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={`mt-1 text-[10px] px-1.5 py-0 ${statusColors[project.status] || 'bg-gray-100'}`}>
              {project.status?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Badge>
          )}
        </div>

        {/* Priority */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Priority</label>
          {onPriorityChange ? (
            <Select value={project.priority || 'medium'} onValueChange={onPriorityChange}>
              <SelectTrigger className="mt-1 h-7 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={`mt-1 text-[10px] px-1.5 py-0 ${priorityColors[project.priority] || 'bg-gray-100'}`}>
              {(project.priority || 'medium').toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Budget */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Budget</label>
          <div className="mt-1 flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium truncate">
              {project.budget ? project.budget.toLocaleString() : 'Not set'}
            </span>
          </div>
        </div>

        {/* Project Manager */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Manager</label>
          <div className="mt-1 flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium truncate">
              {project.manager?.name || 'Not assigned'}
            </span>
          </div>
        </div>

        {/* Start Date */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Start Date</label>
          <div className="mt-1 flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs truncate">{safeFormatDate(project.start_date)}</span>
          </div>
        </div>

        {/* Due Date */}
        <div className={`bg-card px-3 py-2 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : ''}`}>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Due Date</label>
          <div className={`mt-1 flex items-center gap-1 ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : ''}`}>
            <CalendarIcon className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs truncate">{safeFormatDate(project.due_date)}</span>
          </div>
        </div>

        {/* End Date */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">End Date</label>
          <div className="mt-1 flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs truncate">{safeFormatDate(project.end_date)}</span>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Team</label>
          <div className="mt-1 flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium">
              {project.members?.length || 0} members
            </span>
          </div>
        </div>

        {/* Work Items */}
        <div className="bg-card px-3 py-2">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Work Items</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium">
              <ListTodo className="h-3 w-3 text-muted-foreground shrink-0" />
              {project.task_count || 0}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium">
              <Flag className="h-3 w-3 text-muted-foreground shrink-0" />
              {project.milestone_count || 0}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
