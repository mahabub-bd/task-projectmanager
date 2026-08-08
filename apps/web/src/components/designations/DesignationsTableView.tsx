import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Edit, Trash2, ChevronRight } from 'lucide-react';
import { getDesignationAvatarColor, getDesignationInitials } from './utils/designations-page.utils';

interface DesignationsTableViewProps {
  designations: any[];
  onEditDesignation: (designation: any) => void;
  onDeleteDesignation: (designationId: number, designationName: string) => void;
  onDesignationClick?: (designationId: number) => void;
}

// Mobile card view component
function MobileDesignationCard({
  designation,
  onEditDesignation,
  onDeleteDesignation,
  onDesignationClick,
}: {
  designation: any;
  onEditDesignation: (designation: any) => void;
  onDeleteDesignation: (designationId: number, designationName: string) => void;
  onDesignationClick?: (designationId: number) => void;
}) {
  return (
    <Card className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => onDesignationClick?.(designation.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md shrink-0 ${getDesignationAvatarColor(designation.name)}`}
            >
              {getDesignationInitials(designation.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{designation.name}</p>
              {designation.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{designation.description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>

        {designation.department && (
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="gap-1.5 text-xs">
              <Building2 className="h-3 w-3" />
              {designation.department.name}
            </Badge>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEditDesignation(designation);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDesignation(designation.id, designation.name);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DesignationsTableView({
  designations,
  onEditDesignation,
  onDeleteDesignation,
  onDesignationClick,
}: DesignationsTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {designations.map((designation: any) => (
          <MobileDesignationCard
            key={designation.id}
            designation={designation}
            onEditDesignation={onEditDesignation}
            onDeleteDesignation={onDeleteDesignation}
            onDesignationClick={onDesignationClick}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                        onDeleteDesignation(designation.id, designation.name);
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
      </div>
    </>
  );
}
