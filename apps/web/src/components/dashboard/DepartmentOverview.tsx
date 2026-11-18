import { Progress } from '@/components/ui/progress';
import { Building2, FolderKanban, Gauge, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface Department {
  id: number;
  name: string;
  description?: string;
}

interface DepartmentStats {
  department: Department;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
  progress: number;
}

interface DepartmentOverviewProps {
  departmentStats: DepartmentStats[];
  onNavigate?: (path: string) => void;
}

export default function DepartmentOverview({ departmentStats, onNavigate }: DepartmentOverviewProps) {
  const totalDepartments = departmentStats.length;
  const totalProjects = departmentStats.reduce((sum, dept) => sum + dept.totalProjects, 0);
  const totalTeamMembers = departmentStats.reduce((sum, dept) => sum + dept.teamMembers, 0);
  const avgCompletionRate =
    totalDepartments > 0
      ? Math.round(departmentStats.reduce((sum, dept) => sum + dept.progress, 0) / totalDepartments)
      : 0;

  const summaryStats: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: 'Departments', value: totalDepartments, icon: Building2 },
    { label: 'Projects', value: totalProjects, icon: FolderKanban },
    { label: 'Avg. progress', value: `${avgCompletionRate}%`, icon: Gauge },
    { label: 'Members', value: totalTeamMembers, icon: UsersRound },
  ];

  const topDepartments = [...departmentStats].sort((a, b) => b.progress - a.progress).slice(0, 4);

  return (
    <DashboardCard
      icon={Building2}
      title="Departments"
      subtitle="Performance across teams"
      action={onNavigate ? { label: 'View all', onClick: () => onNavigate('/departments') } : undefined}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate text-[10px] font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="mt-2 text-lg font-semibold tabular-nums tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Top performers
        </p>

        {topDepartments.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No departments found</p>
        ) : (
          <div className="space-y-3">
            {topDepartments.map((dept, index) => (
              <button
                key={dept.department.id}
                type="button"
                onClick={() => onNavigate?.('/departments')}
                className="group block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-4 shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="truncate font-medium transition-colors group-hover:text-primary">
                      {dept.department.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{dept.progress}%</span>
                </div>
                <div className="ml-6 mt-1.5">
                  <Progress value={dept.progress} className="h-1.5" />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {dept.activeProjects} active projects · {dept.teamMembers} members
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
