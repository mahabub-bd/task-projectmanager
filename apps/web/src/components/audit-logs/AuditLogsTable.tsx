import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLog } from '@/types/notifications';
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, FileText, Trash2, User as UserIcon } from 'lucide-react';

interface AuditLogsTableProps {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-50">User</TableHead>
                <TableHead className="w-35">Action</TableHead>
                <TableHead className="w-45">Entity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-50">Timestamp</TableHead>
                <TableHead className="w-35">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  {/* User */}
                  <TableCell>
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

                  {/* Action */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <Badge variant={getActionBadgeVariant(log.action)} className="font-normal">
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Entity */}
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className={`font-normal ${getEntityBadgeColor(log.entity_type)}`}>
                        {log.entity_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground font-mono">ID: {log.entity_id}</p>
                    </div>
                  </TableCell>

                  {/* Details */}
                  <TableCell>
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

                  {/* Timestamp */}
                  <TableCell>
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

                  {/* IP Address */}
                  <TableCell>
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
}
