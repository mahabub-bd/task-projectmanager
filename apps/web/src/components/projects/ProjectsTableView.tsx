import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon } from 'lucide-react';
import { safeFormatMilestoneDate } from '../milestones/utils/milestones-page.utils';
import {
  getProjectMilestoneCount,
  getProjectTaskCount,
  isProjectOverdue
} from './utils/projects-page.utils';

interface ProjectsTableViewProps {
  projects: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  onOpenProject: (projectId: string | number) => void;
}

export default function ProjectsTableView({
  projects,
  getStatusBadge,
  getPriorityBadge,
  onOpenProject,
}: ProjectsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Project Manager</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Counts</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project: any) => {
          const isOverdue = isProjectOverdue(project);

          return (
            <TableRow key={project.id} className="cursor-pointer" onClick={() => onOpenProject(project.id)}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{project.name}</p>
                    {project.color && (
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                    )}
                  </div>
                  {project.description && (
                    <p className="max-w-md truncate text-sm text-muted-foreground">{project.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {project.manager ? (
                  <div className="flex items-center gap-2">

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {project.manager.name}
                      </span>
                      {project.manager.email && (
                        <span className="text-xs text-muted-foreground">{project.manager.email}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
              <TableCell>{getPriorityBadge(project.priority || 'medium')}</TableCell>
              <TableCell>
                <div className="min-w-35">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{getProjectTaskCount(project)} tasks</div>
                  <div>{getProjectMilestoneCount(project)} milestones</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm text-muted-foreground flex flex-col">

                  {project.start_date && (
                    <p className=" inline-flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Start: {safeFormatMilestoneDate(project.start_date)}</span>
                    </p>
                  )}
                  <p className={`inline-flex items-center gap-2 ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : ''}`}>
                    <CalendarIcon className="h-4 w-4" />
                    <span>Due: {safeFormatMilestoneDate(project.due_date)}</span>
                  </p>
                  {project.end_date && (
                    <p className="inline-flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>End: {safeFormatMilestoneDate(project.end_date)}</span>
                    </p>
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
