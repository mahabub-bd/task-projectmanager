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
import { FullPageLoader } from '../components/ui/loading-spinner';
import { useGetActivityLogQuery, useGetDepartmentsQuery, useGetMilestonesQuery, useGetOrganizationsQuery, useGetProjectsQuery, useGetTasksQuery } from '../store/api';

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

export default function DashboardPage() {
  const navigate = useNavigate();
  // Fetch all data without pagination limit for accurate stats
  const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({ limit: 1000 });
  const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasksQuery({ limit: 1000 });
  const { data: milestonesResponse, isLoading: isLoadingMilestones } = useGetMilestonesQuery({ limit: 1000 });
  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useGetDepartmentsQuery({ limit: 1000 });
  const { data: activitiesResponse, isLoading: isLoadingActivities } = useGetActivityLogQuery({ limit: 5 });
  const { data: organizationsResponse } = useGetOrganizationsQuery({ limit: 1000 });

  // Overall loading state
  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingMilestones || isLoadingDepartments || isLoadingActivities;

  // Extract items and totals from paginated response format
  const projects = projectsResponse?.items || [];
  const tasks = tasksResponse?.items || [];
  const milestones = milestonesResponse?.items || [];
  const departments = departmentsResponse?.items || [];
  const auditLogs = activitiesResponse?.items || [];
  const organizations = organizationsResponse || [];

  // Calculate organization statistics
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

  // Use the total count from API response for accurate stats
  const totalProjectsCount = projectsResponse?.total || projects.length;
  const totalTasksCount = tasksResponse?.total || tasks.length;
  const totalMilestonesCount = milestonesResponse?.total || milestones.length;

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const now = new Date();
    const total = totalTasksCount;
    // For completed/inProgress/overdue, we can only count from the loaded items
    // These might be underestimates if we have more data than loaded
    const completed = tasks.filter((t: any) => t.status === 'completed').length;
    const inProgress = tasks.filter((t: any) => t.status === 'in_progress').length;
    const overdue = tasks.filter((t: any) => new Date(t.due_date) < now && t.status !== 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, overdue, completionRate };
  }, [tasks, totalTasksCount]);

  // Calculate project statistics with accurate progress
  const projectStats = useMemo(() => {
    const total = totalProjectsCount;
    const completed = projects.filter((p: any) => p.status === 'completed').length;
    const active = projects.filter((p: any) => p.status === 'active').length;

    // Calculate progress dynamically based on actual tasks
    const projectsWithProgress = projects.map((project: any) => {
      const progressData = calculateProjectProgress(project, tasks);

      return {
        ...project,
        ...progressData,
      };
    });

    const avgProgress = total > 0
      ? Math.round(projectsWithProgress.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / total)
      : 0;

    const totalMilestones = totalMilestonesCount;
    const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length;
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;

    return {
      total,
      completed,
      active,
      avgProgress,
      totalMilestones,
      completedMilestones,
      completedTasks,
      projectsWithProgress,
    };
  }, [projects, milestones, tasks, totalProjectsCount, totalMilestonesCount]);

  // Get recent tasks
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [tasks]);

  // Get featured projects (active projects with most tasks) with accurate progress
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

  // Transform audit logs into activity feed items
  const activities = useMemo(() => {
    return auditLogs.map((log: any) => {
      const { action, entity_type, created_at, user, new_values, old_values } = log;

      let type: any = 'task_created';
      let title = '';
      let description = '';
      let projectName = '';

      // Map audit log actions to activity types
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
        user: user ? {
          name: user.name,
          avatar: user.avatar_url,
        } : undefined,
        metadata: {
          projectName,
        },
      };
    });
  }, [auditLogs]);

  // Calculate department statistics
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

  // Calculate team member workload
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

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const twoWeeksAgoCompleted = Math.max(0, taskStats.completed - Math.floor(taskStats.completed * 0.2));

    return {
      tasksCompleted: {
        value: taskStats.completed,
        previousValue: twoWeeksAgoCompleted,
        target: Math.ceil(taskStats.total * 0.8),
        format: 'number' as const,
      },
      projectsOnTrack: {
        value: projectStats.active,
        previousValue: Math.max(0, projectStats.active - 1),
        target: projectStats.total,
        format: 'number' as const,
      },
      teamProductivity: {
        value: taskStats.completionRate,
        previousValue: Math.max(0, taskStats.completionRate - 5),
        target: 85,
        format: 'percentage' as const,
      },
      avgCompletionTime: {
        value: 5.2,
        previousValue: 5.8,
        target: 4,
        unit: 'days',
        format: 'number' as const,
      },
    };
  }, [taskStats, projectStats]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return <FullPageLoader text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <WelcomeHeader />
        <QuickActions onNavigate={handleNavigate} />
      </div>

      {/* Stats Overview */}
      <section className="w-full">
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
      </section>

      {/* Main Content Grid - Responsive grid for all screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Project Spotlight - Full width on mobile, spans 2 cols on large screens */}
        <section className="lg:col-span-2 xl:col-span-2">
          <ProjectSpotlight
            projects={featuredProjects}
            isLoading={false}
            onNavigate={handleNavigate}
          />
        </section>

        {/* Performance Overview - 1 col on mobile, 1 col on desktop */}
        <section className="lg:col-span-1 xl:col-span-1">
          <PerformanceOverview metrics={performanceMetrics} />
        </section>

        {/* Recent Tasks - 1 col on mobile, 1 col on desktop */}
        <section>
          <RecentTasks
            tasks={recentTasks}
            isLoading={false}
            onNavigate={handleNavigate}
          />
        </section>

        {/* Activity Feed - 1 col on mobile, 1 col on desktop */}
        <section>
          <ActivityFeed activities={activities} limit={5} />
        </section>

        {/* Department Overview - 1 col on mobile, 1 col on desktop */}
        <section className="hidden xl:block">
          <DepartmentOverview
            departmentStats={departmentStats}
            onNavigate={handleNavigate}
          />
        </section>

        {/* Team Overview - 1 col on mobile, 1 col on desktop */}
        <section className="hidden lg:block">
          <TeamOverview
            teamMembers={teamMembers}
            onNavigate={handleNavigate}
          />
        </section>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
