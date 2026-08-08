import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Globe, Mail, MapPin, Phone, Trash2, Building2 } from 'lucide-react';
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

// Mobile card view component
function MobileOrganizationCard({
  organization,
  onEditOrganization,
  onDeleteOrganization,
  onNavigate,
}: {
  organization: any;
  onEditOrganization: (organization: any) => void;
  onDeleteOrganization: (organizationId: number, organizationName: string) => void;
  onNavigate?: (path: string) => void;
}) {
  const hasContact = organization.email || organization.phone;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        {/* Header with avatar and name */}
        <div
          className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 cursor-pointer"
          onClick={() => onNavigate?.(`/organizations/${organization.id}`)}
        >
          <Avatar className="h-10 w-10 sm:h-10 sm:w-10 shrink-0">
            {organization.logo_url ? (
              <AvatarImage src={organization.logo_url} alt={organization.name} />
            ) : null}
            <AvatarFallback className={getOrganizationAvatarColor(organization.name)}>
              {getOrganizationInitials(organization.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base truncate">{organization.name}</p>
            {organization.website && (
              <p className="flex items-center gap-1 truncate text-[10px] sm:text-xs text-muted-foreground">
                <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                {organization.website}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        {hasContact && (
          <div className="space-y-1 mb-3 sm:mb-4">
            {organization.email && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <a
                  href={`mailto:${organization.email}`}
                  className="truncate hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  {organization.email}
                </a>
              </div>
            )}
            {organization.phone && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <a
                  href={`tel:${organization.phone}`}
                  className="truncate hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  {organization.phone}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Location */}
        {organization.address && (
          <div className="flex items-start gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <MapPin className="h-2.5 w-2.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground mt-0.5" />
            <span className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2">
              {organization.address}
            </span>
          </div>
        )}

        {/* Status badge and action buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t">
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            Active
          </Badge>
          <div className="flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditOrganization(organization)}
              className="h-7 sm:h-8 w-7 sm:w-8 p-0"
              title="Edit"
            >
              <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteOrganization(organization.id, organization.name)}
              className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-destructive hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrganizationsTableView({
  organizations,
  onEditOrganization,
  onDeleteOrganization,
  onNavigate,
}: OrganizationsTableViewProps) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-2 sm:space-y-3 md:hidden">
        {organizations.map((organization: any) => (
          <MobileOrganizationCard
            key={organization.id}
            organization={organization}
            onEditOrganization={onEditOrganization}
            onDeleteOrganization={onDeleteOrganization}
            onNavigate={onNavigate}
          />
        ))}
        {organizations.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Building2 className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No organizations to display</p>
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
      </div>
    </>
  );
}
