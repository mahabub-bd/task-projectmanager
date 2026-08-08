import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Briefcase, Edit, Trash2, ChevronRight } from 'lucide-react';
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
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar and name */}
        <div
          className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 cursor-pointer"
          onClick={() => onDesignationClick?.(designation.id)}
        >
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-sm font-semibold text-white shadow-md ${getDesignationAvatarColor(designation.name)}`}
          >
            {getDesignationInitials(designation.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{designation.name}</p>
            {designation.description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 truncate">{designation.description}</p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
        </div>

        {/* Department badge */}
        {designation.department && (
          <div className="mb-2 sm:mb-3">
            <Badge variant="outline" className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
              <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {designation.department.name}
            </Badge>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditDesignation(designation)}
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5"
          >
            <Edit className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteDesignation(designation.id, designation.name)}
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">Delete</span>
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
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {designations.map((designation: any) => (
          <MobileDesignationCard
            key={designation.id}
            designation={designation}
            onEditDesignation={onEditDesignation}
            onDeleteDesignation={onDeleteDesignation}
            onDesignationClick={onDesignationClick}
          />
        ))}
        {designations.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Briefcase className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No designations to display</p>
              </div>
            </CardContent>
          </Card>
        )}
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
