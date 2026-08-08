import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showStats?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  showStats = true,
}: TablePaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Mobile view: compact pagination with prev/next and page input
  const renderMobilePagination = () => (
    <div className="flex items-center justify-between gap-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 px-3"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Prev</span>
      </Button>

      {/* Current Page Display */}
      <div className="flex items-center gap-1 text-sm">
        <span className="text-muted-foreground">Page</span>
        <span className="font-semibold text-foreground min-w-[2rem] text-center">{currentPage}</span>
        <span className="text-muted-foreground">/ {totalPages}</span>
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 px-3"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  // Desktop view: full pagination with page numbers
  const renderDesktopPagination = () => (
    <Pagination className="sm:justify-end">
      <PaginationContent>
        {/* First page */}
        {totalPages > 3 && currentPage > 2 && (
          <PaginationItem className="hidden md:inline-flex">
            <PaginationLink
              onClick={() => onPageChange(1)}
              className="cursor-pointer w-9 h-9 p-0 flex items-center justify-center"
            >
              <SkipBack className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {getPageNumbers(currentPage, totalPages).map((pageNum, index) => {
          if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNum as number} className="hidden sm:inline-flex">
              <PaginationLink
                onClick={() => onPageChange(pageNum as number)}
                isActive={currentPage === pageNum}
                className="cursor-pointer w-9 h-9"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {/* Last page */}
        {totalPages > 3 && currentPage < totalPages - 1 && (
          <PaginationItem className="hidden md:inline-flex">
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer w-9 h-9 p-0 flex items-center justify-center"
            >
              <SkipForward className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Stats - Compact on mobile */}
      {showStats && (
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground px-1">
          <span>
            <span className="font-semibold text-foreground">{startItem}</span>
            <span className="mx-1">-</span>
            <span className="font-semibold text-foreground">{endItem}</span>
            <span className="mx-1">of</span>
            <span className="font-semibold text-foreground">{totalItems.toLocaleString()}</span>
          </span>
          <span className="hidden sm:inline">results</span>
        </div>
      )}

      {!showStats && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>Page</span>
          <span className="font-semibold text-foreground">{currentPage}</span>
          <span>of</span>
          <span className="font-semibold text-foreground">{totalPages}</span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Pagination - Different layouts for mobile/desktop */}
        <div className="w-full sm:w-auto">
          {/* Mobile: Show compact pagination */}
          <div className="sm:hidden">
            {renderMobilePagination()}
          </div>

          {/* Desktop: Show full pagination */}
          {totalPages > 1 && (
            <div className="hidden sm:block">
              {renderDesktopPagination()}
            </div>
          )}
        </div>

        {/* Items per page selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <label htmlFor="items-per-page" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            <span className="hidden sm:inline">Rows per page:</span>
            <span className="sm:hidden">Rows:</span>
          </label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger id="items-per-page" className="h-8 w-16 sm:h-9 sm:w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()} className="text-center">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate page numbers with ellipsis
// Mobile-friendly: shows fewer pages on small screens
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 2) {
      // Near the beginning
      for (let i = 2; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis-end');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Near the end
      pages.push('ellipsis-start');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle - show current page and one on each side
      pages.push('ellipsis-start');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('ellipsis-end');
      pages.push(totalPages);
    }
  }

  return pages;
}
