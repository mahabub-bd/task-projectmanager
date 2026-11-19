import { cn } from '@/lib/utils';
import { AlertCircle, Building2, Flag, FolderKanban, ListTodo, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  progress?: number;
  tone: 'blue' | 'violet' | 'amber' | 'teal' | 'emerald' | 'rose';
  path: string;
}

interface EnhancedStatsOverviewProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalMilestones: number;
    completedMilestones: number;
    overdueTasks: number;
    completionRate: number;
    totalOrganizations?: number;
    totalDepartments?: number;
    totalUsers?: number;
  };
  onNavigate?: (path: string) => void;
}

const toneStyles: Record<StatCard['tone'], { icon: string; bar: string }> = {
  blue: { icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  violet: { icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', bar: 'bg-violet-500' },
  amber: { icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  teal: { icon: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', bar: 'bg-teal-500' },
  emerald: { icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  rose: { icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
};

export default function EnhancedStatsOverview({ stats, onNavigate }: EnhancedStatsOverviewProps) {
  const statCards: StatCard[] = [
    {
      title: 'Tasks',
      value: stats.totalTasks,
      icon: ListTodo,
      description: `${stats.completedTasks} done · ${stats.inProgressTasks} in progress`,
      progress: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
      tone: 'blue',
      path: '/tasks',
    },
    {
      title: 'Projects',
      value: stats.activeProjects,
      icon: FolderKanban,
      description: `${stats.totalProjects} total · ${stats.completedProjects} completed`,
      progress: stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0,
      tone: 'violet',
      path: '/projects',
    },
    {
      title: 'Milestones',
      value: stats.totalMilestones,
      icon: Flag,
      description: `${stats.completedMilestones} completed · ${stats.totalMilestones - stats.completedMilestones} remaining`,
      progress: stats.totalMilestones > 0 ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100) : 0,
      tone: 'amber',
      path: '/milestones',
    },
    {
      title: 'Team',
      value: stats.totalUsers || 0,
      icon: UsersRound,
      description: `${stats.totalDepartments || 0} departments · ${stats.totalOrganizations || 0} orgs`,
      tone: 'teal',
      path: '/users',
    },
    {
      title: 'Organizations',
      value: stats.totalOrganizations || 0,
      icon: Building2,
      description: `${stats.totalDepartments || 0} departments · ${stats.totalUsers || 0} members`,
      tone: 'emerald',
      path: '/organizations',
    },
    {
      title: 'Needs attention',
      value: stats.overdueTasks,
      icon: AlertCircle,
      description: stats.overdueTasks > 0 ? 'Overdue tasks to review' : 'Nothing overdue right now',
      tone: 'rose',
      path: '/tasks',
    },
  ];

  return (
    <section aria-label="Workspace statistics" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const tone = toneStyles[stat.tone];

        return (
          <button
            key={stat.title}
            type="button"
            onClick={() => onNavigate?.(stat.path)}
            style={{ animationDelay: `${index * 60}ms` }}
            className="dashboard-card dashboard-enter group w-full p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[13px]">
                  {stat.title}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{stat.value}</p>
              </div>
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl', tone.icon)}>
                <Icon className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-2 truncate text-xs text-muted-foreground sm:text-[13px]">{stat.description}</p>

            {stat.progress !== undefined && (
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-[width] duration-700', tone.bar)}
                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </section>
  );
}
