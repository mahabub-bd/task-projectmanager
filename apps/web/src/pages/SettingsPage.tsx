import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Building2, ChevronRight, LogOut, Mail, Moon, Pencil, Sun, UserRound } from 'lucide-react';
import NotificationSettings from '../components/settings/NotificationSettings';

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme, compactMode, toggleCompactMode } = useTheme();
  const { logout: handleLogout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Page header */}
      <div className="rounded-xl border border-background bg-card/50 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1">
              Manage your account, preferences, and workspace settings.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-[12px] font-semibold text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs">
              <Mail className="h-3 w-3" />
              {user.email}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Account profile */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 lg:pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 text-primary">
                <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Account profile</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Update your name, email, and avatar.
                </CardDescription>
              </div>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="shrink-0">
                Manage profile <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-3 sm:p-4 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Avatar className="h-16 w-16 shrink-0 ring-2 ring-border">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <Link to="/profile">
                    <Button variant="outline" size="icon" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate text-sm">{user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Edit profile details
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Change password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 text-primary">
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Appearance</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Choose your theme and layout density.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-3 sm:p-4 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <Label className="text-sm sm:text-base">Theme</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Switch between light and dark modes
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <Sun className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <Moon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <Label className="text-sm sm:text-base">Compact layout</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Use a denser layout across the app
                </p>
              </div>
              <Switch checked={compactMode} onCheckedChange={toggleCompactMode} className="shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 text-primary">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Notifications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Choose how you hear from us.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-3 sm:p-4 pt-2 sm:pt-3">
            <NotificationSettings compact />
          </CardContent>
        </Card>

        {/* Organization */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 text-primary">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Organization</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your workspace details.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-3 sm:p-4 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-muted/50 p-1.5 shrink-0">
                {user.organization_logo ? (
                  <img
                    src={user.organization_logo}
                    alt={user.organization_name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-background flex items-center justify-center text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                  {user.organization_name || 'Not assigned'}
                </p>
                {user.organization_id && (
                  <p className="text-xs text-muted-foreground">
                    Organization ID: {user.organization_id}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-muted/50 p-1.5 shrink-0">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                  {user.department_name || 'Not assigned'}
                </p>
                {user.department_id && (
                  <p className="text-xs text-muted-foreground">
                    Department ID: {user.department_id}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="w-full border-destructive/20">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-1.5 sm:p-2 text-destructive">
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Danger zone</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Permanent actions. Proceed with caution.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-3 sm:p-4 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <Label className="text-sm sm:text-base font-medium text-destructive">Log out</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
