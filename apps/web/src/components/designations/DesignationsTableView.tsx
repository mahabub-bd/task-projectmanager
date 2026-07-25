import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Edit, Trash2 } from 'lucide-react';
import { getDesignationAvatarColor, getDesignationInitials } from './utils/designations-page.utils';

interface DesignationsTableViewProps {
  designations: any[];
  onEditDesignation: (designation: any) => void;
  onDeleteDesignation: (designationId: number) => void;
  onDesignationClick?: (designationId: number) => void;
}

export default function DesignationsTableView({
  designations,
  onEditDesignation,
  onDeleteDesignation,
  onDesignationClick,
}: DesignationsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Designation</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Department</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {designations.map((designation: any) => (
          <TableRow
            key={designation.id}
            className={onDesignationClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            onClick={() => onDesignationClick?.(designation.id)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getDesignationAvatarColor(
                    designation.name
                  )}`}
                >
                  {getDesignationInitials(designation.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{designation.name}</p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-xs">
                <p
                  className="truncate text-sm text-muted-foreground"
                  title={designation.description}
                >
                  {designation.description || '-'}
                </p>
              </div>
            </TableCell>

            <TableCell>
              {designation.department ? (
                <Badge variant="outline" className="gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {designation.department.name}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>

            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditDesignation(designation);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDesignation(designation.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
