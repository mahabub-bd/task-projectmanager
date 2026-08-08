import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import { BadgeCheck, Building2, Briefcase, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesignationFormModal from '../components/designations/DesignationFormModal';
import DesignationsTableView from '../components/designations/DesignationsTableView';
import PageErrorState from '../components/PageErrorState';
import PageLoadingState from '../components/PageLoadingState';
import {
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from '../store/api';

export default function DesignationsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    designationId: number | null;
    designationName: string;
  }>({
    open: false,
    designationId: null,
    designationName: '',
  });

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    params.page = String(currentPage);
    params.limit = String(itemsPerPage);
    return params;
  }, [searchQuery, currentPage, itemsPerPage]);

  const { data: designationsResponse, isLoading, isError, refetch } =
    useGetDesignationsQuery(queryParams);
  const [deleteDesignation] = useDeleteDesignationMutation();

  const designations = designationsResponse?.items || [];
  const totalDesignations = designationsResponse?.total || 0;
  const totalPages = Math.ceil(totalDesignations / itemsPerPage);

  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const stats = useMemo(() => {
    const withDepartment = designations.filter((d: any) => d.department_id).length;
    const withoutDepartment = designations.filter((d: any) => !d.department_id).length;
    return {
      total: designations.length,
      withDepartment,
      withoutDepartment,
    };
  }, [designations]);

  const openCreateForm = () => {
    setEditingDesignation(null);
    setIsFormOpen(true);
  };

  const openEditForm = (designation: any) => {
    setEditingDesignation(designation);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDesignation(null);
  };

  const handleDeleteDesignation = (id: number, name: string) => {
    setDeleteDialog({ open: true, designationId: id, designationName: name });
  };

  const confirmDeleteDesignation = async () => {
    if (!deleteDialog.designationId) return;

    try {
      await deleteDesignation(deleteDialog.designationId.toString()).unwrap();
      setDeleteDialog({ open: false, designationId: null, designationName: '' });
    } catch {
      // Error handled by toast
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, designationId: null, designationName: '' });
  };

  const handleDesignationClick = (designationId: number) => {
    navigate(`/designations/${designationId}`);
  };

  if (isLoading) return <PageLoadingState message="Loading designations..." />;

  if (isError)
    return (
      <PageErrorState
        title="Could not load designations"
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Designations</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage designations and job titles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {totalDesignations} {totalDesignations === 1 ? 'designation' : 'designations'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        <StatsCard title="Total Designations" value={totalDesignations} icon={Briefcase} />
        <StatsCard
          title="With Department"
          value={stats.withDepartment}
          subtext="Designations"
          icon={Building2}
          iconClassName="text-primary"
          valueClassName="text-primary"
        />
        <StatsCard
          title="Without Department"
          value={stats.withoutDepartment}
          subtext="Designations"
          icon={BadgeCheck}
        />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={(value) => handleFilterChange(() => setSearchQuery(value))}
        placeholder="Search designations by name or description..."
        button={{ icon: Plus, label: 'Add Designation', onClick: openCreateForm }}
      />

      {designations.length > 0 ? (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0 sm:p-0">
              <DesignationsTableView
                designations={designations}
                onEditDesignation={openEditForm}
                onDeleteDesignation={handleDeleteDesignation}
                onDesignationClick={handleDesignationClick}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2.5 sm:p-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalDesignations}
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
              <Briefcase className="h-9 w-9 sm:h-16 sm:w-16 text-muted-foreground/50" />
              <h3 className="text-sm sm:text-lg font-semibold">No designations found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                {searchQuery
                  ? `No designations match "${searchQuery}"`
                  : 'Create your first designation to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateForm} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Create Designation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <DesignationFormModal
        open={isFormOpen}
        onClose={closeForm}
        editingDesignation={editingDesignation}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteDesignation}
        title="Delete Designation"
        description={`Are you sure you want to delete "${deleteDialog.designationName}"? This action cannot be undone.`}
        confirmText="Delete Designation"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
