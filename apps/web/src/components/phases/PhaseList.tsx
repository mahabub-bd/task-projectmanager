import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PhaseListProps {
  phases: any[];
  onAddPhase?: () => void;
  projectId?: string;
}

export default function PhaseList({ phases, onAddPhase }: PhaseListProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: any }> = {
      not_started: { label: 'Not Started', variant: 'status-draft' as any },
      in_progress: { label: 'In Progress', variant: 'status-in_progress' as any },
      completed: { label: 'Completed', variant: 'status-completed' as any },
      on_hold: { label: 'On Hold', variant: 'secondary' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
    };
    const { label, variant } = config[status] || { label: status, variant: 'secondary' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const phaseCount = phases.length;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <h3 className="font-semibold">Phases</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{phaseCount}</span>
          </div>
          {onAddPhase && (
            <Button size="sm" variant="outline" onClick={onAddPhase}>
              <Plus className="h-4 w-4 mr-1" />
              Add Phase
            </Button>
          )}
        </div>
      </div>

      {phaseCount > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {phases.map((phase: any) => {
            const milestones = phase.milestones || [];
            const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length;
            const isOverdue = phase.due_date &&
              new Date(phase.due_date) < new Date() &&
              phase.status !== 'completed' &&
              phase.status !== 'cancelled';

            return (
              <Card
                key={phase.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/phases/${phase.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {phase.color && (
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: phase.color }}
                          />
                        )}
                        <h4 className="font-semibold">{phase.name}</h4>
                      </div>

                      {phase.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {phase.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {getStatusBadge(phase.status)}
                        <span className="text-muted-foreground">
                          {completedMilestones}/{milestones.length} milestones
                        </span>
                        <span className="text-muted-foreground">
                          • {phase.progress || 0}% complete
                        </span>
                        {isOverdue && (
                          <span className="text-red-600 font-medium">Overdue</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="relative h-16 w-16 shrink-0">
                        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className="stroke-muted"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className={isOverdue ? 'stroke-red-500' : 'stroke-primary'}
                            strokeWidth="3"
                            strokeDasharray={`${phase.progress || 0}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold">{phase.progress || 0}%</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Layers className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-4">No phases in this project yet.</p>
          {onAddPhase && (
            <Button size="sm" variant="outline" onClick={onAddPhase}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Phase
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
