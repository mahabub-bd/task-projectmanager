import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Flag,
  FolderKanban,
  ListTodo,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tone = 'blue' | 'violet' | 'amber' | 'teal' | 'emerald' | 'rose';

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  /** 0-100 completion ratio. When omitted the footer renders a status chip. */
  progress?: number;
  chip?: { label: string; variant: 'neutral' | 'success' | 'danger' };
  tone: Tone;
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

const toneStyles: Record<
  Tone,
  { icon: string; bar: string; glow: string; border: string }
> = {
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
    glow: 'from-blue-500/30',
    border: 'hover:border-blue-500/40',
  },
  violet: {
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500',
    glow: 'from-violet-500/30',
    border: 'hover:border-violet-500/40',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
    glow: 'from-amber-500/30',
    border: 'hover:border-amber-500/40',
  },
  teal: {
    icon: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    bar: 'bg-teal-500',
    glow: 'from-teal-500/30',
    border: 'hover:border-teal-500/40',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    glow: 'from-emerald-500/30',
    border: 'hover:border-emerald-500/40',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
    glow: 'from-rose-500/30',
    border: 'hover:border-rose-500/40',
  },
};

const chipStyles = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
} as const;

const ratio = (part: number, whole: number) =>
  whole > 0 ? Math.min(100, Math.round((part / whole) * 100)) : 0;

export default function EnhancedStatsOverview({ stats, onNavigate }: EnhancedStatsOverviewProps) {
  const departments = stats.totalDepartments ?? 0;
  const organizations = stats.totalOrganizations ?? 0;
  const members = stats.totalUsers ?? 0;
  const remainingMilestones = stats.totalMilestones - stats.completedMilestones;

  const statCards: StatCard[] = [
    {
      title: 'Tasks',
      value: stats.totalTasks,
      icon: ListTodo,
      description: `${stats.completedTasks} done · ${stats.inProgressTasks} in progress`,
      progress: ratio(stats.completedTasks, stats.totalTasks),
      tone: 'blue',
      path: '/tasks',
    },
    {
      title: 'Projects',
      value: stats.activeProjects,
      icon: FolderKanban,
      description: `${stats.totalProjects} total · ${stats.completedProjects} completed`,
      progress: ratio(stats.completedProjects, stats.totalProjects),
      tone: 'violet',
      path: '/projects',
    },
    {
      title: 'Milestones',
      value: stats.totalMilestones,
      icon: Flag,
      description: `${stats.completedMilestones} completed · ${remainingMilestones} remaining`,
      progress: ratio(stats.completedMilestones, stats.totalMilestones),
      tone: 'amber',
      path: '/milestones',
    },
    {
      title: 'Team',
      value: members,
      icon: UsersRound,
      description: 'People in your workspace',
      chip: { label: `${departments} department${departments === 1 ? '' : 's'}`, variant: 'neutral' },
      tone: 'teal',
      path: '/users',
    },
    {
      title: 'Organizations',
      value: organizations,
      icon: Building2,
      description: 'Top-level workspace units',
      chip: { label: `${members} member${members === 1 ? '' : 's'}`, variant: 'neutral' },
      tone: 'emerald',
      path: '/organizations',
    },
    {
      title: 'Needs attention',
      value: stats.overdueTasks,
      icon: AlertCircle,
      description:
        stats.overdueTasks > 0 ? 'Overdue tasks to review' : 'Nothing overdue right now',
      chip:
        stats.overdueTasks > 0
          ? { label: `${stats.overdueTasks} overdue`, variant: 'danger' }
          : { label: 'All clear', variant: 'success' },
      tone: 'rose',
      path: '/tasks',
    },
  ];

  return (
    <section
      aria-label="Workspace statistics"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 2xl:grid-cols-6"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const tone = toneStyles[stat.tone];
        const percent = stat.progress;

        return (
          <button
            key={stat.title}
            type="button"
            onClick={() => onNavigate?.(stat.path)}
            aria-label={`${stat.title}: ${stat.value}. ${stat.description}. Open details`}
            style={{ animationDelay: `${index * 60}ms` }}
            className={cn(
              'dashboard-card dashboard-enter group relative flex h-full w-full flex-col overflow-hidden p-3 text-left transition-all duration-300',
              'hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              tone.border
            )}
          >
            {/* Tone wash that lifts on hover */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute -top-14 -right-14 h-32 w-32 rounded-full bg-linear-to-br to-transparent opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
                tone.glow
              )}
            />

            <div className="relative flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                {stat.title}
              </p>
              <span
                className={cn(
                  'relative grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-105',
                  tone.icon
                )}
              >
                <Icon
                  className="h-4 w-4 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
                  aria-hidden="true"
                />
                {/* Replaces the category icon on hover/focus to signal navigation */}
                <ArrowUpRight
                  className="absolute h-4 w-4 opacity-0 transition-opacity duration-200 group-focus-visible:opacity-100 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </div>

            <div className="relative mt-2 flex-1">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {stat.description}
              </p>
            </div>

            {/* Footer sits on a fixed 1.25rem line so every card in a row aligns */}
            <div className="relative mt-1.5 flex h-5 items-center gap-2">
              {percent !== undefined ? (
                <>
                  <div
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${stat.title} completion`}
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={cn('h-full rounded-full transition-[width] duration-700', tone.bar)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    {percent}%
                  </span>
                </>
              ) : stat.chip ? (
                <span
                  className={cn(
                    'inline-flex max-w-full items-center gap-1.5 truncate rounded-full px-1.5 py-0.5 text-xs font-medium',
                    chipStyles[stat.chip.variant]
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                    aria-hidden="true"
                  />
                  {stat.chip.label}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </section>
  );
}
