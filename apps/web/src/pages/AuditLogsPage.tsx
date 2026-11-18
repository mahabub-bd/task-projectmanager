import { AuditLogsFilters, AuditLogsTable, type AuditLog } from '@/components/audit-logs';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { TablePagination } from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, ScrollText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAuditLogsQuery } from '../store/api';
import type { RootState } from '../store/store';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get access token from Redux state
  const accessToken = useSelector((state: RootState) => state.auth.access_token);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (searchQuery) params.search = searchQuery;
    if (actionFilter) params.action = actionFilter;
    if (entityFilter) params.entity_type = entityFilter;
    params.page = currentPage;
    params.limit = itemsPerPage;
    return params;
  }, [searchQuery, actionFilter, entityFilter, currentPage, itemsPerPage]);

  const { data: auditLogsResponse, isLoading } = useGetAuditLogsQuery(queryParams);

  // Extract audit logs and total count from paginated response
  const auditLogsData = auditLogsResponse?.items || [];
  const totalLogs = auditLogsResponse?.total || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setSearchQuery('');
    setActionFilter('');
    setEntityFilter('');
  };

  // Get unique actions and entity types for filters
  const { uniqueActions, uniqueEntityTypes } = useMemo(() => {
    if (!auditLogsData || auditLogsData.length === 0) {
      return { uniqueActions: [], uniqueEntityTypes: [] };
    }

    const actions = new Set<string>();
    const entities = new Set<string>();

    auditLogsData.forEach((log: AuditLog) => {
      if (log.action) actions.add(log.action);
      if (log.entity_type) entities.add(log.entity_type);
    });

    return {
      uniqueActions: Array.from(actions).sort(),
      uniqueEntityTypes: Array.from(entities).sort(),
    };
  }, [auditLogsData]);

  const handleExport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/audit-logs/export`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities and changes"
        icon={ScrollText}
        badge={isLoading ? undefined : totalLogs}
        actions={
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs sm:text-sm"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export logs</span>
            <span className="sm:hidden">Export</span>
          </Button>
        }
      />

      {/* Filters */}
      <div className="dashboard-card p-4 sm:p-5">
        <AuditLogsFilters
          searchQuery={searchQuery}
          actionFilter={actionFilter}
          entityFilter={entityFilter}
          onSearchChange={(value) => handleFilterChange(() => setSearchQuery(value))}
          onActionChange={(value) => handleFilterChange(() => setActionFilter(value))}
          onEntityChange={(value) => handleFilterChange(() => setEntityFilter(value))}
          onClear={handleClearFilters}
          uniqueActions={uniqueActions}
          uniqueEntityTypes={uniqueEntityTypes}
        />
      </div>

      {/* Audit logs */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : auditLogsData.length > 0 ? (
        <>
          <AuditLogsTable logs={auditLogsData} />

          <div className="dashboard-card p-3 sm:p-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalLogs}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
              showStats
            />
          </div>
        </>
      ) : (
        <div className="dashboard-card">
          <EmptyState
            icon={ScrollText}
            title="No audit logs found"
            description={
              searchQuery || actionFilter || entityFilter
                ? 'Try adjusting your filters to find what you’re looking for.'
                : 'No system activities have been recorded yet.'
            }
          />
        </div>
      )}
    </div>
  );
}
