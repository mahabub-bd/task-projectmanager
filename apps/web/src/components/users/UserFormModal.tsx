import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, Shield, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  useCreateUserMutation,
  useGetDepartmentsListQuery,
  useGetDesignationsListQuery,
  useGetRolesQuery,
  useSetUserRolesMutation,
  useUpdateUserMutation,
} from '../../store/api';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department_id: z.number().optional(),
  designation_id: z.number().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  role_ids: z.array(z.number()).optional(),
});

const editUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  department_id: z.number().optional(),
  designation_id: z.number().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  role_ids: z.array(z.number()).optional(),
});

type UserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  editingUser: any | null;
}

export default function UserFormModal({ open, onClose, editingUser }: UserFormModalProps) {
  const [formSelectedRoles, setFormSelectedRoles] = useState<number[]>([]);
  const { data: departmentsData } = useGetDepartmentsListQuery(undefined);
  const { data: designationsData } = useGetDesignationsListQuery(undefined);
  const { data: rolesData } = useGetRolesQuery(undefined);
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [setUserRoles] = useSetUserRolesMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      status: 'pending',
    },
  });

  // Update form when editingUser changes
  useEffect(() => {
    if (editingUser) {
      const userRoleIds = editingUser.user_roles?.map((ur: any) => ur.role.id) || [];
      setFormSelectedRoles(userRoleIds);
      reset({
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        department_id: editingUser.department_id,
        designation_id: editingUser.designation_id,
        address: editingUser.address || '',
        status: editingUser.status,
      });
    } else {
      setFormSelectedRoles([]);
      reset({
        name: '',
        email: '',
        password: '',
        department_id: undefined,
        designation_id: undefined,
        address: '',
        status: 'pending',
      });
    }
  }, [editingUser, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      let userId: string;

      if (editingUser) {
        const updateData: any = {
          name: data.name,
          email: data.email,
          department_id: data.department_id,
          designation_id: data.designation_id,
          address: data.address || undefined,
          status: data.status,
        };
        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
        }
        await updateUser({
          id: editingUser.id.toString(),
          ...updateData,
        }).unwrap();
        userId = editingUser.id.toString();
        toast.success('User updated successfully');
      } else {
        const result = await createUser(data as UserFormData).unwrap();
        userId = result.data.id.toString();
        toast.success('User created successfully');
      }

      if (formSelectedRoles.length > 0) {
        await setUserRoles({
          userId,
          roleIds: formSelectedRoles,
        }).unwrap();
        toast.success('Roles assigned successfully');
      }

      reset();
      onClose();
    } catch (error: any) {
      const errorMessage = error.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`;
      toast.error(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const toggleRole = (roleId: number) => {
    setFormSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingUser ? 'Edit User' : 'Create New User'}
      description={editingUser ? 'Update user information and permissions.' : 'Add a new user to your organization.'}
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
              ? (editingUser ? 'Updating...' : 'Creating...')
              : (editingUser ? 'Update User' : 'Create User')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            {...register('name')}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              className="pl-10"
              placeholder="user@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
          </Label>
          <Input
            {...register('password')}
            type="password"
            placeholder={editingUser ? '••••••••' : '••••••••'}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
          {editingUser && (
            <p className="text-xs text-muted-foreground">
              Only enter a new password if you want to change it
            </p>
          )}
        </div>

        {/* Department Field */}
        <div className="space-y-2">
          <Label htmlFor="department_id">Department</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <select
              {...register('department_id', { valueAsNumber: true })}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 pl-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">No Department</option>
              {departmentsData?.map((dept: any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {errors.department_id && (
            <p className="text-sm text-destructive">{errors.department_id.message}</p>
          )}
        </div>

        {/* Designation Field */}
        <div className="space-y-2">
          <Label htmlFor="designation_id">Designation</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <select
              {...register('designation_id', { valueAsNumber: true })}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 pl-10 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">No Designation</option>
              {designationsData?.map((designation: any) => (
                <option key={designation.id} value={designation.id}>
                  {designation.name}
                </option>
              ))}
            </select>
          </div>
          {errors.designation_id && (
            <p className="text-sm text-destructive">{errors.designation_id.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            {...register('address')}
            placeholder="123 Main St, City, Country"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            {...register('status')}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        {/* Roles Field */}
        {rolesData && (Array.isArray(rolesData) ? rolesData : rolesData.data)?.length > 0 ? (
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2 bg-muted/20">
              {(Array.isArray(rolesData) ? rolesData : rolesData.data).map((role: any) => {
                const isSelected = formSelectedRoles.includes(role.id);
                return (
                  <label
                    key={role.id}
                    className={`flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-accent' : ''
                      }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{role.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {formSelectedRoles.length} role{formSelectedRoles.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Roles</Label>
            <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/20">
              No roles available. Create roles first to assign them to users.
            </p>
          </div>
        )}

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
