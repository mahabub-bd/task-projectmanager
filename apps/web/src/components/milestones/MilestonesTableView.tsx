import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { isMilestoneOverdue, safeFormatMilestoneDate } from './utils/milestones-page.utils';

interface MilestonesTableViewProps {
  milestones: any[];
  onMilestoneClick: (milestoneId: string | number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateProgress: (milestoneId: number) => void;
}

export default function MilestonesTableView({
  milestones,
  onMilestoneClick,
  getStatusBadge,
  onUpdateProgress,
}: MilestonesTableViewProps) {
  return (
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
  );
}
