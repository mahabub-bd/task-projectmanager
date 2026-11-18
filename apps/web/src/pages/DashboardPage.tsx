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
  useGetDepartmentsQuery,
  useGetMilestonesQuery,
  useGetOrganizationsQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
} from '../store/api';

// Helper function to calculate accurate project progress
const calculateProjectProgress = (project: any, allTasks: any[]) => {
  const projectTasks = allTasks.filter((t: any) => t.project_id === project.id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t: any) => t.status === 'completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    progress,
    totalTasks,
    completedTasks,
    inProgressTasks: projectTasks.filter((t: any) => t.status === 'in_progress').length,
  };
};

function DashboardSkeleton() {
  return (
    <div className="dashboard-page space-y-5 sm:space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="h-16 animate-pulse rounded-xl bg-muted/40" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-2xl bg-muted/40" />
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

  // Fetch all data without pagination limit for accurate stats
  const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({ limit: 1000 });
  const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasksQuery({ limit: 1000 });
  const { data: milestonesResponse, isLoading: isLoadingMilestones } = useGetMilestonesQuery({ limit: 1000 });
  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useGetDepartmentsQuery({ limit: 1000 });
  const { data: activitiesResponse, isLoading: isLoadingActivities } = useGetActivityLogQuery({ limit: 5 });
  const { data: organizationsResponse } = useGetOrganizationsQuery({ limit: 1000 });

  const isLoading =
    isLoadingProjects || isLoadingTasks || isLoadingMilestones || isLoadingDepartments || isLoadingActivities;

  const projects = projectsResponse?.items || [];
  const tasks = tasksResponse?.items || [];
  const milestones = milestonesResponse?.items || [];
  const departments = departmentsResponse?.items || [];
  const auditLogs = activitiesResponse?.items || [];
  const organizations = organizationsResponse || [];

  const orgStats = useMemo(() => {
    let totalDepartments = 0;
    let totalUsers = 0;

    organizations.forEach((org: any) => {
      totalDepartments += org.departments?.length || 0;
      totalUsers += org.users?.length || 0;
    });

    return {
      totalOrganizations: organizations.length,
      totalDepartments,
      totalUsers,
    };
  }, [organizations]);

  const totalProjectsCount = projectsResponse?.total || projects.length;
  const totalTasksCount = tasksResponse?.total || tasks.length;
  const totalMilestonesCount = milestonesResponse?.total || milestones.length;

  const taskStats = useMemo(() => {
    const now = new Date();
    const total = totalTasksCount;
    const completed = tasks.filter((t: any) => t.status === 'completed').length;
    const inProgress = tasks.filter((t: any) => t.status === 'in_progress').length;
    const overdue = tasks.filter(
      (t: any) => new Date(t.due_date) < now && t.status !== 'completed'
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, overdue, completionRate };
  }, [tasks, totalTasksCount]);

  const projectStats = useMemo(() => {
    const total = totalProjectsCount;
    const completed = projects.filter((p: any) => p.status === 'completed').length;
    const active = projects.filter((p: any) => p.status === 'active').length;

    const projectsWithProgress = projects.map((project: any) => ({
      ...project,
      ...calculateProjectProgress(project, tasks),
    }));

    const avgProgress =
      total > 0
        ? Math.round(projectsWithProgress.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / total)
        : 0;

    return {
      total,
      completed,
      active,
      avgProgress,
      totalMilestones: totalMilestonesCount,
      completedMilestones: milestones.filter((m: any) => m.status === 'completed').length,
      completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
      projectsWithProgress,
    };
  }, [projects, milestones, tasks, totalProjectsCount, totalMilestonesCount]);

  // Delivery health uses real workspace data instead of fabricated trend values.
  const healthStats = useMemo(() => {
    const now = new Date();
    const activeTasks = tasks.filter((t: any) => t.status !== 'completed');
    const overdueTasks = activeTasks.filter(
      (t: any) => t.due_date && new Date(t.due_date) < now
    ).length;
    const onTrackRate =
      activeTasks.length > 0 ? Math.round(((activeTasks.length - overdueTasks) / activeTasks.length) * 100) : 100;
    const milestoneRate =
      totalMilestonesCount > 0
        ? Math.round((projectStats.completedMilestones / totalMilestonesCount) * 100)
        : 0;

    return {
      completionRate: taskStats.completionRate,
      onTrackRate,
      milestoneRate,
      activeTasks: activeTasks.length,
      overdueTasks,
      completedMilestones: projectStats.completedMilestones,
      totalMilestones: totalMilestonesCount,
    };
  }, [tasks, totalMilestonesCount, projectStats.completedMilestones, taskStats.completionRate]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [tasks]);

  const featuredProjects = useMemo(() => {
    const projectsWithAccurateProgress = projects.map((project: any) => {
      const progressData = calculateProjectProgress(project, tasks);
      const projectTasks = tasks.filter((t: any) => t.project_id === project.id);

      return {
        ...project,
        ...progressData,
        task_count: progressData.totalTasks,
        tasks: projectTasks,
      };
    });

    return projectsWithAccurateProgress
      .filter((p: any) => p.status === 'active')
      .sort((a: any, b: any) => b.task_count - a.task_count)
      .slice(0, 5);
  }, [projects, tasks]);

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
    return departments.map((dept: any) => {
      const deptProjects = projects.filter((p: any) => p.department_id === dept.id);
      const deptTasks = tasks.filter((t: any) => deptProjects.some((p: any) => p.id === t.project_id));
      const completedTasks = deptTasks.filter((t: any) => t.status === 'completed').length;
      const totalTasks = deptTasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        department: dept,
        totalProjects: deptProjects.length,
        activeProjects: deptProjects.filter((p: any) => p.status === 'active').length,
        totalTasks,
        completedTasks,
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
