import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Building2, FolderKanban, Gauge, Users } from 'lucide-react';

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
  const avgCompletionRate = totalDepartments > 0
    ? Math.round(departmentStats.reduce((sum, dept) => sum + dept.progress, 0) / totalDepartments)
    : 0;

  // Sort departments by progress
  const sortedDepartments = [...departmentStats].sort((a, b) => b.progress - a.progress);

  // Stat tiles: label + value, identity chip beside the text (never colored text).
  // Hue order keeps blue/purple at opposite ends so they are never adjacent.
  const summaryStats = [
    { label: 'Departments', value: `${totalDepartments}`, icon: Building2, chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-500' },
    { label: 'Projects', value: `${totalProjects}`, icon: FolderKanban, chip: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Progress', value: `${avgCompletionRate}%`, icon: Gauge, chip: 'bg-amber-500/10 text-amber-600' },
    { label: 'Team Members', value: `${totalTeamMembers}`, icon: Users, chip: 'bg-purple-500/10 text-purple-600 dark:text-purple-500' },
  ];

  return (
    <Card className="h-full border-2">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold truncate">Department Overview</h3>
              <p className="text-xs text-muted-foreground truncate">Performance & Statistics</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate?.('/departments')} className="gap-1 shrink-0 -mr-1">
            <span className="hidden xl:inline">View all</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-lg border p-2.5 space-y-1.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`rounded-md p-1 shrink-0 ${stat.chip}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{stat.label}</p>
                </div>
                <p className="text-lg font-bold leading-none tracking-tight">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Top performers — single-series bars, direct-labeled */}
        <div className="flex flex-col flex-1 min-h-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Top Performers</p>

          {sortedDepartments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">No departments found</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 flex-1 overflow-y-auto -mx-1">
              {sortedDepartments.slice(0, 4).map((dept, index) => (
                <button
                  key={dept.department.id}
                  type="button"
                  onClick={() => onNavigate?.('/departments')}
                  className="w-full text-left rounded-lg p-2.5 hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-5 shrink-0 tabular-nums">
                      #{index + 1}
                    </span>
                    <p className="text-xs font-semibold truncate flex-1 min-w-0 group-hover:text-primary transition-colors">
                      {dept.department.name}
                    </p>
                    <span className="text-xs font-bold shrink-0 tabular-nums">{dept.progress}%</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-1 pl-7">
                    {dept.activeProjects} {dept.activeProjects === 1 ? 'project' : 'projects'} · {dept.teamMembers} {dept.teamMembers === 1 ? 'member' : 'members'}
                  </p>

                  <div className="pl-7 mt-1.5">
                    <Progress
                      value={dept.progress}
                      className="h-1.5"
                      aria-label={`${dept.department.name} completion: ${dept.progress}%`}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
