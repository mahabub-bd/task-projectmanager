import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Key, Settings, Trash2 } from 'lucide-react';
import { getRoleAvatarColor, getRoleInitials } from './utils/roles-page.utils';

interface RolesTableViewProps {
  roles: any[];
  onEditRole: (role: any) => void;
  onDeleteRole: (roleId: number) => void;
  onManagePermissions: (roleId: number) => void;
}

export default function RolesTableView({
  roles,
  onEditRole,
  onDeleteRole,
  onManagePermissions,
}: RolesTableViewProps) {
  return (
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
  );
}
