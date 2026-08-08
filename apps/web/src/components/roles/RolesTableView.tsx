import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Key, Settings, Trash2, Shield } from 'lucide-react';
import { getRoleAvatarColor, getRoleInitials } from './utils/roles-page.utils';

interface RolesTableViewProps {
  roles: any[];
  onEditRole: (role: any) => void;
  onDeleteRole: (roleId: number) => void;
  onManagePermissions: (roleId: number) => void;
}

// Mobile card view component
function MobileRoleCard({
  role,
  onEditRole,
  onDeleteRole,
  onManagePermissions,
}: {
  role: any;
  onEditRole: (role: any) => void;
  onDeleteRole: (roleId: number) => void;
  onManagePermissions: (roleId: number) => void;
}) {
  const avatarColor = getRoleAvatarColor(role.name);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar and name */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div
            className={`flex h-10 w-10 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-white shadow-md ${avatarColor}`}
          >
            {getRoleInitials(role.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{role.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{role.description || 'No description'}</p>
          </div>
        </div>

        {/* Permissions badge */}
        <div className="mb-3 sm:mb-4">
          <Badge variant="outline" className="gap-1.5 sm:gap-2 text-[10px] sm:text-xs px-2 sm:px-2.5 py-1">
            <Key className="h-2.5 w-2.5 sm:h-3 sm:w-3.5" />
            {role.permissions?.length || 0} Permission{role.permissions?.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditRole(role)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm gap-1.5 sm:gap-2"
          >
            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePermissions(role.id)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm gap-1.5 sm:gap-2"
          >
            <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Permissions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteRole(role.id)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm gap-1.5 sm:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RolesTableView({
  roles,
  onEditRole,
  onDeleteRole,
  onManagePermissions,
}: RolesTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {roles.map((role: any) => (
          <MobileRoleCard
            key={role.id}
            role={role}
            onEditRole={onEditRole}
            onDeleteRole={onDeleteRole}
            onManagePermissions={onManagePermissions}
          />
        ))}
        {roles.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Shield className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No roles to display</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role: any) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getRoleAvatarColor(role.name)}`}
                    >
                      {getRoleInitials(role.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{role.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground" title={role.description}>
                      {role.description || '-'}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    {role.permissions?.length || 0} Permissions
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onEditRole(role)} title="Edit role">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onManagePermissions(role.id)}
                      title="Manage permissions"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteRole(role.id)}
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
