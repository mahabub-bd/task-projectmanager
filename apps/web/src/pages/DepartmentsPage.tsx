import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import { Briefcase, Building, Building2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentFormModal from '../components/departments/DepartmentFormModal';
import DepartmentsTableView from '../components/departments/DepartmentsTableView';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from '../store/api';

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    departmentId: number | null;
    departmentName: string;
  }>({
    open: false,
    departmentId: null,
    departmentName: '',
  });

  // Build query params with pagination and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.search = searchQuery;
    params.page = String(currentPage);
    params.limit = String(itemsPerPage);

    return params;
  }, [searchQuery, currentPage, itemsPerPage]);

  const { data: departmentsResponse, isLoading, isError, refetch } = useGetDepartmentsQuery(queryParams);
  const [deleteDepartment] = useDeleteDepartmentMutation();

  // Extract departments and total count from paginated response
  const departments = departmentsResponse?.items || [];
  const totalDepartments = departmentsResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalDepartments / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  // Calculate stats from current page data
  const stats = useMemo(() => {
    const withDivision = departments.filter((d: any) => d.division_id).length;
    const withoutDivision = departments.filter((d: any) => !d.division_id).length;
    return {
      total: departments.length,
      withDivision,
      withoutDivision,
    };
  }, [departments]);

  const openCreateForm = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const openEditForm = (department: any) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (id: number, name: string) => {
    setDeleteDialog({ open: true, departmentId: id, departmentName: name });
  };

  const confirmDeleteDepartment = async () => {
    if (!deleteDialog.departmentId) return;

    try {
      await deleteDepartment(deleteDialog.departmentId.toString()).unwrap();
      setDeleteDialog({ open: false, departmentId: null, departmentName: '' });
    } catch {
      // Error handled by toast
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, departmentId: null, departmentName: '' });
  };

  const handleDepartmentClick = (departmentId: number) => {
    navigate(`/departments/${departmentId}`);
  };

  if (isLoading) {
    return <PageLoadingState message="Loading departments..." />;
  }

  if (isError) {
    return <PageErrorState title="Could not load departments" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage departments and organizational structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {totalDepartments} {totalDepartments === 1 ? 'department' : 'departments'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        <StatsCard title="Total Departments" value={totalDepartments} icon={Building2} />
        <StatsCard
          title="With Division"
          value={stats.withDivision}
          subtext="Departments"
          icon={Building}
          iconClassName="text-primary"
          valueClassName="text-primary"
        />
        <StatsCard
          title="Without Division"
          value={stats.withoutDivision}
          subtext="Departments"
          icon={Briefcase}
          iconClassName="text-blue-600 dark:text-blue-400"
          valueClassName="text-blue-600 dark:text-blue-400"
        />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={(value) => handleFilterChange(() => setSearchQuery(value))}
        placeholder="Search departments by name or description..."
        button={{
          icon: Plus,
          label: "Add Department",
          onClick: openCreateForm,
        }}
      />

      {departments.length > 0 ? (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0 sm:p-0">
              <DepartmentsTableView
                departments={departments}
                onEditDepartment={openEditForm}
                onDeleteDepartment={handleDeleteDepartment}
                onDepartmentClick={handleDepartmentClick}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card>
            <CardContent className="p-2.5 sm:p-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalDepartments}
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
          <CardContent className="p-4 sm:p-12">
            <div className="flex flex-col items-center gap-2.5 sm:gap-4">
              <Building2 className="h-9 w-9 sm:h-16 sm:w-16 text-muted-foreground/50" />
              <h3 className="text-sm sm:text-lg font-semibold">No departments found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                {searchQuery
                  ? `No departments match "${searchQuery}"`
                  : 'Create your first department to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Create Department
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <DepartmentFormModal open={isFormOpen} onClose={closeForm} editingDepartment={editingDepartment} />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteDepartment}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteDialog.departmentName}"? This action cannot be undone.`}
        confirmText="Delete Department"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
