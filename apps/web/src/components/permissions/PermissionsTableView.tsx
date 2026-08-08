import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

// Mobile card view component
function MobilePermissionCard({
  permission,
  onEditPermission,
  onDeletePermission,
}: {
  permission: any;
  onEditPermission: (permission: any) => void;
  onDeletePermission: (permissionId: number) => void;
}) {
  const ActionIcon = getPermissionActionIcon(permission.action);
  const avatarColor = getPermissionAvatarColor(permission.resource);
  const resourceColor = getPermissionResourceBadgeColor(permission.resource);
  const actionVariant = getPermissionActionBadgeVariant(permission.action);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar and name */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={`flex h-10 w-10 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-md ${avatarColor}`}>
            <Key className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{permission.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{permission.description || 'No description'}</p>
          </div>
        </div>

        {/* Resource and Action badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <Badge
            variant="outline"
            className={`${resourceColor} border-0 font-normal text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 bg-opacity-10 gap-1 sm:gap-1.5`}
          >
            <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {permission.resource}
          </Badge>
          <Badge
            variant={actionVariant}
            className="font-normal text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 gap-1 sm:gap-1.5"
          >
            <span className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs">{ActionIcon}</span>
              {permission.action}
            </span>
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditPermission(permission)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm gap-1.5 sm:gap-2"
          >
            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeletePermission(permission.id)}
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

export default function PermissionsTableView({
  permissions,
  onEditPermission,
  onDeletePermission,
}: PermissionsTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {permissions.map((permission: any) => (
          <MobilePermissionCard
            key={permission.id}
            permission={permission}
            onEditPermission={onEditPermission}
            onDeletePermission={onDeletePermission}
          />
        ))}
        {permissions.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Key className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No permissions to display</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
      </div>
    </>
  );
}
