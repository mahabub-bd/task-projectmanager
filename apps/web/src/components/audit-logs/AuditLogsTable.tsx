import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLog } from '@/types/notifications';
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, ChevronDown, ChevronRight, FileText, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface AuditLogsTableProps {
  logs: AuditLog[];
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

  const getActionIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('add')) {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
    if (lowerAction.includes('update') || lowerAction.includes('edit')) {
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
      return <Trash2 className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('add')) {
      return 'default';
    }
    if (lowerAction.includes('update') || lowerAction.includes('edit')) {
      return 'secondary';
    }
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
      return 'destructive';
    }
    return 'outline';
  };

  const getEntityBadgeColor = (entityType: string) => {
    const colors: Record<string, string> = {
      User: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      Department: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      Role: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      Permission: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      Organization: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
      Task: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
      Project: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
      Milestone: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    };
    return colors[entityType] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  };

  const renderMobileCard = (log: AuditLog) => {
    const isExpanded = expandedRows.has(String(log.id));
    const hasDetails = log.description || log.old_values || log.new_values;

    return (
      <Card key={log.id} className="mb-3 overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => toggleRow(String(log.id))}
          className="w-full justify-between px-4 py-3 h-auto hover:bg-muted/50 rounded-none"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <p className="font-medium text-sm truncate w-full">
                {log.user?.name || 'System'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {getActionIcon(log.action)}
                <Badge variant={getActionBadgeVariant(log.action)} className="font-normal text-xs">
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={`font-normal text-xs ${getEntityBadgeColor(log.entity_type)}`}>
              {log.entity_type}
            </Badge>
            {hasDetails && (
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
        </Button>

        {isExpanded && (
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {/* Timestamp & IP */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(log.created_at), 'PPp')}</span>
              </div>
              {log.ip_address && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <code className="bg-muted px-2 py-0.5 rounded font-mono">
                    {log.ip_address}
                  </code>
                </>
              )}
            </div>

            {/* Entity ID */}
            {log.entity_id && (
              <div className="text-xs">
                <span className="text-muted-foreground">Entity ID: </span>
                <span className="font-mono">{log.entity_id}</span>
              </div>
            )}

            {/* Description */}
            {log.description && (
              <div className="text-sm pt-2 border-t">
                <p className="font-medium">{log.description}</p>
              </div>
            )}

            {/* Changes */}
            {(log.old_values || log.new_values) && (
              <div className="space-y-2 pt-2 border-t">
                {log.old_values && Object.keys(log.old_values).length > 0 && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Before:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {Object.entries(log.old_values).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="truncate">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {log.new_values && Object.keys(log.new_values).length > 0 && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">After:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {Object.entries(log.new_values).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="truncate">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  const renderDesktopTable = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-50 hidden md:table-cell">User</TableHead>
                <TableHead className="w-35">Action</TableHead>
                <TableHead className="w-45 hidden lg:table-cell">Entity</TableHead>
                <TableHead className="hidden xl:table-cell">Details</TableHead>
                <TableHead className="w-50 hidden lg:table-cell">Timestamp</TableHead>
                <TableHead className="w-35 hidden xl:table-cell">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  {/* User - hidden on mobile */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{log.user?.name || 'System'}</p>
                        {log.user?.email && (
                          <p className="text-xs text-muted-foreground truncate">{log.user.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Action - always visible */}
                  <TableCell>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <Badge variant={getActionBadgeVariant(log.action)} className="font-normal">
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </Badge>
                      </div>
                      {/* Mobile: show user name below action */}
                      <div className="md:hidden flex items-center gap-2 text-xs text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        <span className="truncate">{log.user?.name || 'System'}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Entity - hidden on small screens */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <Badge variant="outline" className={`font-normal ${getEntityBadgeColor(log.entity_type)}`}>
                        {log.entity_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground font-mono">ID: {log.entity_id}</p>
                    </div>
                  </TableCell>

                  {/* Details - hidden on medium screens */}
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-sm max-w-md space-y-2">
                      {log.description && (
                        <p className="text-foreground font-medium">{log.description}</p>
                      )}
                      {(log.old_values || log.new_values) && (
                        <div className="space-y-1.5 rounded-lg bg-muted/50 p-2">
                          {log.old_values && Object.keys(log.old_values).length > 0 && (
                            <div className="text-xs">
                              <span className="text-red-600 dark:text-red-400 font-semibold">Before: </span>
                              <span className="text-muted-foreground">
                                {Object.entries(log.old_values).map(([key, value]) => `${key}: ${value}`).join(', ')}
                              </span>
                            </div>
                          )}
                          {log.new_values && Object.keys(log.new_values).length > 0 && (
                            <div className="text-xs">
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">After: </span>
                              <span className="text-muted-foreground">
                                {Object.entries(log.new_values).map(([key, value]) => `${key}: ${value}`).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {!log.description && !log.old_values && !log.new_values && (
                        <span className="text-muted-foreground italic">No details available</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Timestamp - hidden on small screens */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{format(new Date(log.created_at), 'PPp')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {format(new Date(log.created_at), 'HH:mm:ss')}
                      </p>
                    </div>
                  </TableCell>

                  {/* IP Address - hidden on medium screens */}
                  <TableCell className="hidden xl:table-cell">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {log.ip_address || '-'}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Mobile Card Layout - visible only on small screens */}
      <div className="md:hidden space-y-0">
        {logs.map((log) => renderMobileCard(log))}
      </div>

      {/* Desktop Table Layout - hidden on small screens */}
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>
    </>
  );
}
