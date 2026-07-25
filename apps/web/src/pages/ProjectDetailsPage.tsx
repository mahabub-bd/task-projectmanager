import { FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectActionBar from '../components/projects/ProjectActionBar';
import ProjectActivityTimeline from '../components/projects/ProjectActivityTimeline';
import ProjectDetailsGrid from '../components/projects/ProjectDetailsGrid';
import ProjectFormModal, { ProjectFormData } from '../components/projects/ProjectFormModal';
import ProjectMilestonesList from '../components/projects/ProjectMilestonesList';
import ProjectOverview from '../components/projects/ProjectOverview';
import ProjectTasksList from '../components/projects/ProjectTasksList';
import ProjectTeam from '../components/projects/ProjectTeam';
import ProjectTimeline from '../components/projects/ProjectTimeline';
import { Button } from '../components/ui/button';
import { FullPageLoader } from '../components/ui/loading-spinner';
import { useDeleteProjectMutation, useGetProjectMembersQuery, useGetProjectQuery, useGetUsersListQuery, useUpdateProjectMutation } from '../store/api';

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const { data: project, isLoading, isError, refetch } = useGetProjectQuery(projectId || '', {
    skip: !projectId,
  });


  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const { data: usersList } = useGetUsersListQuery(project?.organization_id ? String(project.organization_id) : undefined);
  const { data: projectMembers } = useGetProjectMembersQuery(projectId || '', {
    skip: !projectId,
  });

  const projectTasks = Array.isArray(project?.tasks) ? project.tasks : [];
  const projectMilestones = Array.isArray(project?.milestones) ? project.milestones : [];

  useEffect(() => {
    if (project) {
      setEditingProject(project);
    }
  }, [project]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!projectId) return;

    // Extract members from data and exclude from project payload
    const { members, ...projectData } = data;

    try {
      await updateProject({
        id: String(projectId),
        ...projectData,
        budget: projectData.budget ? parseFloat(projectData.budget) : undefined,
        manager_id: projectData.manager_id ? Number(projectData.manager_id) : undefined,
      }).unwrap();
      toast.success('Project updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    if (!confirm('Delete this project? All milestones and tasks will be deleted.')) return;

    try {
      await deleteProject(String(projectId)).unwrap();
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!projectId) return;
    try {
      await updateProject({ id: String(projectId), status }).unwrap();
      toast.success('Status updated');
      await refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!projectId) return;
    try {
      await updateProject({ id: String(projectId), priority }).unwrap();
      toast.success('Priority updated');
      await refetch();
    } catch {
      toast.error('Failed to update priority');
    }
  };

  if (isLoading) {
    return <FullPageLoader text="Loading project details..." />;
  }

  if (isError || !project) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <FolderKanban className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Project not found</h3>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-6">
        <ProjectActionBar
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onBack={() => navigate('/projects')}
        />

        <ProjectOverview
          name={project.name}
          description={project.description}
          status={project.status}
          priority={project.priority}
          progress={project.progress || 0}
          color={project.color}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectTasksList tasks={projectTasks} onTaskClick={(taskId) => navigate(`/tasks/${taskId}`)} />
          <ProjectMilestonesList milestones={projectMilestones} />
        </div>

        <ProjectDetailsGrid
          project={project}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />

        <ProjectTeam project={project} members={projectMembers || []} />

        <ProjectTimeline createdAt={project.created_at} updatedAt={project.updated_at} />

        <ProjectActivityTimeline
          statusHistory={project.status_history || []}
          onRefresh={() => refetch()}
        />
      </div>

      <ProjectFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingProject={editingProject}
        onSubmit={handleSubmit}
        isSaving={isUpdating}
        managerOptions={usersList || []}
      />
    </>
  );
}
