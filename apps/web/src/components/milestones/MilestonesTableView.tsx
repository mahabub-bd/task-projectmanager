import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, RefreshCw, Flag, ChevronRight } from 'lucide-react';
import { isMilestoneOverdue, safeFormatMilestoneDate } from './utils/milestones-page.utils';

interface MilestonesTableViewProps {
  milestones: any[];
  onMilestoneClick: (milestoneId: string | number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateProgress: (milestoneId: number) => void;
}

// Mobile card view component
function MobileMilestoneCard({
  milestone,
  onMilestoneClick,
  getStatusBadge,
  onUpdateProgress,
}: {
  milestone: any;
  onMilestoneClick: (milestoneId: string | number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateProgress: (milestoneId: number) => void;
}) {
  const isOverdue = isMilestoneOverdue(milestone);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with color indicator and name */}
        <div
          className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 cursor-pointer"
          onClick={() => onMilestoneClick(milestone.id)}
        >
          {milestone.color && (
            <div className="h-3 w-3 sm:h-3 sm:w-3 rounded-full shrink-0" style={{ backgroundColor: milestone.color }} />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{milestone.name}</p>
            {milestone.description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 truncate">{milestone.description}</p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
        </div>

        {/* Project name */}
        {milestone.project_id && (
          <div className="mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Project:{' '}
              <span className="font-semibold text-primary">
                {milestone.project.name}
              </span>
            </p>
          </div>
        )}

        {/* Status badge */}
        <div className="mb-2 sm:mb-3">
          {getStatusBadge(milestone.status)}
        </div>

        {/* Progress bar */}
        <div className="mb-2 sm:mb-3">
          <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{milestone.progress || 0}%</span>
          </div>
          <Progress value={milestone.progress || 0} className="h-1.5 sm:h-2" />
        </div>

        {/* Dates */}
        <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
          {milestone.start_date && (
            <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 sm:gap-2">
              <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>Start: {safeFormatMilestoneDate(milestone.start_date)}</span>
            </p>
          )}
          <p className={`text-[10px] sm:text-xs flex items-center gap-1 sm:gap-2 ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
            <CalendarIcon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span>Due: {safeFormatMilestoneDate(milestone.due_date)}</span>
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateProgress(milestone.id);
            }}
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5"
          >
            <RefreshCw className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            Update Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MilestonesTableView({
  milestones,
  onMilestoneClick,
  getStatusBadge,
  onUpdateProgress,
}: MilestonesTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {milestones.map((milestone: any) => (
          <MobileMilestoneCard
            key={milestone.id}
            milestone={milestone}
            onMilestoneClick={onMilestoneClick}
            getStatusBadge={getStatusBadge}
            onUpdateProgress={onUpdateProgress}
          />
        ))}
        {milestones.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Flag className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No milestones to display</p>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((milestone: any) => {
              const isOverdue = isMilestoneOverdue(milestone);

              return (
                <TableRow
                  key={milestone.id}
                  className="cursor-pointer"
                  onClick={() => onMilestoneClick(milestone.id)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{milestone.name}</p>
                        {milestone.color && (
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: milestone.color }} />
                        )}
                      </div>
                      {milestone.description && (
                        <p className="max-w-md truncate text-sm text-muted-foreground">{milestone.description}</p>
                      )}
                      {milestone.project_id && (
                        <p className="text-xs text-muted-foreground">
                          Project:{' '}
                          <span className="font-semibold text-primary">
                            {`${milestone.project.name}`}
                          </span>
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                  <TableCell>
                    <div className="min-w-35">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{milestone.progress || 0}%</span>
                      </div>
                      <Progress value={milestone.progress || 0} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground flex flex-col">

                      {milestone.start_date && (
                        <p className=" inline-flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Start: {safeFormatMilestoneDate(milestone.start_date)}</span>
                        </p>
                      )}
                      <p className={`inline-flex items-center gap-2 ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : ''}`}>
                        <CalendarIcon className="h-4 w-4" />
                        <span>Due: {safeFormatMilestoneDate(milestone.due_date)}</span>
                      </p>
                      {milestone.end_date && (
                        <p className="inline-flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>End: {safeFormatMilestoneDate(milestone.end_date)}</span>
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateProgress(milestone.id);
                        }}
                        title="Update Progress"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
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
