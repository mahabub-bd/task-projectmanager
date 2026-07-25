import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  useCreateDepartmentMutation,
  useGetDivisionsListQuery,
  useUpdateDepartmentMutation,
} from '../../store/api';
import { useAppSelector } from '../../store/hooks';
import DivisionFormModal from '../divisions/DivisionFormModal';

const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  division_id: z.string().optional(),
});

const editDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  division_id: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof createDepartmentSchema>;
type EditDepartmentFormData = z.infer<typeof editDepartmentSchema>;

interface DepartmentFormModalProps {
  open: boolean;
  onClose: () => void;
  editingDepartment: any | null;
}

export default function DepartmentFormModal({ open, onClose, editingDepartment }: DepartmentFormModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id;
  const [isDivisionFormOpen, setIsDivisionFormOpen] = useState(false);

  const { data: divisionsData } = useGetDivisionsListQuery(
    organizationId ? String(organizationId) : undefined
  );

  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditDepartmentFormData>({
    resolver: zodResolver(editDepartmentSchema),
  });

  // Update form when editingDepartment changes
  useEffect(() => {
    if (editingDepartment) {

      reset({
        name: editingDepartment.name,
        description: editingDepartment.description,
        division_id: editingDepartment.division_id?.toString(),
      });
    } else {
      reset({
        name: '',
        description: '',
        division_id: undefined,
      });
    }
  }, [editingDepartment, reset]);

  const onSubmit = async (data: EditDepartmentFormData) => {
    try {
      // Convert division_id to number or undefined
      const submitData = {
        ...data,
        organization_id: organizationId,
        division_id: data.division_id
          ? Number(data.division_id)
          : undefined,
      };

      if (editingDepartment) {
        await updateDepartment({
          id: editingDepartment.id.toString(),
          ...submitData,
        }).unwrap();
        toast.success('Department updated successfully');
      } else {
        await createDepartment(submitData as DepartmentFormData).unwrap();
        toast.success('Department created successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage = error.data?.message || `Failed to ${editingDepartment ? 'update' : 'create'} department`;
      toast.error(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <Fragment>
      <Modal
      open={open}
      onClose={onClose}
      title={editingDepartment ? 'Edit Department' : 'Create New Department'}
      description={editingDepartment
        ? 'Update department information and organizational structure.'
        : 'Add a new department to your organization.'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting
              ? (editingDepartment ? 'Updating...' : 'Creating...')
              : (editingDepartment ? 'Update Department' : 'Create Department')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Department Name *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('name')}
              className="pl-10"
              placeholder="Engineering"
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
            placeholder="Software development and engineering team"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Division Field */}
        <div className="space-y-2">
          <Label htmlFor="division_id">Division (Optional)</Label>
          <Controller
            name="division_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) => {
                  if (value === 'create_new') {
                    setIsDivisionFormOpen(true);
                  } else if (value === 'none') {
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Division</SelectItem>
                  <SelectItem value="create_new" className="font-semibold text-primary">
                    <div className="flex items-center gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Create New Division
                    </div>
                  </SelectItem>
                  {divisionsData?.map((div: any) => (
                    <SelectItem key={div.id} value={div.id.toString()}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.division_id && (
            <p className="text-sm text-destructive">{errors.division_id.message}</p>
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

    {/* Division Form Modal */}
    <DivisionFormModal
      open={isDivisionFormOpen}
      onClose={() => setIsDivisionFormOpen(false)}
      editingDivision={null}
    />
    </Fragment>
  );
}
