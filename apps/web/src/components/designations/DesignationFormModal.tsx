import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck } from 'lucide-react';
import { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  useCreateDesignationMutation,
  useGetDepartmentsListQuery,
  useUpdateDesignationMutation,
} from '../../store/api';
import { useAppSelector } from '../../store/hooks';

const editDesignationSchema = z.object({
  name: z.string().min(1, 'Designation name is required'),
  description: z.string().optional(),
  department_id: z.string().optional(),
});

type EditDesignationFormData = z.infer<typeof editDesignationSchema>;

interface DesignationFormModalProps {
  open: boolean;
  onClose: () => void;
  editingDesignation: any | null;
}

export default function DesignationFormModal({ open, onClose, editingDesignation }: DesignationFormModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id;

  const { data: departmentsData } = useGetDepartmentsListQuery(
    organizationId ? String(organizationId) : undefined
  );

  const [createDesignation] = useCreateDesignationMutation();
  const [updateDesignation] = useUpdateDesignationMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditDesignationFormData>({
    resolver: zodResolver(editDesignationSchema),
  });

  useEffect(() => {
    if (editingDesignation) {
      reset({
        name: editingDesignation.name,
        description: editingDesignation.description,
        department_id: editingDesignation.department_id?.toString(),
      });
    } else {
      reset({ name: '', description: '', department_id: undefined });
    }
  }, [editingDesignation, reset]);

  const onSubmit = async (data: EditDesignationFormData) => {
    try {
      const submitData = {
        ...data,
        organization_id: organizationId,
        department_id: data.department_id ? Number(data.department_id) : undefined,
      };

      if (editingDesignation) {
        await updateDesignation({
          id: editingDesignation.id.toString(),
          name: data.name,
          description: data.description,
          organization_id: organizationId,
          department_id: data.department_id ? Number(data.department_id) : undefined,
        } as any).unwrap();
        toast.success('Designation updated successfully');
      } else {
        await createDesignation(submitData as any).unwrap();
        toast.success('Designation created successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage = error.data?.message || `Failed to ${editingDesignation ? 'update' : 'create'} designation`;
      toast.error(errorMessage);
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={onClose}
        title={editingDesignation ? 'Edit Designation' : 'Create New Designation'}
        description={editingDesignation
          ? 'Update designation information.'
          : 'Add a new designation to your organization.'}
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting
                ? (editingDesignation ? 'Updating...' : 'Creating...')
                : (editingDesignation ? 'Update Designation' : 'Create Designation')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Designation Name *</Label>
            <div className="relative">
              <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('name')}
                className="pl-10"
                placeholder="Software Engineer"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register('description')}
              id="description"
              rows={3}
              placeholder="Engineering role for software development team"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label htmlFor="department_id">Department (Optional)</Label>
            <Controller
              name="department_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {departmentsData?.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department_id && (
              <p className="text-sm text-destructive">{errors.department_id.message}</p>
            )}
          </div>

          {/* Form Errors */}
          {errors.root && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.root.message}</p>
            </div>
          )}
        </form>
      </Modal>
    </Fragment>
  );
}
