import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingDown, TrendingUp } from 'lucide-react';

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

const getProgressBg = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-orange-500';
};

export default function DepartmentOverview({ departmentStats, onNavigate }: DepartmentOverviewProps) {
  const totalDepartments = departmentStats.length;
  const totalProjects = departmentStats.reduce((sum, dept) => sum + dept.totalProjects, 0);
  const totalTeamMembers = departmentStats.reduce((sum, dept) => sum + dept.teamMembers, 0);
  const avgCompletionRate = totalDepartments > 0
    ? Math.round(departmentStats.reduce((sum, dept) => sum + dept.progress, 0) / totalDepartments)
    : 0;

  // Sort departments by progress
  const sortedDepartments = [...departmentStats].sort((a, b) => b.progress - a.progress);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4 pt-5 px-5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white dark:bg-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold dark:text-white">Department Overview</div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-0.5">Performance & Statistics</p>
            </div>
          </div>
          {avgCompletionRate >= 70 ? (
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border  dark:border-blue-900/50 p-3">
            <p className="text-xs text-muted-foreground dark:text-blue-200 mb-1">Departments</p>
            <p className="text-2xl font-bold dark:text-white">{totalDepartments}</p>
          </div>

          <div className="rounded-lg border dark:bg-purple-950/40 dark:border-purple-900/50 p-3">
            <p className="text-xs text-muted-foreground dark:text-purple-200 mb-1">Team Members</p>
            <p className="text-2xl font-bold dark:text-white">{totalTeamMembers}</p>
          </div>

          <div className="rounded-lg border dark:bg-green-950/40 dark:border-green-900/50 p-3">
            <p className="text-xs text-muted-foreground dark:text-green-200 mb-1">Projects</p>
            <p className="text-2xl font-bold dark:text-white">{totalProjects}</p>
          </div>

          <div className="rounded-lg border dark:bg-amber-950/40 dark:border-amber-900/50 p-3">
            <p className="text-xs text-muted-foreground dark:text-amber-200 mb-1">Progress</p>
            <p className="text-2xl font-bold dark:text-white">{avgCompletionRate}%</p>
          </div>
        </div>

        {/* Department List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase">Top Performers</p>

          {sortedDepartments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-8 w-8 mx-auto text-muted-foreground dark:text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">No departments found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDepartments.slice(0, 4).map((dept, index) => (
                <div
                  key={dept.department.id}
                  onClick={() => onNavigate?.(`/departments`)}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent dark:bg-card/50 dark:hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-bold text-muted-foreground dark:text-muted-foreground w-5">#{index + 1}</span>

                  <div className="flex-1">
                    <p className="font-medium text-sm dark:text-white">{dept.department.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {dept.activeProjects} projects · {dept.teamMembers} members
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold dark:text-white">{dept.progress}%</p>
                    <div className="h-1.5 w-12 rounded-full bg-muted dark:bg-muted/50 overflow-hidden">
                      <div
                        className={`h-full ${getProgressBg(dept.progress)}`}
                        style={{ width: `${dept.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        {totalDepartments > 4 && (
          <button
            onClick={() => onNavigate?.('/departments')}
            className="w-full py-2 text-sm text-primary hover:underline"
          >
            View all departments →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
