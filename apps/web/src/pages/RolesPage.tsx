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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
        <Card>
          <CardContent className="p-0">
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
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No roles found' : 'No roles found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No roles match "${searchQuery}"`
                : 'Create your first role to get started!'}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm}>
                <Plus className="h-4 w-4" />
                Create First Role
              </Button>
            )}
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
