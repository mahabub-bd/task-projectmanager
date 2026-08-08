import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, MapPin, Phone, Building2, Briefcase, Network, Shield, IdCard } from 'lucide-react';

interface AddressBookTableViewProps {
  users: any[];
  onUserClick?: (userId: number) => void;
}

function getUserInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getUserAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-emerald-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Mobile card view component
function MobileUserCard({ user }: { user: any }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar, name, and email */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div
            className={`flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-white shadow-md shrink-0 ${getUserAvatarColor(user.name)}`}
          >
            {getUserInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{user.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* Employee ID */}
        {user.employee_id && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2 sm:mb-3">
            <IdCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground" />
            <span className="font-mono text-muted-foreground">{user.employee_id}</span>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
          {user.phone_number && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <a href={`tel:${user.phone_number}`} className="hover:text-foreground truncate">
                {user.phone_number}
              </a>
            </div>
          )}
          {user.address && (
            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5" />
              <span className="truncate">{user.address}</span>
            </div>
          )}
        </div>

        {/* Organization Info */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {user.department?.division && (
            <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-blue-50 border-blue-200 text-blue-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
              <Network className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              <span className="truncate max-w-24">{user.department.division.name}</span>
            </Badge>
          )}
          {user.department && (
            <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-green-50 border-green-200 text-green-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
              <Building2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              <span className="truncate max-w-24">{user.department.name}</span>
            </Badge>
          )}
          {user.designation && (
            <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-purple-50 border-purple-200 text-purple-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
              <Briefcase className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              <span className="truncate max-w-24">{user.designation.name}</span>
            </Badge>
          )}
        </div>

        {/* Roles and Status */}
        <div className="flex items-center justify-between gap-2">
          {user.user_roles && user.user_roles.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {user.user_roles.slice(0, 2).map((userRole: any) => (
                <Badge key={userRole.role.id} variant="outline" className="gap-1 bg-amber-50 border-amber-200 text-amber-700 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                  <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="truncate max-w-20">{userRole.role.name}</span>
                </Badge>
              ))}
              {user.user_roles.length > 2 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                  +{user.user_roles.length - 2}
                </Badge>
              )}
            </div>
          )}
          <Badge
            variant={
              user.status === 'active'
                ? 'default'
                : user.status === 'inactive'
                ? 'secondary'
                : user.status === 'suspended'
                ? 'destructive'
                : 'outline'
            }
            className="text-[10px] sm:text-xs shrink-0 ml-auto"
          >
            {user.status}
          </Badge>
        </div>

        {/* Email Action Button */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `mailto:${user.email}`)}
            className="w-full h-8 sm:h-9 text-xs sm:text-sm gap-1.5 sm:gap-2"
          >
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AddressBookTableView({
  users,
  onUserClick,
}: AddressBookTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {users.map((user: any) => (
          <MobileUserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden lg:table-cell">Employee ID</TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead className="hidden xl:table-cell">Division</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden lg:table-cell">Designation</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow
                key={user.id}
                className={onUserClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onUserClick?.(user.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-white shadow-md ${getUserAvatarColor(user.name)}`}
                    >
                      {getUserInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden lg:table-cell">
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
                  <div className="space-y-1">
                    {user.phone_number && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="truncate">{user.phone_number}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px]" title={user.address}>
                          {user.address}
                        </span>
                      </div>
                    )}
                    {!user.phone_number && !user.address && (
                      <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  {user.department?.division ? (
                    <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-blue-50 border-blue-200 text-blue-700 text-[10px] sm:text-xs">
                      <Network className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {user.department.division.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell>
                  {user.department ? (
                    <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-green-50 border-green-200 text-green-700 text-[10px] sm:text-xs">
                      <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {user.department.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {user.designation ? (
                    <Badge variant="outline" className="gap-1 sm:gap-1.5 bg-purple-50 border-purple-200 text-purple-700 text-[10px] sm:text-xs">
                      <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
                        <Badge key={userRole.role.id} variant="outline" className="gap-1 bg-amber-50 border-amber-200 text-amber-700 text-[10px] sm:text-xs">
                          <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {userRole.role.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      user.status === 'active'
                        ? 'default'
                        : user.status === 'inactive'
                        ? 'secondary'
                        : user.status === 'suspended'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="text-[10px] sm:text-xs"
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${user.email}`;
                      }}
                      title="Send email"
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
