import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleDeleteDivision = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this division?')) return;

    try {
      await deleteDivision(id.toString()).unwrap();
    } catch {
      // Error handled by toast
    }
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
    <div className="space-y-6">
      <p className="text-muted-foreground">Manage divisions and organizational structure</p>

      <div className="grid gap-4 md:grid-cols-4">
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
          <Card>
            <CardContent className="p-0">
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
            <CardContent className="pt-6">
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
          <CardContent className="p-12 text-center">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No divisions found</h3>
            <p className="mb-6 text-muted-foreground">
              {searchQuery
                ? `No divisions match "${searchQuery}"`
                : 'Create your first division to get started!'}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm}>
                <Plus className="h-4 w-4" />
                Create First Division
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <DivisionFormModal open={isFormOpen} onClose={closeForm} editingDivision={editingDivision} />
    </div>
  );
}
