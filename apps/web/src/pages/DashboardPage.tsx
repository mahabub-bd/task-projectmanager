import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import DepartmentOverview from '../components/dashboard/DepartmentOverview';
import EnhancedStatsOverview from '../components/dashboard/EnhancedStatsOverview';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import ProjectSpotlight from '../components/dashboard/ProjectSpotlight';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTasks from '../components/dashboard/RecentTasks';
import TeamOverview from '../components/dashboard/TeamOverview';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import { useAppSelector } from '../store/hooks';
import { hasPermission } from '../utils/permissions';
import {
  useGetActivityLogQuery,
  useGetDashboardStatsQuery,
  useGetDepartmentsQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
} from '../store/api';

function DashboardSkeleton() {
  return (
    <div className="dashboard-page space-y-5 sm:space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
      {/* Mirrors QuickActions: five pills, horizontally scrollable on mobile */}
      <div className="flex gap-2 md:grid md:grid-cols-5">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-12 w-40 shrink-0 animate-pulse rounded-xl bg-muted/40 md:w-auto"
          />
        ))}
      </div>
      {/* Mirrors EnhancedStatsOverview: six stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 2xl:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-36 animate-pulse rounded-2xl bg-muted/40" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-7 2xl:col-span-8">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/40" />
          <div className="h-80 animate-pulse rounded-2xl bg-muted/40" />
        </div>
        <div className="space-y-5 xl:col-span-5 2xl:col-span-4">
          <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const canViewAuditLogs = hasPermission(user, 'read:audit');

  // Aggregate counts come from the dedicated stats endpoint (a handful of
  // GROUP BY queries) instead of downloading every row with limit: 1000.
  // baseQueryWithResponseTransform already unwraps the { data } envelope,
  // so statsResponse IS the stats payload itself.
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStatsQuery(undefined);

  // Small, bounded list fetches for the sections that need real rows.
  const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasksQuery({
    limit: 50,
    sort_by: 'created_at',
    sort_order: 'DESC',
  });
  const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({
    status: 'active',
    limit: 25,
  });
  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useGetDepartmentsQuery({ limit: 200 });
  const { data: activitiesResponse, isLoading: isLoadingActivities } = useGetActivityLogQuery({ limit: 5 });

  const isLoading =
    isLoadingStats || isLoadingTasks || isLoadingProjects || isLoadingDepartments || isLoadingActivities;

  const tasks = tasksResponse?.items || [];
  const projects = projectsResponse?.items || [];
  const departments = departmentsResponse?.items || [];
  const auditLogs = activitiesResponse?.items || [];

  const orgStats = stats?.organization ?? { totalOrganizations: 0, totalDepartments: 0, totalUsers: 0 };
  const totalMilestonesCount = stats?.milestones.total ?? 0;

  const taskStats = useMemo(() => {
    const byStatus = stats?.tasks.byStatus ?? {};
    return {
      total: stats?.tasks.total ?? 0,
      completed: stats?.tasks.completed ?? 0,
      inProgress: byStatus['in_progress'] ?? 0,
      overdue: stats?.tasks.overdue ?? 0,
      completionRate: stats?.tasks.completionRate ?? 0,
    };
  }, [stats]);

  const projectStats = useMemo(() => {
    const byStatus = stats?.projects.byStatus ?? {};
    return {
      total: stats?.projects.total ?? 0,
      completed: byStatus['completed'] ?? 0,
      active: byStatus['active'] ?? 0,
      totalMilestones: totalMilestonesCount,
      completedMilestones: stats?.milestones.completed ?? 0,
      completedTasks: stats?.tasks.completed ?? 0,
    };
  }, [stats, totalMilestonesCount]);

  // Delivery health uses real workspace data instead of fabricated trend values.
  const healthStats = useMemo(() => {
    const activeTasks =
      (stats?.tasks.total ?? 0) - (stats?.tasks.completed ?? 0) - (stats?.tasks.byStatus?.['cancelled'] ?? 0);
    const overdueTasks = stats?.tasks.overdue ?? 0;
    const onTrackRate =
      activeTasks > 0 ? Math.round(((activeTasks - overdueTasks) / activeTasks) * 100) : 100;
    const milestoneRate =
      totalMilestonesCount > 0
        ? Math.round(((stats?.milestones.completed ?? 0) / totalMilestonesCount) * 100)
        : 0;

    return {
      completionRate: stats?.tasks.completionRate ?? 0,
      onTrackRate,
      milestoneRate,
      activeTasks,
      overdueTasks,
      completedMilestones: stats?.milestones.completed ?? 0,
      totalMilestones: totalMilestonesCount,
    };
  }, [stats, totalMilestonesCount]);

  // Already sorted by created_at DESC server-side.
  const recentTasks = tasks.slice(0, 5);

  const featuredProjects = useMemo(() => {
    return [...projects]
      .sort((a: any, b: any) => (b.task_count ?? 0) - (a.task_count ?? 0))
      .slice(0, 5)
      .map((p: any) => ({
        ...p,
        totalTasks: p.task_count ?? 0,
        completedTasks: Math.round(((p.task_count ?? 0) * (p.progress ?? 0)) / 100),
      }));
  }, [projects]);

  const activities = useMemo(() => {
    return auditLogs.map((log: any) => {
      const { action, entity_type, created_at, user, new_values, old_values } = log;

      let type: any = 'task_created';
      let title = '';
      let description = '';
      let projectName = '';

      switch (entity_type) {
        case 'project':
          type = 'project_updated';
          if (action === 'create') {
            title = `Created project "${new_values?.name || 'a project'}"`;
            description = 'New project added';
          } else if (action === 'update') {
            if (new_values?.status && old_values?.status !== new_values?.status) {
              title = `Changed project status to "${new_values.status}"`;
              description = new_values?.name || 'Project';
              projectName = new_values?.name;
            } else {
              title = `Updated project "${new_values?.name || 'a project'}"`;
              description = 'Project details changed';
              projectName = new_values?.name;
            }
          } else if (action === 'delete') {
            title = `Deleted project "${old_values?.name || 'a project'}"`;
            description = 'Project removed';
          }
          break;

        case 'milestone':
          type = 'milestone_completed';
          if (action === 'create') {
            title = `Created milestone "${new_values?.name || 'a milestone'}"`;
            description = 'New milestone added';
          } else if (action === 'update') {
            if (new_values?.status === 'completed') {
              title = `Completed milestone "${new_values?.name || 'a milestone'}"`;
              description = 'Milestone achieved';
            } else {
              title = `Updated milestone "${new_values?.name || 'a milestone'}"`;
              description = 'Milestone details changed';
            }
          } else if (action === 'delete') {
            title = `Deleted milestone "${old_values?.name || 'a milestone'}"`;
            description = 'Milestone removed';
          }
          break;

        case 'task':
          type = action === 'create' ? 'task_created' : action === 'delete' ? 'task_created' : 'task_completed';
          if (action === 'create') {
            title = `Created task "${new_values?.title || 'a task'}"`;
            description = 'New task added';
          } else if (action === 'update') {
            if (new_values?.status === 'completed') {
              title = `Completed task "${new_values?.title || 'a task'}"`;
              description = 'Task marked as done';
            } else if (new_values?.status) {
              title = `Changed task status to "${new_values.status.replace('_', ' ')}"`;
              description = new_values?.title || 'Task';
            } else {
              title = `Updated task "${new_values?.title || 'a task'}"`;
              description = 'Task details changed';
            }
          } else if (action === 'delete') {
            title = `Deleted task "${old_values?.title || 'a task'}"`;
            description = 'Task removed';
          }
          break;

        case 'user':
          if (action === 'login') {
            type = 'user_assigned';
            title = 'Logged in';
            description = 'User session started';
          } else if (action === 'logout') {
            type = 'user_assigned';
            title = 'Logged out';
            description = 'User session ended';
          }
          break;

        default:
          title = `${action} ${entity_type}`;
          description = 'Activity recorded';
      }

      return {
        id: log.id,
        type,
        title,
        description,
        timestamp: new Date(created_at),
        user: user
          ? {
              name: user.name,
              avatar: user.avatar_url,
            }
          : undefined,
        metadata: {
          projectName,
        },
      };
    });
  }, [auditLogs]);

  const departmentStats = useMemo(() => {
    // Single pass: bucket projects by department, tasks by department
    // (via their project's department), instead of nested filters.
    const projectById = new Map<string, any>();
    projects.forEach((p: any) => projectById.set(p.id, p));

    const projectsByDept = new Map<string, any[]>();
    projects.forEach((p: any) => {
      if (p.department_id == null) return;
      const list = projectsByDept.get(p.department_id);
      if (list) list.push(p);
      else projectsByDept.set(p.department_id, [p]);
    });

    const taskCountsByDept = new Map<string, { total: number; completed: number }>();
    tasks.forEach((t: any) => {
      const project = t.project_id != null ? projectById.get(t.project_id) : undefined;
      const deptId = project?.department_id;
      if (deptId == null) return;
      const counts = taskCountsByDept.get(deptId) || { total: 0, completed: 0 };
      counts.total++;
      if (t.status === 'completed') counts.completed++;
      taskCountsByDept.set(deptId, counts);
    });

    return departments.map((dept: any) => {
      const deptProjects = projectsByDept.get(dept.id) || [];
      const counts = taskCountsByDept.get(dept.id) || { total: 0, completed: 0 };
      const progress = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

      return {
        department: dept,
        totalProjects: deptProjects.length,
        activeProjects: deptProjects.filter((p: any) => p.status === 'active').length,
        totalTasks: counts.total,
        completedTasks: counts.completed,
        teamMembers: dept.users?.length || 0,
        progress,
      };
    });
  }, [departments, projects, tasks]);

  const teamMembers = useMemo(() => {
    const memberMap = new Map();

    tasks.forEach((task: any) => {
      const userId = task.assigned_to;
      if (!userId) return;

      if (!memberMap.has(userId)) {
        memberMap.set(userId, {
          id: task.assigned_to_user?.id || userId,
          name: task.assigned_to_user?.name || 'Unknown User',
          email: task.assigned_to_user?.email,
          avatar: task.assigned_to_user?.avatar_url,
          tasks: {
            total: 0,
            completed: 0,
            inProgress: 0,
            overdue: 0,
          },
        });
      }

      const member = memberMap.get(userId);
      member.tasks.total++;
      if (task.status === 'completed') member.tasks.completed++;
      if (task.status === 'in_progress') member.tasks.inProgress++;
      if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed') {
        member.tasks.overdue++;
      }
    });

    return Array.from(memberMap.values());
  }, [tasks]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-page space-y-5 sm:space-y-6">
      <WelcomeHeader onNavigate={handleNavigate} />
      <QuickActions onNavigate={handleNavigate} />

      <EnhancedStatsOverview
        stats={{
          totalTasks: taskStats.total,
          completedTasks: taskStats.completed,
          inProgressTasks: taskStats.inProgress,
          totalProjects: projectStats.total,
          activeProjects: projectStats.active,
          completedProjects: projectStats.completed,
          totalMilestones: projectStats.totalMilestones,
          completedMilestones: projectStats.completedMilestones,
          overdueTasks: taskStats.overdue,
          completionRate: taskStats.completionRate,
          totalOrganizations: orgStats.totalOrganizations,
          totalDepartments: orgStats.totalDepartments,
          totalUsers: orgStats.totalUsers,
        }}
        onNavigate={handleNavigate}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">
        <div className="space-y-4 sm:space-y-5 xl:col-span-7 2xl:col-span-8">
          <ProjectSpotlight
            projects={featuredProjects}
            isLoading={false}
            onNavigate={handleNavigate}
          />
          <RecentTasks tasks={recentTasks} isLoading={false} onNavigate={handleNavigate} />
          <TeamOverview teamMembers={teamMembers} onNavigate={handleNavigate} />
        </div>

        <div className="space-y-4 sm:space-y-5 xl:col-span-5 2xl:col-span-4">
          <PerformanceOverview stats={healthStats} />
          <ActivityFeed
            activities={activities}
            limit={5}
            onNavigate={canViewAuditLogs ? handleNavigate : undefined}
          />
          <DepartmentOverview departmentStats={departmentStats} onNavigate={handleNavigate} />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}
