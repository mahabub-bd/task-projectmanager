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
    <div className="space-y-6">
      <p className="text-muted-foreground">Manage designations and job titles</p>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
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
          <Card>
            <CardContent className="p-0">
              <DesignationsTableView
                designations={designations}
                onEditDesignation={openEditForm}
                onDeleteDesignation={handleDeleteDesignation}
                onDesignationClick={handleDesignationClick}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
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
          <CardContent className="p-8 sm:p-12 text-center">
            <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No designations found</h3>
            <p className="mb-6 text-muted-foreground">
              {searchQuery
                ? `No designations match "${searchQuery}"`
                : 'Create your first designation to get started!'}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm}>
                <Plus className="h-4 w-4" />
                Create First Designation
              </Button>
            )}
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
