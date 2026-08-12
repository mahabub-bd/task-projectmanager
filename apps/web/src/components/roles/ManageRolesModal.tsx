import toast from 'react-toastify';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { useGetRolesQuery, useGetUserRolesQuery, useSetUserRolesMutation } from '../../store/api';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Modal } from '../ui/modal';

interface ManageRolesModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

export default function ManageRolesModal({ open, onClose, userId }: ManageRolesModalProps) {
  const [tempSelectedRoles, setTempSelectedRoles] = useState<number[]>([]);
  const { data: rolesData } = useGetRolesQuery(undefined);
  const { data: userRoles, isLoading: isLoadingRoles } = useGetUserRolesQuery(
    userId?.toString() ?? '',
    { skip: !userId },
  );
  const [setUserRoles] = useSetUserRolesMutation();

  const currentUserRoleIds = userRoles?.map((role: any) => role.id) || [];

  useEffect(() => {
    if (userId) {
      setTempSelectedRoles(currentUserRoleIds);
    }
  }, [userId, currentUserRoleIds]);

  const toggleTempRole = (roleId: number) => {
    setTempSelectedRoles((currentRoles) =>
      currentRoles.includes(roleId)
        ? currentRoles.filter((id) => id !== roleId)
        : [...currentRoles, roleId],
    );
  };

  const handleSaveRoles = async () => {
    if (!userId) return;

    try {
      await setUserRoles({
        userId: userId.toString(),
        roleIds: tempSelectedRoles,
      }).unwrap();
      toast.success('User roles updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update user roles');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage User Roles"
      description="Assign or remove roles for this user. Roles determine user permissions."
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveRoles}>Save Changes</Button>
        </>
      }
    >
      {isLoadingRoles ? (
        <div className="py-8 text-center text-muted-foreground">Loading roles...</div>
      ) : (
        <>
          <div className="max-h-96 space-y-1 overflow-y-auto rounded-md border bg-muted/20 p-4">
            {(Array.isArray(rolesData) ? rolesData : rolesData?.data)?.map((role: any) => {
              const isSelected = tempSelectedRoles.includes(role.id);

              return (
                <label
                  key={role.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md p-3 transition-colors hover:bg-accent ${
                    isSelected ? 'bg-accent' : ''
                  }`}
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleTempRole(role.id)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{role.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
            <span>{tempSelectedRoles.length} roles selected</span>
          </div>
        </>
      )}
    </Modal>
  );
}
