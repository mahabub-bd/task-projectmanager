import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  Building2,
  FileText,
  FolderKanban
} from 'lucide-react';
import { useMemo } from 'react';

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  progress?: number;
  description?: string;
  clickHandler?: () => void;
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

export default function EnhancedStatsOverview({ stats, onNavigate }: EnhancedStatsOverviewProps) {
  const statCards: StatCard[] = useMemo(() => {
    const taskProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
    const projectProgress = stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0;

    return [
      {
        title: 'Total Tasks',
        value: stats.totalTasks,
        icon: FileText,
        color: 'blue',
        progress: taskProgress,
        description: `${stats.completedTasks} completed • ${stats.inProgressTasks} in progress`,
        clickHandler: () => onNavigate?.('/tasks'),
      },
      {
        title: 'Active Projects',
        value: stats.activeProjects,
        icon: FolderKanban,
        color: 'purple',
        progress: projectProgress,
        description: `${stats.totalProjects} total • ${stats.completedProjects} completed`,
        clickHandler: () => onNavigate?.('/projects'),
      },
      {
        title: 'Organizations',
        value: stats.totalOrganizations || 0,
        icon: Building2,
        color: 'emerald',
        description: `${stats.totalDepartments || 0} departments • ${stats.totalUsers || 0} users`,
        clickHandler: () => onNavigate?.('/organizations'),
      },
      {
        title: 'Needs Attention',
        value: stats.overdueTasks,
        icon: AlertCircle,
        color: stats.overdueTasks > 0 ? 'red' : 'gray',
        description: stats.overdueTasks > 0 ? 'Tasks overdue' : 'All caught up!',
        clickHandler: () => onNavigate?.('/tasks'),
      },
    ];
  }, [stats, onNavigate]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        progress: 'bg-blue-500',
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        progress: 'bg-purple-500',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        progress: 'bg-emerald-500',
      },
      red: {
        bg: 'bg-red-500/10',
        text: 'text-red-600 dark:text-red-400',
        progress: 'bg-red-500',
      },
      gray: {
        bg: 'bg-gray-500/10',
        text: 'text-gray-600 dark:text-gray-400',
        progress: 'bg-gray-500',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="group hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/50"
            onClick={stat.clickHandler}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-1.5 sm:space-y-2">
                {/* Value and title with icon on right */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</h3>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5 truncate">{stat.title}</p>
                  </div>
                  <div className={`rounded-lg ${colors.bg} p-1.5 sm:p-2 transition-all duration-300 group-hover:scale-110 shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${colors.text}`} />
                  </div>
                </div>

                {/* Description - always show */}
                <p className="text-[11px] sm:text-sm text-muted-foreground line-clamp-1">{stat.description}</p>

                {/* Progress bar - if exists */}
                {stat.progress !== undefined && (
                  <div className="h-1.5 sm:h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.progress} transition-all duration-500`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
