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
import { useGetDepartmentsListQuery, useGetUsersByDepartmentQuery } from '@/store/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  editingProject: any | null;
  onSubmit: (data: ProjectFormData) => void;
  isSaving: boolean;
  managerOptions: any[];
}

export const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'completed', 'on_hold', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  budget: z.string().optional(),
  manager_id: z.string().optional(),
  color: z.string(),
  progress: z.number().min(0).max(100),
  members: z.array(z.object({
    user_id: z.number().optional(),
    department_id: z.number().optional(),
    role: z.enum(['lead', 'member', 'viewer']),
  })).optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

const projectColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'
];

export default function ProjectFormModal({
  open,
  onClose,
  editingProject,
  onSubmit,
  isSaving,
  managerOptions,
}: ProjectFormModalProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [membersList, setMembersList] = useState<Array<{
    user_id?: number;
    department_id?: number;
    role: 'lead' | 'member' | 'viewer';
  }>>([]);

  const { data: departmentsResponse } = useGetDepartmentsListQuery(undefined);
  const { data: departmentUsers } = useGetUsersByDepartmentQuery(
    selectedDepartment || '',
    { skip: !selectedDepartment }
  );

  const departments = departmentsResponse || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: '',
      due_date: '',
      budget: '',
      manager_id: '',
      color: '#3b82f6',
      progress: 0,
      members: [],
    },
  });

  const selectedColor = watch('color');
  const progress = watch('progress');
  const startDateValue = watch('start_date');
  const dueDateValue = watch('due_date');

  useEffect(() => {
    if (editingProject) {
      reset({
        name: editingProject.name || '',
        description: editingProject.description || '',
        status: editingProject.status || 'planning',
        priority: editingProject.priority || 'medium',
        start_date: editingProject.start_date || '',
        due_date: editingProject.due_date || '',
        budget: editingProject.budget || '',
        manager_id: editingProject.manager_id ? String(editingProject.manager_id) : '',
        color: editingProject.color || '#3b82f6',
        progress: editingProject.progress || 0,
        members: editingProject.members || [],
      });
      // Load existing members
      if (editingProject.members && Array.isArray(editingProject.members)) {
        setMembersList(editingProject.members.map((m: any) => ({
          user_id: m.user_id,
          department_id: m.department_id,
          role: m.role,
        })));
      }
    } else {
      reset();
      setMembersList([]);
    }
  }, [editingProject, reset, open]);

  const onFormSubmit = (data: ProjectFormData) => {
    const dataWithMembers = {
      ...data,
      members: membersList,
    };
    onSubmit(dataWithMembers);
  };

  const handleAddUser = (userId: number) => {
    if (selectedDepartment && !selectedUsers.includes(userId)) {
      const newMember = {
        user_id: userId,
        department_id: Number(selectedDepartment),
        role: 'member' as const,
      };
      setMembersList([...membersList, newMember]);
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembersList(membersList.filter((_, i) => i !== index));
  };

  const getMemberDisplayName = (member: any) => {
    if (member.user_id) {
      const user = departmentUsers?.find((u: any) => u.id === member.user_id);
      return user?.name || `User ${member.user_id}`;
    }
    const dept = departments.find((d: any) => d.id === member.department_id);
    return dept?.name || `Department ${member.department_id}`;
  };

  return (
    <Modal
      open={open}
      className='max-w-2xl'
      onClose={onClose}
      title={editingProject ? 'Edit Project' : 'Create New Project'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-form"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : editingProject ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Project name"
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
            placeholder="Project description"
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
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <DatePicker
              value={startDateValue ? new Date(startDateValue) : undefined}
              onChange={(date) => {
                if (date) {
                  setValue('start_date', format(date, 'yyyy-MM-dd'));
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
            <Label htmlFor="due_date">Due Date</Label>
            <DatePicker
              value={dueDateValue ? new Date(dueDateValue) : undefined}
              onChange={(date) => {
                if (date) {
                  setValue('due_date', format(date, 'yyyy-MM-dd'));
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
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            {...register('budget')}
            placeholder="Project budget"
            className={errors.budget ? 'border-destructive' : ''}
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="manager_id">Project Manager</Label>
          <Select
            value={watch('manager_id') || 'none'}
            onValueChange={(value) =>
              setValue('manager_id', value === 'none' ? '' : value)
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a project manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No manager assigned</SelectItem>
              {managerOptions.map((manager: any) => (
                <SelectItem key={manager.id} value={String(manager.id)}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.manager_id && (
            <p className="mt-1 text-sm text-destructive">{errors.manager_id.message}</p>
          )}
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="department">Add Team Members</Label>
            <div className="flex gap-2 mt-2">
              <Select
                value={selectedDepartment || ''}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setSelectedUsers([]);
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDepartment && departmentUsers && departmentUsers.length > 0 && (
                <Select
                  value=""
                  onValueChange={(value) => handleAddUser(Number(value))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select users to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentUsers
                      .filter((user: any) => !selectedUsers.includes(user.id))
                      .map((user: any) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Members List */}
          {membersList.length > 0 && (
            <div className="space-y-2">
              <Label>Team Members ({membersList.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {membersList.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getMemberDisplayName(member)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({member.role})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {projectColors.map((color) => (
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
      </form>
    </Modal>
  );
}
