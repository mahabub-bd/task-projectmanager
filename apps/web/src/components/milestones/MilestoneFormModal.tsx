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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface MilestoneFormModalProps {
  open: boolean;
  onClose: () => void;
  initialMilestone?: {
    name?: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    due_date?: string;
    progress?: number;
    color?: string;
    project_id?: string;
  };
  onSubmit: (data: MilestoneFormData) => void;
  isSaving: boolean;
  projects?: any[];
}

export const milestoneFormSchema = z.object({
  name: z.string().min(1, 'Milestone name is required'),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  due_date: z.string().optional(),
  progress: z.number().min(0).max(100),
  color: z.string(),
  project_id: z.string().optional(),
});

export type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

const milestoneColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

export default function MilestoneFormModal({
  open,
  onClose,
  initialMilestone,
  onSubmit,
  isSaving,
  projects = [],
}: MilestoneFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'not_started',
      start_date: '',
      end_date: '',
      due_date: '',
      progress: 0,
      color: '#3b82f6',
      project_id: '',
    },
  });

  const selectedColor = watch('color');
  const progress = watch('progress');
  const startDateValue = watch('start_date');
  const endDateValue = watch('end_date');
  const dueDateValue = watch('due_date');

  useEffect(() => {
    if (initialMilestone) {
      // Convert dates to yyyy-MM-dd format for the form
      const formatDate = (date: any) => {
        if (!date) return '';
        // Handle ISO string dates from API
        if (typeof date === 'string') {
          return date.split('T')[0]; // Extract yyyy-MM-dd from ISO string
        }
        // Handle Date objects
        if (date instanceof Date) {
          return format(date, 'yyyy-MM-dd');
        }
        return '';
      };

      reset({
        name: initialMilestone.name || '',
        description: initialMilestone.description || '',
        status: (initialMilestone.status || 'not_started') as any,
        start_date: formatDate(initialMilestone.start_date),
        end_date: formatDate(initialMilestone.end_date),
        due_date: formatDate(initialMilestone.due_date),
        progress: initialMilestone.progress || 0,
        color: initialMilestone.color || '#3b82f6',
        project_id: initialMilestone.project_id ? String(initialMilestone.project_id) : '',
      });
    } else {
      reset();
    }
  }, [initialMilestone, reset, open]);

  const onFormSubmit = (data: MilestoneFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialMilestone ? 'Edit Milestone' : 'Create New Milestone'}
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="milestone-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialMilestone ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="milestone-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Milestone name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Milestone description"
            rows={3}
            className="mt-2"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
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
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="progress">
              Progress ({progress}%)
            </Label>
            <input
              {...register('progress', { valueAsNumber: true })}
              type="range"
              min="0"
              max="100"
              className="w-full mt-2"
            />
            {errors.progress && (
              <p className="mt-1 text-sm text-destructive">{errors.progress.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <DatePicker
              value={startDateValue ? new Date(startDateValue) : undefined}
              onChange={(date) => {
                if (date) {
                  setValue('start_date', format(date, 'yyyy-MM-dd'));
                } else {
                  setValue('start_date', '');
                }
              }}
              placeholder="Pick a date"
              className="mt-2"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-destructive">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="end_date">End Date</Label>
            <DatePicker
              value={endDateValue ? new Date(endDateValue) : undefined}
              onChange={(date) => {
                if (date) {
                  setValue('end_date', format(date, 'yyyy-MM-dd'));
                } else {
                  setValue('end_date', '');
                }
              }}
              placeholder="Pick a date"
              className="mt-2"
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-destructive">{errors.end_date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <DatePicker
              value={dueDateValue ? new Date(dueDateValue) : undefined}
              onChange={(date) => {
                if (date) {
                  setValue('due_date', format(date, 'yyyy-MM-dd'));
                } else {
                  setValue('due_date', '');
                }
              }}
              placeholder="Pick a date"
              className="mt-2"
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-destructive">{errors.due_date.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {milestoneColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-primary scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && (
            <p className="mt-1 text-sm text-destructive">{errors.color.message}</p>
          )}
        </div>

        <input type="hidden" {...register('color')} />

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
          {errors.project_id && (
            <p className="mt-1 text-sm text-destructive">{errors.project_id.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
