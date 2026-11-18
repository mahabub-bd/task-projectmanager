import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('dashboard-card divide-y divide-border/60 overflow-hidden', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-4 sm:px-5">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted/70" />
          </div>
          <div className="hidden h-6 w-20 animate-pulse rounded-md bg-muted sm:block" />
          <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
        </div>
      ))}
    </div>
  );
}
