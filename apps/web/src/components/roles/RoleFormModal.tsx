import { zodResolver } from '@hookform/resolvers/zod';
import { Shield } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useCreateRoleMutation, useUpdateRoleMutation } from '../../store/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';

const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
});

const editRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof createRoleSchema>;
type EditRoleFormData = z.infer<typeof editRoleSchema>;

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  editingRole: any | null;
}

export default function RoleFormModal({ open, onClose, editingRole }: RoleFormModalProps) {
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
  });

  useEffect(() => {
    if (editingRole) {
      reset({
        name: editingRole.name,
        description: editingRole.description,
      });
      return;
    }

    reset({
      name: '',
      description: '',
    });
  }, [editingRole, reset]);

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.id.toString(),
          name: data.name,
          description: data.description,
        }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole(data as RoleFormData).unwrap();
        toast.success('Role created successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.data?.message || `Failed to ${editingRole ? 'update' : 'create'} role`;
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
      title={editingRole ? 'Edit Role' : 'Create New Role'}
      description={
        editingRole
          ? 'Update role information and permissions.'
          : 'Add a new role to your organization.'
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting
              ? editingRole
                ? 'Updating...'
                : 'Creating...'
              : editingRole
                ? 'Update Role'
                : 'Create Role'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name *</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register('name')} className="pl-10" placeholder="Administrator" />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register('description')}
            id="description"
            rows={3}
            placeholder="Full system administrator with all permissions"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{errors.root.message}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
