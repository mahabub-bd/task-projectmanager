import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-toastify';
import { z } from 'zod';
import {
  useCreateDivisionMutation,
  useGetDivisionsListQuery,
  useUpdateDivisionMutation,
} from '../../store/api';
import { useAppSelector } from '../../store/hooks';

const editDivisionSchema = z.object({
  name: z.string().min(1, 'Division name is required'),
  description: z.string().optional(),
  parent_division_id: z.string().optional(),
});

type EditDivisionFormData = z.infer<typeof editDivisionSchema>;

interface DivisionFormModalProps {
  open: boolean;
  onClose: () => void;
  editingDivision: any | null;
}

export default function DivisionFormModal({ open, onClose, editingDivision }: DivisionFormModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id;

  const { data: divisionsData } = useGetDivisionsListQuery(
    organizationId ? String(organizationId) : undefined
  );

  const [createDivision] = useCreateDivisionMutation();
  const [updateDivision] = useUpdateDivisionMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditDivisionFormData>({
    resolver: zodResolver(editDivisionSchema),
  });

  // Update form when editingDivision changes
  useEffect(() => {
    if (editingDivision) {
      reset({
        name: editingDivision.name,
        description: editingDivision.description,
        parent_division_id: editingDivision.parent_division_id?.toString() || undefined,
      });
    } else {
      reset({
        name: '',
        description: '',
        parent_division_id: undefined,
      });
    }
  }, [editingDivision, reset]);

  const onSubmit = async (data: EditDivisionFormData) => {
    try {
      // Convert parent_division_id: "none" means no parent (null), otherwise convert to number
      const parentValue = data.parent_division_id === 'none' || !data.parent_division_id
        ? null
        : Number(data.parent_division_id);

      if (editingDivision) {
        await updateDivision({
          id: editingDivision.id.toString(),
          name: data.name,
          description: data.description,
          organization_id: organizationId,
          parent_division_id: parentValue,
        }).unwrap();
        toast.success('Division updated successfully');
      } else {
        await createDivision({
          name: data.name,
          description: data.description,
          organization_id: organizationId,
          parent_division_id: parentValue,
        } as any).unwrap();
        toast.success('Division created successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage = error.data?.message || `Failed to ${editingDivision ? 'update' : 'create'} division`;
      toast.error(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingDivision ? 'Edit Division' : 'Create New Division'}
      description={editingDivision
        ? 'Update division information and organizational structure.'
        : 'Add a new division to your organization.'}
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
              ? (editingDivision ? 'Updating...' : 'Creating...')
              : (editingDivision ? 'Update Division' : 'Create Division')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Division Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('name')}
              className="pl-10"
              placeholder="North America Operations"
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
            placeholder="All operations and departments in North America"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Parent Division Field */}
        <div className="space-y-2">
          <Label htmlFor="parent_division_id">Parent Division (Optional)</Label>
          <Controller
            name="parent_division_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(value) => {
                  field.onChange(value === "none" ? undefined : value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No Parent (Root Division)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root Division)</SelectItem>
                  {divisionsData
                    ?.filter((div: any) => div.id !== editingDivision?.id)
                    .map((div: any) => (
                      <SelectItem key={div.id} value={div.id.toString()}>
                        {div.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.parent_division_id && (
            <p className="text-sm text-destructive">{errors.parent_division_id.message}</p>
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
  );
}
