import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar as CalendarIcon, ChevronRight, FolderKanban, MessageCircle } from 'lucide-react';
import {
  getAssignedUsers,
  getRunningDays,
  getTagTextColor,
  getTaskTags,
  isTaskOverdue,
  safeFormatDate,
} from './utils/tasks-page.utils';

interface TasksGridViewProps {
  tasks: any[];
  onOpenTask: (taskId: string | number) => void;
}

export default function TasksGridView({ tasks, onOpenTask }: TasksGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task: any) => {
        const runningDays = getRunningDays(task);
        const assignedUsers = getAssignedUsers(task);
        const taskTags = getTaskTags(task);
        const isOverdue = isTaskOverdue(task);

        return (
          <Card
            key={task.id}
            className="cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => onOpenTask(task.id)}
          >
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 flex-1 text-base font-semibold sm:text-lg">{task.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenTask(task.id);
                    }}
                    title="Open task"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {task.description || 'No description provided'}
                </p>
                {task.project?.name && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FolderKanban className="h-3.5 w-3.5" />
                    <span className="truncate">
                      Project: <span className="font-semibold text-primary">{task.project.name}</span>
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={`status-${task.status}` as any}>{task.status?.replace('_', ' ')}</Badge>
                <Badge variant={`priority-${task.priority}` as any}>{task.priority}</Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {task.comment_count || 0}
                </Badge>
              </div>

              {taskTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {taskTags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="px-2 py-1 text-xs"
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

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{task.progress || 0}%</span>
                </div>
                <Progress value={task.progress || 0} className="h-2" />
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Created by</p>
                  <p className="font-medium truncate">{task.created_by_user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <div className="space-y-1 font-medium">
                    {assignedUsers.length > 0 ? (
                      assignedUsers.map((user: any) => <p key={user.id} className="truncate">{user.name}</p>)
                    ) : (
                      <p>Unassigned</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Created at</p>
                  <p className="font-medium">{safeFormatDate(task.created_at, 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Running days</p>
                  <p className="font-medium">
                    {runningDays === null ? 'N/A' : `${runningDays} day${runningDays === 1 ? '' : 's'}`}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Due date</p>
                  <p
                    className={`inline-flex items-center gap-2 ${
                      isOverdue ? 'font-medium text-red-600 dark:text-red-400' : 'font-medium'
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>{safeFormatDate(task.due_date, 'MMM d, yyyy')}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
