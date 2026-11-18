import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import SearchBar from '@/components/ui/SearchBar';
import StatsCard from '@/components/ui/stats-card';
import { Building2, Globe, Mail, Phone, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '@/lib/toast';
import OrganizationFormModal from '../components/organizations/OrganizationFormModal';
import OrganizationsTableView from '../components/organizations/OrganizationsTableView';
import PageLoadingState from '../components/PageLoadingState';
import { useDeleteOrganizationMutation, useGetOrganizationsQuery } from '../store/api';
import { filterOrganizations, getOrganizationStats } from './utils/organizations-page.utils';

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    organizationId: number | null;
    organizationName: string;
  }>({
    open: false,
    organizationId: null,
    organizationName: '',
  });
  const { data: organizationsData, isLoading } = useGetOrganizationsQuery(undefined);
  const [deleteOrganization] = useDeleteOrganizationMutation();

  const organizations = organizationsData || [];
  const filteredOrganizations = useMemo(
    () => filterOrganizations(organizations, searchQuery),
    [organizations, searchQuery],
  );
  const stats = useMemo(() => getOrganizationStats(organizations), [organizations]);

  const handleEdit = (organization: any) => {
    setEditingOrganization(organization);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteDialog({ open: true, organizationId: id, organizationName: name });
  };

  const confirmDeleteOrganization = async () => {
    if (!deleteDialog.organizationId) return;

    try {
      await deleteOrganization(String(deleteDialog.organizationId)).unwrap();
      toastSuccess('Organization deleted successfully!');
      setDeleteDialog({ open: false, organizationId: null, organizationName: '' });
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to delete organization');
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, organizationId: null, organizationName: '' });
  };

  const handleAddNew = () => {
    setEditingOrganization(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrganization(null);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Organizations</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage your organizations and their details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {filteredOrganizations.length} {filteredOrganizations.length === 1 ? 'organization' : 'organizations'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total" value={stats.total} icon={Building2} subtext="Organizations" />
        <StatsCard title="With Email" value={stats.withEmail} icon={Mail} iconClassName="text-blue-500" subtext="Organizations" />
        <StatsCard title="With Phone" value={stats.withPhone} icon={Phone} iconClassName="text-green-500" subtext="Organizations" />
        <StatsCard title="With Website" value={stats.withWebsite} icon={Globe} iconClassName="text-purple-500" subtext="Organizations" />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search organizations..."
        button={{
          icon: Plus,
          label: "Add Organization",
          onClick: handleAddNew,
        }}
      />

      {isLoading ? (
        <PageLoadingState message="Loading organizations..." />
      ) : filteredOrganizations.length > 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0 sm:p-0">
            <OrganizationsTableView
              organizations={filteredOrganizations}
              onEditOrganization={handleEdit}
              onDeleteOrganization={handleDelete}
              onNavigate={navigate}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-12">
            <div className="flex flex-col items-center gap-2.5 sm:gap-4">
              <Building2 className="h-9 w-9 sm:h-16 sm:w-16 text-muted-foreground/50" />
              <h3 className="text-sm sm:text-lg font-semibold">No organizations found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-0">
                {searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first organization'}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddNew} size="sm" className="h-8 sm:h-9 text-xs sm:text-sm mt-1 sm:mt-0">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add Organization
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <OrganizationFormModal
        open={isFormOpen}
        onClose={handleCloseForm}
        editingOrganization={editingOrganization}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteOrganization}
        title="Delete Organization"
        description={`Are you sure you want to delete "${deleteDialog.organizationName}"? This action cannot be undone.`}
        confirmText="Delete Organization"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
