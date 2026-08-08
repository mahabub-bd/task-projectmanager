import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar as CalendarIcon, Flag, Users } from 'lucide-react';
import {
  getProjectMilestoneCount,
  getProjectTaskCount,
  isProjectOverdue,
  safeFormatProjectDate,
} from './utils/projects-page.utils';

interface ProjectsGridViewProps {
  projects: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  onOpenProject: (projectId: string | number) => void;
  onUpdateProgress: (projectId: number) => void;
}

export default function ProjectsGridView({
  projects,
  getStatusBadge,
  getPriorityBadge,
  onOpenProject,
  onUpdateProgress,
}: ProjectsGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project: any) => {
        const isOverdue = isProjectOverdue(project);

        return (
          <Card
            key={project.id}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => onOpenProject(project.id)}
          >
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="line-clamp-1 text-base sm:text-lg font-semibold">{project.name}</h3>
                    {project.color && (
                      <div
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                  </div>
                  {project.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority || 'medium')}
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {getProjectTaskCount(project)} tasks
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Flag className="h-3.5 w-3.5" />
                  {getProjectMilestoneCount(project)} milestones
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground">
                {project.manager && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Project Manager: {project.manager.name}</span>
                  </div>
                )}
                <div className='flex flex-col sm:flex-row sm:gap-4 gap-2'>
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Start: {safeFormatProjectDate(project.start_date)}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Due: {safeFormatProjectDate(project.due_date)}</span>
                  </div>
                </div>

              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateProgress(project.id);
                }}
              >
                Update Progress
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
