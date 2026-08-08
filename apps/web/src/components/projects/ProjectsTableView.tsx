import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, ChevronRight, Flag, FolderKanban, Users } from 'lucide-react';
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

// Mobile card view component
function MobileProjectCard({
  project,
  getStatusBadge,
  getPriorityBadge,
  onOpenProject,
}: {
  project: any;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  onOpenProject: (projectId: string | number) => void;
}) {
  const isOverdue = isProjectOverdue(project);

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-colors hover:bg-muted/30"
      onClick={() => onOpenProject(project.id)}
    >
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">{project.name}</h3>
              {project.color && (
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
              )}
            </div>
            {project.description && (
              <p className="line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {getStatusBadge(project.status)}
          {getPriorityBadge(project.priority || 'medium')}
          {isOverdue && <Badge variant="destructive" className="text-[10px] sm:text-xs">Overdue</Badge>}
        </div>

        {/* Progress */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-1.5 sm:h-2" />
        </div>

        {/* Manager */}
        {project.manager && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{project.manager.name}</span>
            </div>
          </div>
        )}

        {/* Task and Milestone Counts */}
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Flag className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            <span>{getProjectTaskCount(project)} task{getProjectTaskCount(project) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            <span>{getProjectMilestoneCount(project)} milestone{getProjectMilestoneCount(project) !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-0.5 sm:space-y-1.5 text-[10px] sm:text-sm text-muted-foreground">
          {project.start_date && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">Start: {safeFormatMilestoneDate(project.start_date)}</span>
            </div>
          )}
          {project.due_date && (
            <div className={`flex items-center gap-1.5 sm:gap-2 ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : ''}`}>
              <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">Due: {safeFormatMilestoneDate(project.due_date)}</span>
            </div>
          )}
          {project.end_date && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">End: {safeFormatMilestoneDate(project.end_date)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsTableView({
  projects,
  getStatusBadge,
  getPriorityBadge,
  onOpenProject,
}: ProjectsTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {projects.map((project: any) => (
          <MobileProjectCard
            key={project.id}
            project={project}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            onOpenProject={onOpenProject}
          />
        ))}
        {projects.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <FolderKanban className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No projects to display</p>
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
      </div>
    </>
  );
}
