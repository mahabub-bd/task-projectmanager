import ActionBar from '@/components/ui/ActionBar';
import { Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import MilestoneFormModal, { MilestoneFormData } from '../components/milestones/MilestoneFormModal';
import PhaseDetailsGrid from '../components/phases/PhaseDetailsGrid';
import PhaseFormModal, { PhaseFormData } from '../components/phases/PhaseFormModal';
import PhaseMilestonesList from '../components/phases/PhaseMilestonesList';
import PhaseOverview from '../components/phases/PhaseOverview';
import PhaseTimeline from '../components/phases/PhaseTimeline';
import { FullPageLoader } from '../components/ui/loading-spinner';
import { useCreateMilestoneMutation, useDeletePhaseMutation, useGetPhaseQuery, useGetProjectsListQuery, useUpdatePhaseMutation } from '../store/api';
import { useAppSelector } from '../store/hooks';

export default function PhaseDetailsPage() {
  const { phaseId } = useParams<{ phaseId: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);

  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id;

  const { data: phase, isLoading, isError, refetch } = useGetPhaseQuery(phaseId || '', {
    skip: !phaseId,
  });

  const { data: projects } = useGetProjectsListQuery(organizationId ? String(organizationId) : '');
  const [updatePhase, { isLoading: isUpdating }] = useUpdatePhaseMutation();
  const [deletePhase] = useDeletePhaseMutation();
  const [createMilestone, { isLoading: isCreatingMilestone }] = useCreateMilestoneMutation();

  useEffect(() => {
    if (phase) {
      setEditingPhase(phase);
    }
  }, [phase]);

  const handleSubmit = async (data: PhaseFormData) => {
    if (!phaseId) return;

    try {
      await updatePhase({
        id: String(phaseId),
        ...data,
      }).unwrap();
      toast.success('Phase updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update phase');
    }
  };

  const handleDelete = async () => {
    if (!phaseId) return;
    if (!confirm('Delete this phase? All milestones will be reassigned to the project.')) return;

    try {
      await deletePhase(String(phaseId)).unwrap();
      toast.success('Phase deleted successfully');
      if (phase?.project_id) {
        navigate(`/projects/${phase.project_id}`);
      } else {
        navigate('/projects');
      }
    } catch {
      toast.error('Failed to delete phase');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!phaseId) return;
    try {
      await updatePhase({ id: String(phaseId), status }).unwrap();
      toast.success('Status updated');
      await refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleProgressChange = async (progress: number) => {
    if (!phaseId) return;
    try {
      await updatePhase({ id: String(phaseId), progress }).unwrap();
      toast.success('Progress updated');
      await refetch();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleMilestoneClick = (milestoneId: number) => {
    navigate(`/milestones/${milestoneId}`);
  };

  const handleProjectClick = (projectId: string | number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleAddMilestone = () => {
    setShowMilestoneModal(true);
  };

  const handleCreateMilestone = async (data: MilestoneFormData) => {
    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    try {
      await createMilestone({
        ...data,
        organization_id: Number(organizationId),
        project_id: phase?.project_id ? Number(phase.project_id) : undefined,
        phase_id: phaseId ? Number(phaseId) : undefined,
        color: data.color || '#3b82f6',
      }).unwrap();
      toast.success('Milestone created successfully');
      setShowMilestoneModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create milestone');
    }
  };

  if (isLoading) {
    return <FullPageLoader text="Loading phase details..." />;
  }

  if (isError || !phase) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Layers className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Phase not found</h3>
          <p className="text-muted-foreground mb-4">The phase you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-6">
        <ActionBar
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onBack={() => phase?.project_id ? navigate(`/projects/${phase.project_id}`) : navigate('/projects')}
        />

        <PhaseOverview
          name={phase.name}
          description={phase.description}
          status={phase.status}
          progress={phase.progress || 0}
          color={phase.color}
        />

        <PhaseDetailsGrid
          phase={phase}
          onStatusChange={handleStatusChange}
          onProgressChange={handleProgressChange}
          onProjectClick={handleProjectClick}
        />

        <PhaseMilestonesList
          milestones={phase.milestones || []}
          onMilestoneClick={handleMilestoneClick}
          onAddMilestone={handleAddMilestone}
        />

        <PhaseTimeline createdAt={phase.created_at} updatedAt={phase.updated_at} />
      </div>

      <PhaseFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialPhase={editingPhase}
        onSubmit={handleSubmit}
        isSaving={isUpdating}
        projectId={String(phase.project_id || '')}
        organizationId={String(organizationId || '')}
      />

      <MilestoneFormModal
        open={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        initialMilestone={{
          project_id: phase?.project_id ? String(phase.project_id) : '',
          phase_id: phaseId,
        }}
        onSubmit={handleCreateMilestone}
        isSaving={isCreatingMilestone}
        projects={projects || []}
        phases={[]}
        projectId={phase?.project_id ? String(phase.project_id) : ''}
      />
    </>
  );
}
