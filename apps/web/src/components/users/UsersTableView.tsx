import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  onDeleteUser: (userId: number, userName: string) => void;
}

// Mobile card view component
function MobileUserCard({
  user,
  onEditUser,
  onDeleteUser,
}: {
  user: any;
  onEditUser: (user: any) => void;
  onDeleteUser: (userId: number, userName: string) => void;
}) {
  const statusConfig = getUserStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar, name, and actions */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-white shadow-md shrink-0 ${getUserAvatarColor(user.name)}`}
            >
              {getUserInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm sm:text-base truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant={statusConfig.variant} className="gap-1 text-[10px] sm:text-xs">
                  <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEditUser(user)} title="Edit user" className="h-8 w-8 sm:h-9 sm:w-9">
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDeleteUser(user.id, user.name)} title="Delete user" className="h-8 w-8 sm:h-9 sm:w-9 text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Employee ID */}
        {user.employee_id && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2 sm:mb-3">
            <IdCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground" />
            <span className="font-mono text-muted-foreground">{user.employee_id}</span>
          </div>
        )}

        {/* Email */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2 sm:mb-3">
          <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground">{user.email}</span>
        </div>

        {/* Organization Info */}
        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
          {/* Division */}
          {user.department?.division && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-blue-50 border-blue-200 text-blue-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <Network className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-24">{user.department.division.name}</span>
              </Badge>
            </div>
          )}

          {/* Department */}
          {user.department && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-green-50 border-green-200 text-green-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-24">{user.department.name}</span>
              </Badge>
            </div>
          )}

          {/* Designation */}
          {user.designation && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-purple-50 border-purple-200 text-purple-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <Briefcase className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-24">{user.designation.name}</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Roles */}
        {user.user_roles && user.user_roles.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {user.user_roles.map((userRole: any) => (
              <Badge key={userRole.role.id} variant="outline" className="gap-1 bg-amber-50 border-amber-200 text-amber-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-20">{userRole.role.name}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UsersTableView({
  users,
  onEditUser,
  onDeleteUser,
}: UsersTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {users.map((user: any) => (
          <MobileUserCard
            key={user.id}
            user={user}
            onEditUser={onEditUser}
            onDeleteUser={onDeleteUser}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                      <Button size="icon" variant="ghost" onClick={() => onDeleteUser(user.id, user.name)} title="Delete user">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
