import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, KeyRound, MoreVertical, Shield, Trash2 } from 'lucide-react';
import {
  getPermissionActionBadgeVariant,
  getPermissionActionIcon,
  getPermissionResourceBadgeColor,
} from './utils/permissions-page.utils';

interface PermissionsTableViewProps {
  permissions: any[];
  onEditPermission: (permission: any) => void;
  onDeletePermission: (permissionId: number) => void;
}

function ResourceBadge({ resource }: { resource: string }) {
  return (
    <Badge
      variant="secondary"
      className={`gap-1 border-0 font-normal ${getPermissionResourceBadgeColor(resource)}`}
    >
      <Shield className="h-3 w-3 shrink-0" />
      <span className="truncate">{resource}</span>
    </Badge>
  );
}

function ActionBadge({ action }: { action: string }) {
  const ActionIcon = getPermissionActionIcon(action);

  return (
    <Badge variant={getPermissionActionBadgeVariant(action)} className="gap-1 font-normal">
      <ActionIcon className="h-3 w-3 shrink-0" />
      <span className="truncate">{action}</span>
    </Badge>
  );
}

function MobilePermissionCard({
  permission,
  onEditPermission,
  onDeletePermission,
}: {
  permission: any;
  onEditPermission: (permission: any) => void;
  onDeletePermission: (permissionId: number) => void;
}) {
  return (
    <div className="dashboard-card p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{permission.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {permission.description || 'No description'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ResourceBadge resource={permission.resource} />
        <ActionBadge action={permission.action} />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditPermission(permission)}
          className="h-8 flex-1 gap-1.5 rounded-lg text-xs"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeletePermission(permission.id)}
          className="h-8 flex-1 gap-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function PermissionsTableView({
  permissions,
  onEditPermission,
  onDeletePermission,
}: PermissionsTableViewProps) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {permissions.map((permission: any) => (
          <MobilePermissionCard
            key={permission.id}
            permission={permission}
            onEditPermission={onEditPermission}
            onDeletePermission={onDeletePermission}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="dashboard-card hidden overflow-hidden md:block">
        <div className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-4 border-b border-border/60 bg-muted/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <div>Permission</div>
          <div>Description</div>
          <div>Resource</div>
          <div>Action</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-border/60">
          {permissions.map((permission: any) => (
            <div
              key={permission.id}
              className="grid grid-cols-[2fr_3fr_1fr_1fr_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/35"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-sm font-medium" title={permission.name}>
                  {permission.name}
                </span>
              </div>

              <p className="truncate text-sm text-muted-foreground" title={permission.description}>
                {permission.description || '-'}
              </p>

              <div className="min-w-0">
                <ResourceBadge resource={permission.resource} />
              </div>

              <div className="min-w-0">
                <ActionBadge action={permission.action} />
              </div>

              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${permission.name}`}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEditPermission(permission)}
                      className="cursor-pointer gap-2"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeletePermission(permission.id)}
                      className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
