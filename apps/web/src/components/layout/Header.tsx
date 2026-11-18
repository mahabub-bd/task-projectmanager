import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ChangePasswordDialog, EditProfileDialog } from '@/components/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationLogo } from '@/hooks/useOrganizationLogo';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PencilLine,
  Settings2,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderSearch } from './HeaderSearch';
import { Logo } from './Logo';
import type { Breadcrumb } from './types';

interface HeaderProps {
  onMenuOpen: () => void;
  breadcrumbs: Breadcrumb[];
  sidebarOpen?: boolean;
}

interface HeaderIconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  pressed?: boolean;
  className?: string;
}

function HeaderIconButton({ label, onClick, children, pressed, className }: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        pressed && 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export function Header({ onMenuOpen, breadcrumbs, sidebarOpen = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { logoUrl, hasThemeSpecificLogos, organizationName } = useOrganizationLogo();
  const navigate = useNavigate();

  const currentLabel = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';
  const roleLabel = user?.roles?.[0]?.name || user?.email || 'Member';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-gradient-to-r from-primary/[0.04] via-card/95 to-primary/[0.04] backdrop-blur-xl supports-backdrop-filter:bg-gradient-to-r supports-backdrop-filter:from-primary/[0.03] supports-backdrop-filter:via-card/90 supports-backdrop-filter:to-primary/[0.03] dark:from-primary/[0.06] dark:via-card/95 dark:to-primary/[0.06]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="app-header-inner flex h-16 items-center gap-3 px-3 sm:px-5 lg:px-7">
        {/* Logo / brand */}
        <Link to="/dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="Home">
          <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary/10">
            {hasThemeSpecificLogos && logoUrl ? (
              <img
                src={logoUrl}
                alt={organizationName || 'Organization'}
                className="h-full w-full object-contain"
              />
            ) : (
              <Logo className="h-5 w-auto text-primary" />
            )}
          </div>
          <span className="hidden text-sm font-semibold tracking-tight xl:block">
            {organizationName || 'Taskflow'}
          </span>
        </Link>

        <div aria-hidden="true" className="h-6 w-px shrink-0 bg-border/60" />

        {/* Left: menu + location */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={onMenuOpen}
              title="Open menu"
              aria-label="Open menu"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-background/60 text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          {/* Mobile: current page only */}
          <div className="min-w-0 sm:hidden">
            <p className="truncate text-sm font-semibold tracking-tight">{currentLabel}</p>
          </div>

          {/* Tablet and up: full breadcrumb trail */}
          <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
            <ol className="flex min-w-0 items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const isFirst = index === 0;

                return (
                  <li key={crumb.href} className="flex min-w-0 items-center gap-1">
                    {index > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                    )}
                    {isLast ? (
                      <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 font-medium text-primary dark:bg-primary/15">
                        {isFirst && <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />}
                        <span className="truncate">{crumb.label}</span>
                      </span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="inline-flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                      >
                        {isFirst && <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />}
                        <span className="truncate">{crumb.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Center: global search */}
        <div className="hidden flex-1 justify-center lg:flex">
          <HeaderSearch />
        </div>

        {/* Right: unified toolbar */}
        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl bg-background/60 p-1">
            <HeaderSearch iconOnly enableShortcut={false} className="lg:hidden" />

            <HeaderIconButton
              label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={toggleTheme}
              pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </HeaderIconButton>

            <NotificationCenter />
          </div>

          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="group flex items-center gap-2 rounded-xl p-1 pr-1.5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:pr-2.5"
                  >
                    <Avatar className="h-8 w-8 shrink-0 shadow-sm">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden min-w-0 lg:block">
                      <span className="block max-w-32 truncate text-xs font-semibold leading-tight">
                        {user.name}
                      </span>
                      <span className="mt-0.5 block max-w-32 truncate text-[10px] text-muted-foreground">
                        {roleLabel}
                      </span>
                    </span>
                    <ChevronDown className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 lg:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="px-2.5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border border-border/60">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge variant="secondary" className="max-w-full truncate px-2 py-0.5 text-[10px]">
                        {roleLabel}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup className="py-1">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <UserRound className="text-muted-foreground" />
                        <span>View profile</span>
                        <ChevronRight className="ml-auto text-muted-foreground/50" />
                      </Link>
                    </DropdownMenuItem>

                    <EditProfileDialog
                      trigger={
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer">
                          <PencilLine className="text-muted-foreground" />
                          <span>Edit profile</span>
                        </DropdownMenuItem>
                      }
                    />

                    <ChangePasswordDialog
                      trigger={
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-pointer">
                          <KeyRound className="text-muted-foreground" />
                          <span>Change password</span>
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup className="py-1">
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings2 className="text-muted-foreground" />
                        <span>Settings</span>
                        <ChevronRight className="ml-auto text-muted-foreground/50" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
