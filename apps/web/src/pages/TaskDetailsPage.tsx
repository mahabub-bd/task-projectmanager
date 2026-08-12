import { FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ActionBar from '@/components/ui/ActionBar';
import TaskActivityTimeline from '../components/tasks/TaskActivityTimeline';
import TaskAssignModal from '../components/tasks/TaskAssignModal';
import TaskComments from '../components/tasks/TaskComments';
import TaskDetailsGrid from '../components/tasks/TaskDetailsGrid';
import TaskEditModal, { TaskEditFormValues } from '../components/tasks/TaskEditModal';
import TaskOverview from '../components/tasks/TaskOverview';
import TaskTags from '../components/tasks/TaskTags';
import { Button } from '../components/ui/button';
import { FullPageLoader } from '../components/ui/loading-spinner';
import {
  useCreateTagMutation,
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useDeleteTaskMutation,
  useGetTagsQuery,
  useGetTaskCommentsQuery,
  useGetTaskQuery,
  useUpdateTaskCommentMutation,
  useUpdateTaskMutation,
} from '../store/api';
import { useAppSelector } from '../store/hooks';

const getAssignedUsers = (task: any) => {
  const assignmentUsers = Array.isArray(task?.assignments)
    ? task.assignments
      .map((assignment: any) => assignment?.user)
      .filter(Boolean)
    : [];

  if (assignmentUsers.length > 0) {
    return assignmentUsers.filter(
      (user: any, index: number, users: any[]) =>
        index === users.findIndex((candidate: any) => candidate?.id === user?.id)
    );
  }

  return task?.assigned_to_user ? [task.assigned_to_user] : [];
};

const getTaskTags = (task: any) => {
  if (!Array.isArray(task?.tags)) return [];

  return task.tags
    .map((taskTag: any) => {
      if (taskTag?.tag) {
        return {
          id: taskTag.tag.id,
          name: taskTag.tag.name,
          color: taskTag.tag.color,
        };
      }

      return taskTag?.id
        ? {
          id: taskTag.id,
          name: taskTag.name,
          color: taskTag.color,
        }
        : null;
    })
    .filter(Boolean);
};

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id;
  const { data: tagsData } = useGetTagsQuery(organizationId ? { organization_id: String(organizationId) } : undefined);
  const [createTag] = useCreateTagMutation();

  const { refetch: refetchComments } = useGetTaskCommentsQuery(taskId!, {
    skip: !taskId,
  });
  const [createComment] = useCreateTaskCommentMutation();
  const [updateComment] = useUpdateTaskCommentMutation();
  const [deleteComment] = useDeleteTaskCommentMutation();

  const { data: task, isLoading, isError, refetch } = useGetTaskQuery(taskId!, { skip: !taskId });

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const assignedUsers = getAssignedUsers(task);
  const taskTags = getTaskTags(task);

  const handleUpdateTask = async (data: TaskEditFormValues) => {
    if (!taskId) return;
    setIsUpdating(true);
    try {
      await updateTask({
        id: taskId,
        ...data,
        due_date: data.due_date || undefined,
        project_id: data.project_id ? Number(data.project_id) : undefined,
      }).unwrap();
      toast.success('Task updated');
      setShowEditModal(false);
      refetch();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId || !confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId).unwrap();
      toast.success('Task deleted');
      navigate('/tasks');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!taskId) return;
    try {
      await updateTask({ id: taskId, status: status as any }).unwrap();
      toast.success('Status updated');
      await refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddTag = async () => {
    if (!taskId || !newTag.trim()) return;

    if (!organizationId) {
      toast.error('Organization ID is required to create tags');
      return;
    }

    const allTags = tagsData?.data || [];
    const existingTag = allTags.find((t: any) => t.name.toLowerCase() === newTag.toLowerCase());

    let tagId: number;

    if (existingTag) {
      tagId = existingTag.id;
    } else {
      try {
        const createdTag = await createTag({
          name: newTag.trim(),
          color: getRandomColor(),
          organization_id: Number(organizationId),
        }).unwrap();
        tagId = createdTag.data?.id || createdTag.id;
      } catch (error: any) {
        console.error('Tag creation error:', error);
        toast.error(error?.data?.message?.[0] || 'Failed to create tag');
        return;
      }
    }

    const currentTagIds = taskTags.map((tag: any) => tag.id);
    const updatedTagIds = [...currentTagIds, tagId];

    try {
      await updateTask({ id: taskId, tag_ids: updatedTagIds }).unwrap();
      toast.success('Tag added');
      setNewTag('');
      await refetch();
    } catch {
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!taskId) return;

    const currentTagIds = taskTags.map((tag: any) => tag.id);
    const updatedTagIds = currentTagIds.filter((id: number) => id !== tagId);

    try {
      await updateTask({ id: taskId, tag_ids: updatedTagIds }).unwrap();
      toast.success('Tag removed');
      await refetch();
    } catch {
      toast.error('Failed to remove tag');
    }
  };

  const getRandomColor = () => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateComment = async (mentions?: number[]) => {
    if (!taskId || !newComment.trim()) return;
    try {
      await createComment({ taskId, content: newComment.trim(), mentions }).unwrap();
      setNewComment('');
      toast.success('Comment added');
      refetchComments();
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !taskId) return;
    try {
      await updateComment({
        taskId,
        commentId: editingComment.id.toString(),
        content: editingComment.content.trim(),
      }).unwrap();
      setEditingComment(null);
      toast.success('Comment updated');
      refetchComments();
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!taskId) return;
    try {
      await deleteComment({ taskId, commentId: commentId.toString() }).unwrap();
      toast.success('Comment deleted');
      refetchComments();
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const canEditOrDelete = (comment: any) => {
    if (!user) return false;
    return user.id === comment.user?.id || (user.roles?.some((role: any) => role.name === 'admin' || role.name === 'superadmin') ?? false);
  };

  const isOverdue = task?.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed' && task.status !== 'closed';

  if (isLoading) {
    return <FullPageLoader text="Loading task details..." />;
  }

  if (isError || !task) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Task not found</h3>
          <p className="text-muted-foreground mb-4">The task you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/tasks')} className="mt-4">Back to Tasks</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto space-y-6">
        <ActionBar
          onAssign={() => setShowAssignModal(true)}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDeleteTask}
          onBack={() => navigate('/tasks')}
        />

        <TaskOverview
          title={task.title}
          description={task.description}
          status={task.status}
          priority={task.priority}
          progress={task.progress || 0}
          color={task.color}
          isOverdue={isOverdue}
        />

        <TaskTags
          taskTags={taskTags}
          newTag={newTag}
          showTagInput={showTagInput}
          setNewTag={setNewTag}
          setShowTagInput={setShowTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        <TaskDetailsGrid
          task={task}
          assignedUsers={assignedUsers}
          isOverdue={isOverdue}
          onStatusChange={handleStatusChange}
        />

        <TaskComments
          task={task}
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          onCreateComment={handleCreateComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          canEditOrDelete={canEditOrDelete}
          onRefetchTask={() => refetch()}
          onRefetchComments={() => refetchComments()}
        />

        <TaskActivityTimeline
          statusHistory={task.status_history || []}
          onRefresh={() => refetch()}
        />
      </div>

      <TaskEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onSubmit={handleUpdateTask}
        isLoading={isUpdating}
      />

      <TaskAssignModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        taskId={taskId || null}
        taskTitle={task.title}
        currentAssignments={task.assignments?.map((a: any) => a.user_id) || []}
      />
    </>
  );
}
