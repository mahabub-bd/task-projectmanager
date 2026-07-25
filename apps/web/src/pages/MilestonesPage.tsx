import { TablePagination } from '@/components/shared/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import FilterBar from '@/components/ui/FilterBar';
import StatsCard from '@/components/ui/stats-card';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Flag,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MilestoneFormModal, { MilestoneFormData } from '../components/milestones/MilestoneFormModal';
import MilestonesGridView from '../components/milestones/MilestonesGridView';
import MilestonesTableView from '../components/milestones/MilestonesTableView';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import {
  useCreateMilestoneMutation,
  useGetMilestonesQuery,
  useGetOverdueMilestonesQuery,
  useGetPhasesByProjectQuery,
  useGetProjectsListQuery,
  useGetUpcomingMilestonesQuery,
  useUpdateMilestoneMutation,
  useUpdateMilestoneProgressMutation
} from '../store/api';
import { RootState } from '../store/store';
import {
  buildMilestonePayload,
  buildMilestoneUpdatePayload,
  getMilestoneStats,
  getRandomMilestoneColor,
} from './utils/milestones-page.utils';

export default function MilestonesPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');



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

  const { data: milestonesResponse, isLoading, isError, refetch } = useGetMilestonesQuery(queryParams);
  useGetUpcomingMilestonesQuery(organizationId ? String(organizationId) : '');
  const { data: overdueMilestones } = useGetOverdueMilestonesQuery(
    organizationId ? String(organizationId) : '',
  );
  const { data: projects } = useGetProjectsListQuery(
    organizationId ? String(organizationId) : '',
  );
  const { data: phases } = useGetPhasesByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });
  const [createMilestone, { isLoading: isCreating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();

  const [updateProgress] = useUpdateMilestoneProgressMutation();

  // Extract milestones and total count from paginated response
  const milestones = milestonesResponse?.items || [];
  const totalMilestones = milestonesResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalMilestones / itemsPerPage);



  const stats = useMemo(() => getMilestoneStats(milestones, overdueMilestones), [milestones, overdueMilestones]);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingMilestone(null);
  };



  const handleSubmit = async (data: MilestoneFormData) => {
    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    // Update selected project ID for phase loading
    if (data.project_id) {
      setSelectedProjectId(data.project_id);
    }

    try {
      if (editingMilestone) {
        await updateMilestone({
          id: editingMilestone.id,
          ...buildMilestoneUpdatePayload(data),
        }).unwrap();
        toast.success('Milestone updated');
      } else {
        await createMilestone(
          buildMilestonePayload(
            { ...data, color: data.color || getRandomMilestoneColor() },
            Number(organizationId),
          ),
        ).unwrap();
        toast.success('Milestone created');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save milestone');
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
    const statusConfig: Record<string, { label: string; variant: any }> = {
      not_started: { label: 'Not Started', variant: 'status-draft' as any },
      in_progress: { label: 'In Progress', variant: 'status-in_progress' as any },
      completed: { label: 'Completed', variant: 'status-completed' as any },
      on_hold: { label: 'On Hold', variant: 'secondary' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleMilestoneClick = (milestoneId: string | number) => {
    navigate(`/milestones/${milestoneId}`);
  };

  if (isLoading) {
    return <PageLoadingState message="Loading milestones..." />;
  }

  if (isError) {
    return <PageErrorState
      title="Could not load milestones"
      description="The page is loading correctly now, but the milestone request failed."
      onRetry={() => refetch()}
    />;
  }

  return (
    <>
      <div className="space-y-6">
        <p className="text-muted-foreground">Track project milestones, deadlines, and progress.</p>

        <div className="grid gap-4 md:grid-cols-5">
          <StatsCard title="Total Milestones" value={stats.total} icon={Flag} />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            iconClassName="text-amber-600 dark:text-amber-400"
            valueClassName="text-amber-600 dark:text-amber-400"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            iconClassName="text-emerald-600 dark:text-emerald-400"
            valueClassName="text-emerald-600 dark:text-emerald-400"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertCircle}
            iconClassName="text-red-600 dark:text-red-400"
            valueClassName="text-red-600 dark:text-red-400"
          />
          <StatsCard title="Avg Progress" value={`${stats.avgProgress}%`} icon={Clock} />
        </div>

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={(value) => handleFilterChange(() => setSearchQuery(value))}
          searchPlaceholder="Search by name or description..."
          addButton={{
            label: "New Milestone",
            onClick: () => setShowCreateModal(true),
          }}
          filters={{
            status: {
              value: statusFilter,
              onChange: (value) => handleFilterChange(() => setStatusFilter(value)),
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'not_started', label: 'Not Started' },
                { value: 'in_progress', label: 'In Progress' },
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

        {milestones.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <Card>
                <CardContent className="p-0">
                  <MilestonesTableView
                    milestones={milestones}
                    onMilestoneClick={handleMilestoneClick}
                    getStatusBadge={getStatusBadge}
                    onUpdateProgress={handleUpdateProgress}
                  />
                </CardContent>
              </Card>
            ) : (
              <MilestonesGridView
                milestones={milestones}
                onMilestoneClick={handleMilestoneClick}
                getStatusBadge={getStatusBadge}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {/* Pagination */}
            <Card>
              <CardContent className="pt-6">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalMilestones}
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
            <CardContent className="p-12 text-center">
              <Flag className="mx-auto mb-4 h-14 w-14 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">
                No milestones found
              </h3>
              <p className="text-muted-foreground">
                {totalMilestones === 0
                  ? 'Create milestones to track your project progress and deadlines.'
                  : 'No milestones match your current filters.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <MilestoneFormModal
        open={showCreateModal}
        onClose={closeModal}
        initialMilestone={editingMilestone || undefined}
        onSubmit={handleSubmit}
        isSaving={isCreating || isUpdating}
        projects={projects}
        phases={phases || []}
        projectId={selectedProjectId}
      />
    </>
  );
}
