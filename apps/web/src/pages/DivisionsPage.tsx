import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import { Building, Building2, FolderOpen, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DivisionFormModal from '../components/divisions/DivisionFormModal';
import DivisionsTableView from '../components/divisions/DivisionsTableView';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import { useDeleteDivisionMutation, useGetDivisionsQuery } from '../store/api';

export default function DivisionsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    divisionId: number | null;
    divisionName: string;
  }>({
    open: false,
    divisionId: null,
    divisionName: '',
  });

  // Build query params with pagination and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.search = searchQuery;
    params.page = String(currentPage);
    params.limit = String(itemsPerPage);

    return params;
  }, [searchQuery, currentPage, itemsPerPage]);

  const { data: divisionsResponse, isLoading, isError, refetch } = useGetDivisionsQuery(queryParams);
  const [deleteDivision] = useDeleteDivisionMutation();

  // Extract divisions and total count from paginated response
  const divisions = divisionsResponse?.items || [];
  const totalDivisions = divisionsResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalDivisions / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  // Calculate stats from current page data
  const stats = useMemo(() => {
    const root = divisions.filter((d: any) => !d.parent_division_id).length;
    const child = divisions.filter((d: any) => d.parent_division_id).length;
    const totalDepts = divisions.reduce((acc: number, d: any) => acc + (d.departments?.length || 0), 0);
    return {
      total: divisions.length,
      root,
      child,
      totalDepts,
    };
  }, [divisions]);

  const openCreateForm = () => {
    setEditingDivision(null);
    setIsFormOpen(true);
  };

  const openEditForm = (division: any) => {
    setEditingDivision(division);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDivision(null);
  };

  const handleDeleteDivision = (id: number, name: string) => {
    setDeleteDialog({ open: true, divisionId: id, divisionName: name });
  };

  const confirmDeleteDivision = async () => {
    if (!deleteDialog.divisionId) return;

    try {
      await deleteDivision(deleteDialog.divisionId.toString()).unwrap();
      setDeleteDialog({ open: false, divisionId: null, divisionName: '' });
    } catch {
      // Error handled by toast
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, divisionId: null, divisionName: '' });
  };

  const handleDivisionClick = (divisionId: number) => {
    navigate(`/divisions/${divisionId}`);
  };

  if (isLoading) {
    return <PageLoadingState message="Loading divisions..." />;
  }

  if (isError) {
    return <PageErrorState title="Could not load divisions" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Divisions</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage divisions and organizational structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {totalDivisions} {totalDivisions === 1 ? 'division' : 'divisions'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Divisions" value={totalDivisions} icon={Building2} />
        <StatsCard
          title="Root"
          value={stats.root}
          subtext="Divisions"
          icon={Building}
          iconClassName="text-primary"
          valueClassName="text-primary"
        />
        <StatsCard
          title="Child"
          value={stats.child}
          subtext="Divisions"
          icon={FolderOpen}
          iconClassName="text-blue-600 dark:text-blue-400"
          valueClassName="text-blue-600 dark:text-blue-400"
        />
        <StatsCard title="Total Departments" value={stats.totalDepts} subtext="Across Divisions" icon={Building} />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={(value) => handleFilterChange(() => setSearchQuery(value))}
        placeholder="Search divisions by name or description..."
        button={{
          icon: Plus,
          label: "Add Division",
          onClick: openCreateForm,
        }}
      />

      {divisions.length > 0 ? (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0 sm:p-0">
              <DivisionsTableView
                divisions={divisions}
                onEditDivision={openEditForm}
                onDeleteDivision={handleDeleteDivision}
                onDivisionClick={handleDivisionClick}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card>
            <CardContent className="p-2.5 sm:p-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalDivisions}
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
              <h3 className="text-sm sm:text-lg font-semibold">No divisions found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                {searchQuery
                  ? `No divisions match "${searchQuery}"`
                  : 'Create your first division to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Create Division
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <DivisionFormModal open={isFormOpen} onClose={closeForm} editingDivision={editingDivision} />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteDivision}
        title="Delete Division"
        description={`Are you sure you want to delete "${deleteDialog.divisionName}"? This action cannot be undone.`}
        confirmText="Delete Division"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
