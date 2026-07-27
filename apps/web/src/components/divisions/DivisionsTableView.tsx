import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Edit, Trash2, Users } from 'lucide-react';

interface DivisionsTableViewProps {
  divisions: any[];
  onEditDivision: (division: any) => void;
  onDeleteDivision: (divisionId: number, divisionName: string) => void;
  onDivisionClick?: (divisionId: number) => void;
}

function getDivisionInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getDivisionAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function DivisionsTableView({
  divisions,
  onEditDivision,
  onDeleteDivision,
  onDivisionClick,
}: DivisionsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Division</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Parent Division</TableHead>
          <TableHead>Departments Count</TableHead>
          <TableHead>Users Count</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {divisions.map((division: any) => (
          <TableRow
            key={division.id}
            className={onDivisionClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            onClick={() => onDivisionClick?.(division.id)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ${getDivisionAvatarColor(division.name)}`}
                >
                  {getDivisionInitials(division.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{division.name}</p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-xs">
                <p className="truncate text-sm text-muted-foreground" title={division.description}>
                  {division.description || '-'}
                </p>
              </div>
            </TableCell>

            <TableCell>
              {division.parent ? (
                <Badge variant="outline" className="gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {division.parent.name}
                </Badge>
              ) : (
                <Badge variant="secondary">Root</Badge>
              )}
            </TableCell>

            <TableCell>
              <Badge variant="outline">
                {division.departments?.length || 0} Departments
              </Badge>
            </TableCell>

            <TableCell>
              <Badge variant="outline" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {division.users_count || 0} Users
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditDivision(division);
                  }}
                  title="Edit division"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDivision(division.id, division.name);
                  }}
                  title="Delete division"
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
