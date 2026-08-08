import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import { Key, Plus, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoadingState from '../components/PageLoadingState';
import RoleFormModal from '../components/roles/RoleFormModal';
import RolesTableView from '../components/roles/RolesTableView';
import { useDeleteRoleMutation, useGetRolesQuery } from '../store/api';
import { filterRoles, getRoleStats } from './utils/roles-page.utils';


export default function RolesPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rolesData, isLoading } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();

  const roles = rolesData || [];
  const filteredRoles = useMemo(() => filterRoles(roles, searchQuery), [roles, searchQuery]);
  const stats = useMemo(() => getRoleStats(roles), [roles]);

  const openCreateForm = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const openEditForm = (role: any) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id.toString()).unwrap();
      } catch (error) {
        // Error handled by toast
      }
    }
  };

  const handleManagePermissions = (roleId: number) => {
    navigate(`/roles/${roleId}/permissions`);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <StatsCard
          title="Total Roles"
          value={stats.total}
          subtext="Roles"
          icon={Shield}
        />
        <StatsCard
          title="With Permissions"
          value={stats.withPermissions}
          subtext="Roles"
          icon={Key}
          iconClassName="text-primary"
          valueClassName="text-primary"
        />
        <StatsCard
          title="No Permissions"
          value={stats.withoutPermissions}
          subtext="Roles"
          icon={Shield}
          iconClassName="text-amber-600 dark:text-amber-400"
          valueClassName="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Total Permissions"
          value={stats.totalPermissions}
          subtext="Assigned"
          icon={Key}
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search roles by name or description..."
        button={{
          icon: Plus,
          label: "Add Role",
          onClick: openCreateForm,
        }}
      />

      {/* Roles List */}
      {isLoading ? (
        <PageLoadingState message="Loading roles..." />
      ) : filteredRoles.length > 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0 sm:p-0">
            <RolesTableView
              roles={filteredRoles}
              onEditRole={openEditForm}
              onDeleteRole={handleDeleteRole}
              onManagePermissions={handleManagePermissions}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-12">
            <div className="flex flex-col items-center gap-2.5 sm:gap-4">
              <Shield className="h-9 w-9 sm:h-16 sm:w-16 text-muted-foreground/50" />
              <h3 className="text-sm sm:text-lg font-semibold">
                {searchQuery ? 'No roles found' : 'No roles found'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                {searchQuery
                  ? `No roles match "${searchQuery}"`
                  : 'Create your first role to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 sm:default text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Create Role
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Form Modal */}
      <RoleFormModal
        open={isFormOpen}
        onClose={closeForm}
        editingRole={editingRole}
      />
    </div>
  );
}
