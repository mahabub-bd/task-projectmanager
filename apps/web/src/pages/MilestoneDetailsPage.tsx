import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { FullPageLoader } from '../components/ui/loading-spinner';
import { Button } from '../components/ui/button';
import MilestoneActivityTimeline from '../components/milestones/MilestoneActivityTimeline';
import MilestoneActionBar from '../components/milestones/MilestoneActionBar';
import MilestoneDetailsGrid from '../components/milestones/MilestoneDetailsGrid';
import MilestoneFormModal, { MilestoneFormData } from '../components/milestones/MilestoneFormModal';
import MilestoneOverview from '../components/milestones/MilestoneOverview';
import MilestoneTimeline from '../components/milestones/MilestoneTimeline';
import { useDeleteMilestoneMutation, useGetMilestoneQuery, useGetProjectsListQuery, useGetTasksQuery, useUpdateMilestoneMutation } from '../store/api';
import { RootState } from '../store/store';

export default function MilestoneDetailsPage() {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);

  const { data: milestone, isLoading, isError, refetch } = useGetMilestoneQuery(milestoneId || '', {
    skip: !milestoneId,
  });

  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();
  const [deleteMilestone] = useDeleteMilestoneMutation();

  // Fetch projects for the modal
  const { data: projects } = useGetProjectsListQuery(
    organizationId ? String(organizationId) : '',
  );

  // Fetch tasks for the project if milestone has a project
  const { data: projectTasksResponse } = useGetTasksQuery(
    milestone?.project_id ? { project_id: milestone.project_id, limit: 100 } : undefined
  );
  const projectTasks = projectTasksResponse?.items || [];

  useEffect(() => {
    if (milestone) {
      setEditingMilestone(milestone);
    }
  }, [milestone]);

  const handleSubmit = async (data: MilestoneFormData) => {
    if (!milestoneId) return;

    // Filter out empty date strings to avoid validation errors
    const updateData: any = {
      name: data.name,
      description: data.description,
      status: data.status,
      progress: data.progress,
      color: data.color,
    };

    // Only include date fields if they have a value
    if (data.start_date) updateData.start_date = data.start_date;
    if (data.end_date) updateData.end_date = data.end_date;
    if (data.due_date) updateData.due_date = data.due_date;

    // Only include project_id if it has a value
    if (data.project_id) updateData.project_id = Number(data.project_id);

    try {
      await updateMilestone({
        id: String(milestoneId),
        ...updateData,
      }).unwrap();
      toast.success('Milestone updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update milestone');
    }
  };

  const handleDelete = async () => {
    if (!milestoneId) return;
    if (!confirm('Delete this milestone?')) return;

    try {
      await deleteMilestone(String(milestoneId)).unwrap();
      toast.success('Milestone deleted successfully');
      navigate('/milestones');
    } catch {
      toast.error('Failed to delete milestone');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!milestoneId) return;
    try {
      await updateMilestone({ id: String(milestoneId), status }).unwrap();
      toast.success('Status updated');
      await refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleProgressChange = async (progress: number) => {
    if (!milestoneId) return;
    try {
      await updateMilestone({ id: String(milestoneId), progress }).unwrap();
      toast.success('Progress updated');
      await refetch();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  // Calculate project tasks stats
  const projectTasksStats = projectTasks.length > 0 ? {
    total: projectTasks.length,
    completed: projectTasks.filter((t: any) => t.status === 'completed').length,
    inProgress: projectTasks.filter((t: any) => t.status === 'in_progress').length,
    overdue: projectTasks.filter((t: any) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
  } : null;

  if (isLoading) {
    return <FullPageLoader text="Loading milestone details..." />;
  }

  if (isError || !milestone) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Flag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Milestone not found</h3>
          <p className="text-muted-foreground mb-4">The milestone you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/milestones')} className="mt-4">Back to Milestones</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-6">
        <MilestoneActionBar
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onBack={() => navigate('/milestones')}
        />

        <MilestoneOverview
          name={milestone.name}
          description={milestone.description}
          status={milestone.status}
          progress={milestone.progress || 0}
          color={milestone.color}
        />

        {/* Project Information Card */}
        {milestone.project && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Project Information</h3>
                    <p className="text-sm text-muted-foreground">This milestone belongs to</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {milestone.project.color && (
                      <div
                        className="h-4 w-4 rounded-full shadow-sm"
                        style={{ backgroundColor: milestone.project.color }}
                      />
                    )}
                    <button
                      onClick={() => navigate(`/projects/${milestone.project.id}`)}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {milestone.project.name}
                    </button>
                    <Badge variant={`status-${milestone.project.status}` as any}>
                      {milestone.project.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  {milestone.project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {milestone.project.description}
                    </p>
                  )}
                </div>

                {/* Project Tasks Stats */}
                {projectTasksStats && (
                  <div className="border-l pl-6 space-y-3">
                    <h4 className="text-sm font-semibold">Project Tasks</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold text-lg">{projectTasksStats.total}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completed</p>
                        <p className="font-semibold text-lg text-green-600">{projectTasksStats.completed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">In Progress</p>
                        <p className="font-semibold text-lg text-blue-600">{projectTasksStats.inProgress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overdue</p>
                        <p className="font-semibold text-lg text-red-600">{projectTasksStats.overdue}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <MilestoneDetailsGrid
          milestone={milestone}
          onStatusChange={handleStatusChange}
          onProgressChange={handleProgressChange}
        />

        <MilestoneTimeline createdAt={milestone.created_at} updatedAt={milestone.updated_at} />

        <MilestoneActivityTimeline
          statusHistory={milestone.status_history || []}
        />
      </div>

      <MilestoneFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialMilestone={editingMilestone}
        onSubmit={handleSubmit}
        isSaving={isUpdating}
        projects={projects}
      />
    </>
  );
}
