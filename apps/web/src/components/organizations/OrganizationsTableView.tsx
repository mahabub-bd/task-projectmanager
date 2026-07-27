import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Globe, Mail, MapPin, Phone, Trash2 } from 'lucide-react';
import {
  getOrganizationAvatarColor,
  getOrganizationInitials,
} from './utils/organizations-page.utils';

interface OrganizationsTableViewProps {
  organizations: any[];
  onEditOrganization: (organization: any) => void;
  onDeleteOrganization: (organizationId: number, organizationName: string) => void;
  onNavigate?: (path: string) => void;
}

export default function OrganizationsTableView({
  organizations,
  onEditOrganization,
  onDeleteOrganization,
  onNavigate,
}: OrganizationsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((organization: any) => (
          <TableRow
            key={organization.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onNavigate?.(`/organizations/${organization.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {organization.logo_url ? (
                    <AvatarImage src={organization.logo_url} alt={organization.name} />
                  ) : null}
                  <AvatarFallback className={getOrganizationAvatarColor(organization.name)}>
                    {getOrganizationInitials(organization.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{organization.name}</p>
                  {organization.website && (
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      {organization.website}
                    </p>
                  )}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="space-y-1">
                {organization.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{organization.email}</span>
                  </div>
                )}
                {organization.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{organization.phone}</span>
                  </div>
                )}
              </div>
            </TableCell>

            <TableCell>
              {organization.address ? (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-2 max-w-xs">{organization.address}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>

            <TableCell>
              <Badge variant="secondary">Active</Badge>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" onClick={() => onEditOrganization(organization)} title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteOrganization(organization.id, organization.name)}
                  className="text-destructive hover:text-destructive"
                  title="Delete"
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
