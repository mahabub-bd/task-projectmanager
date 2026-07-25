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

interface PhaseFormModalProps {
  open: boolean;
  onClose: () => void;
  initialPhase?: {
    name?: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    due_date?: string;
    progress?: number;
    color?: string;
  };
  onSubmit: (data: PhaseFormData) => void;
  isSaving: boolean;
  projectId: string;
  organizationId: string;
}

export const phaseFormSchema = z.object({
  name: z.string().min(1, 'Phase name is required'),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  due_date: z.string().optional(),
  progress: z.number().min(0).max(100),
  color: z.string(),
  order: z.number().min(0).optional(),
});

export type PhaseFormData = z.infer<typeof phaseFormSchema>;

const phaseColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

export default function PhaseFormModal({
  open,
  onClose,
  initialPhase,
  onSubmit,
  isSaving,
  projectId,
  organizationId,
}: PhaseFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PhaseFormData>({
    resolver: zodResolver(phaseFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'not_started',
      start_date: '',
      end_date: '',
      due_date: '',
      progress: 0,
      color: '#3b82f6',
      order: 0,
    },
  });

  const selectedColor = watch('color');
  const progress = watch('progress');
  const startDateValue = watch('start_date');
  const endDateValue = watch('end_date');
  const dueDateValue = watch('due_date');

  useEffect(() => {
    if (initialPhase) {
      const formatDate = (date: any) => {
        if (!date) return '';
        if (typeof date === 'string') {
          return date.split('T')[0];
        }
        if (date instanceof Date) {
          return format(date, 'yyyy-MM-dd');
        }
        return '';
      };

      reset({
        name: initialPhase.name || '',
        description: initialPhase.description || '',
        status: (initialPhase.status || 'not_started') as any,
        start_date: formatDate(initialPhase.start_date),
        end_date: formatDate(initialPhase.end_date),
        due_date: formatDate(initialPhase.due_date),
        progress: initialPhase.progress || 0,
        color: initialPhase.color || '#3b82f6',
        order: initialPhase.order || 0,
      });
    } else {
      reset();
    }
  }, [initialPhase, reset, open]);

  const onFormSubmit = (data: PhaseFormData) => {
    const submitData = {
      ...data,
      project_id: Number(projectId),
      organization_id: Number(organizationId),
    };
    onSubmit(submitData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialPhase ? 'Edit Phase' : 'Create New Phase'}
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="phase-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialPhase ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="phase-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Phase name"
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
            placeholder="Phase description"
            rows={3}
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
            {phaseColors.map((color) => (
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
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            {...register('order', { valueAsNumber: true })}
            placeholder="Phase order within project"
            className="mt-2"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-destructive">{errors.order.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
