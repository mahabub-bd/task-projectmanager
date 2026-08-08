import AddressBookTableView from '@/components/address-book/AddressBookTableView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDepartmentsListQuery, useGetDesignationsListQuery, useGetDivisionsListQuery, useGetOrganizationDirectoryQuery } from '@/store/api';
import type { RootState } from '@/store/store';
import { FileSpreadsheet, FileText, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function AddressBookPage() {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [designationFilter, setDesignationFilter] = useState<string>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Get access token from Redux state
  const accessToken = useSelector((state: RootState) => state.auth.access_token);

  // Build query params - only include defined values
  const queryParams: Record<string, string | number> = {
    page,
    limit: 20,
  };

  if (search) {
    queryParams.search = search;
  }
  if (departmentFilter !== 'all') {
    queryParams.department_id = Number(departmentFilter);
  }
  if (designationFilter !== 'all') {
    queryParams.designation_id = Number(designationFilter);
  }
  if (divisionFilter !== 'all') {
    queryParams.division_id = Number(divisionFilter);
  }

  const { data: directoryData, isLoading, refetch } = useGetOrganizationDirectoryQuery(queryParams);

  const { data: departmentsData } = useGetDepartmentsListQuery(undefined);
  const { data: designationsData } = useGetDesignationsListQuery(undefined);
  const { data: divisionsData } = useGetDivisionsListQuery(undefined);

  const users = directoryData?.items || [];
  const total = directoryData?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDepartmentFilter = (value: string) => {
    setDepartmentFilter(value);
    setPage(1);
    refetch();
  };

  const handleDesignationFilter = (value: string) => {
    setDesignationFilter(value);
    setPage(1);
    refetch();
  };

  const handleDivisionFilter = (value: string) => {
    setDivisionFilter(value);
    setPage(1);
    refetch();
  };

  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('all');
    setDesignationFilter('all');
    setDivisionFilter('all');
    setPage(1);
  };

  const hasActiveFilters = search || departmentFilter !== 'all' || designationFilter !== 'all' || divisionFilter !== 'all';

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentFilter !== 'all') params.append('department_id', departmentFilter);
      if (designationFilter !== 'all') params.append('designation_id', designationFilter);
      if (divisionFilter !== 'all') params.append('division_id', divisionFilter);

      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1').replace(/\/$/, '');
      const response = await fetch(
        `${apiBaseUrl}/users/directory/export/excel?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `address-book-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentFilter !== 'all') params.append('department_id', departmentFilter);
      if (designationFilter !== 'all') params.append('designation_id', designationFilter);
      if (divisionFilter !== 'all') params.append('division_id', divisionFilter);

      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1').replace(/\/$/, '');
      const response = await fetch(
        `${apiBaseUrl}/users/directory/export/pdf?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `address-book-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Address Book</h1>
            <p className="text-sm text-muted-foreground">Organization directory with contact information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExporting}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border p-4 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, phone..."
                className="pl-10"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={departmentFilter} onValueChange={handleDepartmentFilter}>
              <SelectTrigger id="department">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departmentsData?.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Designation Filter */}
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Select value={designationFilter} onValueChange={handleDesignationFilter}>
              <SelectTrigger id="designation">
                <SelectValue placeholder="All designations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All designations</SelectItem>
                {designationsData?.map((designation: any) => (
                  <SelectItem key={designation.id} value={designation.id.toString()}>
                    {designation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Division Filter */}
          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Select value={divisionFilter} onValueChange={handleDivisionFilter}>
              <SelectTrigger id="division">
                <SelectValue placeholder="All divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All divisions</SelectItem>
                {divisionsData?.map((division: any) => (
                  <SelectItem key={division.id} value={division.id.toString()}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
            <span className="text-sm text-muted-foreground">
              {total} result{total !== 1 ? 's' : ''} found
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No contacts found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {hasActiveFilters
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'No users found in the organization directory.'}
            </p>
          </div>
        ) : (
          <>
            <AddressBookTableView users={users} />
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
