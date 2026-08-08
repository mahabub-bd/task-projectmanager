import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import {
  CheckCircle,
  Clock,
  UserPlus,
  Users as UsersIcon,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import UserFormModal from '../components/users/UserFormModal';
import UsersTableView from '../components/users/UsersTableView';
import { useDeleteUserMutation, useGetUsersQuery } from '../store/api';
import { filterUsers, getUserStats } from './utils/users-page.utils';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({
    open: false,
    userId: null,
    userName: '',
  });

  // Build query params with pagination and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.search = searchQuery;
    params.page = String(currentPage);
    params.limit = String(itemsPerPage);

    return params;
  }, [searchQuery, currentPage, itemsPerPage]);

  const { data: usersResponse, isLoading, isError, refetch } = useGetUsersQuery(queryParams);
  const [deleteUser] = useDeleteUserMutation();

  // Extract users and total count from paginated response
  const users = usersResponse?.items || [];
  const totalUsers = usersResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const filteredUsers = useMemo(() => filterUsers(users, searchQuery), [users, searchQuery]);
  const stats = useMemo(() => getUserStats(users), [users]);

  const openCreateForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user: any) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: number, name: string) => {
    setDeleteDialog({ open: true, userId: id, userName: name });
  };

  const confirmDeleteUser = async () => {
    if (!deleteDialog.userId) return;

    try {
      await deleteUser(deleteDialog.userId.toString()).unwrap();
      setDeleteDialog({ open: false, userId: null, userName: '' });
    } catch {
      // Toast is handled by RTK Query callers elsewhere
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null, userName: '' });
  };

  if (isLoading) {
    return <PageLoadingState message="Loading users..." />;
  }

  if (isError) {
    return <PageErrorState title="Could not load users" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <p className="text-xs sm:text-sm text-muted-foreground">Manage users and their permissions</p>

      <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats.total} icon={UsersIcon} />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          iconClassName="text-emerald-600 dark:text-emerald-400"
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconClassName="text-amber-600 dark:text-amber-400"
          valueClassName="text-amber-600 dark:text-amber-400"
        />
        <StatsCard title="Inactive" value={stats.total - stats.active} icon={XCircle} />
      </div>
      <SearchBar
        value={searchQuery}
        onChange={(value) => handleFilterChange(() => setSearchQuery(value))}
        placeholder="Search users by name or email..."
        button={{
          icon: UserPlus,
          label: "Add User",
          onClick: openCreateForm,
        }}
      />

      {filteredUsers.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-0">
              <UsersTableView
                users={filteredUsers}
                onEditUser={openEditForm}
                onDeleteUser={handleDeleteUser}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card>
            <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUsers}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
                showStats={true}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center sm:p-12">
            <UsersIcon className="mx-auto mb-3 sm:mb-4 h-10 w-10 text-muted-foreground/50 sm:h-16 sm:w-16" />
            <h3 className="mb-2 text-sm sm:text-lg font-semibold">No users found</h3>
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
              {searchQuery
                ? `No users match "${searchQuery}"`
                : 'Create your first user to get started!'}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="ml-2">Create User</span>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <UserFormModal open={isFormOpen} onClose={closeForm} editingUser={editingUser} />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
