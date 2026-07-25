import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getTagTextColor } from './utils/tasks-page.utils';

interface TaskCreateModalProps {
  open: boolean;
  onClose: () => void;
  initialTask?: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    project_id?: string;
    tag_ids?: number[];
  };
  onSubmit: (data: TaskFormData) => void;
  isSaving: boolean;
  newTagName: string;
  setNewTagName: React.Dispatch<React.SetStateAction<string>>;
  onCreateTag: () => void;
  isCreatingTag: boolean;
  selectedTags: any[];
  availableTags: any[];
  projects: any[];
  onToggleTag: (tagId: number) => void;
}

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'open', 'in_progress', 'review', 'completed', 'closed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().optional(),
  project_id: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export default function TaskCreateModal({
  open,
  onClose,
  initialTask,
  onSubmit,
  isSaving,
  newTagName,
  setNewTagName,
  onCreateTag,
  isCreatingTag,
  selectedTags = [],
  availableTags = [],
  projects = [],
  onToggleTag,
}: TaskCreateModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'draft',
      priority: 'medium',
      due_date: '',
      project_id: '',
    },
  });

  const dueDateValue = watch('due_date');

  useEffect(() => {
    if (initialTask) {
      reset({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: (initialTask.status || 'draft') as any,
        priority: (initialTask.priority || 'medium') as any,
        due_date: initialTask.due_date || '',
        project_id: initialTask.project_id || '',
      });
    } else {
      reset();
    }
  }, [initialTask, reset, open]);

  const onFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialTask ? 'Edit Task' : 'Create New Task'}
      description={initialTask ? 'Update task details' : 'Add a new task to the project workspace'}
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Task title"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Task description"
            rows={4}
            className="mt-2"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as any)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={watch('priority')}
              onValueChange={(value) => setValue('priority', value as any)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <DatePicker
            value={dueDateValue ? new Date(dueDateValue) : undefined}
            onChange={(date) => {
              if (date) {
                setValue('due_date', format(date, 'yyyy-MM-dd'));
              }
            }}
            placeholder="Pick a due date"
            className="mt-2"
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-destructive">{errors.due_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="project_id">Project</Label>
          <Select
            value={watch('project_id') || 'none'}
            onValueChange={(value) =>
              setValue('project_id', value === 'none' ? '' : value)
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a project (optional)" />
            </SelectTrigger>
            <SelectContent>
              {projects?.length > 0 ? (
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
          {errors.project_id && (
            <p className="mt-1 text-sm text-destructive">{errors.project_id.message}</p>
          )}
        </div>

        <div>
          <Label>Tags</Label>

          {selectedTags?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedTags.map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="gap-1 py-1 pl-2 pr-1"
                  style={{
                    backgroundColor: tag.color || '#e5e7eb',
                    color: getTagTextColor(tag.color),
                  }}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => onToggleTag(tag.id)}
                    className="rounded-full p-0.5 hover:bg-black/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="mb-3 flex gap-2">
            <Input
              value={newTagName}
              onChange={(event) => setNewTagName(event.target.value)}
              placeholder="Create or select a tag"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onCreateTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={onCreateTag} disabled={isCreatingTag}>
              {isCreatingTag ? 'Adding...' : 'Add Tag'}
            </Button>
          </div>

          <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-md border p-3">
            {availableTags?.length > 0 ? (
              availableTags.map((tag: any) => {
                const isSelected = selectedTags?.some((t: any) => t.id === tag.id);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onToggleTag(tag.id)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No tags available yet.</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
