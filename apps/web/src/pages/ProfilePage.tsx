import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Calendar, ChevronRight, Key, Mail, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ChangePasswordDialog, EditProfileDialog } from '@/components/profile';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-base mt-1">{user.email}</CardDescription>
                </div>
              </div>
              <EditProfileDialog />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Organization Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Organization
                </div>
                <div className="flex items-center gap-3">
                  {user.organization_logo && (
                    <img
                      src={user.organization_logo}
                      alt={user.organization_name || 'Organization'}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{user.organization_name}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.organization_id}</p>
                  </div>
                </div>
              </div>

              {/* Department Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Department
                </div>
                <div>
                  <p className="font-semibold">{user.department_name}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.department_id}</p>
                </div>
              </div>
            </div>

            {/* Account Created */}
            {user.created_at && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(user.created_at)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roles Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  {user.roles?.length || 0} role{user.roles?.length !== 1 ? 's' : ''} assigned
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {user.roles && user.roles.length > 0 ? (
              <div className="space-y-3">
                {user.roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{role.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {role.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {role.permissions?.length || 0} permission{role.permissions?.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No roles assigned
              </p>
            )}
          </CardContent>
        </Card>

        {/* Permissions Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  {user.roles?.reduce((acc, role) => acc + (role.permissions?.length || 0), 0) || 0} total permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {user.roles && user.roles.length > 0 ? (
              <div className="space-y-4">
                {user.roles.map((role) => (
                  <div key={role.id} className="space-y-2">
                    <p className="text-sm font-semibold">{role.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions?.slice(0, 5).map((permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions && role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No permissions available
              </p>
            )}
            <Link to="/permissions">
              <Button variant="link" className="mt-4 p-0 h-auto text-sm">
                View all permissions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common account management tasks</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <EditProfileDialog
                trigger={
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer">
                    <div className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Edit Profile</p>
                      <p className="text-sm text-muted-foreground">Update your information</p>
                    </div>
                  </div>
                }
              />

              <ChangePasswordDialog
                trigger={
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer">
                    <div className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your password</p>
                    </div>
                  </div>
                }
              />

              <Link to="/settings" className="group">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Notifications</p>
                    <p className="text-sm text-muted-foreground">Manage preferences</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
