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
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5 dark:border-border">
        <div>
          <h2 className="text-base font-semibold text-foreground">Project Details</h2>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">Status, schedule, and team overview</p>
        </div>
        {isOverdue && <Badge variant="destructive">Overdue</Badge>}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-6">
        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Status</label>
          {onStatusChange ? (
            <Select value={project.status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-8 w-full text-sm">
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
            <Badge className={`w-fit ${statusColors[project.status] || 'bg-gray-100'}`}>
              {project.status?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Priority</label>
          {onPriorityChange ? (
            <Select value={project.priority || 'medium'} onValueChange={onPriorityChange}>
              <SelectTrigger className="h-8 w-full text-sm">
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
            <Badge className={`w-fit ${priorityColors[project.priority] || 'bg-gray-100'}`}>
              {(project.priority || 'medium').toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Budget</label>
          <div className="flex items-center gap-1.5 text-sm">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="font-medium text-foreground">
              {project.budget ? project.budget.toLocaleString() : 'Not set'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Project Manager</label>
          <div className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="font-medium text-foreground">
              {project.manager?.name || 'Not assigned'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Start Date</label>
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="text-foreground">{safeFormatDate(project.start_date)}</span>
          </div>
        </div>

        <div className={`space-y-1.5 p-4 ${isOverdue ? 'bg-red-50/70 dark:bg-red-950/20' : 'bg-card'}`}>
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Due Date</label>
          <div className={`flex items-center gap-1.5 text-sm ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-foreground'}`}>
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span>{safeFormatDate(project.due_date)}</span>
          </div>
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">End Date</label>
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="text-foreground">{safeFormatDate(project.end_date)}</span>
          </div>
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Team Members</label>
          <div className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="font-medium text-foreground">
              {project.members?.length || 0} members
            </span>
          </div>
        </div>

        <div className="space-y-1.5 bg-card p-4">
          <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">Work Items</label>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 font-medium text-foreground"><ListTodo className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />{project.task_count || 0}</span>
            <span className="flex items-center gap-1.5 font-medium text-foreground"><Flag className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground/70" />{project.milestone_count || 0}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
