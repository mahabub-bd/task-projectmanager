import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGetProjectsListQuery } from '../../store/api';
import { useAppSelector } from '../../store/hooks';

export const taskEditSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['draft', 'open', 'in_progress', 'review', 'completed', 'closed']),
  due_date: z.string().optional().nullable().or(z.literal('')),
  progress: z.number().min(0).max(100).optional(),
  project_id: z.string().optional(),
});

export type TaskEditFormValues = z.infer<typeof taskEditSchema>;

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: any;
  onSubmit: (data: TaskEditFormValues) => void;
  isLoading?: boolean;
}

export default function TaskEditModal({ open, onClose, task, onSubmit, isLoading }: TaskEditModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));
  const { data: projects } = useGetProjectsListQuery(
    organizationId ? String(organizationId) : '',
  );

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskEditFormValues>({
    resolver: zodResolver(taskEditSchema),
  });

  const watchedProjectId = watch('project_id');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        progress: task.progress || 0,
        project_id: task.project_id ? String(task.project_id) : '',
      });
    }
  }, [task, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 rounded-md border bg-background text-sm"
              placeholder="Task title"
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 rounded-md border bg-background text-sm"
              placeholder="Task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 rounded-md border bg-background text-sm">
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select {...register('priority')} className="w-full px-3 py-2 rounded-md border bg-background text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full px-3 py-2 rounded-md border bg-background text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Progress ({task?.progress || 0}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              {...register('progress', { valueAsNumber: true })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <Select
              value={watchedProjectId || 'none'}
              onValueChange={(value) =>
                setValue('project_id', value === 'none' ? '' : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                {projects && projects.length > 0 ? (
                  projects.map((project: any) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No projects available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
