import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Key, Trash2, Shield, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getPermissionActionBadgeVariant,
  getPermissionActionIcon,
  getPermissionAvatarColor,
  getPermissionResourceBadgeColor
} from './utils/permissions-page.utils';

interface PermissionsTableViewProps {
  permissions: any[];
  onEditPermission: (permission: any) => void;
  onDeletePermission: (permissionId: number) => void;
}

export default function PermissionsTableView({
  permissions,
  onEditPermission,
  onDeletePermission,
}: PermissionsTableViewProps) {
  return (
    <div className="rounded-lg border bg-card">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 border-b bg-muted/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div>Permission</div>
        <div>Description</div>
        <div>Resource</div>
        <div>Action</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {permissions.map((permission: any) => {
          const ActionIcon = getPermissionActionIcon(permission.action);
          const avatarColor = getPermissionAvatarColor(permission.resource);
          const resourceColor = getPermissionResourceBadgeColor(permission.resource);
          const actionVariant = getPermissionActionBadgeVariant(permission.action);

          return (
            <div
              key={permission.id}
              className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors"
            >
              {/* Permission Name with Avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${avatarColor}`}>
                  <Key className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium truncate" title={permission.name}>
                  {permission.name}
                </span>
              </div>

              {/* Description */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate" title={permission.description}>
                  {permission.description || '-'}
                </p>
              </div>

              {/* Resource Badge */}
              <div className="text-left">
                <Badge
                  variant="outline"
                  className={`${resourceColor} border-0 font-normal text-xs px-2 py-0.5 bg-opacity-10 justify-start`}
                >
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  {permission.resource}
                </Badge>
              </div>

              {/* Action Badge */}
              <div className="text-left">
                <Badge
                  variant={actionVariant}
                  className="font-normal text-xs px-2 py-0.5 justify-start"
                >
                  <span className="flex items-center gap-1">
                    <span className="text-xs">{ActionIcon}</span>
                    {permission.action}
                  </span>
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEditPermission(permission)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeletePermission(permission.id)}
                      className="cursor-pointer text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}

        {permissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Key className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No permissions to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
