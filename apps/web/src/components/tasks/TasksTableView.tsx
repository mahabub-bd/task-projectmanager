import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, ChevronRight, FileText, FolderKanban, MessageCircle } from 'lucide-react';
import {
  getAssignedUsers,
  getRunningDays,
  getTagTextColor,
  getTaskTags,
  isTaskOverdue,
  safeFormatDate,
} from './utils/tasks-page.utils';

interface TasksTableViewProps {
  tasks: any[];
  onOpenTask: (taskId: string | number) => void;
}

// Mobile card view component
function MobileTaskCard({
  task,
  onOpenTask,
}: {
  task: any;
  onOpenTask: (taskId: string | number) => void;
}) {
  const assignedUsers = getAssignedUsers(task);
  const taskTags = getTaskTags(task);
  const isOverdue = isTaskOverdue(task);

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-colors hover:bg-muted/30"
      onClick={() => onOpenTask(task.id)}
    >
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate mb-0.5 sm:mb-1">{task.title}</h3>
            {task.project?.name && (
              <p className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <FolderKanban className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate">{task.project.name}</span>
              </p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
        </div>

        {/* Description */}
        {task.description && (
          <p className="line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Badge variant={`status-${task.status}` as any} className="text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">{task.status?.replace('_', ' ')}</Badge>
          <Badge variant={`priority-${task.priority}` as any} className="text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">{task.priority}</Badge>
          {isOverdue && <Badge variant="destructive" className="text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">Overdue</Badge>}
        </div>

        {/* Tags */}
        {taskTags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {taskTags.slice(0, 3).map((tag: any) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs"
                style={{
                  backgroundColor: tag.color || '#e5e7eb',
                  color: getTagTextColor(tag.color),
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {taskTags.length > 3 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                +{taskTags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{task.progress || 0}%</span>
          </div>
          <Progress value={task.progress || 0} className="h-1.5 sm:h-2" />
        </div>

        {/* Details Grid - compact version */}
        <div className="grid gap-1 sm:gap-2 text-[10px] sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Due</span>
            <span className={`font-medium truncate ml-2 flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
              <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
              {safeFormatDate(task.due_date, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Assignee</span>
            <span className="font-medium truncate ml-2">
              {assignedUsers.length > 0
                ? (assignedUsers.length === 1
                  ? assignedUsers[0].name
                  : `${assignedUsers[0].name} +${assignedUsers.length - 1}`)
                : 'Unassigned'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TasksTableView({ tasks, onOpenTask }: TasksTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {tasks.map((task: any) => (
          <MobileTaskCard key={task.id} task={task} onOpenTask={onOpenTask} />
        ))}
        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <FileText className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No tasks to display</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Running days</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task: any) => {
              const runningDays = getRunningDays(task);
              const assignedUsers = getAssignedUsers(task);
              const taskTags = getTaskTags(task);
              const isOverdue = isTaskOverdue(task);

              return (
                <TableRow
                  key={task.id}
                  className="cursor-pointer"
                  onClick={() => onOpenTask(task.id)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="max-w-lg truncate text-sm text-muted-foreground">
                        {task.description || 'No description provided'}
                      </p>
                      {task.project?.name && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FolderKanban className="h-3.5 w-3.5" />
                          <span>
                            Project: <span className="font-semibold text-primary">{task.project.name}</span>
                          </span>
                        </p>
                      )}
                      {taskTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {taskTags.map((tag: any) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="px-2 py-0.5 text-xs"
                              style={{
                                backgroundColor: tag.color || '#e5e7eb',
                                color: getTagTextColor(tag.color),
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{task.created_by_user?.name || 'Unknown'}</p>
                      <p>{safeFormatDate(task.created_at, 'MMM d, yyyy')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={`status-${task.status}` as any}>{task.status?.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={`priority-${task.priority}` as any}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{task.comment_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {runningDays === null ? 'N/A' : `${runningDays} day${runningDays === 1 ? '' : 's'}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-[140px] items-center gap-3">
                      <Progress value={task.progress || 0} className="h-2" />
                      <span className="text-sm text-muted-foreground">{task.progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isOverdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span>{safeFormatDate(task.due_date, 'MMM d, yyyy')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {assignedUsers.length > 0 ? (
                        assignedUsers.map((user: any) => (
                          <div key={user.id} className="leading-none">
                            {user.name}
                          </div>
                        ))
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
