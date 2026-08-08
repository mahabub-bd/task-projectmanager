import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/ui/stats-card';
import { CheckCircle, ChevronDown, ChevronRight, EyeOff, Filter, Key, Shield, ShieldAlert, UserCog } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageLoadingState from '../components/PageLoadingState';
import { useGetPermissionsQuery, useGetRolesQuery } from '../store/api';

export default function PermissionsByRolePage() {
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [collapsedRoles, setCollapsedRoles] = useState<Record<number, boolean>>({});
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  // Fetch all permissions (which include role assignments) and roles
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionsQuery(undefined);
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery(undefined);

  const permissions = permissionsData || [];
  const roles = rolesData || [];

  // Initialize all roles as collapsed on first load
  useEffect(() => {
    if (roles.length > 0 && Object.keys(collapsedRoles).length === 0) {
      const initialCollapsedState: Record<number, boolean> = {};
      roles.forEach((role: any) => {
        initialCollapsedState[role.id] = true; // true = collapsed
      });
      setCollapsedRoles(initialCollapsedState);
    }
  }, [roles]);

  // Group permissions by role
  const permissionsByRole = useMemo(() => {
    const grouped: Record<number, typeof permissions> = {};

    // Initialize all roles with empty arrays
    roles.forEach((role: any) => {
      grouped[role.id] = [];
    });

    // Group permissions by the roles that have them
    permissions.forEach((permission: any) => {
      if (permission.roles && Array.isArray(permission.roles)) {
        permission.roles.forEach((role: any) => {
          if (!grouped[role.id]) {
            grouped[role.id] = [];
          }
          grouped[role.id].push(permission);
        });
      }
    });

    return grouped;
  }, [permissions, roles]);

  // Group permissions by resource for better organization
  const groupPermissionsByResource = (perms: typeof permissions) => {
    return perms.reduce((acc: Record<string, typeof permissions>, permission: any) => {
      const resource = permission.resource || 'Other';
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(permission);
      return acc;
    }, {} as Record<string, typeof permissions>);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPermissions = permissions.length;
    const totalRoles = roles.length;
    const uniqueResources = new Set(permissions.map((p: any) => p.resource)).size;
    const totalAssignments = permissions.reduce((sum: number, p: any) =>
      sum + (p.roles?.length || 0), 0);

    return {
      totalPermissions,
      totalRoles,
      uniqueResources,
      totalAssignments,
    };
  }, [permissions, roles]);

  // Toggle role selection for comparison
  const toggleRoleSelection = (roleId: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Toggle role collapse
  const toggleRoleCollapse = (roleId: number) => {
    setCollapsedRoles(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  // Get avatar color for resources
  const getAvatarColor = (resource: string) => {
    const colors: Record<string, string> = {
      users: 'bg-blue-500',
      tasks: 'bg-green-500',
      departments: 'bg-purple-500',
      roles: 'bg-orange-500',
      permissions: 'bg-pink-500',
      organizations: 'bg-indigo-500',
      comment: 'bg-yellow-500',
      tags: 'bg-teal-500',
      milestones: 'bg-cyan-500',
      projects: 'bg-emerald-500',
      audit: 'bg-slate-500',
    };
    return colors[resource] || 'bg-gray-500';
  };

  // Get action badge color
  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'border-green-500 text-green-700 dark:text-green-400',
      read: 'border-blue-500 text-blue-700 dark:text-blue-400',
      update: 'border-yellow-500 text-yellow-700 dark:text-yellow-400',
      delete: 'border-red-500 text-red-700 dark:text-red-400',
      assign: 'border-purple-500 text-purple-700 dark:text-purple-400',
      revoke: 'border-orange-500 text-orange-700 dark:text-orange-400',
    };
    return colors[action] || 'border-gray-500 text-gray-700 dark:text-gray-400';
  };

  // Filter roles based on selection and difference view
  const filteredRoles = useMemo(() => {
    let filtered = roles;

    if (showOnlyDifferences && selectedRoleIds.length === 2) {
      // Only show permissions that differ between the two selected roles
      return roles.filter((role: any) => selectedRoleIds.includes(role.id));
    }

    if (selectedRoleIds.length > 0) {
      return roles.filter((role: any) => selectedRoleIds.includes(role.id));
    }

    return filtered;
  }, [roles, selectedRoleIds, showOnlyDifferences]);

  // Find permissions that differ between two selected roles
  const getDifferingPermissions = (roleId: number) => {
    if (selectedRoleIds.length !== 2) return null;

    const [roleId1, roleId2] = selectedRoleIds;
    const perms1 = new Set(permissionsByRole[roleId1]?.map((p: any) => p.id) || []);
    const perms2 = new Set(permissionsByRole[roleId2]?.map((p: any) => p.id) || []);

    if (roleId === roleId1) {
      return permissionsByRole[roleId]?.filter((p: any) => !perms2.has(p.id)) || [];
    } else {
      return permissionsByRole[roleId]?.filter((p: any) => !perms1.has(p.id)) || [];
    }
  };

  if (isLoadingPermissions || isLoadingRoles) {
    return <PageLoadingState message="Loading permissions by role..." />;
  }

  if (roles.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center gap-4">
            <ShieldAlert className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No roles found</h3>
            <p className="text-muted-foreground">
              Create roles first to view their permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Permissions by Role</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm">
            View and compare permissions assigned to different roles
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <StatsCard
          title="Total Roles"
          value={stats.totalRoles}
          icon={Shield}
          iconClassName="text-purple-500"
          subtext="In system"
        />
        <StatsCard
          title="Total Permissions"
          value={stats.totalPermissions}
          icon={Key}
          iconClassName="text-blue-500"
          subtext="Available"
        />
        <StatsCard
          title="Resources"
          value={stats.uniqueResources}
          icon={UserCog}
          iconClassName="text-green-500"
          subtext="Unique types"
        />
        <StatsCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={CheckCircle}
          iconClassName="text-orange-500"
          subtext="Total"
        />
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader className="py-2 sm:py-3 px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base">Filter & Compare</CardTitle>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {selectedRoleIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRoleIds([])}
                  className="text-xs sm:text-sm h-7 sm:h-8 px-2"
                >
                  Clear
                </Button>
              )}
              {selectedRoleIds.length === 2 && (
                <Button
                  variant={showOnlyDifferences ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                  className="text-xs sm:text-sm h-7 sm:h-8 gap-1 px-2"
                >
                  <Filter className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {showOnlyDifferences ? 'Differences Only' : 'Show Differences'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {roles.map((role: any) => {
              const isSelected = selectedRoleIds.includes(role.id);
              const permissionCount = permissionsByRole[role.id]?.length || 0;
              return (
                <Button
                  key={role.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRoleSelection(role.id)}
                  className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="font-medium truncate max-w-16 sm:max-w-none">{role.name}</span>
                  <Badge variant={isSelected ? "secondary" : "outline"} className="text-[10px] sm:text-sm h-4 sm:h-5 px-1 sm:px-1.5">
                    {permissionCount}
                  </Badge>
                </Button>
              );
            })}
          </div>
          {selectedRoleIds.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {selectedRoleIds.length === 2 && showOnlyDifferences
                ? 'Showing permissions that differ between selected roles'
                : `${selectedRoleIds.length} role(s) selected`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Roles and Permissions */}
      <div className="space-y-3 sm:space-y-4">
        {filteredRoles.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <EyeOff className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <h3 className="text-sm sm:text-lg font-semibold">No roles to display</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select roles from the filter above to view their permissions.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRoles.map((role: any) => {
            const rolePermissions = showOnlyDifferences && selectedRoleIds.length === 2
              ? getDifferingPermissions(role.id)
              : permissionsByRole[role.id];

            const isCollapsed = collapsedRoles[role.id];
            const groupedPermissions = groupPermissionsByResource(rolePermissions || []);

            return (
              <Card key={role.id}>
                <CardHeader
                  className="py-2 sm:py-3 px-3 sm:px-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleRoleCollapse(role.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="flex flex-col items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 text-white shrink-0">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-xs sm:text-sm truncate">{role.name}</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1 hidden xs:block">
                          {role.description || 'No description'}
                        </p>
                      </div>

                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <Badge variant="secondary" className="text-[10px] sm:text-sm h-5 sm:h-6 px-1.5 sm:px-2 whitespace-nowrap">
                        {rolePermissions?.length || 0}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 shrink-0">
                        {isCollapsed ? (
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>

                  </div>
                </CardHeader>
                {!isCollapsed && (
                  <CardContent className="p-0">
                    {(!rolePermissions || rolePermissions.length === 0) ? (
                      <div className="p-6 sm:p-8 text-center text-muted-foreground text-xs sm:text-sm">
                        No permissions assigned to this role
                      </div>
                    ) : (
                      <div className="divide-y">
                        {(Object.entries(groupedPermissions) as Array<[string, any[]]>).map(([resource, perms]) => (
                          <div key={resource} className="p-3 sm:p-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                              <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded flex items-center justify-center ${getAvatarColor(resource)} text-white shrink-0`}>
                                <Key className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              </div>
                              <h3 className="text-xs sm:text-sm font-semibold">
                                {resource.charAt(0).toUpperCase() + resource.slice(1)}
                              </h3>
                              <Badge variant="outline" className="text-[10px] sm:text-sm h-5 sm:h-6 px-1.5 sm:px-2 whitespace-nowrap">
                                {perms.length}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
                              {perms.map((permission: any) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center gap-1.5 sm:gap-2 p-2 rounded border bg-card hover:bg-accent/50 transition-colors"
                                >
                                  <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium truncate leading-tight">
                                      {permission.name}
                                    </p>
                                    <p className="text-[10px] sm:text-sm text-muted-foreground truncate hidden xs:block">
                                      {permission.description}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-[9px] sm:text-xs h-4 sm:h-5 px-1 sm:px-1.5 border shrink-0 ${getActionBadgeColor(permission.action)}`}
                                  >
                                    {permission.action}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
