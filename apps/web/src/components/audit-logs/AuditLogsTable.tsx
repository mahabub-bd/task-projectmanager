import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLog } from '@/types/notifications';
import { format } from 'date-fns';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface AuditLogsTableProps {
  logs: AuditLog[];
}

type ActionStyle = {
  icon: LucideIcon;
  badge: string;
  tile: string;
};

function getActionStyle(action: string): ActionStyle {
  const lowerAction = action.toLowerCase();

  if (lowerAction.includes('create') || lowerAction.includes('add')) {
    return {
      icon: CheckCircle2,
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    };
  }
  if (lowerAction.includes('update') || lowerAction.includes('edit')) {
    return {
      icon: AlertCircle,
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      tile: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
    };
  }
  if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
    return {
      icon: Trash2,
      badge: 'bg-destructive/10 text-destructive',
      tile: 'bg-destructive/10 text-destructive',
    };
  }
  return {
    icon: FileText,
    badge: 'bg-muted text-muted-foreground',
    tile: 'bg-muted text-muted-foreground',
  };
}

function getEntityBadgeColor(entityType: string) {
  const colors: Record<string, string> = {
    User: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    Department: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Role: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    Permission: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Organization: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
    Task: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    Project: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
    Milestone: 'bg-yellow-600/10 text-yellow-700 dark:text-yellow-300',
  };
  return colors[entityType] || 'bg-muted text-muted-foreground';
}

function ActionCell({ action }: { action: string }) {
  const style = getActionStyle(action);
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${style.tile}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <Badge variant="secondary" className={`border-0 font-normal ${style.badge}`}>
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </Badge>
    </div>
  );
}

function ChangeValues({ values, label }: { values: unknown; label: 'Before' | 'After' }) {
  if (!values || typeof values !== 'object' || Object.keys(values).length === 0) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
      <p
        className={`mb-1.5 text-[10px] font-semibold uppercase tracking-wide ${
          label === 'Before' ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {label}
      </p>
      <div className="space-y-1 text-xs text-muted-foreground">
        {Object.entries(values as Record<string, unknown>).map(([key, value]) => (
          <div key={key} className="flex min-w-0 gap-2">
            <span className="shrink-0 font-medium text-foreground">{key}:</span>
            <span className="min-w-0 truncate">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderMobileCard = (log: AuditLog) => {
    const id = String(log.id);
    const isExpanded = expandedRows.has(id);
    const hasDetails = Boolean(log.description || log.old_values || log.new_values);

    return (
      <div key={id} className="dashboard-card overflow-hidden">
        <button
          type="button"
          onClick={() => toggleRow(id)}
          aria-expanded={isExpanded}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{log.user?.name || 'System'}</span>
            <span className="mt-1.5 block">
              <ActionCell action={log.action} />
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className={`border-0 font-normal ${getEntityBadgeColor(log.entity_type)}`}>
              {log.entity_type}
            </Badge>
            {hasDetails &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ))}
          </span>
        </button>

        {isExpanded && (
          <div className="space-y-3 border-t border-border/60 px-4 pb-4 pt-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {format(new Date(log.created_at), 'PPp')}
              </span>
              {log.ip_address && (
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                  {log.ip_address}
                </code>
              )}
              {log.entity_id && (
                <span className="font-mono">ID: {log.entity_id}</span>
              )}
            </div>

            {log.description && (
              <p className="text-sm text-foreground">{log.description}</p>
            )}

            {(log.old_values || log.new_values) && (
              <div className="grid gap-2 sm:grid-cols-2">
                <ChangeValues values={log.old_values} label="Before" />
                <ChangeValues values={log.new_values} label="After" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {logs.map((log) => renderMobileCard(log))}
      </div>

      {/* Desktop table */}
      <div className="dashboard-card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-56 pl-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  User
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Action
                </TableHead>
                <TableHead className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground lg:table-cell">
                  Entity
                </TableHead>
                <TableHead className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground xl:table-cell">
                  Details
                </TableHead>
                <TableHead className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground lg:table-cell">
                  Timestamp
                </TableHead>
                <TableHead className="hidden pr-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground xl:table-cell">
                  IP Address
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-border/60 transition-colors hover:bg-muted/35">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{log.user?.name || 'System'}</p>
                        {log.user?.email && (
                          <p className="truncate text-xs text-muted-foreground">{log.user.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <ActionCell action={log.action} />
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <Badge variant="secondary" className={`border-0 font-normal ${getEntityBadgeColor(log.entity_type)}`}>
                        {log.entity_type}
                      </Badge>
                      {log.entity_id && (
                        <p className="font-mono text-[11px] text-muted-foreground">ID: {log.entity_id}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell">
                    <div className="max-w-md space-y-2">
                      {log.description && <p className="text-sm font-medium">{log.description}</p>}
                      {(log.old_values || log.new_values) && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <ChangeValues values={log.old_values} label="Before" />
                          <ChangeValues values={log.new_values} label="After" />
                        </div>
                      )}
                      {!log.description && !log.old_values && !log.new_values && (
                        <span className="text-xs italic text-muted-foreground">No details available</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="whitespace-nowrap">{format(new Date(log.created_at), 'PPp')}</span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden pr-5 xl:table-cell">
                    <code className="rounded-md bg-muted px-2 py-1 font-mono text-[11px]">
                      {log.ip_address || '-'}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
