import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UsersRound } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardCard, DashboardEmptyState } from './DashboardCard';

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

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getWorkload = (member: TeamMember) => {
  if (member.tasks.overdue > 0) {
    return { label: `${member.tasks.overdue} overdue`, tone: 'text-rose-600 dark:text-rose-400' };
  }
  if (member.tasks.inProgress > 5) {
    return { label: 'Heavy load', tone: 'text-amber-600 dark:text-amber-400' };
  }
  return { label: 'On track', tone: 'text-emerald-600 dark:text-emerald-400' };
};

export default function TeamOverview({ teamMembers, onNavigate }: TeamOverviewProps) {
  const displayMembers = useMemo(() => {
    return [...teamMembers]
      .sort((a, b) => {
        if (a.tasks.overdue > 0 && b.tasks.overdue === 0) return -1;
        if (b.tasks.overdue > 0 && a.tasks.overdue === 0) return 1;
        return b.tasks.total - a.tasks.total;
      })
      .slice(0, 4);
  }, [teamMembers]);

  return (
    <DashboardCard
      icon={UsersRound}
      title="Team workload"
      subtitle="Assigned work at a glance"
      count={teamMembers.length}
      action={onNavigate ? { label: 'View team', onClick: () => onNavigate('/users') } : undefined}
    >
      {displayMembers.length === 0 ? (
        <DashboardEmptyState
          icon={UsersRound}
          title="No assigned work yet"
          description="Team workload will appear once tasks are assigned."
          compact
        />
      ) : (
        <div className="space-y-3">
          {displayMembers.map((member) => {
            const rate =
              member.tasks.total > 0 ? Math.round((member.tasks.completed / member.tasks.total) * 100) : 0;
            const workload = getWorkload(member);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onNavigate?.(`/users/${member.id}`)}
                className="group flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-9 w-9 shrink-0 border border-border/70">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-[13px] font-semibold text-primary">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                      {member.name}
                    </span>
                    <span className={cn('shrink-0 text-xs font-medium', workload.tone)}>
                      {workload.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={rate} className="h-1.5 flex-1" />
                    <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {member.tasks.completed}/{member.tasks.total}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
