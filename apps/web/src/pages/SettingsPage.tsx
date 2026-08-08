import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import NotificationSettings from '../components/settings/NotificationSettings';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme, compactMode, toggleCompactMode } = useTheme();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm">
          Customize your application preferences
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">


        {/* Appearance Settings */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Customize how the application looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-4 sm:p-6 pt-3 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <Label className="text-sm sm:text-base">Dark Mode</Label>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Switch between light and dark themes
                </p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <Label className="text-sm sm:text-base">Compact Mode</Label>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Use a more compact layout
                </p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={toggleCompactMode}
                className="shrink-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <NotificationSettings />
      </div>
    </div>
  );
}
