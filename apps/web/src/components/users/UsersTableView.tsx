import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Edit, Mail, Shield, Trash2, Network, Briefcase, IdCard } from 'lucide-react';
import {
  getUserAvatarColor,
  getUserInitials,
  getUserStatusConfig,
} from './utils/users-page.utils';

interface UsersTableViewProps {
  users: any[];
  onEditUser: (user: any) => void;
  onDeleteUser: (userId: number) => void;
}

export default function UsersTableView({
  users,
  onEditUser,
  onDeleteUser,
}: UsersTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Division</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => {
          const statusConfig = getUserStatusConfig(user.status);
          const StatusIcon = statusConfig.icon;

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getUserAvatarColor(user.name)}`}
                  >
                    {getUserInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {user.employee_id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <IdCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="font-mono">{user.employee_id}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
              </TableCell>

              <TableCell>
                {user.department?.division ? (
                  <Badge variant="outline" className="gap-1.5 bg-blue-50 border-blue-200 text-blue-700">
                    <Network className="h-3.5 w-3.5" />
                    {user.department.division.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                {user.department ? (
                  <Badge variant="outline" className="gap-1.5 bg-green-50 border-green-200 text-green-700">
                    <Building2 className="h-3.5 w-3.5" />
                    {user.department.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                {user.designation ? (
                  <Badge variant="outline" className="gap-1.5 bg-purple-50 border-purple-200 text-purple-700">
                    <Briefcase className="h-3.5 w-3.5" />
                    {user.designation.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                {user.user_roles && user.user_roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {user.user_roles.map((userRole: any) => (
                      <Badge key={userRole.role.id} variant="outline" className="gap-1 bg-amber-50 border-amber-200 text-amber-700">
                        <Shield className="h-3 w-3" />
                        {userRole.role.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell>
                <Badge variant={statusConfig.variant} className="gap-1.5">
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusConfig.label}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEditUser(user)} title="Edit user">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDeleteUser(user.id)} title="Delete user">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
