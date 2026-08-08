import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Shield } from 'lucide-react';

interface AuditLogsFiltersProps {
  searchQuery: string;
  actionFilter: string;
  entityFilter: string;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  uniqueActions: string[];
  uniqueEntityTypes: string[];
}

export function AuditLogsFilters({
  searchQuery,
  actionFilter,
  entityFilter,
  onSearchChange,
  onActionChange,
  onEntityChange,
  uniqueActions,
  uniqueEntityTypes,
}: AuditLogsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search - Full width on all devices */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by user, action, or entity..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Action Filter */}
        <div className="space-y-2">
          <Label htmlFor="action-filter" className="text-sm text-muted-foreground">
            Action
          </Label>
          <Select
            value={actionFilter || 'all'}
            onValueChange={(value) => onActionChange(value === 'all' ? '' : value)}
          >
            <SelectTrigger id="action-filter" className="h-11">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entity Filter */}
        <div className="space-y-2">
          <Label htmlFor="entity-filter" className="text-sm text-muted-foreground">
            Entity Type
          </Label>
          <Select
            value={entityFilter || 'all'}
            onValueChange={(value) => onEntityChange(value === 'all' ? '' : value)}
          >
            <SelectTrigger id="entity-filter" className="h-11">
              <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {uniqueEntityTypes.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
