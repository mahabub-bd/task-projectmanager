import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Edit, Trash2, FolderKanban } from 'lucide-react';
import { getDepartmentAvatarColor, getDepartmentInitials } from './utils/departments-page.utils';


interface DepartmentsTableViewProps {
  departments: any[];
  onEditDepartment: (department: any) => void;
  onDeleteDepartment: (departmentId: number, departmentName: string) => void;
  onDepartmentClick?: (departmentId: number) => void;
}

export default function DepartmentsTableView({
  departments,
  onEditDepartment,
  onDeleteDepartment,
  onDepartmentClick,
}: DepartmentsTableViewProps) {
  return (
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
  );
}
