import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TablePagination } from '@/components/shared/TablePagination';
import SearchBar from '@/components/ui/SearchBar';
import { Key, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PageLoadingState from '../components/PageLoadingState';
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
        toast.success('Permission deleted successfully!');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete permission');
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
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Permissions</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage the access rules available to your roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {filteredPermissions.length} {filteredPermissions.length === 1 ? 'permission' : 'permissions'}
          </span>
        </div>
      </div>

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

      {isLoading ? (
        <PageLoadingState message="Loading permissions..." />
      ) : paginatedPermissions.length > 0 ? (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0 sm:p-0">
              <PermissionsTableView
                permissions={paginatedPermissions}
                onEditPermission={openEditForm}
                onDeletePermission={handleDeletePermission}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2.5 sm:p-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPermissions.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showStats={true}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-12">
            <div className="flex flex-col items-center gap-2.5 sm:gap-4">
              <Key className="h-9 w-9 sm:h-16 sm:w-16 text-muted-foreground/50" />
              <h3 className="text-sm sm:text-lg font-semibold">No permissions found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-4">
                {searchQuery ? 'Try adjusting your search query' : 'Create your first permission to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add Permission
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
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
