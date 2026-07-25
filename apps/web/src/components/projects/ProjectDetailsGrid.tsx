import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          {onStatusChange ? (
            <Select value={project.status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full">
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
            <Badge className={statusColors[project.status] || 'bg-gray-100'}>
              {project.status?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Badge>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Priority</label>
          {onPriorityChange ? (
            <Select value={project.priority || 'medium'} onValueChange={onPriorityChange}>
              <SelectTrigger className="w-full">
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
            <Badge className={priorityColors[project.priority] || 'bg-gray-100'}>
              {(project.priority || 'medium').toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Budget</label>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {project.budget ? project.budget.toLocaleString() : 'Not set'}
            </span>
          </div>
        </div>

        {/* Manager */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Project Manager</label>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {project.manager?.name || 'Not assigned'}
            </span>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Start Date</label>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{safeFormatDate(project.start_date)}</span>
          </div>
        </div>

        {/* Due Date */}
        <div className={`space-y-2 ${isOverdue ? 'bg-red-50 dark:bg-red-950/20 -mx-2 px-2 py-1 rounded' : ''}`}>
          <label className="text-sm font-medium text-muted-foreground">Due Date</label>
          <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
            <CalendarIcon className="h-4 w-4" />
            <span>{safeFormatDate(project.due_date)}</span>
            {isOverdue && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">End Date</label>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{safeFormatDate(project.end_date)}</span>
          </div>
        </div>

        {/* Team Members Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Team Members</label>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {project.members?.length || 0} members
            </span>
          </div>
        </div>

        {/* Tasks & Milestones Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Tasks & Milestones</label>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">{project.task_count || 0} tasks</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{project.milestone_count || 0} milestones</span>
          </div>
        </div>
      </div>
    </div>
  );
}
