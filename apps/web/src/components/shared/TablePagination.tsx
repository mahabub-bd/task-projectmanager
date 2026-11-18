import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkipBack, SkipForward } from 'lucide-react';
import { useId } from 'react';

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
  const selectId = useId();
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const startItem = totalItems > 0 ? (safeCurrentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      {/* Result summary */}
      <p className="text-xs text-muted-foreground">
        {showStats ? (
          <>
            Showing{' '}
            <span className="font-semibold tabular-nums text-foreground">{startItem}</span>
            {' - '}
            <span className="font-semibold tabular-nums text-foreground">{endItem}</span>
            {' of '}
            <span className="font-semibold tabular-nums text-foreground">
              {totalItems.toLocaleString()}
            </span>{' '}
            results
          </>
        ) : (
          <>
            Page{' '}
            <span className="font-semibold tabular-nums text-foreground">{safeCurrentPage}</span>
            {' of '}
            <span className="font-semibold tabular-nums text-foreground">{safeTotalPages}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="whitespace-nowrap text-xs text-muted-foreground">
            <span className="hidden sm:inline">Rows per page:</span>
            <span className="sm:hidden">Rows:</span>
          </label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger
              id={selectId}
              className="h-8 w-[4.5rem] rounded-lg text-xs sm:w-[5rem]"
            >
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

        {/* Page controls */}
        <Pagination>
          <PaginationContent>
            <PaginationItem className="hidden sm:flex">
              <PaginationLink
                aria-label="Go to first page"
                title="First page"
                onClick={() => onPageChange(1)}
                disabled={safeCurrentPage <= 1}
              >
                <SkipBack className="h-3.5 w-3.5" />
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
              />
            </PaginationItem>

            <PaginationItem className="sm:hidden">
              <span className="px-1.5 text-xs font-semibold tabular-nums text-foreground">
                {safeCurrentPage} / {safeTotalPages}
              </span>
            </PaginationItem>

            {getPageNumbers(safeCurrentPage, safeTotalPages).map((pageNum, index) => {
              if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
                return (
                  <PaginationItem key={`ellipsis-${index}`} className="hidden sm:flex">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNum} className="hidden sm:flex">
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={safeCurrentPage === pageNum}
                    aria-label={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= safeTotalPages}
              />
            </PaginationItem>

            <PaginationItem className="hidden sm:flex">
              <PaginationLink
                aria-label="Go to last page"
                title="Last page"
                onClick={() => onPageChange(safeTotalPages)}
                disabled={safeCurrentPage >= safeTotalPages}
              >
                <SkipForward className="h-3.5 w-3.5" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

// Helper function to generate page numbers with ellipsis
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage <= 2) {
    pages.push(2, 3, 'ellipsis-end', totalPages);
  } else if (currentPage >= totalPages - 1) {
    pages.push('ellipsis-start', totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push('ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages);
  }

  return pages;
}
