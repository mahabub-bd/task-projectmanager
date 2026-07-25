import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function AddressBookTableView({
  users,
  onUserClick,
}: AddressBookTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Contact Information</TableHead>
          <TableHead>Division</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
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
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getUserAvatarColor(user.name)}`}
                >
                  {getUserInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
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
              <div className="space-y-1">
                {user.phone_number && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="truncate">{user.phone_number}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[200px]" title={user.address}>
                      {user.address}
                    </span>
                  </div>
                )}
                {!user.phone_number && !user.address && (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
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
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
