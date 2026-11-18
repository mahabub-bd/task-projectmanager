import { FolderKanban, Flag, ListTodo, Users, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const quickActions: QuickAction[] = [
  { title: 'Projects', description: 'Portfolio overview', icon: FolderKanban, path: '/projects' },
  { title: 'Tasks', description: 'Your workload', icon: ListTodo, path: '/tasks' },
  { title: 'Milestones', description: 'Key deadlines', icon: Flag, path: '/milestones' },
  { title: 'Team', description: 'Contributors', icon: Users, path: '/users' },
  { title: 'Organization', description: 'Structure & teams', icon: Building2, path: '/organizations' },
];

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
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold sm:text-sm">{action.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{action.description}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
