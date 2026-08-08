import { AuditLogsFilters, AuditLogsTable, type AuditLog } from '@/components/audit-logs';
import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
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

  // Get unique actions and entity types for filters
  const { uniqueActions, uniqueEntityTypes } = useMemo(() => {
    if (!auditLogsData || auditLogsData.length === 0) return { uniqueActions: [], uniqueEntityTypes: [] };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track all system activities and changes
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="sm:size-default w-full sm:w-auto shrink-0">
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export Logs</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
          <AuditLogsFilters
            searchQuery={searchQuery}
            actionFilter={actionFilter}
            entityFilter={entityFilter}
            onSearchChange={(value) => handleFilterChange(() => setSearchQuery(value))}
            onActionChange={(value) => handleFilterChange(() => setActionFilter(value))}
            onEntityChange={(value) => handleFilterChange(() => setEntityFilter(value))}
            uniqueActions={uniqueActions}
            uniqueEntityTypes={uniqueEntityTypes}
          />
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse rounded-full bg-muted"></div>
              <p className="text-muted-foreground text-sm sm:text-base">Loading audit logs...</p>
            </div>
          </CardContent>
        </Card>
      ) : auditLogsData && auditLogsData.length > 0 ? (
        <>
          <AuditLogsTable logs={auditLogsData} />

          {/* Pagination */}
          <Card>
            <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
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
                showStats={true}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground opacity-50" />
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg font-semibold">No audit logs found</h3>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {searchQuery || actionFilter || entityFilter
                    ? 'Try adjusting your filters to find what you\'re looking for'
                    : 'No system activities have been recorded yet'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
