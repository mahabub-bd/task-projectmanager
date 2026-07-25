import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterOption } from '@/types/components';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  filters?: {
    status?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
    priority?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
  };
  viewMode?: {
    value: 'list' | 'grid';
    onChange: (value: 'list' | 'grid') => void;
  };
  onRefresh?: () => void;
  extraActions?: ReactNode;
  className?: string;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  addButton,
  filters,
  viewMode,
  onRefresh,
  extraActions,
  className = '',
}: FilterBarProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 pl-10"
            />
          </div>

          {filters?.status && (
            <Select value={filters.status.value} onValueChange={filters.status.onChange}>
              <SelectTrigger className="h-10 w-full lg:w-45">
                <SelectValue placeholder={filters.status.placeholder || "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                {filters.status.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filters?.priority && (
            <Select value={filters.priority.value} onValueChange={filters.priority.onChange}>
              <SelectTrigger className="h-10 w-full lg:w-45">
                <SelectValue placeholder={filters.priority.placeholder || "Filter by priority"} />
              </SelectTrigger>
              <SelectContent>
                {filters.priority.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center gap-2">
            {viewMode && (
              <div className="inline-flex h-10 rounded-md border bg-background p-1">
                <Button
                  type="button"
                  variant={viewMode.value === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => viewMode.onChange('list')}
                  className="h-full gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
                <Button
                  type="button"
                  variant={viewMode.value === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => viewMode.onChange('grid')}
                  className="h-full gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </Button>
              </div>
            )}

            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="h-10">
                Refresh
              </Button>
            )}

            {addButton && (
              <Button onClick={addButton.onClick} className="h-10">
                <Plus className="mr-2 h-4 w-4" />
                {addButton.label}
              </Button>
            )}

            {extraActions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
