import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  FolderKanban,
  Globe,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Upload,
  Users,
  ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';
import { useNavigate, useParams } from 'react-router-dom';
import OrganizationFormModal from '../components/organizations/OrganizationFormModal';
import PageLoadingState from '../components/PageLoadingState';
import { useDeleteOrganizationLogoMutation, useDeleteOrganizationMutation, useGetOrganizationQuery, useUploadOrganizationLogoMutation, useUploadOrganizationDarkLogoMutation, useUploadOrganizationLightLogoMutation, useDeleteOrganizationDarkLogoMutation, useDeleteOrganizationLightLogoMutation } from '../store/api';

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);


  const { data: organization, isLoading, refetch } = useGetOrganizationQuery(id || '', {
    skip: !id,
  });

  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [uploadLogo] = useUploadOrganizationLogoMutation();
  const [deleteLogo] = useDeleteOrganizationLogoMutation();
  const [uploadDarkLogo] = useUploadOrganizationDarkLogoMutation();
  const [deleteDarkLogo] = useDeleteOrganizationDarkLogoMutation();
  const [uploadLightLogo] = useUploadOrganizationLightLogoMutation();
  const [deleteLightLogo] = useDeleteOrganizationLightLogoMutation();

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteOrganization(id || '').unwrap();
      toastSuccess('Organization deleted successfully');
      navigate('/organizations');
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to delete organization');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('File size must be less than 5MB');
      return;
    }

    try {
      await uploadLogo({ id, file }).unwrap();
      toastSuccess('Logo uploaded successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to upload logo');
    }
  };

  const handleLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the logo?')) {
      return;
    }

    try {
      await deleteLogo(id || '').unwrap();
      toastSuccess('Logo removed successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to remove logo');
    }
  };

  const handleDarkLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('File size must be less than 5MB');
      return;
    }

    try {
      await uploadDarkLogo({ id, file }).unwrap();
      toastSuccess('Dark logo uploaded successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to upload dark logo');
    }
  };

  const handleDarkLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the dark logo?')) {
      return;
    }

    try {
      await deleteDarkLogo(id || '').unwrap();
      toastSuccess('Dark logo removed successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to remove dark logo');
    }
  };

  const handleLightLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('File size must be less than 5MB');
      return;
    }

    try {
      await uploadLightLogo({ id, file }).unwrap();
      toastSuccess('Light logo uploaded successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to upload light logo');
    }
  };

  const handleLightLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the light logo?')) {
      return;
    }

    try {
      await deleteLightLogo(id || '').unwrap();
      toastSuccess('Light logo removed successfully');
      refetch();
    } catch (error: any) {
      toastError(error?.data?.message || 'Failed to remove light logo');
    }
  };

  if (isLoading) {
    return <PageLoadingState message="Loading organization details..." />;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Organization not found</h2>
        <Button onClick={() => navigate('/organizations')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>
      </div>
    );
  }

  const totalDepartments = organization.departments?.length || 0;
  const totalUsers = organization.users?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/organizations')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Organization Details</h1>
            <p className="text-muted-foreground">View and manage organization information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Organization Overview Card */}
      <Card>
        <CardContent className="p-6">
          {/* Organization Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{organization.name}</h2>
                {organization.description && (
                  <p className="text-muted-foreground mt-1">{organization.description}</p>
                )}
              </div>
              <Badge variant={organization.is_active ? 'default' : 'secondary'}>
                {organization.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {organization.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              )}
              {organization.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${organization.email}`} className="hover:text-primary">
                    {organization.email}
                  </a>
                </div>
              )}
              {organization.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${organization.phone}`} className="hover:text-primary">
                    {organization.phone}
                  </a>
                </div>
              )}
              {organization.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{organization.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created {new Date(organization.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <p className="text-sm text-muted-foreground">Manage organization logos for different themes</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default Logo */}
            <div className="space-y-2">
              <div className="font-medium text-sm">Default Logo</div>
              <div className="relative group">
                {organization.logo_url ? (
                  <div className="relative">
                    <img
                      src={organization.logo_url}
                      alt="Organization logo"
                      className="h-32 w-full rounded-lg object-contain border"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label htmlFor="logo-upload" className="cursor-pointer p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Upload className="h-4 w-4 text-white" />
                      </label>
                      <button onClick={handleLogoDelete} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <label
                      htmlFor="logo-upload"
                      className="absolute inset-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dark Logo */}
            <div className="space-y-2">
              <div className="font-medium text-sm">Dark Logo (Dark Theme)</div>
              <div className="relative group">
                {organization.dark_logo_url ? (
                  <div className="relative">
                    <img
                      src={organization.dark_logo_url}
                      alt="Organization dark logo"
                      className="h-32 w-full rounded-lg object-contain border bg-slate-900"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label htmlFor="dark-logo-upload" className="cursor-pointer p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Upload className="h-4 w-4 text-white" />
                      </label>
                      <button onClick={handleDarkLogoDelete} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <label
                      htmlFor="dark-logo-upload"
                      className="absolute inset-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Light Logo */}
            <div className="space-y-2">
              <div className="font-medium text-sm">Light Logo (Light Theme)</div>
              <div className="relative group">
                {organization.light_logo_url ? (
                  <div className="relative">
                    <img
                      src={organization.light_logo_url}
                      alt="Organization light logo"
                      className="h-32 w-full rounded-lg object-contain border"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label htmlFor="light-logo-upload" className="cursor-pointer p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Upload className="h-4 w-4 text-white" />
                      </label>
                      <button onClick={handleLightLogoDelete} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <label
                      htmlFor="light-logo-upload"
                      className="absolute inset-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <input
            id="dark-logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDarkLogoUpload}
          />
          <input
            id="light-logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLightLogoUpload}
          />
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Total departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total users</p>
          </CardContent>
        </Card>
      </div>

      {/* Departments */}
      {organization.departments && organization.departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{dept.name}</p>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">{dept.user_count || 0} members</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users */}
      {organization.users && organization.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.department_name && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Dept:</span>
                        <span className="truncate">{user.department_name}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="shrink-0">
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Form Modal */}
      <OrganizationFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingOrganization={organization}
      />
    </div>
  );
}
