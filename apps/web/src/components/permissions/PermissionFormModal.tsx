import { zodResolver } from '@hookform/resolvers/zod';
import { Key } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useCreatePermissionMutation, useUpdatePermissionMutation } from '../../store/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';

const createPermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
});

const editPermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
});

type PermissionFormData = z.infer<typeof createPermissionSchema>;
type EditPermissionFormData = z.infer<typeof editPermissionSchema>;

interface PermissionFormModalProps {
  open: boolean;
  onClose: () => void;
  editingPermission: any | null;
}

const resources = [
  'users',
  'tasks',
  'divisions',
  'departments',
  'designations',
  'roles',
  'permissions',
  'organizations',
  'projects',
  'comments',
  'attachments',
];

const actions = ['create', 'read', 'update', 'delete', 'manage', 'assign', 'export', 'import'];

export default function PermissionFormModal({
  open,
  onClose,
  editingPermission,
}: PermissionFormModalProps) {
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditPermissionFormData>({
    resolver: zodResolver(editPermissionSchema),
    defaultValues: {
      name: '',
      description: '',
      resource: '',
      action: '',
    },
  });

  useEffect(() => {
    if (editingPermission) {
      reset({
        name: editingPermission.name,
        description: editingPermission.description,
        resource: editingPermission.resource,
        action: editingPermission.action,
      });
      return;
    }

    reset({
      name: '',
      description: '',
      resource: '',
      action: '',
    });
  }, [editingPermission, reset]);

  const onSubmit = async (data: EditPermissionFormData) => {
    try {
      if (editingPermission) {
        await updatePermission({
          id: editingPermission.id.toString(),
          ...data,
        }).unwrap();
        toast.success('Permission updated successfully');
      } else {
        await createPermission(data as PermissionFormData).unwrap();
        toast.success('Permission created successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.data?.message || `Failed to ${editingPermission ? 'update' : 'create'} permission`;
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
      title={editingPermission ? 'Edit Permission' : 'Create New Permission'}
      description={
        editingPermission
          ? 'Update permission details.'
          : 'Add a new permission to the system.'
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting
              ? editingPermission
                ? 'Updating...'
                : 'Creating...'
              : editingPermission
                ? 'Update Permission'
                : 'Create Permission'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Permission Name *</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register('name')} className="pl-10" placeholder="Create User" />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register('description')}
            id="description"
            rows={2}
            placeholder="Allows creating new users in the system"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resource">Resource *</Label>
          <select
            {...register('resource')}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Select a resource</option>
            {resources.map((resource) => (
              <option key={resource} value={resource}>
                {resource.charAt(0).toUpperCase() + resource.slice(1)}
              </option>
            ))}
          </select>
          {errors.resource && <p className="text-sm text-destructive">{errors.resource.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">Action *</Label>
          <select
            {...register('action')}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Select an action</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </option>
            ))}
          </select>
          {errors.action && <p className="text-sm text-destructive">{errors.action.message}</p>}
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
