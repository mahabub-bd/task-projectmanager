import { TablePagination } from '@/components/shared/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import FilterBar from '@/components/ui/FilterBar';
import StatsCard from '@/components/ui/stats-card';
import { AlertCircle, CheckCircle2, Flag, FolderKanban } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import ProjectsGridView from '../components/projects/ProjectsGridView';
import ProjectsTableView from '../components/projects/ProjectsTableView';
import {
  useAddProjectMemberMutation,
  useCreateProjectMutation,
  useGetOverdueProjectsQuery,
  useGetProjectsQuery,
  useGetUsersListQuery,
  useUpdateProjectMutation,
  useUpdateProjectProgressMutation
} from '../store/api';
import { RootState } from '../store/store';
import {
  getProjectStats,
  getRandomProjectColor,
} from './utils/projects-page.utils';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    if (user?.organization_id) {
      localStorage.setItem('organization_id', String(user.organization_id));
    }
  }, [user]);

  // Build query params with pagination and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (organizationId) params.organization_id = String(organizationId);
    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.status = statusFilter;

    return params;
  }, [organizationId, searchQuery, statusFilter, currentPage, itemsPerPage]);

  const { data: projectsResponse, isLoading, isError, refetch } = useGetProjectsQuery(queryParams);
  const { data: usersList } = useGetUsersListQuery(organizationId ? String(organizationId) : undefined);
  const { data: overdueProjects } = useGetOverdueProjectsQuery(
    organizationId ? String(organizationId) : '',
  );
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const [updateProgress] = useUpdateProjectProgressMutation();
  const [addProjectMember] = useAddProjectMemberMutation();

  // Extract projects and total count from paginated response
  const projects = projectsResponse?.items || [];
  const totalProjects = projectsResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const managerOptions = useMemo(
    () => [...(usersList || [])].sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '')),
    [usersList],
  );

  const stats = useMemo(() => getProjectStats(projects, overdueProjects), [projects, overdueProjects]);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingProject(null);
  };



  const handleSubmit = async (data: any) => {
    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    // Extract members from data and exclude from project payload
    const { members, ...projectData } = data;

    try {
      let projectId: number;

      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          priority: projectData.priority,
          start_date: projectData.start_date,
          due_date: projectData.due_date,
          budget: projectData.budget ? parseFloat(projectData.budget) : undefined,
          manager_id: projectData.manager_id ? Number(projectData.manager_id) : undefined,
          color: projectData.color,
          progress: projectData.progress,
        }).unwrap();
        projectId = editingProject.id;
        toast.success('Project updated');
      } else {
        const result = await createProject({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          priority: projectData.priority,
          start_date: projectData.start_date,
          due_date: projectData.due_date,
          budget: projectData.budget ? parseFloat(projectData.budget) : undefined,
          organization_id: Number(organizationId),
          manager_id: projectData.manager_id ? Number(projectData.manager_id) : undefined,
          color: projectData.color || getRandomProjectColor(),
          progress: projectData.progress,
        }).unwrap();
        projectId = result.id;
        toast.success('Project created');
      }

      // Add members if provided
      if (members && members.length > 0) {
        for (const member of members) {
          try {
            await addProjectMember({
              projectId: String(projectId),
              user_id: member.user_id,
              department_id: member.department_id,
              role: member.role || 'member',
            }).unwrap();
          } catch (error) {
            console.error('Failed to add member:', error);
          }
        }
      }

      closeModal();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save project');
    }
  };



  const handleUpdateProgress = async (id: number) => {
    try {
      await updateProgress(String(id)).unwrap();
      toast.success('Progress updated');
      refetch();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: any }> = {
      planning: { label: 'Planning', variant: 'status-draft' as any },
      active: { label: 'Active', variant: 'status-in_progress' as any },
      completed: { label: 'Completed', variant: 'status-completed' as any },
      on_hold: { label: 'On Hold', variant: 'secondary' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
    };
    const { label, variant } = config[status] || { label: status, variant: 'secondary' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; variant: any }> = {
      low: { label: 'Low', variant: 'priority-low' as any },
      medium: { label: 'Medium', variant: 'priority-medium' as any },
      high: { label: 'High', variant: 'priority-high' as any },
      urgent: { label: 'Urgent', variant: 'priority-urgent' as any },
    };
    const { label, variant } = config[priority] || { label: priority, variant: 'secondary' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (isLoading) {
    return <PageLoadingState message="Loading projects..." />;
  }

  if (isError) {
    return <PageErrorState title="Could not load projects" onRetry={() => refetch()} />;
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
              Manage projects, track milestones, and monitor progress.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {totalProjects} {totalProjects === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <StatsCard title="Total Projects" value={stats.total} icon={FolderKanban} />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={CheckCircle2}
            iconClassName="text-emerald-600 dark:text-emerald-400"
            valueClassName="text-emerald-600 dark:text-emerald-400"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            iconClassName="text-blue-600 dark:text-blue-400"
            valueClassName="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertCircle}
            iconClassName="text-red-600 dark:text-red-400"
            valueClassName="text-red-600 dark:text-red-400"
          />
          <StatsCard title="Avg Progress" value={`${Math.round(stats.avgProgress)}%`} icon={Flag} />
        </div>

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={(value) => handleFilterChange(() => setSearchQuery(value))}
          searchPlaceholder="Search by name or description..."
          addButton={{
            label: "New Project",
            onClick: () => setShowCreateModal(true),
          }}
          filters={{
            status: {
              value: statusFilter,
              onChange: (value) => handleFilterChange(() => setStatusFilter(value)),
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'cancelled', label: 'Cancelled' },
              ],
            },
          }}
          viewMode={{
            value: viewMode,
            onChange: setViewMode,
          }}
          onRefresh={() => refetch()}
        />

        {projects.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <Card className="overflow-hidden">
                <CardContent className="p-0 sm:p-0">
                  <ProjectsTableView
                    projects={projects}
                    getStatusBadge={getStatusBadge}
                    getPriorityBadge={getPriorityBadge}
                    onOpenProject={(projectId) => navigate(`/projects/${projectId}`)}
                  />
                </CardContent>
              </Card>
            ) : (
              <ProjectsGridView
                projects={projects}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
                onOpenProject={(projectId) => navigate(`/projects/${projectId}`)}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {/* Pagination */}
            <Card>
              <CardContent className="p-2.5 sm:p-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalProjects}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                  showStats={true}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-4 sm:p-12">
              <div className="flex flex-col items-center gap-2.5 sm:gap-4">
                <FolderKanban className="h-9 w-9 sm:h-14 sm:w-14 text-muted-foreground/50" />
                <h3 className="text-sm sm:text-lg font-semibold">
                  No projects found
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                  {totalProjects === 0
                    ? 'Create projects to organize your milestones and tasks.'
                    : 'No projects match your current filters.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ProjectFormModal
        open={showCreateModal}
        onClose={closeModal}
        editingProject={editingProject}
        onSubmit={handleSubmit}
        isSaving={isCreating || isUpdating}
        managerOptions={managerOptions}
      />
    </>
  );
}
