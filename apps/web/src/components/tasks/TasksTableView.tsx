import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, FolderKanban, MessageCircle } from 'lucide-react';
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

export default function TasksTableView({ tasks, onOpenTask }: TasksTableViewProps) {
  return (
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
  );
}
