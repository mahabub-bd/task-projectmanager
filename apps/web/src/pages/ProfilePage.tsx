import { ChangePasswordDialog, EditProfileDialog } from '@/components/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bell,
  Building2,
  Calendar,
  ChevronRight,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();

  // Determine which logo to use based on theme
  const getLogoUrl = () => {
    if (!user) return '';
    if (theme === 'dark' && user.organization_dark_logo) {
      return user.organization_dark_logo;
    }
    if (theme === 'light' && user.organization_light_logo) {
      return user.organization_light_logo;
    }
    // Fallback to default logo
    return user.organization_logo || '';
  };

  const logoUrl = getLogoUrl();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const permissionCount = user.roles?.reduce(
    (total, role) => total + (role.permissions?.length || 0),
    0,
  ) || 0;

  return (
    <div className="mx-auto  space-y-6 pb-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">Account settings</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your profile</h1>
        <p className="text-muted-foreground">Manage your personal details, access, and account preferences.</p>
      </div>

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="h-28 bg-gradient-to-r from-primary via-primary/85 to-primary/55 sm:h-32" />
        <CardContent className="relative px-5 pb-6 pt-0 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="-mt-12 h-24 w-24 border-4 border-card shadow-md sm:-mt-14 sm:h-28 sm:w-28">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 sm:pb-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <EditProfileDialog
              trigger={
                <Button className="gap-2 sm:mb-1">
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </Button>
              }
            />
          </div>

          <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
            <ProfileMeta
              icon={<Building2 className="h-4 w-4" />}
              label="Organization"
              value={user.organization_name || 'Not assigned'}
              detail={user.organization_id ? `ID: ${user.organization_id}` : undefined}
              image={logoUrl}
            />
            <ProfileMeta
              icon={<Building2 className="h-4 w-4" />}
              label="Department"
              value={user.department_name || 'Not assigned'}
              detail={user.department_id ? `ID: ${user.department_id}` : undefined}
            />
            <ProfileMeta
              icon={<Calendar className="h-4 w-4" />}
              label="Member since"
              value={user.created_at ? formatDate(user.created_at) : 'Not available'}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <CardTitle className="text-lg">Assigned roles</CardTitle>
                <CardDescription>{user.roles?.length || 0} role{user.roles?.length !== 1 ? 's' : ''} grant access to your workspace</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{permissionCount} permissions</Badge>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {user.roles?.length ? user.roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-accent/70">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{role.name}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{role.description || 'No role description provided.'}</p>
                </div>
                <Badge variant="outline" className="shrink-0">{role.permissions?.length || 0} permissions</Badge>
              </div>
            )) : (
              <EmptyState label="No roles have been assigned yet." />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><KeyRound className="h-5 w-5" /></div>
              <div>
                <CardTitle className="text-lg">Access overview</CardTitle>
                <CardDescription>Your available permissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {user.roles?.length ? (
              <div className="space-y-4">
                {user.roles.map((role) => (
                  <div key={role.id}>
                    <p className="mb-2 text-sm font-medium text-foreground">{role.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions?.slice(0, 4).map((permission) => (
                        <Badge key={permission.id} variant="outline" className="bg-background text-xs normal-case">{permission.name}</Badge>
                      ))}
                      {(role.permissions?.length || 0) > 4 && <Badge variant="outline">+{role.permissions!.length - 4}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState label="No permissions available." />}
            <Link to="/permissions" className="mt-5 inline-flex">
              <Button variant="link" className="h-auto gap-1 p-0 text-sm">View all permissions <ChevronRight className="h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
            <p className="text-sm text-muted-foreground">Manage the essentials of your account.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <EditProfileDialog trigger={<ActionCard icon={<UserRound className="h-5 w-5" />} title="Edit profile" description="Update your name, email, and bio." />} />
          <ChangePasswordDialog trigger={<ActionCard icon={<KeyRound className="h-5 w-5" />} title="Change password" description="Keep your account secure." />} />
          <Link to="/settings"><ActionCard icon={<Bell className="h-5 w-5" />} title="Notifications" description="Choose how you hear from us." /></Link>
        </div>
      </section>
    </div>
  );
}

function ProfileMeta({ icon, label, value, detail, image }: { icon: ReactNode; label: string; value: string; detail?: string; image?: string | null }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-lg bg-muted/50 p-3">
    {image ? <img src={image} alt="" className="h-9 w-9 rounded-md object-cover" /> : <div className="rounded-md bg-background p-2 text-muted-foreground">{icon}</div>}
    <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="truncate text-sm font-semibold text-foreground">{value}</p>{detail && <p className="text-xs text-muted-foreground">{detail}</p>}</div>
  </div>;
}

function ActionCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return <div className="group flex min-h-28 cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm">
    <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">{icon}</div>
    <div><p className="font-semibold text-foreground">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
  </div>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">{label}</div>;
}
