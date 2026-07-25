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
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import OrganizationFormModal from '../components/organizations/OrganizationFormModal';
import PageLoadingState from '../components/PageLoadingState';
import { useDeleteOrganizationLogoMutation, useDeleteOrganizationMutation, useGetOrganizationQuery, useUploadOrganizationLogoMutation } from '../store/api';

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

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteOrganization(id || '').unwrap();
      toast.success('Organization deleted successfully');
      navigate('/organizations');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete organization');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      await uploadLogo({ id, file }).unwrap();
      toast.success('Logo uploaded successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to upload logo');
    }
  };

  const handleLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the logo?')) {
      return;
    }

    try {
      await deleteLogo(id || '').unwrap();
      toast.success('Logo removed successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove logo');
    }
  };

  const getOrganizationInitials = (name: string) => {
    if (!name) return 'NA';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-cyan-500',
      'bg-amber-500',
      'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
          <div className="flex items-start gap-6">
            {/* Logo Section */}
            <div className="relative group">
              {organization.logo_url ? (
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={organization.logo_url} alt={organization.name} />
                    <AvatarFallback className={getAvatarColor(organization.name) + ' text-white text-2xl'}>
                      {getOrganizationInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 text-white hover:text-white/80" />
                    </label>
                    <button onClick={handleLogoDelete} className="hover:text-white/80">
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className={getAvatarColor(organization.name) + ' text-white text-2xl'}>
                      {getOrganizationInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="logo-upload"
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </label>
                </div>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Organization Info */}
            <div className="flex-1">
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
          </div>
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
            <div className="space-y-2">
              {organization.departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{dept.users?.length || 0} members</Badge>
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
            <div className="space-y-3">
              {organization.users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
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
