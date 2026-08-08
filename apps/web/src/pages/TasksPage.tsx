import { TablePagination } from '@/components/shared/TablePagination';
import { Card, CardContent } from '@/components/ui/card';
import FilterBar from '@/components/ui/FilterBar';
import StatsCard from '@/components/ui/stats-card';
import { AlertCircle, CheckCircle2, Clock, FileText, Percent } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import TaskCreateModal, { TaskFormData } from '../components/tasks/TaskCreateModal';
import TasksGridView from '../components/tasks/TasksGridView';
import TasksTableView from '../components/tasks/TasksTableView';
import {
  useCreateTagMutation,
  useCreateTaskMutation,
  useGetProjectsListQuery,
  useGetTagsQuery,
  useGetTasksQuery,
} from '../store/api';
import { RootState } from '../store/store';
import { getTaskStats } from './utils/tasks-page.utils';

const getRandomColor = () => {
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function TasksPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Build query params with pagination and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter !== 'all') params.priority = priorityFilter;

    return params;
  }, [searchQuery, statusFilter, priorityFilter, currentPage, itemsPerPage]);

  const { data: tasksResponse, isLoading, isError, refetch } = useGetTasksQuery(queryParams);
  const { data: projects } = useGetProjectsListQuery(
    organizationId ? String(organizationId) : '',
  );
  const { data: tagsResponse, refetch: refetchTags } = useGetTagsQuery(
    organizationId ? { organization_id: String(organizationId) } : undefined,
  );
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  // Extract tasks and total count from paginated response
  const tasks = tasksResponse?.items || [];
  const totalTasks = tasksResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalTasks / itemsPerPage);

  // Handle refetch with proper typing
  const handleRefetchTasks = () => {
    refetch();
  };

  const availableTags = Array.isArray(tagsResponse?.data)
    ? tagsResponse.data
    : Array.isArray(tagsResponse)
      ? tagsResponse
      : [];

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  const selectedTags = useMemo(
    () => availableTags.filter((tag: any) => selectedTagIds.includes(tag.id)),
    [availableTags, selectedTagIds],
  );

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedTagIds([]);
    setNewTagName('');
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );
  };

  const handleCreateTagForTask = async () => {
    const tagName = newTagName.trim();
    if (!tagName) return;

    const orgId = Number(organizationId);
    if (!orgId || Number.isNaN(orgId)) {
      toast.error('Organization ID is required to create tags');
      return;
    }

    const existingTag = availableTags.find(
      (tag: any) => tag.name?.toLowerCase() === tagName.toLowerCase(),
    );
    if (existingTag) {
      toggleTag(existingTag.id);
      setNewTagName('');
      return;
    }

    try {
      const createdTag = await createTag({
        name: tagName,
        color: getRandomColor(),
        organization_id: orgId,
      }).unwrap();

      const createdTagId = createdTag?.data?.id || createdTag?.id;
      if (createdTagId) {
        setSelectedTagIds((current) =>
          current.includes(createdTagId) ? current : [...current, createdTagId]
        );
      }

      setNewTagName('');
      await refetchTags();
      toast.success('Tag created');
    } catch (error: any) {
      toast.error(error?.data?.message?.[0] || 'Failed to create tag');
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || undefined,
        project_id: data.project_id ? Number(data.project_id) : undefined,
        tag_ids: selectedTagIds,
      }).unwrap();

      toast.success('Task created');
      closeCreateModal();
      refetch();
    } catch {
      toast.error('Failed to create task');
    }
  };

  if (isLoading) {
    return <PageLoadingState message="Loading tasks..." />;
  }

  if (isError) {
    return <PageErrorState
      title="Could not load tasks"
      description="The page is loading correctly now, but the task request failed."
      onRetry={() => refetch()}
    />;
  }

  return (
    <>
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Track work, monitor deadlines, and open any task for full details.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard title="Total Tasks" value={stats.total} icon={FileText} />
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
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={Percent}
            iconClassName="text-blue-600 dark:text-blue-400"
            valueClassName="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Loading and Error States */}
        {isLoading && <PageLoadingState message="Loading tasks..." />}
        {isError && (
          <PageErrorState
            title="Failed to load tasks"
            description="There was an error loading the tasks. Please try again."
            onRetry={handleRefetchTasks}
          />
        )}

        {!isLoading && !isError && (
          <>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={(value) => handleFilterChange(() => setSearchQuery(value))}
          searchPlaceholder="Search by title, description, assignee, or creator..."
          addButton={{
            label: "New Task",
            onClick: () => setShowCreateModal(true),
          }}
          filters={{
            status: {
              value: statusFilter,
              onChange: (value) => handleFilterChange(() => setStatusFilter(value)),
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'draft', label: 'Draft' },
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In progress' },
                { value: 'review', label: 'Review' },
                { value: 'completed', label: 'Completed' },
                { value: 'closed', label: 'Closed' },
              ],
            },
            priority: {
              value: priorityFilter,
              onChange: (value) => handleFilterChange(() => setPriorityFilter(value)),
              options: [
                { value: 'all', label: 'All priorities' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ],
            },
          }}
          viewMode={{
            value: viewMode,
            onChange: setViewMode,
          }}
          onRefresh={() => refetch()}
        />

        {tasks.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <Card>
                <CardContent className="p-0">
                  <TasksTableView tasks={tasks} onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)} />
                </CardContent>
              </Card>
            ) : (
              <TasksGridView tasks={tasks} onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)} />
            )}

            {/* Pagination */}
            <Card>
              <CardContent className="pt-6">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalTasks}
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
            <CardContent className="p-8 text-center sm:p-12">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50 sm:h-14 sm:w-14" />
              <h3 className="mb-2 text-base font-semibold sm:text-lg">
                No tasks found
              </h3>
              <p className="text-sm text-muted-foreground">
                {totalTasks === 0
                  ? 'Tasks will appear here once they are created.'
                  : 'No tasks match your current filters.'}
              </p>
            </CardContent>
          </Card>
        )}
        </>
      )}
      </div>

      <TaskCreateModal
        open={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
        isSaving={isCreatingTask}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        onCreateTag={handleCreateTagForTask}
        isCreatingTag={isCreatingTag}
        selectedTags={selectedTags}
        availableTags={availableTags}
        projects={projects}
        onToggleTag={toggleTag}
      />
    </>
  );
}
