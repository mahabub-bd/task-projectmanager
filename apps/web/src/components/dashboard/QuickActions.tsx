import { cn } from '@/lib/utils';
import { FolderKanban, Flag, ListTodo, UsersRound, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  tone: 'blue' | 'violet' | 'amber' | 'teal' | 'emerald';
}

const quickActions: QuickAction[] = [
  { title: 'Projects', description: 'Portfolio overview', icon: FolderKanban, path: '/projects', tone: 'violet' },
  { title: 'Tasks', description: 'Your workload', icon: ListTodo, path: '/tasks', tone: 'blue' },
  { title: 'Milestones', description: 'Key deadlines', icon: Flag, path: '/milestones', tone: 'amber' },
  { title: 'Team', description: 'Contributors', icon: UsersRound, path: '/users', tone: 'teal' },
  { title: 'Organization', description: 'Structure & teams', icon: Building2, path: '/organizations', tone: 'emerald' },
];

const toneStyles: Record<QuickAction['tone'], string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
};

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <nav
      aria-label="Quick actions"
      className="dashboard-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 md:pb-0"
    >
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            type="button"
            onClick={() => onNavigate(action.path)}
            className="group flex min-w-[156px] flex-1 items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-w-0"
          >
            <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors', toneStyles[action.tone])}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold sm:text-base">{action.title}</span>
              <span className="block truncate text-[13px] text-muted-foreground">{action.description}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
