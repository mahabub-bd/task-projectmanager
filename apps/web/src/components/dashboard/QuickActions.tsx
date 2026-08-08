import {
  ArrowRight,
  FileText,
  Flag,
  FolderKanban,
  Plus,
  Users
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  onClick: () => string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'New Project',
    description: 'Start a new initiative',
    icon: Plus,
    onClick: () => '/projects',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    title: 'All Projects',
    description: 'Browse your portfolio',
    icon: FolderKanban,
    onClick: () => '/projects',
    color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  },
  {
    title: 'Task Board',
    description: 'Manage your workload',
    icon: FileText,
    onClick: () => '/tasks',
    color: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
  {
    title: 'Milestones',
    description: 'Track project deadlines',
    icon: Flag,
    onClick: () => '/milestones',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  {
    title: 'Team',
    description: 'Manage contributors',
    icon: Users,
    onClick: () => '/users',
    color: 'bg-gradient-to-br from-rose-500 to-rose-600',
  },
];

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {quickActions.map((action) => (
        <button
          key={action.title}
          onClick={() => onNavigate(action.onClick())}
          className="group relative overflow-hidden rounded-xl cursor-pointer border-2 bg-card p-3 sm:p-4 text-left transition-all duration-300 hover:shadow-lg hover:border-primary/50"
        >
          {/* Background gradient decoration */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${action.color}`} />

          <div className="relative flex items-center gap-2 sm:gap-3">
            <div className={`rounded-lg p-2 sm:p-2.5 text-white shadow-md transition-all duration-300 group-hover:scale-110 shrink-0 ${action.color}`}>
              <action.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold transition-colors group-hover:text-primary truncate">
                {action.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">{action.description}</p>
            </div>
          </div>

          {/* Arrow indicator on hover - hidden on mobile */}
          <ArrowRight className="absolute top-3 sm:top-4 right-3 sm:right-4 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
        </button>
      ))}
    </div>
  );
}
