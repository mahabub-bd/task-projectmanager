import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetPermissionsQuery,
  useGetRolePermissionsQuery,
  useGetRoleQuery,
  useSetRolePermissionsMutation,
} from '../store/api';

export default function RolePermissionsPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [tempSelectedPermissions, setTempSelectedPermissions] = useState<number[]>([]);

  const { data: role, isLoading: isLoadingRole } = useGetRoleQuery(roleId || '', { skip: !roleId });
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionsQuery(undefined);
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useGetRolePermissionsQuery(
    roleId || '',
    { skip: !roleId },
  );
  const [setPermissions, { isLoading: isSaving }] = useSetRolePermissionsMutation();

  const currentRolePermissionIds = useMemo(
    () => rolePermissions?.map((permission: any) => permission.id) || [],
    [rolePermissions],
  );

  useEffect(() => {
    if (rolePermissions) setTempSelectedPermissions(currentRolePermissionIds);
  }, [rolePermissions, currentRolePermissionIds]);

  const groupedPermissions = useMemo(() => {
    if (!permissionsData) return {} as Record<string, typeof permissionsData>;

    return permissionsData.reduce((groups: Record<string, typeof permissionsData>, permission: any) => {
      const resource = permission.resource || 'Other';
      (groups[resource] ??= []).push(permission);
      return groups;
    }, {} as Record<string, typeof permissionsData>);
  }, [permissionsData]);

  const togglePermission = (permissionId: number) => {
    setTempSelectedPermissions((selected) =>
      selected.includes(permissionId)
        ? selected.filter((id) => id !== permissionId)
        : [...selected, permissionId],
    );
  };

  const isAllSelected = Boolean(
    permissionsData?.length && permissionsData.every((permission: any) => tempSelectedPermissions.includes(permission.id)),
  );

  const toggleSelectAll = () => {
    setTempSelectedPermissions(
      isAllSelected ? [] : permissionsData?.map((permission: any) => permission.id) || [],
    );
  };

  const handleSavePermissions = async () => {
    if (!roleId) return;

    try {
      await setPermissions({ roleId, permissionIds: tempSelectedPermissions }).unwrap();
      toastSuccess('Permissions updated successfully');
    } catch {
      toastError('Failed to update permissions');
    }
  };

  if (isLoadingRole || isLoadingRolePermissions) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading role permissions...</p>;
  }

  if (!role) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <ShieldAlert className="h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="font-semibold">Role not found</h1>
            <p className="text-sm text-muted-foreground">The requested role does not exist.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/roles')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Manage permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the permissions assigned to <span className="font-medium text-foreground">{role.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/roles')}>Cancel</Button>
          <Button onClick={handleSavePermissions} disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 border-b py-4">
          <div>
            <CardTitle className="text-base">Permissions</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {tempSelectedPermissions.length} of {permissionsData?.length || 0} selected
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleSelectAll} disabled={!permissionsData?.length}>
            {isAllSelected ? 'Clear all' : 'Select all'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingPermissions ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Loading permissions...</p>
          ) : permissionsData?.length ? (
            <div className="divide-y">
              {(Object.entries(groupedPermissions) as Array<[string, any[]]>).map(([resource, permissions]) => (
                <section key={resource} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-medium capitalize">{resource}</h2>
                    <Badge variant="secondary">{permissions.length}</Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-4">
                    {permissions.map((permission: any) => {
                      const isSelected = tempSelectedPermissions.includes(permission.id);
                      return (
                        <label
                          key={permission.id}
                          className="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                        >
                          <Checkbox checked={isSelected} onCheckedChange={() => togglePermission(permission.id)} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{permission.name}</span>
                            {permission.description && (
                              <span className="mt-0.5 block truncate text-sm text-muted-foreground">{permission.description}</span>
                            )}
                          </span>
                          <Badge variant="outline" className="capitalize">{permission.action}</Badge>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">No permissions are available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
