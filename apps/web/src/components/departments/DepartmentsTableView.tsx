import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Edit, Trash2, FolderKanban, ChevronRight } from 'lucide-react';
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
  return (
    <Card className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => onDepartmentClick?.(department.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md shrink-0 ${getDepartmentAvatarColor(department.name)}`}
            >
              {getDepartmentInitials(department.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{department.name}</p>
              {department.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{department.description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          {department.division && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 text-xs">
                <FolderKanban className="h-3 w-3" />
                {department.division.name}
              </Badge>
            </div>
          )}

          {department.organization && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 text-xs">
                <Building className="h-3 w-3" />
                {department.organization.name}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEditDepartment(department);
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
              onDeleteDepartment(department.id, department.name);
            }}
          >
            <Trash2 className="h-4 w-4" />
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
      <div className="space-y-3 md:hidden">
        {departments.map((department: any) => (
          <MobileDepartmentCard
            key={department.id}
            department={department}
            onEditDepartment={onEditDepartment}
            onDeleteDepartment={onDeleteDepartment}
            onDepartmentClick={onDepartmentClick}
          />
        ))}
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
