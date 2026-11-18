import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';

interface AuditLogsFiltersProps {
  searchQuery: string;
  actionFilter: string;
  entityFilter: string;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onClear?: () => void;
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
  onClear,
  uniqueActions,
  uniqueEntityTypes,
}: AuditLogsFiltersProps) {
  const hasFilters = Boolean(searchQuery || actionFilter || entityFilter);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </div>
        {hasFilters && onClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 gap-1 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <Label htmlFor="audit-search" className="sr-only">
            Search audit logs
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="audit-search"
              type="text"
              placeholder="Search by user, action, or entity..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-9 rounded-lg pl-9 text-sm"
            />
          </div>
        </div>

        <div className="min-w-0">
          <Label htmlFor="action-filter" className="sr-only">
            Action
          </Label>
          <Select
            value={actionFilter || 'all'}
            onValueChange={(value) => onActionChange(value === 'all' ? '' : value)}
          >
            <SelectTrigger id="action-filter" className="h-9 rounded-lg text-sm">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <Label htmlFor="entity-filter" className="sr-only">
            Entity type
          </Label>
          <Select
            value={entityFilter || 'all'}
            onValueChange={(value) => onEntityChange(value === 'all' ? '' : value)}
          >
            <SelectTrigger id="entity-filter" className="h-9 rounded-lg text-sm">
              <ShieldCheck className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
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
