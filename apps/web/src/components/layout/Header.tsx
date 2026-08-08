import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ChangePasswordDialog, EditProfileDialog } from '@/components/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Key,
  LogOut,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from './types';

interface HeaderProps {
  onMenuOpen: () => void;
  breadcrumbs: Breadcrumb[];
}

export function Header({ onMenuOpen, breadcrumbs }: HeaderProps) {
  const { theme, toggleTheme, compactMode, toggleCompactMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 dark:bg-card/90 dark:border-border/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuOpen}
            className="xl:hidden p-2 hover:bg-accent rounded-lg transition-colors shrink-0"
            title="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs - Hidden on mobile, shown on tablet and above */}
          <nav className="hidden sm:flex items-center min-w-0">
            <ol className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-foreground px-2.5 py-1 rounded-md bg-primary/10 dark:bg-primary/20">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.href}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-accent/30 px-2.5 py-1 rounded-md transition-all duration-200 font-medium"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Theme Toggle - Hide on very small screens if needed */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent/80 dark:hover:bg-accent/20"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>

          {/* Compact Mode Toggle - Hide on small mobile screens */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCompactMode}
            className={cn(
              'hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent/80 dark:hover:bg-accent/20',
              compactMode && 'bg-accent/50 dark:bg-accent/30'
            )}
            title={compactMode ? 'Disable compact mode' : 'Enable compact mode'}
          >
            {compactMode ? (
              <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent/80 dark:hover:bg-accent/20 transition-colors p-0"
                  title="User menu"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-border/50 dark:border-border/30">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-[10px] sm:text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 sm:w-56" align="end" forceMount>
                {/* User Info Section */}
                <div className="px-2 sm:px-2.5 py-2.5 sm:py-3 border-b border-border/60 dark:border-border/40">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-border/50 dark:border-border/30">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs sm:text-sm font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  {/* User Role Badge */}
                  {user.roles && user.roles.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {user.roles[0].name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <DropdownMenuGroup className="py-1">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>View Profile</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                    </Link>
                  </DropdownMenuItem>

                  <EditProfileDialog
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Edit Profile</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                      </DropdownMenuItem>
                    }
                  />

                  <ChangePasswordDialog
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span>Change Password</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                      </DropdownMenuItem>
                    }
                  />

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {/* Logout Section */}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-800 dark:hover:bg-red-950/50 focus:text-red-700 dark:focus:text-red-400 focus:bg-red-100 dark:focus:bg-red-950/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
