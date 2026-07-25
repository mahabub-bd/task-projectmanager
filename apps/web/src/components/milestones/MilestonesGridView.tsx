import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import {
  isMilestoneOverdue,
  safeFormatMilestoneDate,
} from './utils/milestones-page.utils';

interface MilestonesGridViewProps {
  milestones: any[];
  onMilestoneClick: (milestoneId: string | number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onUpdateProgress: (milestoneId: number) => void;
}

export default function MilestonesGridView({
  milestones,
  onMilestoneClick,
  getStatusBadge,
  onUpdateProgress,
}: MilestonesGridViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {milestones.map((milestone: any) => {

        const isOverdue = isMilestoneOverdue(milestone);

        return (
          <Card
            key={milestone.id}
            className="cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => onMilestoneClick(milestone.id)}
          >
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{milestone.name}</h3>
                  {milestone.color && (
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: milestone.color }} />
                  )}
                </div>
                {milestone.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{milestone.description}</p>
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

              <div className="flex flex-wrap gap-2">
                {getStatusBadge(milestone.status)}
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                <Badge variant="outline">{milestone.progress || 0}% complete</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{milestone.progress || 0}%</span>
                </div>
                <Progress value={milestone.progress || 0} className="h-2" />
              </div>

              <div className='flex gap-4 items-center justify-between'>
                <div className="space-y-1 text-sm text-muted-foreground gap-2">
                  {milestone.start_date && (
                    <p className="inline-flex items-center gap-2 px-2">
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
              </div>


            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
