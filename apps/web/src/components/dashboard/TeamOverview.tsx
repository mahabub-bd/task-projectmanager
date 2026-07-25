import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';
import { useMemo } from 'react';

interface TeamMember {
  id: number | string;
  name: string;
  email?: string;
  avatar?: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

interface TeamOverviewProps {
  teamMembers: TeamMember[];
  onNavigate?: (path: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getWorkloadStatus = (member: TeamMember) => {
  const completionRate = member.tasks.total > 0 ? (member.tasks.completed / member.tasks.total) * 100 : 0;

  if (member.tasks.overdue > 0) return { label: 'Overdue', color: 'destructive' };
  if (member.tasks.inProgress > 5) return { label: 'Heavy', color: 'secondary' };
  if (completionRate > 80) return { label: 'Excellent', color: 'default' };
  if (member.tasks.total === 0) return { label: 'No tasks', color: 'outline' };
  return { label: 'On Track', color: 'default' };
};

export default function TeamOverview({ teamMembers, onNavigate }: TeamOverviewProps) {
  const displayMembers = useMemo(() => {
    return [...teamMembers]
      .sort((a, b) => {
        // Sort by overdue tasks first, then by total tasks descending
        if (a.tasks.overdue > 0 && b.tasks.overdue === 0) return -1;
        if (b.tasks.overdue > 0 && a.tasks.overdue === 0) return 1;
        return b.tasks.total - a.tasks.total;
      })
      .slice(0, 5);
  }, [teamMembers]);

  return (
    <Card className="border-2 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold truncate">Team Overview</h3>
                <p className="text-xs text-muted-foreground truncate">Workload distribution</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="rounded-lg bg-primary/10 p-1">
                <Users className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">{teamMembers.length}</span>
            </div>
          </div>
        </div>

        {displayMembers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-xs text-muted-foreground">No team members yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto -mx-1">
            {displayMembers.map((member) => {
              const status = getWorkloadStatus(member);
              const completionRate = member.tasks.total > 0
                ? (member.tasks.completed / member.tasks.total) * 100
                : 0;

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => onNavigate?.(`/users/${member.id}`)}
                >
                  <Avatar className="h-9 w-9 border-2 shrink-0 shadow-sm">
                    <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white text-xs font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold truncate flex-1 group-hover:text-primary transition-colors">{member.name}</p>
                      <Badge variant={status.color as any} className="text-[10px] px-2 py-0.5 shrink-0 font-medium">
                        {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <span className="text-muted-foreground">{member.tasks.completed} of {member.tasks.total} tasks</span>
                          <span className="font-semibold text-foreground">{completionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={completionRate} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
