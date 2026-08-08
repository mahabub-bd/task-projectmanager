import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Building2, Edit, Trash2, FolderKanban, ChevronRight } from 'lucide-react';
import { getDepartmentAvatarColor, getDepartmentInitials } from './utils/departments-page.utils';


interface DepartmentsTableViewProps {
  departments: any[];
  onEditDepartment: (department: any) => void;
  onDeleteDepartment: (departmentId: number, departmentName: string) => void;
  onDepartmentClick?: (departmentId: number) => void;
}

// Mobile card view component
function MobileDepartmentCard({
  department,
  onEditDepartment,
  onDeleteDepartment,
  onDepartmentClick,
}: {
  department: any;
  onEditDepartment: (department: any) => void;
  onDeleteDepartment: (departmentId: number, departmentName: string) => void;
  onDepartmentClick?: (departmentId: number) => void;
}) {
  const hasDivision = department.division;
  const hasOrganization = department.organization;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar and name */}
        <div
          className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 cursor-pointer"
          onClick={() => onDepartmentClick?.(department.id)}
        >
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-sm font-semibold text-white shadow-md ${getDepartmentAvatarColor(department.name)}`}
          >
            {getDepartmentInitials(department.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{department.name}</p>
            {department.description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 truncate">{department.description}</p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
        </div>

        {/* Division and Organization badges */}
        {(hasDivision || hasOrganization) && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {hasDivision && (
              <Badge variant="outline" className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <FolderKanban className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {department.division.name}
              </Badge>
            )}
            {hasOrganization && (
              <Badge variant="outline" className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 sm:px-2 py-0.5">
                <Building className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {department.organization.name}
              </Badge>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditDepartment(department)}
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5"
          >
            <Edit className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteDepartment(department.id, department.name)}
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

export default function DepartmentsTableView({
  departments,
  onEditDepartment,
  onDeleteDepartment,
  onDepartmentClick,
}: DepartmentsTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {departments.map((department: any) => (
          <MobileDepartmentCard
            key={department.id}
            department={department}
            onEditDepartment={onEditDepartment}
            onDeleteDepartment={onDeleteDepartment}
            onDepartmentClick={onDepartmentClick}
          />
        ))}
        {departments.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Building2 className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No departments to display</p>
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
              <TableHead>Department</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department: any) => (
              <TableRow
                key={department.id}
                className={onDepartmentClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onDepartmentClick?.(department.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getDepartmentAvatarColor(department.name)}`}
                    >
                      {getDepartmentInitials(department.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{department.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground" title={department.description}>
                      {department.description || '-'}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  {department.division ? (
                    <Badge variant="outline" className="gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5" />
                      {department.division.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell>
                  {department.organization ? (
                    <Badge variant="outline" className="gap-1.5">
                      <Building className="h-3.5 w-3.5" />
                      {department.organization.name}
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
                        onEditDepartment(department);
                      }}
                      title="Edit department"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDepartment(department.id, department.name);
                      }}
                      title="Delete department"
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
