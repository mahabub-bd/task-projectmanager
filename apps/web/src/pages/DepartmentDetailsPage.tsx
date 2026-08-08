import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { FullPageLoader } from '../components/ui/loading-spinner';
import { Button } from '../components/ui/button';
import DepartmentDescription from '../components/departments/DepartmentDescription';
import DepartmentDetailsGrid from '../components/departments/DepartmentDetailsGrid';
import DepartmentFormModal from '../components/departments/DepartmentFormModal';
import DepartmentHeader from '../components/departments/DepartmentHeader';
import DepartmentProjects from '../components/departments/DepartmentProjects';
import DepartmentTasks from '../components/departments/DepartmentTasks';
import {
  useDeleteDepartmentMutation,
  useGetDepartmentProjectsQuery,
  useGetDepartmentQuery,
  useGetDepartmentTasksQuery,
} from '../store/api';

export default function DepartmentDetailsPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: department, isLoading, isError } = useGetDepartmentQuery(departmentId || '', {
    skip: !departmentId,
  });

  const [deleteDepartment] = useDeleteDepartmentMutation();

  // Use dedicated endpoints for department projects and tasks
  const { data: departmentProjects } = useGetDepartmentProjectsQuery(departmentId || '', {
    skip: !departmentId,
  });
  const { data: departmentTasks } = useGetDepartmentTasksQuery(departmentId || '', {
    skip: !departmentId,
  });

  const projects = Array.isArray(departmentProjects) ? departmentProjects : [];
  const tasks = Array.isArray(departmentTasks) ? departmentTasks : [];
  const membersCount = Array.isArray(department?.users) ? department.users.length : 0;

  const handleDelete = async () => {
    if (!departmentId) return;
    if (!confirm('Delete this department?')) return;

    try {
      await deleteDepartment(String(departmentId)).unwrap();
      toast.success('Department deleted successfully');
      navigate('/departments');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete department');
    }
  };

  if (isLoading) {
    return <FullPageLoader text="Loading department details..." />;
  }

  if (isError || !department) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Department not found</h3>
          <p className="text-muted-foreground mb-4">The department you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/departments')} className="mt-4">Back to Departments</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-6">
        <DepartmentHeader
          department={department}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onBack={() => navigate('/departments')}
        />

        <DepartmentDescription description={department.description} />

        <DepartmentDetailsGrid
          department={department}
          projectsCount={projects.length}
          tasksCount={tasks.length}
          membersCount={membersCount}
        />

        <div className="grid gap-4 sm:gap-6 grid-cols-1">
          <DepartmentProjects projects={departmentProjects} onProjectClick={(projectId) => navigate(`/projects/${projectId}`)} />
          <DepartmentTasks tasks={departmentTasks} onTaskClick={(taskId) => navigate(`/tasks/${taskId}`)} />
        </div>
      </div>

      <DepartmentFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingDepartment={department}
      />
    </>
  );
}
