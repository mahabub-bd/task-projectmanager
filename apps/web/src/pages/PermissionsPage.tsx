import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import SearchBar from '@/components/ui/SearchBar';
import { KeyRound, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { toastError, toastSuccess } from '@/lib/toast';
import PermissionFormModal from '../components/permissions/PermissionFormModal';
import PermissionsTableView from '../components/permissions/PermissionsTableView';
import { useDeletePermissionMutation, useGetPermissionsQuery } from '../store/api';
import { filterPermissions } from './utils/permissions-page.utils';

export default function PermissionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: permissionsData, isLoading } = useGetPermissionsQuery(undefined);
  const [deletePermission] = useDeletePermissionMutation();

  const permissions = permissionsData || [];
  const filteredPermissions = useMemo(
    () => filterPermissions(permissions, searchQuery),
    [permissions, searchQuery],
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);

  const openCreateForm = () => {
    setEditingPermission(null);
    setIsFormOpen(true);
  };

  const openEditForm = (permission: any) => {
    setEditingPermission(permission);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPermission(null);
  };

  const handleDeletePermission = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(id.toString()).unwrap();
        toastSuccess('Permission deleted successfully!');
      } catch (error: any) {
        toastError(error?.data?.message || 'Failed to delete permission');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Permissions"
        description="Manage the access rules available to your roles."
        icon={KeyRound}
        badge={isLoading ? undefined : filteredPermissions.length}
      />

      {/* Search + create */}
      <div className="dashboard-card p-3 sm:p-4">
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Search permissions..."
          button={{
            icon: Plus,
            label: 'Add permission',
            onClick: openCreateForm,
          }}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : paginatedPermissions.length > 0 ? (
        <>
          <PermissionsTableView
            permissions={paginatedPermissions}
            onEditPermission={openEditForm}
            onDeletePermission={handleDeletePermission}
          />

          <div className="dashboard-card p-3 sm:p-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPermissions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showStats
            />
          </div>
        </>
      ) : (
        <div className="dashboard-card">
          <EmptyState
            icon={KeyRound}
            title="No permissions found"
            description={
              searchQuery
                ? 'Try adjusting your search query.'
                : 'Create your first permission to get started.'
            }
            actionLabel={searchQuery ? undefined : 'Add permission'}
            onAction={openCreateForm}
          />
        </div>
      )}

      {/* Permission Form Modal */}
      <PermissionFormModal
        open={isFormOpen}
        onClose={closeForm}
        editingPermission={editingPermission}
      />
    </div>
  );
}
